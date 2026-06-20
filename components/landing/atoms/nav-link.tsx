import { cn } from "@/lib/utils";
import Link from "next/link";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export function NavLink({ href, children, className }: NavLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
        className
      )}
    >
      {children}
    </Link>
  );
}
