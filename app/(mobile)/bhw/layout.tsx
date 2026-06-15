"use client"

import { usePathname } from "next/navigation"
import { MobileNavTab } from "@/components/layout/mobile/mobile-nav"
import { bhwNavSections } from "./nav-config"

export default function BhwLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isWizard = pathname.startsWith("/bhw/households/new")

  if (isWizard) {
    return (
      <div className="h-dvh ">{children}</div>
    )
  }

  return (
    <>
      <div className="px-4 md:px-10 lg:px-16 py-4 md:py-10 lg:py-16">
        <MobileNavTab sections={bhwNavSections} />
        {children}
      </div>
    </>
  )
}
