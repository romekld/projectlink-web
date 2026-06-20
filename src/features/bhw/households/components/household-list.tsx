'use client'

import { HouseholdCard } from './household-card'

export function HouseholdList() {
    return (
        <div className="flex items-center flex-col gap-4">
            {/* List Container */}
            {/* <ListItemContainer>
                {
                    items.map((item) => (
                        <ListItem
                            key={item.id}
                            icon={item.icon}
                            title={item.title}
                            subtitle={item.subtitle}
                            status={item.status}
                            statusVariant="outline"
                            amount={item.amount}
                            onClick={() => alert(`Clicked: ${item.title}`)}
                        />
                    ))
                }
            </ListItemContainer > */}

            {/* Info Section */}

            <HouseholdCard />
            <HouseholdCard />
            <HouseholdCard />
            <HouseholdCard />
            <HouseholdCard />
            <HouseholdCard />
        </div>
    )
}
