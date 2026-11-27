import Image, { type ImageProps } from "next/image";
import { cn } from "@/lib/utils";

/**
 * Shows the whole image (object-contain) so tall building elevations are never cropped,
 * with a blurred copy of the same image filling the frame behind it instead of empty bars.
 * `cutout` is for transparent elevations: no blurred copy, the building stands on the bottom
 * edge of the frame and the frame's own background shows around it.
 * Use inside a `relative overflow-hidden` box, like `<Image fill />`.
 */
export function FitImage({ className, alt, cutout, ...props }: Omit<ImageProps, "fill"> & { alt: string; cutout?: boolean }) {
  if (cutout) return <Image {...props} alt={alt} fill className={cn("object-contain object-bottom", className)} />;
  return (
    <>
      <Image {...props} alt="" aria-hidden fill className="scale-125 object-cover opacity-60 blur-2xl" />
      <Image {...props} alt={alt} fill className={cn("object-contain", className)} />
    </>
  );
}
