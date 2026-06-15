import {
    Avatar as AvatarComponent,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"

export function Avatar() {
    return (
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
