"use client"

import { usePathname } from "next/navigation"
import { MobileNavTab } from "@/components/layout/mobile/mobile-nav"
import { bhwNavSections } from "./nav-config"

export default function BhwLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isWizard = pathname.startsWith("/bhw/households/new")

  if (isWizard) {
    return (
      <div className="flex h-dvh flex-col">{children}</div>
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
