"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { useHouseholdWizard } from "@/lib/store/household-wizard"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, MapPin, User, Droplet, Toilet } from "lucide-react"
import { waterSourceOptions, toiletFacilityOptions } from "../../data"

export function ReviewStep() {
  const { householdData, members, resetWizard } = useHouseholdWizard()

  const waterSource = waterSourceOptions.find(opt => opt.value === householdData.waterSource)
  const toiletFacility = toiletFacilityOptions.find(opt => opt.value === householdData.toiletFacility)

  const handleSubmit = () => {
    // In a real app, this would be an API call
    console.log("Submitting Household Profile:", { householdData, members })
    
    toast.success("Household Profile Submitted Successfully!", {
      description: `Household ${householdData.householdNo || "New"} has been recorded.`,
      position: "top-center"
    })
    
    // Clear wizard after successful submission
    resetWizard()
  }

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto pb-10">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center size-12 rounded-full bg-primary/10 text-primary mb-2">
          <CheckCircle2 className="size-6" />
        </div>
        <h1 className="font-heading text-2xl font-bold tracking-tight">Review & Submit</h1>
        <p className="text-sm text-muted-foreground">
          Please verify the information below before finalizing the profile.
        </p>
      </div>

      <div className="grid gap-6">
        {/* Household Overview */}
        <Card>
          <CardHeader className="pb-3 border-b">
            <CardTitle className="text-lg flex items-center gap-2">
              <MapPin className="size-5 text-primary" />
              Household Information
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 grid sm:grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
              <span className="text-muted-foreground block font-medium">Household No.</span>
              <span className="font-semibold">{householdData.householdNo || "202606-PHS203-00001"}</span>
            </div>
            <div className="space-y-1">
              <span className="text-muted-foreground block font-medium">Barangay</span>
              <span className="font-semibold">{householdData.barangay || "Not set"}</span>
            </div>
            <div className="space-y-1">
              <span className="text-muted-foreground block font-medium">Visit Date</span>
              <span className="font-semibold">{householdData.visitDate || "Not set"} ({householdData.quarter || "N/A"} Quarter)</span>
            </div>
            <div className="space-y-1">
              <span className="text-muted-foreground block font-medium">Respondent</span>
              <span className="font-semibold">{householdData.respondentFirstName} {householdData.respondentLastName}</span>
            </div>
            <div className="sm:col-span-2 space-y-1">
              <span className="text-muted-foreground block font-medium">Address</span>
              <span className="font-semibold">
                {householdData.houseNoStreet ? `${householdData.houseNoStreet}, ` : ""}
                {householdData.purok ? `${householdData.purok}, ` : ""}
                {householdData.barangay}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Environmental Health */}
        <Card>
          <CardHeader className="pb-3 border-b">
            <CardTitle className="text-lg flex items-center gap-2">
              <Droplet className="size-5 text-primary" />
              Environmental Health
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 grid sm:grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
              <span className="text-muted-foreground flex items-center gap-1.5 font-medium">
                <Droplet className="size-4" /> Water Source
              </span>
              <span className="font-semibold">{waterSource?.label || "Not specified"}</span>
              {waterSource?.abbreviation && (
                <Badge variant="outline" className="ml-2">{waterSource.abbreviation}</Badge>
              )}
            </div>
            <div className="space-y-1">
              <span className="text-muted-foreground flex items-center gap-1.5 font-medium">
                <Toilet className="size-4" /> Toilet Facility
              </span>
              <span className="font-semibold">{toiletFacility?.label || "Not specified"}</span>
              {toiletFacility?.category && (
                <Badge 
                  variant={toiletFacility.category === "sanitary" ? "default" : "destructive"} 
                  className="ml-2 capitalize"
                >
                  {toiletFacility.category}
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Members List */}
        <Card>
          <CardHeader className="pb-3 border-b">
            <CardTitle className="text-lg flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="size-5 text-primary" />
                Household Members
              </div>
              <Badge variant="secondary">{members.length} Total</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {members.map((member) => (
                <div key={member.id} className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-full bg-muted flex items-center justify-center font-bold text-xs uppercase">
                      {member.firstName[0]}{member.lastName[0]}
                    </div>
                    <div>
                      <div className="font-semibold text-sm">
                        {member.firstName} {member.lastName}
                        {member.relationshipToHhHead === "1" && (
                          <Badge variant="default" className="ml-2 h-4 px-1 text-[10px] uppercase">Head</Badge>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {member.sex === "male" ? "Male" : "Female"} • {member.age}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs font-medium text-muted-foreground uppercase">
                    {member.relationshipToHhHead === "1" ? "Household Head" : "Member"}
                  </div>
                </div>
              ))}
              {members.length === 0 && (
                <div className="p-8 text-center text-muted-foreground italic">
                  No members added yet.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Button size="lg" className="w-full mt-4 h-12 text-base font-bold" onClick={handleSubmit}>
        Submit Household Profile
      </Button>
    </div>
  )
}
