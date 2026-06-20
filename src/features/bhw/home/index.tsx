"use client"

import { SyncStatusBanner } from "./components/sync-status-banner"
import { ReturnedRecordsAlert } from "./components/returned-records-alert"
import { QuickActionCards } from "./components/quick-action-cards"
import { HouseholdsSummaryCard } from "./components/households-summary-card"
import { SummaryStatsGrid } from "./components/summary-stats-grid"
import { RecentActivityList } from "./components/recent-activity-list"
// import type { mockBhwDashboard } from "./data/mock"

// type BhwDashboardPageProps = typeof mockBhwDashboard

export function HomePage() {

  return (
    <div className="flex h-dvh flex-col gap-4 bg-background p-4">
      {/* <SyncStatusBanner />
      <ReturnedRecordsAlert />
      <QuickActionCards />
      <HouseholdsSummaryCard />
      <SummaryStatsGrid />
      <RecentActivityList /> */}
    </div>
  )
}
