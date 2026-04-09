"use client";

import { useUser } from "@clerk/nextjs";
import { ArrowUpRightIcon } from "lucide-react";
import { SettingsView } from "@/components/settings-view";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Drawer,
  DrawerDescription,
  DrawerHeader,
  DrawerPanel,
  DrawerPopup,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";

export function ProfileDrawer() {
  const { user } = useUser();

  return (
    <SidebarMenuItem>
      <Drawer position="right">
        <DrawerTrigger
          render={<SidebarMenuButton tooltip="Profile" type="button" />}
        >
          <Avatar className="size-4 rounded-md">
            <AvatarImage src={user?.imageUrl} />
            <AvatarFallback className="text-[9px]">
              {getInitials(user?.firstName, user?.lastName)}
            </AvatarFallback>
          </Avatar>
          <span>Profile</span>
          <ArrowUpRightIcon className="ms-auto size-4 opacity-64" />
        </DrawerTrigger>
        <DrawerPopup position="right" variant="inset">
          <DrawerHeader>
            <DrawerTitle>Profile</DrawerTitle>
            <DrawerDescription>Manage your account.</DrawerDescription>
          </DrawerHeader>
          <DrawerPanel scrollFade={false}>
            <SettingsView />
          </DrawerPanel>
        </DrawerPopup>
      </Drawer>
    </SidebarMenuItem>
  );
}

function getInitials(firstName?: string | null, lastName?: string | null) {
  const initials = `${firstName?.trim().charAt(0) ?? ""}${lastName?.trim().charAt(0) ?? ""}`.trim();
  return initials || "U";
}
