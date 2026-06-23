export function Header({ title, description, className }: { title: string; description: string; className?: string }) {
    return (
        <section className={`p-6 border-b ${className || ''}`}>
            <h2 className="text-lg font-semibold">{title}</h2>
            <p className="text-sm text-muted-foreground">
                {description}
            </p>
        </section>
    )
}