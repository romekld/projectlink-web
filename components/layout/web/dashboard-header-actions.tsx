"use client"

import { Config } from "./config-drawer"
import { HeaderProfileMenu } from "@/components/layout/web/header-profile-menu"
import { ThemeSwitch } from "@/components/layout/shared/theme-switch"

export function DashboardHeaderActions() {
  return (
    <div className="flex items-center gap-4">
      <ThemeSwitch />
      <Config />
      <HeaderProfileMenu />
    </div>
  )
}