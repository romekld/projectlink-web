"use client"

import {
    Field,
    FieldContent,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSeparator,
    FieldSet,
    FieldTitle,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { ButtonGroup } from "@/components/ui/button-group"
import { Button } from "@/components/ui/button"
import { useState } from "react"

import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "@/components/ui/input-group"
import { Droplets, House, Signpost, Toilet, MapPin, Minus, Plus } from "lucide-react"
import { Badge } from "@/components/ui/badge"

import {
    Combobox,
    ComboboxCollection,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxGroup,
    ComboboxInput,
    ComboboxItem,
    ComboboxLabel,
    ComboboxList,
    ComboboxSeparator,
} from "@/components/ui/combobox"

import { FieldDate } from "../field-date"
import { waterSourceOptions } from "../../options/water-source-options"
import { toiletFacilityOptions } from "../../options/toilet-facility-options"

// dynamic fetch from the database based on the bhw assigned barangay
const bhwBarangayAssigned = "Barangay 1"


// options will be the list of barangays the bhw is assigned to, but for now it's hardcoded
const barangays = [
    "Barangay 1",
    "Barangay 2",
    "Barangay 3",
    "Barangay 4",
    "Barangay 5",
    "Barangay 6",
] as const

export function HouseholdInfoForm() {
    const [familyCount, setFamilyCount] = useState(1)
    return (
        <>
            <FieldSet>
                <FieldLegend>Visit Log</FieldLegend>
                <FieldDescription>Record the date of the household visit.</FieldDescription>
                <FieldGroup>
                    <FieldDate />
                </FieldGroup>
            </FieldSet>

            <FieldSeparator />

            <FieldSet>
                <FieldLegend>Household Address</FieldLegend>
                <FieldDescription>Location of the household.</FieldDescription>
                <FieldGroup>

                    {/* Barangay */}
                    <Field>
                        <FieldLabel>
                            Barangay <span className="text-destructive">*</span>
                        </FieldLabel>
                        <Combobox items={barangays} defaultValue={bhwBarangayAssigned}>
                            <ComboboxInput placeholder="Select a barangay" showClear required>
                                <InputGroupAddon>
                                    <MapPin />
                                </InputGroupAddon>
                            </ComboboxInput>
                            <ComboboxContent>
                                <ComboboxEmpty>No barangays found.</ComboboxEmpty>
                                <ComboboxList>
                                    {(item) => (
                                        <ComboboxItem key={item} value={item}>
                                            {item}
                                        </ComboboxItem>
                                    )}
                                </ComboboxList>
                            </ComboboxContent>
                        </Combobox>
                        <FieldDescription>
                            Select the barangay where the household is located.
                        </FieldDescription>
                    </Field>

                    {/* Address Line 1 */}
                    <Field>
                        <FieldLabel htmlFor="hh-address-line1">Address Line 1 <span className="text-destructive">*</span></FieldLabel>
                        <InputGroup>
                            <InputGroupAddon>
                                <House />
                            </InputGroupAddon>
                            <InputGroupInput id="hh-address-line1" placeholder="e.g. Blk 123 Lot 44" required />
                        </InputGroup>
                    </Field>

                    {/* Address Line 2 */}
                    <Field>
                        <FieldLabel htmlFor="hh-address-line2">Address Line 2</FieldLabel>
                        <InputGroup>
                            <InputGroupAddon>
                                <Signpost />
                            </InputGroupAddon>
                            <InputGroupInput id="hh-address-line2" placeholder="e.g. Purok 1" />
                        </InputGroup>
                        <FieldDescription>Additional address details such as purok or subdivision.</FieldDescription>
                    </Field>

                </FieldGroup>
            </FieldSet>

            <FieldSeparator />

            <FieldSet>
                <FieldLegend>Respondent Profile</FieldLegend>
                <FieldDescription>Information about the person providing the household information.</FieldDescription>
                <FieldGroup>

                    {/* Last Name */}
                    <Field>
                        <FieldLabel htmlFor="respondent-last-name">Last Name <span className="text-destructive">*</span></FieldLabel>
                        <Input id="respondent-last-name" placeholder="e.g. Dela Cruz" required />
                    </Field>

                    {/* First Name */}
                    <Field>
                        <FieldLabel htmlFor="respondent-first-name">First Name <span className="text-destructive">*</span></FieldLabel>
                        <Input id="respondent-first-name" placeholder="e.g. Juan" required />
                    </Field>

                    {/* Middle Name */}
                    <Field>
                        <FieldLabel htmlFor="respondent-middle-name">Middle Name <span className="text-muted-foreground">(Optional)</span></FieldLabel>
                        <Input id="respondent-middle-name" placeholder="e.g. Reyes" />
                    </Field>

                </FieldGroup>
            </FieldSet>

            <FieldSeparator />

            <FieldSet>
                <FieldLegend>Household Information</FieldLegend>
                <FieldDescription>Facilities and resources available to the household.</FieldDescription>
                <FieldGroup>

                    {/* no. of families in the household */}
                    <Field>
                        <FieldLabel htmlFor="no-of-families">Number of Families <span className="text-destructive">*</span></FieldLabel>
                        <ButtonGroup>
                            <Input type="number" id="no-of-families" value={familyCount} min="1" placeholder="e.g. 3" required onChange={(e) => setFamilyCount(Number(e.target.value))} />
                            <Button variant="outline" onClick={() => setFamilyCount((c) => Math.max(1, c - 1))}><Minus /></Button>
                            <Button variant="outline" onClick={() => setFamilyCount((c) => c + 1)}><Plus /></Button>
                        </ButtonGroup>
                    </Field>

                    {/* Type of Water Source */}
                    <Field>
                        <FieldLabel>
                            Type of Water Source <span className="text-destructive">*</span>
                        </FieldLabel>
                        <Combobox items={waterSourceOptions}>
                            <ComboboxInput placeholder="Select a water source" showClear required>
                                <InputGroupAddon>
                                    <Droplets />
                                </InputGroupAddon>
                            </ComboboxInput>
                            <ComboboxContent>
                                <ComboboxEmpty>No options found.</ComboboxEmpty>
                                <ComboboxList>
                                    {(item) => (
                                        <ComboboxItem key={item.value} value={item.code}>
                                            <Badge variant="outline">{item.code}</Badge>
                                            {item.label}
                                        </ComboboxItem>
                                    )}
                                </ComboboxList>
                            </ComboboxContent>
                        </Combobox>
                        <FieldDescription>
                            Select the primary source of drinking water for the household.
                        </FieldDescription>
                    </Field>

                    {/* Type of Toilet Facility */}
                    <Field>
                        <FieldLabel>
                            Type of Toilet Facility <span className="text-destructive">*</span>
                        </FieldLabel>
                        <Combobox items={toiletFacilityOptions}>
                            <ComboboxInput placeholder="Select a toilet facility" showClear required>
                                <InputGroupAddon>
                                    <Toilet />
                                </InputGroupAddon>
                            </ComboboxInput>
                            <ComboboxContent>
                                <ComboboxEmpty>No options found.</ComboboxEmpty>
                                <ComboboxList>
                                    {(group, index) => (
                                        <ComboboxGroup key={group.label} items={group.items}>
                                            <ComboboxLabel>{group.label}</ComboboxLabel>
                                            <ComboboxCollection>
                                                {(item) => (
                                                    <ComboboxItem key={item.value} value={item.code}>
                                                        <Badge variant="outline">{item.code}</Badge>
                                                        {item.label}
                                                    </ComboboxItem>
                                                )}
                                            </ComboboxCollection>
                                            {index < toiletFacilityOptions.length - 1 && <ComboboxSeparator />}
                                        </ComboboxGroup>
                                    )}
                                </ComboboxList>
                            </ComboboxContent>
                        </Combobox>
                        <FieldDescription>
                            Select the type of toilet facility available to the household.
                        </FieldDescription>
                    </Field>

                </FieldGroup>
            </FieldSet>
        </>
    )
}