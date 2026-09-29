"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import type { LeadModalOptions } from "@/types";
import { LeadModal } from "./LeadModal";

type Ctx = { openLeadModal: (opts?: LeadModalOptions) => void };
const LeadModalContext = createContext<Ctx>({ openLeadModal: () => {} });

export const useLeadModal = () => useContext(LeadModalContext);

export const FLOORPLAN_UNLOCK_KEY = "dg_floorplans_unlocked";
export const FLOORPLAN_UNLOCK_EVENT = "dg:floorplans-unlocked";

export function LeadModalProvider({ projects, children }: { projects: string[]; children: ReactNode }) {
  const [opts, setOpts] = useState<LeadModalOptions | null>(null);

  const pathname = usePathname();
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpts(null);
  }

  const openLeadModal = useCallback((o: LeadModalOptions = {}) => setOpts(o), []);
  const value = useMemo(() => ({ openLeadModal }), [openLeadModal]);

  return (
    <LeadModalContext.Provider value={value}>
      {children}
      <LeadModal
        options={opts}
        projects={projects}
        onClose={() => setOpts(null)}
      />
    </LeadModalContext.Provider>
  );
}
