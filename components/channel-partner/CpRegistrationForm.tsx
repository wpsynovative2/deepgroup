"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { AlertCircle, ArrowRight, Check, Loader2 } from "lucide-react";
import { ChannelPartnerSchema } from "@/lib/schemas/lead.schema";
import { Consent, Input, RecaptchaNotice, ServerError, Textarea } from "@/components/forms/Fields";
import { PhoneInput } from "@/components/forms/PhoneInput";
import { Honeypot } from "@/components/forms/Honeypot";
import { useSubmitLead } from "@/components/forms/useSubmitLead";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const ClientSchema = ChannelPartnerSchema.pick({
  fullName: true, mobile: true, email: true, firmName: true, reraAgentNo: true, operatingAreas: true, experienceYears: true, teamSize: true,
  message: true, consent: true,
});
type In = z.input<typeof ClientSchema>;
type Out = z.output<typeof ClientSchema>;

export function CpRegistrationForm({ areas }: { areas: string[] }) {
  const [honeypot, setHoneypot] = useState("");
  const { submit, serverError, onFirstInteraction } = useSubmitLead({ formType: "channel-partner" });
  const { register, control, handleSubmit, formState: { errors, isSubmitting } } = useForm<In, unknown, Out>({
    resolver: zodResolver(ClientSchema),
    mode: "onTouched",
    defaultValues: { fullName: "", mobile: "", email: "", firmName: "", reraAgentNo: "", operatingAreas: [], message: "" },
  });

  return (
    <form noValidate onFocus={onFirstInteraction} onSubmit={handleSubmit((v) => submit(v, honeypot))} className="relative grid gap-4">
      <Honeypot value={honeypot} onChange={setHoneypot} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Full name" required autoComplete="name" error={errors.fullName?.message} {...register("fullName")} />
        <Controller control={control} name="mobile" render={({ field }) => <PhoneInput name={field.name} value={field.value} onChange={field.onChange} onBlur={field.onBlur} error={errors.mobile?.message} />} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Email" required type="email" autoComplete="email" error={errors.email?.message} {...register("email")} />
        <Input label="Firm / agency name" required autoComplete="organization" error={errors.firmName?.message} {...register("firmName")} />
      </div>
      <Input
        label="MahaRERA agent registration no."
        required
        placeholder="A51800012345"
        className="uppercase"
        autoCapitalize="characters"
        error={errors.reraAgentNo?.message}
        hint="Format: A followed by 11 digits"
        {...register("reraAgentNo")}
      />
      <Controller
        control={control}
        name="operatingAreas"
        render={({ field }) => (
          <fieldset>
            <legend className="mb-2 text-sm font-medium text-ink">
              Areas you operate in <span className="text-brand-600">*</span>
            </legend>
            <div className="flex flex-wrap gap-2">
              {[...areas, "Other"].map((a) => {
                const on = field.value.includes(a);
                return (
                  <button
                    key={a}
                    type="button"
                    aria-pressed={on}
                    onClick={() => field.onChange(on ? field.value.filter((x) => x !== a) : [...field.value, a])}
                    className={cn(
                      "flex min-h-10 items-center gap-1.5 rounded-full border px-4 text-sm transition",
                      on ? "border-brand-700 bg-brand-700 text-white" : "border-line bg-white hover:border-gold-500",
                    )}
                  >
                    {on ? <Check className="size-3.5" aria-hidden /> : null} {a}
                  </button>
                );
              })}
            </div>
            {errors.operatingAreas ? (
              <p className="mt-1.5 flex items-center gap-1.5 text-sm text-brand-600" role="alert">
                <AlertCircle className="size-3.5" aria-hidden /> {errors.operatingAreas.message}
              </p>
            ) : null}
          </fieldset>
        )}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Years of experience" type="number" min={0} inputMode="numeric" error={errors.experienceYears?.message} {...register("experienceYears", { setValueAs: (v) => (v === "" ? undefined : v) })} />
        <Input label="Team size" type="number" min={1} inputMode="numeric" error={errors.teamSize?.message} {...register("teamSize", { setValueAs: (v) => (v === "" ? undefined : v) })} />
      </div>
      <Textarea label="Message" error={errors.message?.message} {...register("message")} />
      <Consent error={errors.consent?.message} {...register("consent")} />
      <ServerError message={serverError} />
      <Button type="submit" size="lg" disabled={isSubmitting} className="w-full">
        {isSubmitting ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
        {isSubmitting ? "Registering…" : "Register as a partner"}
        {!isSubmitting ? <ArrowRight className="size-4" aria-hidden /> : null}
      </Button>
      <RecaptchaNotice />
    </form>
  );
}
