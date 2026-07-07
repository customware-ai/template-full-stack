"use client";

import { type ReactElement } from "react";
import { Button } from "~/components/ui/Button";

export function HeroSection({
  onOpenCommand,
  onTriggerSonner,
  onTriggerLegacyToast,
}: {
  onOpenCommand: () => void;
  onTriggerSonner: () => void;
  onTriggerLegacyToast: () => void;
}): ReactElement {
  return (
    <section className="space-y-5">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Component Reference</h1>
        <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
          Shipped shadcn primitives and local wrappers for this template. Keep this page as a
          reference surface only, then remove it before real implementation work starts.
        </p>
      </div>
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
          <span>Client-only SPA</span>
          <span className="hidden text-border sm:inline">/</span>
          <span>Radix aggregate package</span>
          <span className="hidden text-border sm:inline">/</span>
          <span>Interactive QA target</span>
        </div>
        <div className="grid gap-2 sm:grid-cols-3 xl:w-auto">
          <Button variant="outline" onClick={onOpenCommand}>
            Open Command
          </Button>
          <Button variant="outline" onClick={onTriggerSonner}>
            Trigger Sonner
          </Button>
          <Button variant="outline" onClick={onTriggerLegacyToast}>
            Trigger Legacy Toast
          </Button>
        </div>
      </div>
    </section>
  );
}
