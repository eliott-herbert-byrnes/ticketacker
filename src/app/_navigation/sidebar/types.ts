export type NavItem = {
    seperator?: boolean
    title: string
    icon: React.ReactElement<{ className: string }>
    href: string
}