"use client";

import { type Dispatch, type ReactElement, type SetStateAction } from "react";
import { type UseFormReturn } from "react-hook-form";
import { SearchIcon, SparklesIcon, CreditCardIcon } from "lucide-react";

import { Button } from "~/components/ui/Button";
import { Badge } from "~/components/ui/Badge";
import { ButtonGroup, ButtonGroupSeparator, ButtonGroupText } from "~/components/ui/button-group";
import { Checkbox } from "~/components/ui/checkbox";
import { Combobox } from "~/components/ui/combobox";
import { DatePicker } from "~/components/ui/date-picker";
import { Field, FieldContent, FieldDescription, FieldGroup, FieldLabel, FieldSeparator, FieldSet, FieldTitle } from "~/components/ui/field";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/Input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupTextarea,
} from "~/components/ui/input-group";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "~/components/ui/input-otp";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemHeader,
  ItemMedia,
  ItemTitle,
} from "~/components/ui/item";
import { Kbd } from "~/components/ui/kbd";
import { Label } from "~/components/ui/Label";
import { NativeSelect } from "~/components/ui/native-select";
import { Popover, PopoverContent, PopoverDescription, PopoverHeader, PopoverTitle, PopoverTrigger } from "~/components/ui/Popover";
import { Progress } from "~/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Select } from "~/components/ui/Select";
import { Slider } from "~/components/ui/slider";
import { Switch } from "~/components/ui/switch";
import { Textarea } from "~/components/ui/Textarea";
import { Toggle } from "~/components/ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "~/components/ui/toggle-group";

import { Section, ShowcaseCard, type FormValues } from "~/components/demo/shared";

export function ActionsSection({
  form,
  dateValue,
  setDateValue,
  comboboxValue,
  setComboboxValue,
  progressValue,
  setProgressValue,
  otpValue,
  setOtpValue,
  onSubmit,
}: {
  form: UseFormReturn<FormValues>;
  dateValue: Date | undefined;
  setDateValue: Dispatch<SetStateAction<Date | undefined>>;
  comboboxValue: string;
  setComboboxValue: Dispatch<SetStateAction<string>>;
  progressValue: number;
  setProgressValue: Dispatch<SetStateAction<number>>;
  otpValue: string;
  setOtpValue: Dispatch<SetStateAction<string>>;
  onSubmit: (values: FormValues) => void;
}): ReactElement {
  return (
    <Section
      title="Actions and Inputs"
      description="Buttons, toggles, fields, structured forms, and common entry patterns."
    >
      <div className="grid items-start gap-4 xl:grid-cols-2 2xl:grid-cols-3">
        <ShowcaseCard title="Buttons and toggles" description="Stateful controls and keyboard hinting.">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Button>Primary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="secondary">Secondary</Button>
            </div>
            <ButtonGroup>
              <Button variant="ghost" size="sm">
                Save
              </Button>
              <ButtonGroupSeparator />
              <ButtonGroupText>Ctrl</ButtonGroupText>
              <Kbd>S</Kbd>
            </ButtonGroup>
            <div className="flex flex-wrap items-center gap-3">
              <Toggle aria-label="Toggle pin">
                <SparklesIcon />
              </Toggle>
              <ToggleGroup type="single" defaultValue="week">
                <ToggleGroupItem value="day">Day</ToggleGroupItem>
                <ToggleGroupItem value="week">Week</ToggleGroupItem>
                <ToggleGroupItem value="month">Month</ToggleGroupItem>
              </ToggleGroup>
            </div>
          </div>
        </ShowcaseCard>
        <ShowcaseCard title="Choice controls" description="Checkbox, radio, switch, slider, and progress.">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Checkbox defaultChecked id="alerts" />
              <Label htmlFor="alerts">Alert routing enabled</Label>
            </div>
            <RadioGroup defaultValue="proposal">
              <div className="flex items-center gap-3">
                <RadioGroupItem value="proposal" id="proposal" />
                <Label htmlFor="proposal">Proposal</Label>
              </div>
              <div className="flex items-center gap-3">
                <RadioGroupItem value="review" id="review" />
                <Label htmlFor="review">Review</Label>
              </div>
            </RadioGroup>
            <div className="flex items-center justify-between">
              <span className="text-sm">Auto-approve under threshold</span>
              <Switch defaultChecked />
            </div>
            <Slider
              value={[progressValue]}
              onValueChange={(values): void => setProgressValue(values[0] ?? 0)}
              max={100}
              step={1}
            />
            <Progress value={progressValue} />
          </div>
        </ShowcaseCard>
        <ShowcaseCard title="Inputs and composed fields" description="Structured entry patterns and mobile-safe native inputs.">
          <div className="space-y-4">
            <Input placeholder="Quote title" />
            <Textarea placeholder="Context for reviewers" />
            <InputGroup>
              <InputGroupAddon>
                <SearchIcon className="size-4" />
              </InputGroupAddon>
              <InputGroupInput placeholder="Search accounts" />
              <InputGroupButton>Go</InputGroupButton>
            </InputGroup>
            <NativeSelect
              defaultValue="review"
              options={[
                { label: "Discovery", value: "discovery" },
                { label: "Review", value: "review" },
                { label: "Approved", value: "approved" },
              ]}
            />
            <InputOTP maxLength={6} value={otpValue} onChange={setOtpValue}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>
        </ShowcaseCard>
      </div>
      <div className="grid items-start gap-4 xl:grid-cols-2 2xl:grid-cols-3">
        <ShowcaseCard title="Select, combobox, date picker" description="Decision controls built on the shared primitives.">
          <div className="space-y-4">
            <Select
              value="ops"
              options={[
                { label: "Operations", value: "ops" },
                { label: "Finance", value: "finance" },
                { label: "Executive", value: "executive" },
              ]}
            />
            <Combobox
              value={comboboxValue}
              onChange={setComboboxValue}
              options={[
                { label: "Proposal", value: "proposal" },
                { label: "Review", value: "review" },
                { label: "Approved", value: "approved" },
              ]}
            />
            <DatePicker value={dateValue} onChange={setDateValue} />
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">Popover</Button>
              </PopoverTrigger>
              <PopoverContent>
                <PopoverHeader>
                  <PopoverTitle>Context panel</PopoverTitle>
                  <PopoverDescription>
                    Compact summaries, helper content, and small utility forms.
                  </PopoverDescription>
                </PopoverHeader>
              </PopoverContent>
            </Popover>
          </div>
        </ShowcaseCard>
        <ShowcaseCard title="Field and item helpers" description="Support components for dense settings screens.">
          <div className="space-y-4">
            <FieldSet>
              <FieldTitle>Approval settings</FieldTitle>
              <FieldDescription>
                Keep low-level layout primitives reusable instead of burying them in route code.
              </FieldDescription>
              <FieldSeparator />
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="billing-code">Billing code</FieldLabel>
                  <FieldContent>
                    <Input id="billing-code" placeholder="NW-4451" />
                  </FieldContent>
                </Field>
                <Field>
                  <FieldLabel htmlFor="internal-notes">Internal notes</FieldLabel>
                  <FieldContent>
                    <InputGroup>
                      <InputGroupTextarea
                        id="internal-notes"
                        defaultValue="Escalate only if margin drops below threshold."
                      />
                    </InputGroup>
                  </FieldContent>
                </Field>
              </FieldGroup>
            </FieldSet>
            <Item>
              <ItemMedia>
                <CreditCardIcon className="size-4" />
              </ItemMedia>
              <ItemContent>
                <ItemHeader>
                  <ItemTitle>Billing profile</ItemTitle>
                  <ItemActions>
                    <Badge variant="secondary">Saved</Badge>
                  </ItemActions>
                </ItemHeader>
                <ItemDescription>
                  Ends in 4421 and is used for preview purchases.
                </ItemDescription>
                <ItemFooter>
                  <Button size="sm" variant="outline">
                    Edit
                  </Button>
                </ItemFooter>
              </ItemContent>
            </Item>
          </div>
        </ShowcaseCard>
        <ShowcaseCard title="React Hook Form" description="Form wrapper plus validation messaging.">
          <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="company"
                render={({ field }): ReactElement => (
                  <FormItem>
                    <FormLabel>Company</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>Account receiving the updated quote.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contact"
                render={({ field }): ReactElement => (
                  <FormItem>
                    <FormLabel>Contact</FormLabel>
                    <FormControl>
                      <Input id="contact" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="notes"
                render={({ field }): ReactElement => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea id="notes" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="priority"
                render={({ field }): ReactElement => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <FormControl>
                      <RadioGroup
                        value={field.value}
                        onValueChange={field.onChange}
                        className="grid gap-2 sm:grid-cols-2"
                      >
                        <label
                          htmlFor="priority-standard"
                          className="flex items-center gap-3 rounded-lg border border-border px-3 py-3"
                        >
                          <RadioGroupItem id="priority-standard" value="standard" />
                          <div>
                            <div className="text-sm font-medium">Standard</div>
                            <div className="text-xs text-muted-foreground">
                              Normal review lane
                            </div>
                          </div>
                        </label>
                        <label
                          htmlFor="priority-expedite"
                          className="flex items-center gap-3 rounded-lg border border-border px-3 py-3"
                        >
                          <RadioGroupItem id="priority-expedite" value="expedite" />
                          <div>
                            <div className="text-sm font-medium">Expedite</div>
                            <div className="text-xs text-muted-foreground">
                              Move to the front of the queue
                            </div>
                          </div>
                        </label>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </ShowcaseCard>
      </div>
    </Section>
  );
}
