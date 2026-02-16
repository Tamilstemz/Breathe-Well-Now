import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, ClipboardCheck, Stethoscope } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Patient, Screening } from "@shared/schema";

const screeningFormSchema = z.object({
  patientId: z.string().min(1, "Select a patient"),
  coughDuration: z.coerce.number().min(0).default(0),
  sputumProduction: z.boolean().default(false),
  dyspnea: z.boolean().default(false),
  wheezing: z.boolean().default(false),
  chestTightness: z.boolean().default(false),
  frequentInfections: z.boolean().default(false),
  familyHistory: z.boolean().default(false),
  ageOver40: z.boolean().default(false),
  notes: z.string().optional(),
  screenedBy: z.string().optional(),
  status: z.enum(["pending", "in_progress", "completed"]).default("completed"),
});

const symptoms = [
  { name: "sputumProduction" as const, label: "Sputum Production", desc: "Regular coughing up of mucus" },
  { name: "dyspnea" as const, label: "Dyspnea (Breathlessness)", desc: "Difficulty breathing during activity or rest" },
  { name: "wheezing" as const, label: "Wheezing", desc: "Whistling sound when breathing" },
  { name: "chestTightness" as const, label: "Chest Tightness", desc: "Feeling of pressure or constriction" },
  { name: "frequentInfections" as const, label: "Frequent Respiratory Infections", desc: "Recurring colds, flu, or pneumonia" },
  { name: "familyHistory" as const, label: "Family History of COPD", desc: "Close relatives diagnosed with COPD" },
  { name: "ageOver40" as const, label: "Age Over 40", desc: "Patient is 40 years or older" },
];

function ScreeningForm({ onSuccess }: { onSuccess: () => void }) {
  const { toast } = useToast();
  const { data: patients = [] } = useQuery<Patient[]>({ queryKey: ["/api/patients"] });

  const form = useForm<z.infer<typeof screeningFormSchema>>({
    resolver: zodResolver(screeningFormSchema),
    defaultValues: {
      patientId: "",
      coughDuration: 0,
      sputumProduction: false,
      dyspnea: false,
      wheezing: false,
      chestTightness: false,
      frequentInfections: false,
      familyHistory: false,
      ageOver40: false,
      notes: "",
      screenedBy: "",
      status: "completed",
    },
  });

  const values = form.watch();
  const score =
    (values.sputumProduction ? 1 : 0) +
    (values.dyspnea ? 1 : 0) +
    (values.wheezing ? 1 : 0) +
    (values.chestTightness ? 1 : 0) +
    (values.frequentInfections ? 1 : 0) +
    (values.familyHistory ? 1 : 0) +
    (values.ageOver40 ? 1 : 0) +
    (values.coughDuration >= 3 ? 1 : 0);

  const riskLabel = score <= 2 ? "Low" : score <= 4 ? "Moderate" : score <= 6 ? "High" : "Very High";
  const riskColor =
    score <= 2
      ? "text-emerald-600 dark:text-emerald-400"
      : score <= 4
      ? "text-amber-600 dark:text-amber-400"
      : score <= 6
      ? "text-orange-600 dark:text-orange-400"
      : "text-red-600 dark:text-red-400";

  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof screeningFormSchema>) => {
      const payload = { ...data, totalScore: score };
      const res = await apiRequest("POST", "/api/screenings", payload);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/screenings"] });
      queryClient.invalidateQueries({ queryKey: ["/api/patients"] });
      toast({ title: "Screening completed successfully" });
      form.reset();
      onSuccess();
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((d) => mutation.mutate(d))} className="space-y-5">
        <FormField
          control={form.control}
          name="patientId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Patient</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger data-testid="select-screening-patient">
                    <SelectValue placeholder="Select a patient" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {patients.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.firstName} {p.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="coughDuration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Chronic Cough Duration (weeks)</FormLabel>
              <FormControl>
                <Input type="number" min={0} {...field} data-testid="input-cough-duration" />
              </FormControl>
              <FormDescription>Persistent cough lasting 3+ weeks indicates risk</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-3">
          <h4 className="text-sm font-medium">Symptom Assessment</h4>
          {symptoms.map((symptom) => (
            <FormField
              key={symptom.name}
              control={form.control}
              name={symptom.name}
              render={({ field }) => (
                <FormItem className="flex items-center justify-between gap-3 rounded-md border p-3">
                  <div className="space-y-0.5">
                    <FormLabel className="text-sm">{symptom.label}</FormLabel>
                    <FormDescription className="text-xs">{symptom.desc}</FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      data-testid={`switch-${symptom.name}`}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          ))}
        </div>

        <Card>
          <CardContent className="flex items-center justify-between gap-4 p-4">
            <div>
              <p className="text-sm font-medium">Risk Score</p>
              <p className="text-xs text-muted-foreground">Based on responses above</p>
            </div>
            <div className="text-right">
              <p className={`text-2xl font-bold ${riskColor}`} data-testid="text-risk-score">
                {score}/8
              </p>
              <p className={`text-sm font-medium ${riskColor}`}>{riskLabel} Risk</p>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="screenedBy"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Screened By</FormLabel>
                <FormControl>
                  <Input placeholder="Healthcare worker name" {...field} data-testid="input-screened-by" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger data-testid="select-screening-status">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes (Optional)</FormLabel>
              <FormControl>
                <Textarea placeholder="Additional observations..." {...field} data-testid="input-screening-notes" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={mutation.isPending} data-testid="button-submit-screening">
          {mutation.isPending ? "Submitting..." : "Complete Screening"}
        </Button>
      </form>
    </Form>
  );
}

export default function ScreeningsPage() {
  const [open, setOpen] = useState(false);
  const { data: screenings = [], isLoading } = useQuery<Screening[]>({
    queryKey: ["/api/screenings"],
  });
  const { data: patients = [] } = useQuery<Patient[]>({
    queryKey: ["/api/patients"],
  });

  const getPatientName = (id: string) => {
    const p = patients.find((p) => p.id === id);
    return p ? `${p.firstName} ${p.lastName}` : `Patient #${id.slice(0, 8)}`;
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-20" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" data-testid="text-screenings-title">
            Screenings
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            COPD risk assessment questionnaires
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-new-screening">
              <Plus className="w-4 h-4 mr-2" />
              New Screening
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>COPD Risk Screening</DialogTitle>
            </DialogHeader>
            <ScreeningForm onSuccess={() => setOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {screenings.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 gap-3">
            <ClipboardCheck className="w-10 h-10 text-muted-foreground" />
            <p className="text-muted-foreground text-sm">No screenings recorded yet</p>
            <Button variant="outline" onClick={() => setOpen(true)}>
              Start First Screening
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {screenings.map((s) => {
            const scoreColor =
              (s.totalScore ?? 0) <= 2
                ? "text-emerald-600 dark:text-emerald-400"
                : (s.totalScore ?? 0) <= 4
                ? "text-amber-600 dark:text-amber-400"
                : (s.totalScore ?? 0) <= 6
                ? "text-orange-600 dark:text-orange-400"
                : "text-red-600 dark:text-red-400";

            return (
              <Card key={s.id} data-testid={`card-screening-${s.id}`}>
                <CardContent className="flex items-center justify-between gap-4 flex-wrap p-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-md bg-muted">
                      <Stethoscope className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{getPatientName(s.patientId)}</p>
                      <p className="text-xs text-muted-foreground">
                        {s.screenedBy && `By ${s.screenedBy} | `}
                        {s.createdAt ? new Date(s.createdAt).toLocaleDateString() : "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className={`text-lg font-bold ${scoreColor}`}>
                      {s.totalScore ?? 0}/8
                    </span>
                    <Badge
                      variant={
                        s.status === "completed"
                          ? "default"
                          : s.status === "in_progress"
                          ? "secondary"
                          : "outline"
                      }
                    >
                      {s.status === "in_progress" ? "In Progress" : s.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
