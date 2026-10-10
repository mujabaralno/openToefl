import Link from "next/link"

interface FooterLink {
  label: string
  href: string
}

interface FooterLinkGroupProps {
  title: string
  links: FooterLink[]
}

export function FooterLinkGroup({ title, links }: FooterLinkGroupProps) {
  return (
    <nav aria-label={title}>
      <p className="mb-4 font-mono text-[10px] text-muted-foreground">{title}</p>
      <ul className="flex flex-wrap gap-x-6 gap-y-3 sm:gap-8">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="inline-block py-1 text-xl underline-offset-4 hover:underline"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
