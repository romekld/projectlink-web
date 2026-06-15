"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { usePathname } from "next/navigation"
import type { ElementType } from "react"
import {
  UserRound,
  Folder,
  House,
  Plus,
  UserRoundPlus,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { SidebarSection } from "@/features/navigation/data/types"
import { cn } from "@/lib/utils"

type MobileNavTab = {
  label: string
  href: string
  icon: ElementType
  activeIcon?: ElementType
  match: string[]
}

const defaultTabs: MobileNavTab[] = [
  {
    label: "Home",
    href: "/bhw/dashboard",
    icon: House,
    match: ["/bhw/dashboard"],
  },
  {
    label: "Household",
    href: "/bhw/households",
    icon: Folder,
    match: ["/bhw/households"],
  },
  {
    label: "Profile",
    href: "/bhw/profile",
    icon: UserRound,
    match: ["/bhw/profile"],
  },
]

function getMobileNavTabs(sections?: SidebarSection[]): MobileNavTab[] {
  const tabs = sections?.flatMap((section) =>
    section.items
      .filter((item) => item.href)
      .map((item) => ({
        label: item.title,
        href: item.href as string,
        icon: item.icon ?? House,
        activeIcon: item.activeIcon,
        match: item.match ?? [item.href as string],
      }))
  )

  return tabs?.length ? tabs : defaultTabs
}

export function MobileNavTab({ sections }: { sections?: SidebarSection[] }) {
  const pathname = usePathname()
  const tabs = getMobileNavTabs(sections)

  return (
    <div className="pointer-events-none fixed bottom-0 left-0 right-0 z-40">
      <div
        className="mx-auto flex max-w-md items-end justify-center gap-2 pb-4"
      >
        <nav
          aria-label="BHW navigation"
          className="pointer-events-auto flex items-center gap-1 rounded-full bg-accent/95 p-1 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-accent/90"
        >
          {tabs.map(({ label, href, icon: Icon, activeIcon, match }) => {
            const isActive = match.some(
              (m) => pathname === m || pathname.startsWith(m + "/")
            )
            const NavIcon = isActive && activeIcon ? activeIcon : Icon

            return (
              <Link
                key={href}
                href={href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "relative flex items-center justify-start rounded-full p-3 active:scale-[0.98] text-xs font-medium transition-colors duration-300",
                  isActive
                    ? "flex-1 text-background"
                    : "shrink-0 text-muted-foreground/80 hover:text-foreground"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-nav-pill"
                    className="absolute inset-0 bg-foreground rounded-full"
                    transition={{
                      type: "spring",
                      bounce: 0.12,
                      duration: 0.35,
                    }}
                  />
                )}
                <span className="relative z-10 flex items-center">
                  <NavIcon className="size-5 shrink-0" aria-hidden="true" />
                  <motion.span
                    initial={false}
                    animate={{
                      width: isActive ? "auto" : 0,
                      marginLeft: isActive ? 8 : 0,
                    }}
                    transition={{
                      type: "spring",
                      bounce: 0.12,
                      duration: 0.35,
                    }}
                    className="overflow-hidden whitespace-nowrap inline-block text-left"
                  >
                    {label}
                  </motion.span>
                </span>
              </Link>
            )
          })}
        </nav>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              aria-label="Create a new record"
              className="pointer-events-auto shrink-0 rounded-full shadow-sm size-13"
            >
              <Plus aria-hidden="true" className="size-5" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            side="top"
            align="end"
            sideOffset={12}
            className="w-72"
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel>Choose Action</DropdownMenuLabel>

              <DropdownMenuItem asChild className="px-0 py-0">
                <Link
                  href="/bhw/households/new"
                  className="flex min-w-0 items-start gap-2.5 rounded-md px-2 py-2"
                >
                  <Plus />
                  <span className="min-w-0 flex-1 text-left">
                    <span className="block text-sm font-medium">
                      New household
                    </span>
                    <span className="block text-xs text-muted-foreground">
                      Create a new household record.
                    </span>
                  </span>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem
                disabled
                className="items-start gap-2.5 px-2 py-2"
              >
                <UserRoundPlus />
                <span className="min-w-0 flex-1 text-left">
                  <span className="block text-sm font-medium">New patient</span>
                  <span className="block text-xs text-muted-foreground">
                    Coming next.
                  </span>
                </span>
                <Badge variant="outline">Soon</Badge>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}