"use client"

import { usePathname } from "next/navigation"
import { MobileNavTab } from "@/components/layout/mobile/mobile-nav"
import { bhwNavSections } from "./nav-config"

export default function BhwLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isWizard = pathname.startsWith("/bhw/household/new") || pathname.startsWith("/bhw/clients/new")

  if (isWizard) {
    return (
      <div className="h-dvh ">{children}</div>
    )
  }

  return (
    <>
      <div className="">
        <MobileNavTab sections={bhwNavSections} />
        {children}
      </div>
    </>
  )
}
