"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { useLeadModal } from "@/components/forms/LeadModalProvider";
import { Button, type ButtonVariant } from "./Button";
import type { LeadModalOptions } from "@/types";

type Props = LeadModalOptions & {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: "sm" | "md" | "lg";
  className?: string;
};

/** A button that opens the global lead modal with context. */
export function CtaButton({ children, variant, size, className, ...opts }: Props) {
  const { openLeadModal } = useLeadModal();
  const pathname = usePathname();
  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      className={className}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        openLeadModal({ source: pathname, ...opts });
      }}
    >
      {children}
    </Button>
  );
}
