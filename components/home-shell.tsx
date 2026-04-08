"use client";

import * as React from "react";
import { useClerk, useOrganization, useUser } from "@clerk/nextjs";
import {
  ImageIcon,
  Building2Icon,
  CircleHelpIcon,
  CreditCardIcon,
  LogOutIcon,
  MonitorIcon,
  MoonStarIcon,
  PaperclipIcon,
  SettingsIcon,
  SunIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import {
  Menu,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuPopup,
  MenuSeparator,
  MenuTrigger,
} from "@/components/ui/menu";
import {
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipPopup,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function HomeShell() {
  const { signOut } = useClerk();
  const { organization } = useOrganization();
  const { user } = useUser();

  const displayName =
    user?.fullName ||
    user?.firstName ||
    user?.primaryEmailAddress?.emailAddress ||
    "Account";
  const email = user?.primaryEmailAddress?.emailAddress ?? "";

  return (
    <main className="relative flex min-h-svh items-center justify-center p-6">
      <div className="fixed top-4 left-4 z-10 sm:top-6 sm:left-6">
        <Menu>
          <MenuTrigger
            render={
              <Button className="h-auto min-w-0 justify-start px-2 py-1.5" variant="outline" />
            }
          >
            <span className="text-sm font-medium">Account</span>
          </MenuTrigger>
          <MenuPopup align="end" className="w-64">
            <MenuGroup>
              <MenuGroupLabel>Account</MenuGroupLabel>
              <div className="px-2 py-1.5 text-xs text-muted-foreground">
                <div className="truncate font-medium text-foreground">
                  {displayName}
                </div>
                {email ? <div className="truncate">{email}</div> : null}
              </div>
              <MenuItem disabled>
                <Building2Icon />
                Organization
              </MenuItem>
              <MenuItem disabled>
                <CreditCardIcon />
                Billing
              </MenuItem>
              <MenuItem disabled>
                <SettingsIcon />
                Settings
              </MenuItem>
            </MenuGroup>
            <MenuSeparator />
            <MenuGroup>
              <MenuGroupLabel>Support</MenuGroupLabel>
              <MenuItem disabled>
                <CircleHelpIcon />
                Docs
              </MenuItem>
              <MenuItem disabled>
                <CircleHelpIcon />
                Contact
              </MenuItem>
            </MenuGroup>
            <MenuSeparator />
            <MenuGroup>
              <MenuItem onClick={() => signOut({ redirectUrl: "/sign-in" })}>
                <LogOutIcon />
                Sign out
              </MenuItem>
            </MenuGroup>
          </MenuPopup>
        </Menu>
      </div>
      <div className="w-full max-w-2xl">
        <InputGroup>
          <InputGroupTextarea placeholder="Compose your message..." rows={4} />
          <InputGroupAddon align="block-end" className="justify-between">
            <TooltipProvider>
              <div className="flex gap-1">
                <Tooltip>
                  <TooltipTrigger
                    render={
                      <Button
                        aria-label="Attach file"
                        size="icon-sm"
                        variant="ghost"
                      />
                    }
                  >
                    <PaperclipIcon />
                  </TooltipTrigger>
                  <TooltipPopup>Attach file</TooltipPopup>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger
                    render={
                      <Button
                        aria-label="Insert image"
                        size="icon-sm"
                        variant="ghost"
                      />
                    }
                  >
                    <ImageIcon />
                  </TooltipTrigger>
                  <TooltipPopup>Insert image</TooltipPopup>
                </Tooltip>
              </div>
            </TooltipProvider>
            <Button size="sm">Send</Button>
          </InputGroupAddon>
        </InputGroup>
      </div>
      <ThemeModeSelect />
    </main>
  );
}

function ThemeModeSelect() {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const value = mounted ? theme ?? "system" : "system";
  const handleValueChange = React.useCallback(
    (nextValue: string | null) => {
      if (nextValue) {
        setTheme(nextValue);
      }
    },
    [setTheme],
  );

  return (
    <div className="fixed bottom-4 left-4 z-10 w-40 sm:bottom-6 sm:left-6">
      <Select onValueChange={handleValueChange} value={value}>
        <SelectTrigger
          aria-label="Theme mode"
          className="bg-background/80 backdrop-blur-sm"
          size="sm"
        >
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
    </div>
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
