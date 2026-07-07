"use client";

import { type ColumnDef } from "@tanstack/react-table";
import type { ReactNode } from "react";
import { z } from "zod";
import { type ChartConfig } from "~/components/ui/chart";
import { cn } from "~/lib/utils";

export type DealRow = {
  account: string;
  owner: string;
  stage: string;
  value: string;
};

export const chartData = [
  { stage: "Discover", velocity: 22, quality: 18 },
  { stage: "Scope", velocity: 36, quality: 28 },
  { stage: "Price", velocity: 51, quality: 42 },
  { stage: "Approve", velocity: 67, quality: 58 },
];

export const chartConfig = {
  velocity: { label: "Velocity", color: "hsl(var(--primary))" },
  quality: { label: "Confidence", color: "hsl(var(--chart-2))" },
} satisfies ChartConfig;

export const tableData: DealRow[] = [
  { account: "Northwind Health", owner: "Ava", stage: "Proposal", value: "$84k" },
  { account: "Highline Energy", owner: "Milo", stage: "Review", value: "$126k" },
  { account: "Sunset Transit", owner: "Rhea", stage: "Discovery", value: "$52k" },
  { account: "Axis Retail", owner: "Jin", stage: "Approved", value: "$194k" },
];

export const columns: ColumnDef<DealRow>[] = [
  { accessorKey: "account", header: "Account" },
  { accessorKey: "owner", header: "Owner" },
  { accessorKey: "stage", header: "Stage" },
  { accessorKey: "value", header: "Value" },
];

export const formSchema = z.object({
  company: z.string().min(2, "Use at least 2 characters."),
  contact: z.string().email("Enter a valid email."),
  notes: z.string().min(10, "Add more context."),
  priority: z.enum(["standard", "expedite"]),
});

export type FormValues = z.infer<typeof formSchema>;

export function Section({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}): React.ReactElement {
  return (
    <section className="space-y-5 border-t border-border/80 pt-8 first:border-t-0 first:pt-0">
      <div className="space-y-1.5">
        <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
        <p className="max-w-2xl text-sm text-muted-foreground">{description}</p>
      </div>
      {children}
    </section>
  );
}

export function ShowcaseCard({
  title,
  description,
  className,
  children,
}: {
  title: string;
  description: string;
  className?: string;
  children: ReactNode;
}): React.ReactElement {
  return (
    <div className={cn("min-w-0 space-y-4", className)}>
      <div className="space-y-1.5">
        <h3 className="text-base font-medium tracking-tight">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {children}
    </div>
  );
}
