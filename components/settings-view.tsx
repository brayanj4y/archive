"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useClerk, useUser } from "@clerk/nextjs";
import { getClerkErrorMessage } from "@/components/auth/utils";
import { Alert } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { Field, FieldLabel } from "@/components/ui/field";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SIGN_IN_URL } from "@/lib/routes";

export function SettingsView() {
  const router = useRouter();
  const { signOut } = useClerk();
  const { isLoaded, user } = useUser();
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");
  const [isSavingProfile, setIsSavingProfile] = React.useState(false);
  const [isUploadingImage, setIsUploadingImage] = React.useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = React.useState(false);
  const [isSigningOut, setIsSigningOut] = React.useState(false);

  React.useEffect(() => {
    if (!user) {
      setFirstName("");
      setLastName("");
      return;
    }

    setFirstName(user.firstName ?? "");
    setLastName(user.lastName ?? "");
  }, [user]);

  async function handleProfileSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!user) {
      return;
    }

    setErrorMessage("");
    setIsSavingProfile(true);

    try {
      await user.update({
        firstName: firstName.trim() || null,
        lastName: lastName.trim() || null,
      });
    } catch (error) {
      setErrorMessage(getClerkErrorMessage(error));
    } finally {
      setIsSavingProfile(false);
    }
  }

  async function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file || !user) {
      return;
    }

    setErrorMessage("");
    setIsUploadingImage(true);

    try {
      await user.setProfileImage({ file });
    } catch (error) {
      setErrorMessage(getClerkErrorMessage(error));
    } finally {
      setIsUploadingImage(false);
      event.target.value = "";
    }
  }

  async function handleDeleteAccount() {
    if (!user) {
      return;
    }

    setErrorMessage("");
    setIsDeletingAccount(true);

    try {
      await user.delete();
      router.replace(SIGN_IN_URL);
      router.refresh();
    } catch (error) {
      setErrorMessage(getClerkErrorMessage(error));
    } finally {
      setIsDeletingAccount(false);
    }
  }

  async function handleSignOut() {
    setIsSigningOut(true);
    try {
      await signOut({ redirectUrl: SIGN_IN_URL });
    } finally {
      setIsSigningOut(false);
    }
  }

  const profileChanged =
    firstName !== (user?.firstName ?? "") || lastName !== (user?.lastName ?? "");

  if (!isLoaded || !user) {
    return <div className="text-sm text-muted-foreground">Loading settings...</div>;
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      {errorMessage ? <Alert variant="error">{errorMessage}</Alert> : null}

      <section className="space-y-3">
        <div className="text-sm font-medium">Profile</div>
        <div className="flex items-center gap-4">
          <Avatar className="size-16 border">
            <AvatarImage src={user.imageUrl} />
            <AvatarFallback>{getInitials(firstName, lastName)}</AvatarFallback>
          </Avatar>
          <div className="space-y-2">
            <Button
              disabled={isUploadingImage}
              loading={isUploadingImage}
              size="sm"
              variant="outline"
            >
              <label className="cursor-pointer">
                Change photo
                <input
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                  type="file"
                />
              </label>
            </Button>
          </div>
        </div>
        <Form className="max-w-md" onSubmit={handleProfileSave}>
          <Field>
            <FieldLabel>First name</FieldLabel>
            <Input
              onChange={(event) => setFirstName(event.target.value)}
              value={firstName}
            />
          </Field>
          <Field>
            <FieldLabel>Last name</FieldLabel>
            <Input
              onChange={(event) => setLastName(event.target.value)}
              value={lastName}
            />
          </Field>
          <Button disabled={!profileChanged} loading={isSavingProfile} type="submit">
            Save profile
          </Button>
        </Form>
      </section>

      <section className="space-y-3">
        <div className="text-sm font-medium text-destructive-foreground">
          Danger zone
        </div>
        <div className="space-y-4 max-w-md">
          <Field>
            <FieldLabel>Sign out of this device</FieldLabel>
            <Drawer position="right">
              <DrawerTrigger render={<Button className="w-full" variant="outline" />}>
                Sign out
              </DrawerTrigger>
              <DrawerPopup variant="inset">
                <DrawerHeader>
                  <DrawerTitle>Sign out</DrawerTitle>
                  <DrawerDescription>Sign out of this device.</DrawerDescription>
                </DrawerHeader>
                <DrawerPanel className="grid gap-2">
                  <p className="text-muted-foreground text-sm">
                    You can sign back in any time with your current account.
                  </p>
                </DrawerPanel>
                <DrawerFooter>
                  <DrawerClose render={<Button variant="ghost" />}>Cancel</DrawerClose>
                  <Button
                    loading={isSigningOut}
                    onClick={handleSignOut}
                    type="button"
                    variant="outline"
                  >
                    Sign out
                  </Button>
                </DrawerFooter>
              </DrawerPopup>
            </Drawer>
          </Field>
          <Field>
            <FieldLabel>Delete your account</FieldLabel>
            <Drawer position="right">
              <DrawerTrigger render={<Button className="w-full" variant="destructive-outline" />}>
                Delete account
              </DrawerTrigger>
              <DrawerPopup variant="inset">
                <DrawerHeader>
                  <DrawerTitle>Delete account</DrawerTitle>
                  <DrawerDescription>This action cannot be undone.</DrawerDescription>
                </DrawerHeader>
                <DrawerPanel className="grid gap-2">
                  <p className="text-muted-foreground text-sm">
                    Your profile, organizations, and access will be removed.
                  </p>
                </DrawerPanel>
                <DrawerFooter>
                  <DrawerClose render={<Button variant="ghost" />}>Cancel</DrawerClose>
                  <Button
                    loading={isDeletingAccount}
                    onClick={handleDeleteAccount}
                    type="button"
                    variant="destructive"
                  >
                    Delete account
                  </Button>
                </DrawerFooter>
              </DrawerPopup>
            </Drawer>
          </Field>
        </div>
      </section>
    </div>
  );
}
function getInitials(firstName: string, lastName: string) {
  const initials = `${firstName.trim().charAt(0)}${lastName.trim().charAt(0)}`.trim();
  return initials || "U";
}
