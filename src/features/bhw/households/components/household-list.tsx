'use client'

import { ListItem, ListItemContainer } from '@/components/ui/list-item'
import {
    Utensils,
    Utensils as ForkKnife,
    Luggage,
    ShoppingBag,
    Folder,
} from 'lucide-react'
import { HouseholdCard } from './household-card'

export function HouseholdList() {
    const items = [
        {
            id: 1,
            icon: <Folder className="size-5 text-orange-500" />,
            title: 'Reyes',
            subtitle: '202606-BHS102-0015',
            status: 'Pending',
            amount: '₱226.00',
        },
        {
            id: 2,
            icon: <ForkKnife className="size-5 text-green-500" />,
            title: 'Shared expense',
            subtitle: 'Bill split • Jun 3, 2026',
            status: 'Open',
            amount: '₱231.00',
        },
        // {
        //     id: 3,
        //     icon: <Luggage className="size-5 text-green-500" />,
        //     title: 'Delos Santos',
        //     subtitle: 'Bill split • May 17, 2026',
        //     status: 'Approved',
        //     amount: '₱196.50',
        // },
        // {
        //     id: 4,
        //     icon: <Utensils className="size-5 text-orange-500" />,
        //     title: 'Jollibee Acacia',
        //     subtitle: 'Bill split • May 17, 2026',
        //     status: 'Open',
        //     amount: '₱211.00',
        // },
        // {
        //     id: 5,
        //     icon: <ShoppingBag className="size-5 text-teal-500" />,
        //     title: 'McDo SPMC',
        //     subtitle: 'Bill split • May 22, 2026',
        //     status: 'Submitted',
        //     amount: '₱214.00',
        // },
        // {
        //     id: 6,
        //     icon: <ShoppingBag className="size-5 text-teal-500" />,
        //     title: 'SM City',
        //     subtitle: 'Bill split • May 16, 2026',
        //     status: 'Open',
        //     amount: '₱13.50',
        // },
    ]

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
