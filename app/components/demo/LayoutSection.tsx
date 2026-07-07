"use client";

import { type ReactElement, useState } from "react";
import { type SortingState, flexRender, getCoreRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { useDirection, DirectionProvider } from "~/components/ui/direction";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/Table";
import { Button } from "~/components/ui/Button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "~/components/ui/accordion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "~/components/ui/carousel";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "~/components/ui/chart";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "~/components/ui/pagination";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "~/components/ui/resizable";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarInset, SidebarProvider, SidebarSeparator } from "~/components/ui/Sidebar";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "~/components/ui/SidebarMenu";
import { Badge } from "~/components/ui/Badge";
import { Kbd } from "~/components/ui/kbd";
import { Layers3Icon, BellIcon, Settings2Icon } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "~/components/ui/collapsible";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

import { Section, ShowcaseCard, chartConfig, chartData, columns, tableData } from "~/components/demo/shared";

function DataTableDemo(): ReactElement {
  const [sorting, setSorting] = useState<SortingState>([]);
  const table = useReactTable({
    data: tableData,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-xl border border-border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {cell.column.columnDef.cell
                      ? flexRender(cell.column.columnDef.cell, cell.getContext())
                      : (cell.getValue() as string)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Route-level data table demo using TanStack Table plus the shared `Table` primitive.
        </p>
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={(): void => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Prev
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={(): void => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

function SidebarPreview(): ReactElement {
  const items = [
    { icon: Layers3Icon, label: "Workflows" },
    { icon: BellIcon, label: "Activity" },
    { icon: Settings2Icon, label: "Settings" },
  ];

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-sidebar text-sidebar-foreground">
      <SidebarProvider
        defaultOpen
        className="min-h-0 flex-col overflow-hidden [--sidebar-width:17rem] md:h-80 md:flex-row"
      >
        <Sidebar
          collapsible="none"
          className="w-full shrink-0 border-b border-sidebar-border md:h-full md:w-(--sidebar-width) md:border-b-0 md:border-r"
        >
          <SidebarHeader className="justify-center px-4 py-4 md:min-h-28">
            <div className="flex items-center gap-3 rounded-xl bg-sidebar-accent/70 px-4 py-3 text-sm font-semibold text-sidebar-accent-foreground">
              <Layers3Icon className="size-5 shrink-0" />
              <span>Component Lab</span>
            </div>
          </SidebarHeader>
          <SidebarSeparator className="mx-0" />
          <SidebarContent className="px-3 py-3">
            <SidebarGroup className="gap-2 px-0">
              <SidebarGroupLabel className="px-3 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-sidebar-foreground/60">
                Navigation
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {items.map(({ icon: Icon, label }, index) => (
                    <SidebarMenuItem key={label}>
                      <SidebarMenuButton
                        isActive={index === 0}
                        className="h-10 rounded-lg px-3 text-base"
                      >
                        <Icon className="size-5" />
                        <span>{label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <SidebarInset className="min-w-0 bg-background">
          <div className="flex flex-col justify-center border-b border-border px-5 py-4 md:min-h-28">
            <div className="text-lg font-semibold">Inset preview</div>
            <p className="mt-1 text-sm text-muted-foreground">
              The shared sidebar primitives used by the main shell are also exposed here.
            </p>
          </div>
          <div className="grid gap-3 p-5 text-sm text-muted-foreground xl:grid-cols-2">
            <div className="rounded-lg border border-dashed border-border bg-muted/30 px-4 py-4">
              Desktop shell collapse behavior is exercised through the real app sidebar toggle in
              the header.
            </div>
            <div className="rounded-lg border border-border/70 bg-card px-4 py-4">
              Direction switching is covered separately below so this preview can stay layout-stable
              across widths.
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}

function DirectionDemo(): ReactElement {
  const { dir, setDir } = useDirection();

  return (
    <div dir={dir} className="space-y-3 rounded-xl border border-border p-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold">Direction provider</div>
          <div className="text-sm text-muted-foreground">Current mode: {dir.toUpperCase()}</div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={(): void => setDir((current) => (current === "ltr" ? "rtl" : "ltr"))}
        >
          Toggle Direction
        </Button>
      </div>
      <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3 text-sm">
        <Badge variant="secondary">Lead</Badge>
        <span>Direction-sensitive row content</span>
        <Kbd className="ml-auto">Tab</Kbd>
      </div>
    </div>
  );
}

export function LayoutSection(): ReactElement {
  return (
    <Section
      title="Layout and Data"
      description="Disclosure patterns, scrolling, resizing, tables, charts, and client-only shell previews."
    >
      <div className="grid gap-4">
        <ShowcaseCard title="Accordion, collapsible, tabs" description="Progressive disclosure for dense screens.">
          <div className="space-y-4">
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger>Quote summary</AccordionTrigger>
                <AccordionContent>
                  Three approvals pending, margin stable, and no blocking validation errors.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <Collapsible>
              <CollapsibleTrigger asChild>
                <Button variant="outline" size="sm">
                  Toggle details
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-3 text-sm text-muted-foreground">
                Collapsible content is useful when a full accordion feels too heavy.
              </CollapsibleContent>
            </Collapsible>
            <Tabs defaultValue="overview">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="text-sm text-muted-foreground">
                Overview panel content.
              </TabsContent>
              <TabsContent value="history" className="text-sm text-muted-foreground">
                History panel content.
              </TabsContent>
            </Tabs>
          </div>
        </ShowcaseCard>
        <ShowcaseCard title="Scroll area and resizable panels" description="Viewport-bound containers and pane resizing.">
          <div className="space-y-4">
            <ScrollArea className="h-40 rounded-xl border border-border p-4">
              <div className="space-y-3 text-sm">
                {Array.from({ length: 8 }, (_, index) => `Row ${index + 1}`).map((rowLabel) => (
                  <div key={rowLabel} className="rounded-lg bg-muted/60 p-3">
                    {rowLabel} inside the scroll area.
                  </div>
                ))}
              </div>
            </ScrollArea>
            <div className="h-52 overflow-hidden rounded-xl border border-border">
              <ResizablePanelGroup orientation="horizontal">
                <ResizablePanel defaultSize={55}>
                  <div className="flex h-full items-center justify-center bg-muted/30 text-sm text-muted-foreground">
                    Pipeline board
                  </div>
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={45}>
                  <div className="flex h-full items-center justify-center bg-card text-sm text-muted-foreground">
                    Inspector
                  </div>
                </ResizablePanel>
              </ResizablePanelGroup>
            </div>
          </div>
        </ShowcaseCard>
        <ShowcaseCard title="Sidebar and direction" description="Shell preview and RTL/LTR coverage.">
          <div className="space-y-4">
            <SidebarPreview />
            <DirectionProvider>
              <DirectionDemo />
            </DirectionProvider>
          </div>
        </ShowcaseCard>
      </div>
      <div className="grid gap-4">
        <ShowcaseCard title="Table and data table" description="Shared primitive plus route-level table composition.">
          <div className="space-y-6">
            <div className="overflow-x-auto rounded-xl border border-border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Step</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Discovery</TableCell>
                    <TableCell>Ava</TableCell>
                    <TableCell>
                      <Badge variant="secondary">Active</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Pricing</TableCell>
                    <TableCell>Rhea</TableCell>
                    <TableCell>
                      <Badge variant="outline">Queued</Badge>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
            <DataTableDemo />
          </div>
        </ShowcaseCard>
        <ShowcaseCard title="Chart and carousel" description="Data and media presentation.">
          <div className="space-y-6">
            <ChartContainer config={chartConfig} className="h-[320px] min-w-0 w-full">
              <BarChart
                accessibilityLayer
                data={chartData}
                margin={{ top: 8, right: 8, bottom: 0, left: 8 }}
              >
                <CartesianGrid vertical={false} />
                <XAxis dataKey="stage" tickLine={false} axisLine={false} tickMargin={8} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey="velocity"
                  fill="var(--color-velocity)"
                  radius={6}
                  isAnimationActive={false}
                />
                <Bar
                  dataKey="quality"
                  fill="var(--color-quality)"
                  radius={6}
                  isAnimationActive={false}
                />
              </BarChart>
            </ChartContainer>
            <div className="mx-auto w-full max-w-3xl space-y-6">
              <Carousel opts={{ loop: true }}>
                <CarouselContent>
                  {["Proposal", "Review", "Approval"].map((label) => (
                    <CarouselItem key={label}>
                      <div className="rounded-xl border border-border bg-muted/40 p-8 text-center text-sm font-medium">
                        {label} slide
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious href="#pagination" />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#pagination" isActive>
                      1
                    </PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#pagination">2</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext href="#pagination" />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </div>
        </ShowcaseCard>
      </div>
    </Section>
  );
}
