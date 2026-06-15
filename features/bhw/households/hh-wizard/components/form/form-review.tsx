"use client"

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useHouseholdWizard } from "@/lib/store/household-wizard"
import { Check, AlertCircle, Edit } from "lucide-react"

export function ReviewStep() {
  const { householdData, members, goToStep } = useHouseholdWizard()

  const hasHouseholdHead = members.some(m => m.relationshipToHhHead === "1-Head")
  const isStep1Valid = householdData.visitDate && householdData.barangay && 
                      householdData.respondentLastName && householdData.respondentFirstName

  const handleSubmit = () => {
    console.log("Submitting household profile:", { householdData, members })
    // TODO: Submit to backend
    alert("Household profile submitted successfully!")
  }

  return (
    <div className="w-full max-w-2xl space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight mb-1">Review & Submit</h1>
        <p className="text-sm text-muted-foreground">
          Review your household profile information before submitting.
        </p>
      </div>

      <FieldSeparator />

      {/* Household Information Summary */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Household Information</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => goToStep(0)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>
          <CardDescription>Basic household details and address</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FieldGroup>
            <Field>
              <FieldLabel>Visit Date</FieldLabel>
              <FieldDescription>{householdData.visitDate || "Not provided"}</FieldDescription>
            </Field>
            <Field>
              <FieldLabel>Quarter</FieldLabel>
              <FieldDescription>{householdData.quarter || "Not provided"}</FieldDescription>
            </Field>
            <Field>
              <FieldLabel>Barangay</FieldLabel>
              <FieldDescription>{householdData.barangay || "Not provided"}</FieldDescription>
            </Field>
            <Field>
              <FieldLabel>Address</FieldLabel>
              <FieldDescription>
                {householdData.houseNoStreet || "Not provided"}
                {householdData.purok && `, Purok ${householdData.purok}`}
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel>Respondent</FieldLabel>
              <FieldDescription>
                {householdData.respondentFirstName} {householdData.respondentMiddleName} {householdData.respondentLastName}
              </FieldDescription>
            </Field>
          </FieldGroup>
        </CardContent>
      </Card>

      {/* Members Summary */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Household Members ({members.length})</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => goToStep(1)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>
          <CardDescription>List of all household members</CardDescription>
        </CardHeader>
        <CardContent>
          {members.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No members added yet
            </div>
          ) : (
            <div className="space-y-3">
              {members.map((member) => (
                <div key={member.id} className="flex items-start gap-3 p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">
                      {member.lastName}, {member.firstName} {member.middleName || ""}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {member.relationshipToHhHead} • {member.sex} • {member.age || "N/A"}
                    </div>
                  </div>
                  {member.relationshipToHhHead === "1-Head" && (
                    <div className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                      Head
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Validation Status */}
      <Card className={isStep1Valid && hasHouseholdHead ? "border-green-500" : "border-yellow-500"}>
        <CardHeader>
          <div className="flex items-center gap-2">
            {isStep1Valid && hasHouseholdHead ? (
              <Check className="h-5 w-5 text-green-500" />
            ) : (
              <AlertCircle className="h-5 w-5 text-yellow-500" />
            )}
            <CardTitle className="text-lg">Validation Status</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Field>
              <FieldLabel>Household Information</FieldLabel>
              <FieldDescription className={isStep1Valid ? "text-green-600" : "text-yellow-600"}>
                {isStep1Valid ? "Complete" : "Incomplete - Missing required fields"}
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel>Household Members</FieldLabel>
              <FieldDescription className={hasHouseholdHead ? "text-green-600" : "text-yellow-600"}>
                {hasHouseholdHead ? "Complete - Household head assigned" : "Incomplete - Household head required"}
              </FieldDescription>
            </Field>
          </FieldGroup>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <Button 
        className="w-full" 
        size="lg" 
        onClick={handleSubmit}
        disabled={!isStep1Valid || !hasHouseholdHead}
      >
        Submit Household Profile
      </Button>
    </div>
  )
}
