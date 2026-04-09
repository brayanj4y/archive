"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useOrganization, useOrganizationList } from "@clerk/nextjs";
import { getClerkErrorMessage } from "@/components/auth/utils";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerPanel,
  DrawerPopup,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { ArrowUpRightIcon, Building2Icon } from "lucide-react";

export function OrganizationDrawer() {
  const router = useRouter();
  const {
    isLoaded,
    invitations,
    memberships,
    organization,
  } = useOrganization({
    invitations: true,
    memberships: true,
  });
  const { isLoaded: isListLoaded, setActive, userMemberships } =
    useOrganizationList({
      userMemberships: true,
    });
  const [name, setName] = React.useState("");
  const [slug, setSlug] = React.useState("");
  const [isSaving, setIsSaving] = React.useState(false);
  const [isSwitching, setIsSwitching] = React.useState(false);
  const [inviteEmail, setInviteEmail] = React.useState("");
  const [isInviting, setIsInviting] = React.useState(false);
  const [isLeaving, setIsLeaving] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [isInviteDrawerOpen, setIsInviteDrawerOpen] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");

  const membershipsForUser = userMemberships.data ?? [];
  const currentOrgId = organization?.id ?? "";
  const currentMembership = membershipsForUser.find(
    (membership) => membership.organization.id === organization?.id,
  );
  const activeOrganizationMembers = memberships?.data ?? [];
  const pendingInvitations = invitations?.data ?? [];
  const currentSlug = organization?.slug ?? "";
  const canSwitchOrganizations = membershipsForUser.length > 1;

  React.useEffect(() => {
    if (!organization) {
      setName("");
      setSlug("");
      return;
    }

    setName(organization.name);
    setSlug(organization.slug ?? "");
  }, [organization]);

  async function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!organization) {
      return;
    }

    const nextName = name.trim();
    const nextSlug = slugify(slug);

    if (!nextName) {
      setErrorMessage("Enter an organization name.");
      return;
    }

    setErrorMessage("");
    setIsSaving(true);

    try {
      await organization.update({
        name: nextName,
        slug: nextSlug || undefined,
      });
    } catch (error) {
      setErrorMessage(getClerkErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  }

  const hasPendingChanges =
    name.trim() !== (organization?.name ?? "") || slugify(slug) !== currentSlug;

  async function handleSwitchOrganization(nextOrganizationId: string | null) {
    if (
      !setActive ||
      !nextOrganizationId ||
      nextOrganizationId === currentOrgId
    ) {
      return;
    }

    setErrorMessage("");
    setIsSwitching(true);

    try {
      await setActive({ organization: nextOrganizationId });
    } catch (error) {
      setErrorMessage(getClerkErrorMessage(error));
    } finally {
      setIsSwitching(false);
    }
  }

  async function handleLeaveOrganization() {
    if (!currentMembership) {
      return;
    }

    setErrorMessage("");
    setIsLeaving(true);

    try {
      await currentMembership.destroy();
      router.replace("/");
      router.refresh();
    } catch (error) {
      setErrorMessage(getClerkErrorMessage(error));
    } finally {
      setIsLeaving(false);
    }
  }

  async function handleDeleteOrganization() {
    if (!organization) {
      return;
    }

    setErrorMessage("");
    setIsDeleting(true);

    try {
      await organization.destroy();
      router.replace("/");
      router.refresh();
    } catch (error) {
      setErrorMessage(getClerkErrorMessage(error));
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <SidebarMenuItem>
      <Drawer position="right">
        <DrawerTrigger
          render={<SidebarMenuButton tooltip="Organization" type="button" />}
        >
          <Building2Icon />
          <span>Organization</span>
          <ArrowUpRightIcon className="ms-auto size-4 opacity-64" />
        </DrawerTrigger>
        <DrawerPopup position="right" variant="inset">
          <DrawerHeader>
            <DrawerTitle>Organization</DrawerTitle>
            <DrawerDescription>Manage this workspace.</DrawerDescription>
          </DrawerHeader>
          <DrawerPanel scrollFade={false}>
            <div className="space-y-4">
              {errorMessage ? <Alert variant="error">{errorMessage}</Alert> : null}
              <form className="space-y-4" id="organization-settings-form" onSubmit={handleSave}>
              <div className="space-y-4">
                {canSwitchOrganizations ? (
                  <Field>
                    <FieldLabel>Workspace</FieldLabel>
                    <Select
                      disabled={!isListLoaded || isSwitching || isSaving}
                      items={membershipsForUser.map((membership) => ({
                        label: membership.organization.name,
                        value: membership.organization.id,
                      }))}
                      onValueChange={(value) => handleSwitchOrganization(value)}
                      value={currentOrgId}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select workspace" />
                      </SelectTrigger>
                      <SelectPopup>
                        {membershipsForUser.map((membership) => (
                          <SelectItem
                            key={membership.organization.id}
                            value={membership.organization.id}
                          >
                            {membership.organization.name}
                          </SelectItem>
                        ))}
                      </SelectPopup>
                    </Select>
                    <FieldDescription>
                      Switch to another workspace from here.
                    </FieldDescription>
                  </Field>
                ) : null}
                <Field>
                  <FieldLabel htmlFor="organization-name">Name</FieldLabel>
                  <Input
                    id="organization-name"
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Organization name"
                    type="text"
                    value={name}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="organization-slug">Slug</FieldLabel>
                  <Input
                    id="organization-slug"
                    onChange={(event) => setSlug(event.target.value)}
                    placeholder="workspace-slug"
                    type="text"
                    value={slug}
                  />
                </Field>
                <Drawer position="right">
                  <DrawerTrigger
                    render={<Button className="w-full" variant="outline" />}
                  >
                    View members
                  </DrawerTrigger>
                    <DrawerPopup variant="inset">
                      <DrawerHeader>
                        <DrawerTitle>Members</DrawerTitle>
                      <DrawerDescription>
                        Current members and pending invites.
                      </DrawerDescription>
                    </DrawerHeader>
                    <DrawerPanel className="grid gap-4">
                      {activeOrganizationMembers.map((membership) => {
                        const memberName =
                          membership.publicUserData?.identifier ||
                          membership.publicUserData?.firstName ||
                          "Member";

                        return (
                          <div className="grid gap-1" key={membership.id}>
                            <p className="text-muted-foreground text-sm">Member</p>
                            <p className="font-medium text-sm">{memberName}</p>
                          </div>
                        );
                      })}
                      {pendingInvitations.map((invitation) => (
                        <div className="grid gap-1" key={invitation.id}>
                          <p className="text-muted-foreground text-sm">
                            Pending invite
                          </p>
                          <p className="font-medium text-sm">
                            {invitation.emailAddress}
                          </p>
                        </div>
                      ))}
                      {activeOrganizationMembers.length === 0 &&
                      pendingInvitations.length === 0 ? (
                        <p className="text-muted-foreground text-sm">
                          No members or invitations yet.
                        </p>
                      ) : null}
                    </DrawerPanel>
                    <DrawerFooter>
                      <Drawer
                        onOpenChange={setIsInviteDrawerOpen}
                        open={isInviteDrawerOpen}
                        position="right"
                      >
                        <DrawerTrigger render={<Button variant="outline" />}>
                          Invite
                        </DrawerTrigger>
                        <DrawerPopup variant="inset">
                          <DrawerHeader>
                            <DrawerTitle>Invite member</DrawerTitle>
                            <DrawerDescription>
                              Invite someone to this workspace.
                            </DrawerDescription>
                          </DrawerHeader>
                          <DrawerPanel className="grid gap-4">
                            <Field>
                              <FieldLabel>Email</FieldLabel>
                              <Input
                                onChange={(event) =>
                                  setInviteEmail(event.target.value)
                                }
                                placeholder="member@example.com"
                                type="email"
                                value={inviteEmail}
                              />
                            </Field>
                          </DrawerPanel>
                          <DrawerFooter>
                            <DrawerClose render={<Button variant="ghost" />}>
                              Cancel
                            </DrawerClose>
                            <Button
                              disabled={!organization || !inviteEmail.trim()}
                              loading={isInviting}
                              onClick={async () => {
                                if (!organization || !inviteEmail.trim()) {
                                  return;
                                }

                                setErrorMessage("");
                                setIsInviting(true);

                                try {
                                  await organization.inviteMember({
                                    emailAddress: inviteEmail.trim(),
                                    role: "org:member",
                                  });
                                  setInviteEmail("");
                                  setIsInviteDrawerOpen(false);
                                } catch (error) {
                                  setErrorMessage(getClerkErrorMessage(error));
                                } finally {
                                  setIsInviting(false);
                                }
                              }}
                              type="button"
                            >
                              Send invite
                            </Button>
                          </DrawerFooter>
                        </DrawerPopup>
                      </Drawer>
                    </DrawerFooter>
                  </DrawerPopup>
                </Drawer>
                <div className="space-y-4">
                  <Field>
                    <FieldLabel>Leave workspace</FieldLabel>
                    <FieldDescription>
                      Remove your access to this workspace.
                    </FieldDescription>
                    <Drawer position="right">
                      <DrawerTrigger
                        render={
                          <Button
                            className="w-full"
                            variant="destructive-outline"
                          />
                        }
                      >
                        Leave organization
                      </DrawerTrigger>
                      <DrawerPopup variant="inset">
                        <DrawerHeader>
                          <DrawerTitle>Leave organization</DrawerTitle>
                          <DrawerDescription>
                            You will lose access to this workspace.
                          </DrawerDescription>
                        </DrawerHeader>
                        <DrawerPanel className="grid gap-2">
                          <p className="text-muted-foreground text-sm">
                            Choose another workspace if you still need access.
                          </p>
                        </DrawerPanel>
                        <DrawerFooter>
                          <DrawerClose render={<Button variant="ghost" />}>
                            Cancel
                          </DrawerClose>
                          <Button
                            loading={isLeaving}
                            onClick={handleLeaveOrganization}
                            type="button"
                            variant="destructive"
                          >
                            Leave
                          </Button>
                        </DrawerFooter>
                      </DrawerPopup>
                    </Drawer>
                  </Field>
                  <Field>
                    <FieldLabel>Delete workspace</FieldLabel>
                    <FieldDescription>
                      Permanently remove this workspace.
                    </FieldDescription>
                    <Drawer position="right">
                      <DrawerTrigger
                        render={
                          <Button
                            className="w-full"
                            variant="destructive-outline"
                          />
                        }
                      >
                        Delete organization
                      </DrawerTrigger>
                      <DrawerPopup variant="inset">
                        <DrawerHeader>
                          <DrawerTitle>Delete organization</DrawerTitle>
                          <DrawerDescription>
                            This action cannot be undone.
                          </DrawerDescription>
                        </DrawerHeader>
                        <DrawerPanel className="grid gap-2">
                          <p className="text-muted-foreground text-sm">
                            Members and pending invitations will be removed.
                          </p>
                        </DrawerPanel>
                        <DrawerFooter>
                          <DrawerClose render={<Button variant="ghost" />}>
                            Cancel
                          </DrawerClose>
                          <Button
                            loading={isDeleting}
                            onClick={handleDeleteOrganization}
                            type="button"
                            variant="destructive"
                          >
                            Delete
                          </Button>
                        </DrawerFooter>
                      </DrawerPopup>
                    </Drawer>
                  </Field>
                </div>
              </div>
              </form>
            </div>
          </DrawerPanel>
          <DrawerFooter>
            <DrawerClose render={<Button variant="ghost" />}>
              Cancel
            </DrawerClose>
            <Button
              disabled={!isLoaded || !organization || !hasPendingChanges}
              form="organization-settings-form"
              loading={isSaving}
              type="submit"
            >
              Save
            </Button>
          </DrawerFooter>
        </DrawerPopup>
      </Drawer>
    </SidebarMenuItem>
  );
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
