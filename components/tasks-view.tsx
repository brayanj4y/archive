import Link from "next/link";
import { BookIcon, RouteIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { DOCS_URL } from "@/lib/routes";

export function TasksView() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <RouteIcon />
          </EmptyMedia>
          <EmptyTitle>No tasks yet</EmptyTitle>
          <EmptyDescription>Create a task to get started.</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <div className="flex gap-2">
            <Button size="sm" type="button">
              Create task
            </Button>
            <Button render={<Link href={DOCS_URL} />} size="sm" variant="outline">
              <BookIcon />
              View docs
            </Button>
          </div>
        </EmptyContent>
      </Empty>
    </div>
  );
}
