"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { ArrowRight, Loader2 } from "lucide-react";
import { RedevelopmentSchema } from "@/lib/schemas/lead.schema";
import { Consent, Input, RecaptchaNotice, SelectField, ServerError, Textarea } from "@/components/forms/Fields";
import { PhoneInput } from "@/components/forms/PhoneInput";
import { Honeypot } from "@/components/forms/Honeypot";
import { useSubmitLead } from "@/components/forms/useSubmitLead";
import { Button } from "@/components/ui/Button";

const ClientSchema = RedevelopmentSchema.pick({
  fullName: true, mobile: true, email: true, societyName: true, location: true, members: true, plotArea: true, buildingAge: true,
  designation: true, message: true, consent: true,
});
type In = z.input<typeof ClientSchema>;
type Out = z.output<typeof ClientSchema>;

export function RedevEnquiryForm({ stations }: { stations: string[] }) {
  const [honeypot, setHoneypot] = useState("");
  const { submit, serverError, onFirstInteraction } = useSubmitLead({ formType: "redevelopment" });
  const { register, control, handleSubmit, formState: { errors, isSubmitting } } = useForm<In, unknown, Out>({
    resolver: zodResolver(ClientSchema),
    mode: "onTouched",
    defaultValues: { fullName: "", mobile: "", email: "", societyName: "", location: "", members: "", plotArea: "", buildingAge: "", designation: "", message: "" },
  });

  return (
    <form noValidate onFocus={onFirstInteraction} onSubmit={handleSubmit((v) => submit({ ...v, intent: "enquiry" }, honeypot))} className="relative grid gap-4">
      <Honeypot value={honeypot} onChange={setHoneypot} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Society name" required placeholder="e.g. Shree Sai CHS" error={errors.societyName?.message} {...register("societyName")} />
        <SelectField label="Location" placeholder="Choose area" options={[...stations, "Other"].map((s) => ({ value: s, label: s }))} {...register("location")} />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <Input label="Members / flats" inputMode="numeric" placeholder="32" {...register("members")} />
        <Input label="Plot area" placeholder="e.g. 1,200 sq m" {...register("plotArea")} />
        <Input label="Building age (yrs)" inputMode="numeric" placeholder="35" {...register("buildingAge")} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Your name" required autoComplete="name" error={errors.fullName?.message} {...register("fullName")} />
        <SelectField
          label="Your designation"
          options={[
            { value: "chairman", label: "Chairman" },
            { value: "secretary", label: "Secretary" },
            { value: "member", label: "Member" },
          ]}
          {...register("designation")}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Controller control={control} name="mobile" render={({ field }) => <PhoneInput name={field.name} value={field.value} onChange={field.onChange} onBlur={field.onBlur} error={errors.mobile?.message} />} />
        <Input label="Email" type="email" autoComplete="email" error={errors.email?.message} {...register("email")} />
      </div>
      <Textarea label="Anything we should know?" error={errors.message?.message} {...register("message")} />
      <Consent error={errors.consent?.message} {...register("consent")} />
      <ServerError message={serverError} />
      <Button type="submit" size="lg" disabled={isSubmitting} className="w-full">
        {isSubmitting ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
        {isSubmitting ? "Sending…" : "Request a feasibility meeting"}
        {!isSubmitting ? <ArrowRight className="size-4" aria-hidden /> : null}
      </Button>
      <RecaptchaNotice />
    </form>
  );
}
