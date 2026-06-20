import { Globe, Share2 } from "lucide-react";

export function SocialLinks() {
  return (
    <div className="flex gap-4">
      <a
        href="#"
        className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground transition-all hover:border-primary/20 hover:bg-secondary hover:text-foreground"
        aria-label="Website"
      >
        <Globe className="size-[18px]" />
      </a>
      <a
        href="#"
        className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground transition-all hover:border-primary/20 hover:bg-secondary hover:text-foreground"
        aria-label="Share"
      >
        <Share2 className="size-[18px]" />
      </a>
    </div>
  );
}
