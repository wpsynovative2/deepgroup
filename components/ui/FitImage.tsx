import Image, { type ImageProps } from "next/image";
import { cn } from "@/lib/utils";

/**
 * Shows the whole image (object-contain) so tall building elevations are never cropped,
 * with a blurred copy of the same image filling the frame behind it instead of empty bars.
 * Use inside a `relative overflow-hidden` box, like `<Image fill />`.
 */
export function FitImage({ className, alt, ...props }: Omit<ImageProps, "fill"> & { alt: string }) {
  return (
    <>
      <Image {...props} alt="" aria-hidden fill className="scale-125 object-cover opacity-60 blur-2xl" />
      <Image {...props} alt={alt} fill className={cn("object-contain", className)} />
    </>
  );
}
