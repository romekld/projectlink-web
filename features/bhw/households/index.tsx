"use client"

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import type { Household } from "./data/schema"

import { StatusTab } from "./components/status-tab"
// import { SearchBar } from "./components/search-bar"

type BhwHouseholdsPageProps = {
  households: Household[]
}

export function BhwHouseholdsPage({ households }: BhwHouseholdsPageProps) {
  return (
    <section className="flex flex-col gap-3">
      <Card>
        <CardHeader>
          <CardTitle>
            Household Lists
          </CardTitle>
          <CardDescription>Card Description</CardDescription>
          <CardAction>Card Action</CardAction>
        </CardHeader>
        <CardContent>
          <p>Card Content</p>
        </CardContent>
        <CardFooter>
          <p>Card Footer</p>
        </CardFooter>
      </Card>
      <StatusTab />

    </section>
  )
}
