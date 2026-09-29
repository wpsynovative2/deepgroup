"use client";

import { usePathname } from "next/navigation";
import { MessageSquareText, Phone } from "lucide-react";
import { useLeadModal } from "@/components/forms/LeadModalProvider";
import { WhatsAppIcon } from "@/components/decor/SocialIcons";

export function MobileActionBar({ phoneHref, whatsapp }: { phoneHref: string; whatsapp: string }) {
  const { openLeadModal } = useLeadModal();
  const pathname = usePathname();
  const cell = "flex min-h-14 flex-1 flex-col items-center justify-center gap-0.5 text-[0.7rem] font-medium";
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex border-t border-line bg-white/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_30px_-12px_rgba(51,3,15,.2)] backdrop-blur lg:hidden">
      <a href={`tel:${phoneHref}`} className={`${cell} text-brand-700`}>
        <Phone className="size-5" aria-hidden /> Call
      </a>
      <a
        href={`https://wa.me/${whatsapp}?text=${encodeURIComponent("Hi Deep Group, I'd like to know more about your projects.")}`}
        target="_blank"
        rel="noopener noreferrer"
        className={`${cell} text-[#1f8a4c]`}
      >
        <WhatsAppIcon className="size-5" /> WhatsApp
      </a>
      <button type="button" onClick={() => openLeadModal({ source: `${pathname}#mobile-bar` })} className={`${cell} bg-brand-700 text-white`}>
        <MessageSquareText className="size-5" aria-hidden /> Enquire
      </button>
    </div>
  );
}
