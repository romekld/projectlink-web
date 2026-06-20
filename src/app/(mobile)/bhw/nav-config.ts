import { IconSettings, IconSettingsFilled, IconHome2, IconHome2Filled, IconFolder, IconFolderFilled, IconClipboardList, IconClipboardListFilled } from '@tabler/icons-react';

import type { SidebarSection } from "@/features/navigation/data/types";

export const bhwNavSections = [
  {
    id: "bhw-main",
    label: "Overview",
    items: [
      {
        id: "bhw-home",
        title: "Home",
        href: "/bhw/home",
        icon: IconHome2,
        activeIcon: IconHome2Filled,
        match: ["/bhw/home"],
      },
    ],
  },
  {
    id: "bhw-field",
    label: "Field Operations",
    items: [
      {
        id: "bhw-households",
        title: "Households",
        href: "/bhw/households",
        icon: IconFolder,
        activeIcon: IconFolderFilled,
        match: ["/bhw/households"],
      },
    ],
  },
  {
    id: "bhw-clients",
    label: "Clients",
    items: [
      {
        id: "bhw-clients",
        title: "Clients",
        href: "/bhw/clients",
        icon: IconClipboardList,
        activeIcon: IconClipboardListFilled,
        match: ["/bhw/clients"],
      },
    ],
  },
  {
    id: "bhw-account",
    label: "Account",
    items: [
      {
        id: "bhw-profile",
        title: "Profile",
        href: "/bhw/profile",
        icon: IconSettings,
        activeIcon: IconSettingsFilled,
        match: ["/bhw/profile"],
      },
    ],
  },
] satisfies SidebarSection[];
