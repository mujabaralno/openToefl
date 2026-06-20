import { Skeleton } from "@/components/ui/skeleton"

export default function AdminSettingsLoading() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-4 w-80" />
      </div>
      <Skeleton className="h-72 w-full rounded-xl" />
    </div>
  )
}
