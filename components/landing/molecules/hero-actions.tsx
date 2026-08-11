import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function HeroActions() {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <Button asChild size="lg" className="w-full sm:w-auto">
        <Link href="/register">
          Mulai simulasi
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </Button>
      <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
        <Link href="#simulation">Lihat format tes</Link>
      </Button>
    </div>
  );
}
