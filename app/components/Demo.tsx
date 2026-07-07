"use client";

import { type ReactElement, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast as sonnerToast } from "sonner";

import { TooltipProvider } from "~/components/ui/Tooltip";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "~/components/ui/command";
import { ToastAction } from "~/components/ui/toast";
import { toast as legacyToast } from "~/hooks/use-toast";

import { ActionsSection } from "~/components/demo/ActionsSection";
import { FeedbackSection } from "~/components/demo/FeedbackSection";
import { HeroSection } from "~/components/demo/HeroSection";
import { IdentitySection } from "~/components/demo/IdentitySection";
import { LayoutSection } from "~/components/demo/LayoutSection";
import { OverlaySection } from "~/components/demo/OverlaySection";
import { formSchema, type FormValues } from "~/components/demo/shared";

export default function Demo(): ReactElement {
  const [commandOpen, setCommandOpen] = useState(false);
  const [dateValue, setDateValue] = useState<Date | undefined>(new Date());
  const [comboboxValue, setComboboxValue] = useState("proposal");
  const [progressValue, setProgressValue] = useState(58);
  const [otpValue, setOtpValue] = useState("");
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      company: "Northwind Health",
      contact: "ops@northwind.example",
      notes: "Need final pricing review before Friday.",
      priority: "standard",
    },
  });
  const onSubmit = (values: FormValues): void => {
    sonnerToast.success("Form submitted", {
      description: `${values.company} updated for ${values.priority} review.`,
    });
  };

  return (
    <TooltipProvider>
      <div className="space-y-12 pb-12">
        <HeroSection
          onOpenCommand={(): void => setCommandOpen(true)}
          onTriggerSonner={(): void => {
            sonnerToast.success("Sonner notification", {
              description: "Global toast wiring is active.",
            });
          }}
          onTriggerLegacyToast={(): void => {
            legacyToast({
              title: "Legacy toast",
              description: "Hook-based Radix toast is still mounted.",
              action: <ToastAction altText="Dismiss">Undo</ToastAction>,
            });
          }}
        />
        <IdentitySection />
        <ActionsSection
          form={form}
          dateValue={dateValue}
          setDateValue={setDateValue}
          comboboxValue={comboboxValue}
          setComboboxValue={setComboboxValue}
          progressValue={progressValue}
          setProgressValue={setProgressValue}
          otpValue={otpValue}
          setOtpValue={setOtpValue}
          onSubmit={onSubmit}
        />
        <OverlaySection onOpenCommand={(): void => setCommandOpen(true)} />
        <LayoutSection />
        <FeedbackSection dateValue={dateValue} setDateValue={setDateValue} />
      </div>

      <CommandDialog open={commandOpen} onOpenChange={setCommandOpen}>
        <CommandInput placeholder="Search commands..." />
        <CommandList>
          <CommandEmpty>No result found.</CommandEmpty>
          <CommandGroup heading="Actions">
            <CommandItem onSelect={(): void => setCommandOpen(false)}>
              Open review board
            </CommandItem>
            <CommandItem onSelect={(): void => setCommandOpen(false)}>Export pipeline</CommandItem>
            <CommandItem onSelect={(): void => setCommandOpen(false)}>Toggle density</CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </TooltipProvider>
  );
}
