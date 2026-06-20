/**
 * components/layout/index.ts
 * Central export for the dashboard shell.
 *
 * Conventions:
 * - Presentational pieces (SidebarContent, AppNavbar) stay Server-friendly.
 * - Interactive parts (SidebarNav, UserMenu, MobileSidebar, LogoutButton)
 *   are client components.
 */

export { AppNavbar } from "@/components/layout/app-navbar"
export { SidebarContent } from "@/components/layout/sidebar-content"
export { SidebarNav } from "@/components/layout/sidebar-nav"
export { MobileSidebar } from "@/components/layout/mobile-sidebar"
export { UserMenu } from "@/components/layout/user-menu"
export { LogoutButton } from "@/components/layout/logout-button"
export { studentNavItems, adminNavItems } from "@/components/layout/nav-config"
