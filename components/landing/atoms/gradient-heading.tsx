import { cn } from "@/lib/utils";

interface GradientHeadingProps {
  children: React.ReactNode;
  className?: string;
}

export function GradientHeading({ children, className }: GradientHeadingProps) {
  return (
    <h1
      className={cn(
        "gradient-text mx-auto max-w-4xl text-4xl font-bold tracking-tight md:text-6xl lg:text-[72px] lg:leading-[1.05]",
        className
      )}
    >
      {children}
    </h1>
  );
}
