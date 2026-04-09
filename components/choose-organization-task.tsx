"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { CircleAlertIcon } from "lucide-react";
import { useOrganizationList } from "@clerk/nextjs";
import { getClerkErrorMessage } from "@/components/auth/utils";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardPanel,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Form } from "@/components/ui/form";
import { Frame, FrameFooter } from "@/components/ui/frame";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { HOME_URL } from "@/lib/routes";

export function ChooseOrganizationTask() {
  const router = useRouter();
  const { createOrganization, isLoaded, setActive, userMemberships } =
    useOrganizationList({
      userMemberships: {
        infinite: true,
      },
    });
  const [mode, setMode] = React.useState<"existing" | "create">("create");
  const [selectedOrganizationId, setSelectedOrganizationId] = React.useState("");
  const [organizationName, setOrganizationName] = React.useState("");
  const [organizationSlug, setOrganizationSlug] = React.useState("");
  const [isSlugDirty, setIsSlugDirty] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitMode, setSubmitMode] = React.useState<"existing" | "create" | null>(
    null,
  );
  const [errorMessage, setErrorMessage] = React.useState("");

  const memberships = userMemberships.data ?? [];
  const organizationOptions = memberships.map((membership) => ({
    label: membership.organization.name,
    value: membership.organization.id,
  }));
  const hasOrganizations = organizationOptions.length > 0;

  React.useEffect(() => {
    if (!isSlugDirty) {
      setOrganizationSlug(slugify(organizationName));
    }
  }, [isSlugDirty, organizationName]);

  React.useEffect(() => {
    if (!selectedOrganizationId && organizationOptions.length > 0) {
      setSelectedOrganizationId(organizationOptions[0].value);
    }
  }, [organizationOptions, selectedOrganizationId]);

  React.useEffect(() => {
    if (hasOrganizations) {
      setMode("existing");
      return;
    }

    setMode("create");
  }, [hasOrganizations]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isLoaded) {
      return;
    }

    if (mode === "existing") {
      if (!selectedOrganizationId) {
        return;
      }

      setErrorMessage("");
      setSubmitMode("existing");
      setIsSubmitting(true);

      try {
        await setActive({ organization: selectedOrganizationId });
        router.replace(HOME_URL);
        router.refresh();
      } catch (error) {
        setErrorMessage(getClerkErrorMessage(error));
      } finally {
        setIsSubmitting(false);
        setSubmitMode(null);
      }

      return;
    }

    const normalizedName = organizationName.trim();
    const normalizedSlug = organizationSlug.trim() || undefined;

    if (!normalizedName) {
      setErrorMessage("Enter an organization name.");
      return;
    }

    setErrorMessage("");
    setSubmitMode("create");
    setIsSubmitting(true);

    try {
      const existingMembership = memberships.find((membership) => {
        const organization = membership.organization;
        return (
          organization.name.toLowerCase() === normalizedName.toLowerCase() ||
          (normalizedSlug ? organization.slug === normalizedSlug : false)
        );
      });

      const organization = existingMembership?.organization
        ? existingMembership.organization
        : await createOrganization({
            name: normalizedName,
            slug: normalizedSlug,
          });

      await setActive({ organization: organization.id });
      router.replace(HOME_URL);
      router.refresh();
    } catch (error) {
      setErrorMessage(getClerkErrorMessage(error));
    } finally {
      setIsSubmitting(false);
      setSubmitMode(null);
    }
  }

  return (
    <main className="flex min-h-svh items-center justify-center px-4 py-10">
      <Frame className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle>Choose organization</CardTitle>
            <CardDescription>
              {hasOrganizations
                ? "Select an existing workspace or create a new one to continue."
                : "Create a new workspace to continue."}
            </CardDescription>
          </CardHeader>
          <CardPanel className="space-y-4">
            {errorMessage ? <Alert variant="error">{errorMessage}</Alert> : null}
            <Form onSubmit={handleSubmit}>
              {hasOrganizations ? (
                <div className="grid grid-cols-2 gap-1 rounded-lg bg-muted p-1">
                  <Button
                    aria-pressed={mode === "existing"}
                    className="w-full"
                    disabled={isSubmitting}
                    onClick={() => setMode("existing")}
                    type="button"
                    variant={mode === "existing" ? "default" : "ghost"}
                  >
                    Existing org
                  </Button>
                  <Button
                    aria-pressed={mode === "create"}
                    className="w-full"
                    disabled={isSubmitting}
                    onClick={() => setMode("create")}
                    type="button"
                    variant={mode === "create" ? "default" : "ghost"}
                  >
                    Create new
                  </Button>
                </div>
              ) : null}

              <div className="grid">
                <div
                  aria-hidden={mode !== "existing"}
                  className={[
                    "overflow-hidden transition-all duration-300 ease-out",
                    mode === "existing"
                      ? "max-h-48 translate-y-0 opacity-100"
                      : "pointer-events-none max-h-0 -translate-y-2 opacity-0",
                  ].join(" ")}
                >
                  <div className="space-y-4 pb-0.5">
                    <Field>
                      <FieldLabel>Workspace</FieldLabel>
                      <Select
                        disabled={!isLoaded || !hasOrganizations || isSubmitting}
                        items={organizationOptions}
                        onValueChange={(value) => setSelectedOrganizationId(value ?? "")}
                        value={selectedOrganizationId}
                      >
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              isLoaded
                                ? "No organizations available"
                                : "Loading organizations"
                            }
                          />
                        </SelectTrigger>
                        <SelectPopup>
                          {organizationOptions.map(({ label, value }) => (
                            <SelectItem key={value} value={value}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectPopup>
                      </Select>
                      <FieldDescription>
                        If your previous active org was deleted, choose another one
                        here.
                      </FieldDescription>
                    </Field>
                  </div>
                </div>

                <div
                  aria-hidden={mode !== "create"}
                  className={[
                    "overflow-hidden transition-all duration-300 ease-out",
                    mode === "create"
                      ? "max-h-80 translate-y-0 opacity-100"
                      : "pointer-events-none max-h-0 translate-y-2 opacity-0",
                  ].join(" ")}
                >
                  <div className="space-y-4 pb-0.5">
                    <Field>
                      <FieldLabel htmlFor="organization-name">Name</FieldLabel>
                      <Input
                        id="organization-name"
                        onChange={(event) => setOrganizationName(event.target.value)}
                        placeholder="Name of your organization"
                        type="text"
                        value={organizationName}
                      />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="organization-slug">Slug</FieldLabel>
                      <Input
                        id="organization-slug"
                        onChange={(event) => {
                          setIsSlugDirty(true);
                          setOrganizationSlug(slugify(event.target.value));
                        }}
                        placeholder="workspace-slug"
                        type="text"
                        value={organizationSlug}
                      />
                    </Field>
                  </div>
                </div>
              </div>

              <Button
                className="w-full"
                disabled={
                  !isLoaded ||
                  isSubmitting ||
                  (mode === "existing" && !selectedOrganizationId)
                }
                loading={
                  isSubmitting &&
                  ((mode === "existing" && submitMode === "existing") ||
                    (mode === "create" && submitMode === "create"))
                }
                type="submit"
              >
                {mode === "existing" ? "Continue" : "Create and continue"}
              </Button>
            </Form>
          </CardPanel>
        </Card>
        <FrameFooter>
          <div className="flex gap-1 text-muted-foreground text-xs">
            <CircleAlertIcon className="size-3 h-lh shrink-0" />
            <p>Clerk requires an active organization before this session can continue.</p>
          </div>
        </FrameFooter>
      </Frame>
    </main>
  );
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
