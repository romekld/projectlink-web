"use client"

import * as React from "react"

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
import { Switch } from "@/components/ui/switch"

import { Church, GraduationCap, Sparkles, Hash, Fingerprint, CalendarDays } from "lucide-react"

import {
    Combobox,
    ComboboxChip,
    ComboboxChips,
    ComboboxChipsInput,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
    ComboboxValue,
    useComboboxAnchor,
} from "@/components/ui/combobox"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "@/components/ui/input-group"

import { relationshipOptions } from "../../options/relationship-options"
import { FieldDateOfBirth } from "../field-date-of-birth"
import { civilStatusOptions } from "../../options/civil-status-options"
import { educationOptions } from "../../options/education-options"
import { religionOptions } from "../../options/religion-options"
import { philhealthCategoryOptions } from "../../options/philhealth-category-options"
import { fpMethodOptions } from "../../options/fp-method-options"
import { fpStatusOptions } from "../../options/fp-status-options"
import { computeAge, formatAge, autoSuggestClassification } from "../../options/classification"
import { useWizardStore } from "../../stores/wizard-store"
import type { HouseholdMember } from "../../stores/wizard-store"


interface MemberInfoFormProps {
    comboboxContainer?: HTMLElement | null
    initialData?: Partial<HouseholdMember>
    onSubmit?: (data: Omit<HouseholdMember, "id">) => void
    onCancel?: () => void
}

const initialMedItems = [
    { value: "HPN", label: "Hypertension" },
    { value: "DM", label: "Diabetes" },
    { value: "TB", label: "Tuberculosis" },
    { value: "Asthma", label: "Asthma" },
]

export function MemberInfoForm({ comboboxContainer, initialData, onSubmit, onCancel }: MemberInfoFormProps) {
    const existingMembers = useWizardStore((s) => s.members)
    const hasHead = existingMembers.some((m) => m.relationship === "Head")

    const anchor = useComboboxAnchor()

    const [lastName, setLastName] = React.useState(initialData?.lastName ?? "")
    const [firstName, setFirstName] = React.useState(initialData?.firstName ?? "")
    const [middleName, setMiddleName] = React.useState(initialData?.middleName ?? "")
    const [relationship, setRelationship] = React.useState(initialData?.relationship ?? "")
    const [relationshipOther, setRelationshipOther] = React.useState(initialData?.relationshipOther ?? "")
    const [sex, setSex] = React.useState<string>(initialData?.sex ?? "female")
    const [dateOfBirth, setDateOfBirth] = React.useState(initialData?.dateOfBirth ?? "")
    const [civilStatus, setCivilStatus] = React.useState(initialData?.civilStatus ?? "")
    const [education, setEducation] = React.useState(initialData?.education ?? "")
    const [religion, setReligion] = React.useState(initialData?.religion ?? "")
    const [religionOther, setReligionOther] = React.useState(initialData?.religionOther ?? "")
    const [is4ps, setIs4Ps] = React.useState(initialData?.is4ps ?? false)
    const [is4psId, setIs4PsId] = React.useState(initialData?.is4psId ?? "")
    const [isIndigenous, setIsIndigenous] = React.useState(initialData?.isIndigenous ?? false)
    const [philhealthId, setPhilhealthId] = React.useState(initialData?.philhealthId ?? "")
    const [philhealthMembershipType, setPhilhealthMembershipType] = React.useState(initialData?.philhealthMembershipType ?? "M")
    const [philhealthCategory, setPhilhealthCategory] = React.useState(initialData?.philhealthCategory ?? "")

    const [medHistoryItems, setMedHistoryItems] = React.useState(initialMedItems)
    const [selectedMedHistory, setSelectedMedHistory] = React.useState<typeof initialMedItems>(
        initialData?.medicalHistory
            ? initialData.medicalHistory.map((v) => ({ value: v, label: v }))
            : [],
    )
    const [medInputValue, setMedInputValue] = React.useState("")

    const [lmpDate, setLmpDate] = React.useState<Date | undefined>(
        initialData?.lmpDate ? new Date(initialData.lmpDate) : undefined,
    )
    const [lmpOpen, setLmpOpen] = React.useState(false)
    const [usingFP, setUsingFP] = React.useState(initialData?.usingFP ?? false)
    const fpMethodAnchor = useComboboxAnchor()

    const initialFpMethodItems = React.useMemo(() => fpMethodOptions, [])
    const [fpMethodItems, setFpMethodItems] = React.useState(initialFpMethodItems)
    const [selectedFpMethods, setSelectedFpMethods] = React.useState<typeof fpMethodOptions>(
        initialData?.fpMethods
            ? fpMethodOptions.filter((o) => initialData.fpMethods!.includes(o.value))
            : [],
    )
    const [fpMethodInputValue, setFpMethodInputValue] = React.useState("")
    const [fpStatus, setFpStatus] = React.useState<string | null>(initialData?.fpStatus ?? null)

    const age = dateOfBirth ? computeAge(dateOfBirth) : null
    const classification = dateOfBirth && sex
        ? autoSuggestClassification(dateOfBirth, sex === "male" ? "M" : "F")
        : null
    const isWRA = classification === "WRA"

    const handleFpMethodKeyDown = React.useCallback((e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            const text = fpMethodInputValue.trim()
            if (!text) return
            const exists = fpMethodItems.some(
                (item) => item.label.toLowerCase() === text.toLowerCase(),
            )
            if (!exists) {
                e.preventDefault()
                e.stopPropagation()
                const newItem = { value: text, label: text, code: "" }
                setFpMethodItems((prev) => [...prev, newItem])
                setSelectedFpMethods((prev) => [...prev, newItem])
                setFpMethodInputValue("")
            }
        }
    }, [fpMethodInputValue, fpMethodItems])

    const handleMedKeyDown = React.useCallback((e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            const text = medInputValue.trim()
            if (!text) return
            const exists = medHistoryItems.some(
                (item) => item.label.toLowerCase() === text.toLowerCase(),
            )
            if (!exists) {
                e.preventDefault()
                e.stopPropagation()
                const newItem = { value: text, label: text, code: "" }
                setMedHistoryItems((prev) => [...prev, newItem])
                setSelectedMedHistory((prev) => [...prev, newItem])
                setMedInputValue("")
            }
        }
    }, [medInputValue, medHistoryItems])

    const handleSubmit = React.useCallback(() => {
        const data: Omit<HouseholdMember, "id"> = {
            lastName,
            firstName,
            middleName,
            sex: sex as "male" | "female",
            dateOfBirth,
            age: age ?? 0,
            ageGroup: classification ?? "",
            relationship,
            relationshipOther,
            civilStatus,
            education,
            religion,
            religionOther,
            is4ps,
            is4psId,
            isIndigenous,
            philhealthId,
            philhealthMembershipType,
            philhealthCategory,
            medicalHistory: selectedMedHistory.map((m) => m.value),
            lmpDate: lmpDate?.toISOString() ?? "",
            usingFP,
            fpMethods: selectedFpMethods.map((m) => m.value),
            fpStatus: fpStatus ?? "",
        }
        onSubmit?.(data)
    }, [lastName, firstName, middleName, sex, dateOfBirth, age, classification, relationship, relationshipOther, civilStatus, education, religion, religionOther, is4ps, is4psId, isIndigenous, philhealthId, philhealthMembershipType, philhealthCategory, selectedMedHistory, lmpDate, usingFP, selectedFpMethods, fpStatus, onSubmit])

    return (
        <FieldGroup>
            <FieldSet>
                <FieldLegend>Member Profile</FieldLegend>
                <FieldDescription>Information about the member.</FieldDescription>
                <FieldGroup>
                    {/* Last Name */}
                    <Field>
                        <FieldLabel htmlFor="member-last-name">Last Name <span className="text-destructive">*</span></FieldLabel>
                        <Input id="member-last-name" placeholder="e.g. Dela Cruz" required value={lastName} onChange={(e) => setLastName(e.target.value)} />
                    </Field>

                    {/* First Name */}
                    <Field>
                        <FieldLabel htmlFor="member-first-name">First Name <span className="text-destructive">*</span></FieldLabel>
                        <Input id="member-first-name" placeholder="e.g. Juan" required value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                    </Field>

                    {/* Middle Name */}
                    <Field>
                        <FieldLabel htmlFor="member-middle-name">Middle Name <span className="text-muted-foreground">(Optional)</span></FieldLabel>
                        <Input id="member-middle-name" placeholder="e.g. Reyes" value={middleName} onChange={(e) => setMiddleName(e.target.value)} />
                    </Field>

                    {/* Relationship */}
                    <Field>
                        <FieldLabel>
                            Relationship to Head of Household <span className="text-destructive">*</span>
                        </FieldLabel>
                        <Combobox
                            items={relationshipOptions}
                            value={relationship ? relationshipOptions.find((o) => o.value === relationship) ?? null : null}
                            onValueChange={(val) => setRelationship(val?.value ?? "")}
                        >
                            <ComboboxInput placeholder="Select a relationship" showClear required />
                            <ComboboxContent container={comboboxContainer}>
                                <ComboboxEmpty>No relationships found.</ComboboxEmpty>
                                <ComboboxList>
                                    {(item) => (
                                        <ComboboxItem
                                            key={item.value}
                                            value={item}
                                            disabled={item.value === "Head" && hasHead}
                                        >
                                            <Badge variant="outline">{item.code}</Badge>
                                            {item.label}
                                        </ComboboxItem>
                                    )}
                                </ComboboxList>
                            </ComboboxContent>
                        </Combobox>
                        <FieldDescription>
                            {hasHead && relationship !== "Head"
                                ? "Head already assigned. Only one head per household."
                                : "Select the relationship of the member to the household head."}
                        </FieldDescription>
                    </Field>

                    {/* Relationship Other */}
                    {relationship === "Other" && (
                        <Field>
                            <FieldLabel htmlFor="member-relationship-other">Specify Relationship<span className="text-destructive">*</span></FieldLabel>
                            <Input id="member-relationship-other" placeholder="e.g. Nephew, Cousin, Grandparent" required value={relationshipOther} onChange={(e) => setRelationshipOther(e.target.value)} />
                            <FieldDescription>Specify the relationship if Others was selected above.</FieldDescription>
                        </Field>
                    )}
                </FieldGroup>
            </FieldSet>

            <FieldSeparator />

            <FieldSet>
                <FieldLegend>Demographics</FieldLegend>
                <FieldDescription>Information about the member.</FieldDescription>
                <FieldGroup>
                    {/* Sex */}
                    <FieldSet>
                        <FieldLegend variant="label">Sex <span className="text-destructive">*</span></FieldLegend>
                        <RadioGroup value={sex} onValueChange={setSex} className="grid grid-cols-2 gap-4" required>
                            <FieldLabel htmlFor="member-sex-female">
                                <Field orientation="horizontal">
                                    <FieldContent>
                                        <FieldTitle>Female</FieldTitle>
                                    </FieldContent>
                                    <RadioGroupItem value="female" id="member-sex-female" />
                                </Field>
                            </FieldLabel>
                            <FieldLabel htmlFor="member-sex-male">
                                <Field orientation="horizontal">
                                    <FieldContent>
                                        <FieldTitle>Male</FieldTitle>
                                    </FieldContent>
                                    <RadioGroupItem value="male" id="member-sex-male" />
                                </Field>
                            </FieldLabel>
                        </RadioGroup>
                    </FieldSet>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Date of Birth */}
                        <FieldDateOfBirth value={dateOfBirth} onValueChange={setDateOfBirth} />

                        {/* Age */}
                        <Field>
                            <FieldLabel>
                                Age <span className="text-destructive">*</span>
                            </FieldLabel>
                            <InputGroup>
                                <InputGroupAddon align="inline-end">
                                    <Sparkles />
                                </InputGroupAddon>
                                <InputGroupInput
                                    placeholder="Auto-computed"
                                    required
                                    readOnly
                                    value={dateOfBirth ? formatAge(dateOfBirth) : ""}
                                />
                            </InputGroup>
                            <FieldDescription>Automatically computed from date of birth.</FieldDescription>
                        </Field>
                    </div>

                    {/* Classification */}
                    <Field>
                        <FieldLabel>
                            Classification by Age/Health Risk Group <span className="text-destructive">*</span>
                        </FieldLabel>
                        <InputGroup>
                            <InputGroupAddon align="inline-end">
                                <Sparkles />
                            </InputGroupAddon>
                            <InputGroupInput
                                placeholder="Auto-computed"
                                required
                                readOnly
                                value={classification ?? "—"}
                            />
                        </InputGroup>
                        <FieldDescription>
                            Automatically classified based on age and sex (e.g. Infant, Child, Adult, Senior, WRA).
                        </FieldDescription>
                    </Field>

                    {/* Civil Status */}
                    <Field>
                        <FieldLabel>
                            Civil Status <span className="text-destructive">*</span>
                        </FieldLabel>
                        <Combobox
                            items={civilStatusOptions}
                            value={civilStatus ? civilStatusOptions.find((o) => o.value === civilStatus) ?? null : null}
                            onValueChange={(val) => setCivilStatus(val?.value ?? "")}
                        >
                            <ComboboxInput placeholder="Select a civil status" showClear required />
                            <ComboboxContent container={comboboxContainer}>
                                <ComboboxEmpty>No civil statuses found.</ComboboxEmpty>
                                <ComboboxList>
                                    {(item) => (
                                        <ComboboxItem key={item.value} value={item}>
                                            <Badge variant="outline">{item.code}</Badge>
                                            {item.label}
                                        </ComboboxItem>
                                    )}
                                </ComboboxList>
                            </ComboboxContent>
                        </Combobox>
                        <FieldDescription>
                            Select the civil status of the member.
                        </FieldDescription>
                    </Field>

                    {/* Educational Attainment */}
                    <Field>
                        <FieldLabel>
                            Educational Attainment
                        </FieldLabel>
                        <Combobox
                            items={educationOptions}
                            value={education ? educationOptions.find((o) => o.label === education) ?? null : null}
                            onValueChange={(val) => setEducation(val?.label ?? "")}
                        >
                            <ComboboxInput placeholder="Select educational attainment" showClear>
                                <InputGroupAddon>
                                    <GraduationCap />
                                </InputGroupAddon>
                            </ComboboxInput>
                            <ComboboxContent container={comboboxContainer}>
                                <ComboboxEmpty>No educational attainments found.</ComboboxEmpty>
                                <ComboboxList>
                                    {(item) => (
                                        <ComboboxItem key={item.value} value={item}>
                                            <Badge variant="outline">{item.code}</Badge>
                                            {item.label}
                                        </ComboboxItem>
                                    )}
                                </ComboboxList>
                            </ComboboxContent>
                        </Combobox>
                        <FieldDescription>
                            Select the educational attainment of the member.
                        </FieldDescription>
                    </Field>

                    {/* Religion */}
                    <Field>
                        <FieldLabel>
                            Religion
                        </FieldLabel>
                        <Combobox
                            items={religionOptions}
                            value={religion ? religionOptions.find((o) => o.label === religion) ?? null : null}
                            onValueChange={(val) => setReligion(val?.label ?? "")}
                        >
                            <ComboboxInput placeholder="Select religious affiliation" showClear>
                                <InputGroupAddon>
                                    <Church />
                                </InputGroupAddon>
                            </ComboboxInput>
                            <ComboboxContent container={comboboxContainer}>
                                <ComboboxEmpty>No religious affiliations found.</ComboboxEmpty>
                                <ComboboxList>
                                    {(item) => (
                                        <ComboboxItem key={item.value} value={item}>
                                            {item.label}
                                        </ComboboxItem>
                                    )}
                                </ComboboxList>
                            </ComboboxContent>
                        </Combobox>
                        <FieldDescription>
                            Select the religious affiliation of the member.
                        </FieldDescription>
                    </Field>

                    {/* Religion Other */}
                    {religion === "Others (please specify)" && (
                        <Field>
                            <FieldLabel htmlFor="member-religion-other">Specify Religion<span className="text-destructive">*</span></FieldLabel>
                            <InputGroup>
                                <InputGroupAddon>
                                    <Church />
                                </InputGroupAddon>
                                <InputGroupInput id="member-religion-other" placeholder="e.g. Islam, Buddhism, Seventh-day Adventist" required value={religionOther} onChange={(e) => setReligionOther(e.target.value)} />
                            </InputGroup>
                            <FieldDescription>If Others was selected above, specify the religion.</FieldDescription>
                        </Field>
                    )}

                    {/* 4Ps Member */}
                    <FieldLabel htmlFor="switch-4ps">
                        <Field orientation="horizontal">
                            <FieldContent>
                                <FieldTitle>Member of 4Ps?</FieldTitle>
                                <FieldDescription>
                                    Is the member a member of the Pantawid Pamilyang Pilipino Program (4Ps)?
                                </FieldDescription>
                            </FieldContent>
                            <Switch id="switch-4ps" checked={is4ps} onCheckedChange={setIs4Ps} />
                        </Field>
                    </FieldLabel>

                    {/* 4Ps ID */}
                    {is4ps && (
                        <Field>
                            <FieldLabel htmlFor="member-4ps-id">4Ps ID Number<span className="text-destructive">*</span></FieldLabel>
                            <InputGroup>
                                <InputGroupAddon>
                                    <Hash />
                                </InputGroupAddon>
                                <InputGroupInput id="member-4ps-id" placeholder="e.g. 1234-5678-9012" required value={is4psId} onChange={(e) => setIs4PsId(e.target.value)} />
                            </InputGroup>
                            <FieldDescription>Enter the 4Ps household ID number if the member is a 4Ps beneficiary.</FieldDescription>
                        </Field>
                    )}

                    {/* Indigenous People */}
                    <FieldLabel htmlFor="switch-ip">
                        <Field orientation="horizontal">
                            <FieldContent>
                                <FieldTitle>Indigenous People?</FieldTitle>
                                <FieldDescription>
                                    Is the member a member of Indigenous Peoples?
                                </FieldDescription>
                            </FieldContent>
                            <Switch id="switch-ip" checked={isIndigenous} onCheckedChange={setIsIndigenous} />
                        </Field>
                    </FieldLabel>
                </FieldGroup>
            </FieldSet>

            <FieldSeparator />

            <FieldSet>
                <FieldLegend>Philhealth Information</FieldLegend>
                <FieldDescription>Philhealth membership details of the member.</FieldDescription>
                <FieldGroup>
                    {/* Philhealth ID Number */}
                    <Field>
                        <FieldLabel htmlFor="philhealth-id">
                            Philhealth ID Number
                        </FieldLabel>
                        <InputGroup>
                            <InputGroupAddon>
                                <Fingerprint />
                            </InputGroupAddon>
                            <InputGroupInput id="philhealth-id" placeholder="e.g. 12-123456789-0" value={philhealthId} onChange={(e) => setPhilhealthId(e.target.value)} />
                        </InputGroup>
                    </Field>

                    {/* Membership Type */}
                    <FieldSet>
                        <FieldLegend variant="label">Membership Type</FieldLegend>
                        <RadioGroup value={philhealthMembershipType} onValueChange={setPhilhealthMembershipType} required>
                            <FieldLabel htmlFor="philhealth-member">
                                <Field orientation="horizontal">
                                    <FieldContent>
                                        <FieldTitle>Member</FieldTitle>
                                        <FieldDescription>
                                            Primary person registered and actively paying.
                                        </FieldDescription>
                                    </FieldContent>
                                    <RadioGroupItem value="M" id="philhealth-member" />
                                </Field>
                            </FieldLabel>
                            <FieldLabel htmlFor="philhealth-dependent">
                                <Field orientation="horizontal">
                                    <FieldContent>
                                        <FieldTitle>Dependent</FieldTitle>
                                        <FieldDescription>
                                            Registered as a dependent of a member, not paying but still covered.
                                        </FieldDescription>
                                    </FieldContent>
                                    <RadioGroupItem value="D" id="philhealth-dependent" />
                                </Field>
                            </FieldLabel>
                        </RadioGroup>
                    </FieldSet>

                    {/* Philhealth Category */}
                    <Field>
                        <FieldLabel>
                            Philhealth Category <span className="text-destructive">*</span>
                        </FieldLabel>
                        <Combobox
                            items={philhealthCategoryOptions}
                            value={philhealthCategory ? philhealthCategoryOptions.find((o) => o.label === philhealthCategory) ?? null : null}
                            onValueChange={(val) => setPhilhealthCategory(val?.label ?? "")}
                        >
                            <ComboboxInput placeholder="Select a category" showClear required />
                            <ComboboxContent container={comboboxContainer}>
                                <ComboboxEmpty>No categories found.</ComboboxEmpty>
                                <ComboboxList>
                                    {(item) => (
                                        <ComboboxItem key={item.value} value={item}>
                                            <Badge variant="outline">{item.code}</Badge>
                                            {item.label}
                                        </ComboboxItem>
                                    )}
                                </ComboboxList>
                            </ComboboxContent>
                        </Combobox>
                        <FieldDescription>
                            Select the PhilHealth membership category of the member.
                        </FieldDescription>
                    </Field>
                </FieldGroup>
            </FieldSet>

            <FieldSeparator />

            <FieldSet>
                <FieldLegend>Medical History</FieldLegend>
                <FieldDescription>Known medical conditions of the member.</FieldDescription>
                <FieldGroup>
                    <Field>
                        <FieldLabel>
                            Medical History <span className="text-destructive">*</span>
                        </FieldLabel>
                        <Combobox
                            multiple
                            autoHighlight
                            items={medHistoryItems}
                            value={selectedMedHistory}
                            onValueChange={(val) => setSelectedMedHistory(val ?? [])}
                        >
                            <ComboboxChips ref={anchor}>
                                <ComboboxValue>
                                    {(values) => (
                                        <>
                                            {values.map((value: { label: string; value: string }) => (
                                                <ComboboxChip key={value.value}>{value.label}</ComboboxChip>
                                            ))}
                                            <ComboboxChipsInput
                                                placeholder="Type or select a condition, press Enter to add"
                                                value={medInputValue}
                                                onChange={(e) => setMedInputValue(e.target.value)}
                                                onKeyDown={handleMedKeyDown}
                                            />
                                        </>
                                    )}
                                </ComboboxValue>
                            </ComboboxChips>
                            <ComboboxContent anchor={anchor} container={comboboxContainer}>
                                <ComboboxEmpty>
                                    {medInputValue.trim()
                                        ? `Press Enter to add "${medInputValue.trim()}"`
                                        : "No medical histories found."}
                                </ComboboxEmpty>
                                <ComboboxList>
                                    {(item) => (
                                        <ComboboxItem key={item.value} value={item}>
                                            {item.label}
                                        </ComboboxItem>
                                    )}
                                </ComboboxList>
                            </ComboboxContent>
                        </Combobox>
                        <FieldDescription>
                            Select from the list or type a custom medical condition and press Enter to add.
                        </FieldDescription>
                    </Field>
                </FieldGroup>
            </FieldSet>

            {/* WRA section — only visible when classification is WRA */}
            {isWRA && (
                <>
                    <FieldSeparator />
                    <FieldSet>
                        <FieldLegend>Maternal Health / Family Planning</FieldLegend>
                        <FieldDescription>Reproductive health and family planning information.</FieldDescription>
                        <FieldGroup>
                            {/* LMP Date */}
                            <Field>
                                <FieldLabel htmlFor="lmp-date">
                                    Last Menstrual Period (LMP)
                                </FieldLabel>
                                <Popover open={lmpOpen} onOpenChange={setLmpOpen}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            id="lmp-date"
                                            variant="outline"
                                            className="justify-start font-normal"
                                        >
                                            <CalendarDays />
                                            {lmpDate
                                                ? lmpDate.toLocaleDateString("en-US", {
                                                    month: "long",
                                                    day: "numeric",
                                                    year: "numeric",
                                                })
                                                : "Select LMP date"}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={lmpDate}
                                            defaultMonth={lmpDate}
                                            captionLayout="dropdown"
                                            disabled={{ after: new Date() }}
                                            onSelect={(date) => {
                                                setLmpDate(date)
                                                setLmpOpen(false)
                                            }}
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FieldDescription>
                                    If pregnant, enter the first day of the last menstrual period.
                                </FieldDescription>
                            </Field>

                            {/* Using any FP method? */}
                            <FieldLabel htmlFor="using-fp">
                                <Field orientation="horizontal">
                                    <FieldContent>
                                        <FieldTitle>Using any FP Method?</FieldTitle>
                                        <FieldDescription>
                                            Is the member currently using any family planning method?
                                        </FieldDescription>
                                    </FieldContent>
                                    <Switch id="using-fp" checked={usingFP} onCheckedChange={setUsingFP} />
                                </Field>
                            </FieldLabel>

                            {/* FP Methods */}
                            {usingFP && (
                                <Field>
                                    <FieldLabel>
                                        Family Planning Method(s) <span className="text-destructive">*</span>
                                    </FieldLabel>
                                    <Combobox
                                        multiple
                                        autoHighlight
                                        items={fpMethodItems}
                                        value={selectedFpMethods}
                                        onValueChange={(val) => setSelectedFpMethods(val ?? [])}
                                    >
                                        <ComboboxChips ref={fpMethodAnchor}>
                                            <ComboboxValue>
                                                {(values) => (
                                                    <>
                                                        {values.map((value: { label: string; value: string; code: string }) => (
                                                            <ComboboxChip key={value.value}>{value.code}</ComboboxChip>
                                                        ))}
                                                        <ComboboxChipsInput
                                                            placeholder="Type or select FP method"
                                                            value={fpMethodInputValue}
                                                            onChange={(e) => setFpMethodInputValue(e.target.value)}
                                                            onKeyDown={handleFpMethodKeyDown}
                                                        />
                                                    </>
                                                )}
                                            </ComboboxValue>
                                        </ComboboxChips>
                                        <ComboboxContent anchor={fpMethodAnchor} container={comboboxContainer}>
                                            <ComboboxEmpty>
                                                {fpMethodInputValue.trim()
                                                    ? `Press Enter to add "${fpMethodInputValue.trim()}"`
                                                    : "No methods found."}
                                            </ComboboxEmpty>
                                            <ComboboxList>
                                                {(item) => (
                                                    <ComboboxItem key={item.value} value={item}>
                                                        <Badge variant="outline">{item.code}</Badge>
                                                        {item.label}
                                                    </ComboboxItem>
                                                )}
                                            </ComboboxList>
                                        </ComboboxContent>
                                    </Combobox>
                                    <FieldDescription>
                                        Select from the list or type a custom method and press Enter to add.
                                    </FieldDescription>
                                </Field>
                            )}

                            {/* FP Status */}
                            {usingFP && selectedFpMethods.length > 0 && (
                                <Field>
                                    <FieldLabel>
                                        FP Status <span className="text-destructive">*</span>
                                    </FieldLabel>
                                    <Combobox
                                        items={fpStatusOptions}
                                        value={fpStatus ? fpStatusOptions.find((o) => o.value === fpStatus) ?? null : null}
                                        onValueChange={(val) => setFpStatus(val?.value ?? null)}
                                    >
                                        <ComboboxInput placeholder="Select FP status" showClear />
                                        <ComboboxContent container={comboboxContainer}>
                                            <ComboboxEmpty>No statuses found.</ComboboxEmpty>
                                            <ComboboxList>
                                                {(item) => (
                                                    <ComboboxItem key={item.value} value={item}>
                                                        <Badge variant="outline">{item.code}</Badge>
                                                        {item.label}
                                                    </ComboboxItem>
                                                )}
                                            </ComboboxList>
                                        </ComboboxContent>
                                    </Combobox>
                                    <FieldDescription>
                                        Select the current family planning status of the member.
                                    </FieldDescription>
                                </Field>
                            )}
                        </FieldGroup>
                    </FieldSet>
                </>
            )}

            {/* Submit / Cancel buttons inside form when callbacks provided */}
            {(onSubmit || onCancel) && (
                <div className="flex gap-4 pt-4">
                    {onCancel && (
                        <Button type="button" variant="outline" size="lg" className="flex-1" onClick={onCancel}>
                            Cancel
                        </Button>
                    )}
                    {onSubmit && (
                        <Button type="button" size="lg" className="flex-1" onClick={handleSubmit}>
                            Save Member
                        </Button>
                    )}
                </div>
            )}
        </FieldGroup>
    )
}
