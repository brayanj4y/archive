"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useClerk } from "@clerk/nextjs";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  HomeIcon,
  CircleHelpIcon,
  CreditCardIcon,
  LogOutIcon,
  MonitorIcon,
  MoonStarIcon,
  SettingsIcon,
  SunIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { OrganizationDrawer } from "@/components/organization-drawer";
import {
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import {
  BILLING_URL,
  CONTACT_URL,
  DOCS_URL,
  HOME_URL,
  SETTINGS_URL,
  SIGN_IN_URL,
} from "@/lib/routes";

const PRIMARY_ITEMS = [
  {
    href: HOME_URL,
    icon: HomeIcon,
    label: "Home",
  },
  {
    href: BILLING_URL,
    icon: CreditCardIcon,
    label: "Billing",
  },
  {
    href: SETTINGS_URL,
    icon: SettingsIcon,
    label: "Settings",
  },
] as const;

const SUPPORT_ITEMS = [
  {
    href: DOCS_URL,
    icon: CircleHelpIcon,
    label: "Docs",
  },
  {
    href: CONTACT_URL,
    icon: CircleHelpIcon,
    label: "Contact",
  },
] as const;

type AppShellProps = {
  children?: React.ReactNode;
  title: string;
};

export function AppShell({ children, title }: AppShellProps) {
  const pathname = usePathname();
  const { signOut } = useClerk();
  const showBreadcrumb = pathname !== HOME_URL;

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="border-b border-sidebar-border px-4 py-4">
          <Link className="font-heading text-sm font-semibold tracking-wide" href={HOME_URL}>
            Ultron
          </Link>
        </SidebarHeader>
        <SidebarContent className="px-2 py-3">
          <SidebarGroup>
            <SidebarGroupLabel>Workspace</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <OrganizationDrawer />
                {PRIMARY_ITEMS.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      isActive={pathname === item.href}
                      render={<Link href={item.href} />}
                    >
                      <item.icon />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel>Support</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {SUPPORT_ITEMS.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      isActive={pathname === item.href}
                      render={<Link href={item.href} />}
                    >
                      <item.icon />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="border-t border-sidebar-border p-3">
          <ThemeModeSelect />
          <Button
            className="w-full justify-start"
            onClick={() => signOut({ redirectUrl: SIGN_IN_URL })}
            variant="outline"
          >
            <LogOutIcon />
            <span>Sign out</span>
          </Button>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <div className="flex min-h-svh flex-col">
          <main className="flex flex-1 flex-col gap-4 p-4 sm:p-6">
            {showBreadcrumb ? (
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink render={<Link href={HOME_URL} />}>
                      Home
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator> / </BreadcrumbSeparator>
                  <BreadcrumbItem>
                    <BreadcrumbPage>{title}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            ) : null}
            {children}
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

function ThemeModeSelect() {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const value = mounted ? theme ?? "system" : "system";

  return (
    <Select
      onValueChange={(nextValue) => {
        if (nextValue) {
          setTheme(nextValue);
        }
      }}
      value={value}
    >
      <SelectTrigger aria-label="Theme mode" className="w-full" size="sm">
        <span className="flex min-w-0 flex-1 items-center gap-2">
          <ThemeModeIcon theme={value} />
          <SelectValue />
        </span>
      </SelectTrigger>
      <SelectPopup>
        <SelectItem value="light">
          <span className="flex items-center gap-2">
            <SunIcon />
            <span>Light</span>
          </span>
        </SelectItem>
        <SelectItem value="dark">
          <span className="flex items-center gap-2">
            <MoonStarIcon />
            <span>Dark</span>
          </span>
        </SelectItem>
        <SelectItem value="system">
          <span className="flex items-center gap-2">
            <MonitorIcon />
            <span>System</span>
          </span>
        </SelectItem>
      </SelectPopup>
    </Select>
  );
}

function ThemeModeIcon({ theme }: { theme: string }) {
  if (theme === "light") {
    return <SunIcon className="size-4" />;
  }

  if (theme === "dark") {
    return <MoonStarIcon className="size-4" />;
  }

  return <MonitorIcon className="size-4" />;
}
