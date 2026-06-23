import {
    Avatar as AvatarComponent,
    AvatarFallback,
} from "@/components/ui/avatar"

export function Avatar() {
    return (

        // make this dynamic that would accept props for size and image source and the text fallback in the initials of the name being passed.
        <AvatarComponent size="lg">
            {/* <AvatarImage
                src="https://github.com/shadcn.png"
                alt="@shadcn"
                className="grayscale"
            /> */}
            <AvatarFallback>1</AvatarFallback>
            
        </AvatarComponent>
    )
}
