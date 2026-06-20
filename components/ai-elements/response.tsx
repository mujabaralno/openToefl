"use client"

import Link from "next/link"
import ReactMarkdown, { type Components } from "react-markdown"
import remarkGfm from "remark-gfm"

import { cn } from "@/lib/utils"

interface ResponseProps {
  children: string
  className?: string
}

const linkClass = "text-primary underline underline-offset-2 hover:opacity-80"

// Internal links (/...) navigate with Next; external links open in a new tab.
const markdownComponents: Components = {
  a: ({ href, children }) => {
    const url = typeof href === "string" ? href : ""
    if (url.startsWith("/")) {
      return (
        <Link href={url} className={linkClass}>
          {children}
        </Link>
      )
    }
    return (
      <a href={url} target="_blank" rel="noreferrer" className={linkClass}>
        {children}
      </a>
    )
  },
}

/**
 * Token-styled Markdown renderer for AI output (react-markdown + GFM).
 * Element styles are applied via descendant selectors so the markup stays
 * theme-driven — no hardcoded colors.
 */
export function Response({ children, className }: ResponseProps) {
  return (
    <div
      className={cn(
        "text-sm leading-relaxed text-foreground",
        "[&>:first-child]:mt-0 [&>:last-child]:mb-0",
        "[&_h1]:mt-5 [&_h1]:mb-2 [&_h1]:text-lg [&_h1]:font-semibold [&_h1]:tracking-tight",
        "[&_h2]:mt-5 [&_h2]:mb-2 [&_h2]:text-base [&_h2]:font-semibold [&_h2]:tracking-tight",
        "[&_h3]:mt-4 [&_h3]:mb-1.5 [&_h3]:text-sm [&_h3]:font-semibold",
        "[&_p]:mb-3",
        "[&_ul]:mb-3 [&_ul]:ml-5 [&_ul]:list-disc [&_ul]:space-y-1",
        "[&_ol]:mb-3 [&_ol]:ml-5 [&_ol]:list-decimal [&_ol]:space-y-1",
        "[&_li]:leading-relaxed [&_li]:pl-1",
        "[&_strong]:font-semibold [&_strong]:text-foreground",
        "[&_em]:italic",
        "[&_blockquote]:mb-3 [&_blockquote]:border-l-2 [&_blockquote]:border-border [&_blockquote]:pl-3 [&_blockquote]:text-muted-foreground",
        "[&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-xs",
        "[&_hr]:my-4 [&_hr]:border-border",
        "[&_table]:mb-3 [&_table]:w-full [&_table]:text-left",
        "[&_th]:border [&_th]:border-border [&_th]:px-2 [&_th]:py-1 [&_th]:font-medium",
        "[&_td]:border [&_td]:border-border [&_td]:px-2 [&_td]:py-1",
        className
      )}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
        {children}
      </ReactMarkdown>
    </div>
  )
}
