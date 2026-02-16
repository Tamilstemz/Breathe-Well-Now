import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ClipboardCheck,
  AlertTriangle,
  Calendar,
  Stethoscope,
  FileText,
  Send,
  Activity,
  ShieldCheck,
  Pill,
  CalendarClock,
  ChevronRight,
  Check,
  Clock,
  Circle,
  SkipForward,
  Plus,
  Search,
  ArrowLeft,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
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
import type { Patient, Assessment } from "@shared/schema";

const STEPS = [
  { key: "cbacCompleted", label: "CBAC Completed", num: 1, icon: ClipboardCheck },
  { key: "crdRiskIdentified", label: "CRD Risk Identified", num: 2, icon: AlertTriangle },
  { key: "spirometryScheduled", label: "Spirometry Scheduled", num: 3, icon: Calendar },
  { key: "preBdSpirometry", label: "Pre-BD Spirometry", num: 4, icon: Stethoscope },
  { key: "screeningResult", label: "Screening Result", num: 5, icon: FileText },
  { key: "referralConfirmatory", label: "Referral for Confirmatory", num: 6, icon: Send },
  { key: "postBdSpirometry", label: "Post-BD Spirometry", num: 7, icon: Activity },
  { key: "diagnosisConfirmed", label: "Diagnosis Confirmed", num: 8, icon: ShieldCheck },
  { key: "treatmentInitiated", label: "Treatment Initiated", num: 9, icon: Pill },
  { key: "followUpScheduled", label: "Follow-up Scheduled", num: 10, icon: CalendarClock },
] as const;

type StepKey = (typeof STEPS)[number]["key"];

function stepStatus(assessment: Assessment, key: StepKey): string {
  return (assessment[key] as string) ?? "pending";
}

function StepIndicator({ status, num }: { status: string; num: number }) {
  if (status === "completed") {
    return (
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-600 text-white shrink-0">
        <Check className="w-4 h-4" />
      </div>
    );
  }
  if (status === "in_progress") {
    return (
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white shrink-0 animate-pulse">
        <Clock className="w-4 h-4" />
      </div>
    );
  }
  if (status === "skipped") {
    return (
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-muted-foreground shrink-0">
        <SkipForward className="w-4 h-4" />
      </div>
    );
  }
  return (
    <div className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-muted text-muted-foreground shrink-0">
      <span className="text-xs font-semibold">{num}</span>
    </div>
  );
}

function statusBadge(status: string) {
  const map: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; label: string }> = {
    pending: { variant: "outline", label: "Pending" },
    in_progress: { variant: "secondary", label: "In Progress" },
    completed: { variant: "default", label: "Completed" },
    skipped: { variant: "outline", label: "Skipped" },
  };
  const c = map[status] ?? map.pending;
  return <Badge variant={c.variant}>{c.label}</Badge>;
}

function completedCount(assessment: Assessment): number {
  return STEPS.filter((s) => stepStatus(assessment, s.key) === "completed").length;
}

function getStepFields(step: StepKey) {
  switch (step) {
    case "cbacCompleted":
      return { dateField: "cbacDate", byField: "cbacBy", notesField: "cbacNotes", extra: ["cbacScore"] };
    case "crdRiskIdentified":
      return { dateField: "crdRiskDate", byField: "crdRiskBy", notesField: "crdRiskNotes", extra: ["crdRiskLevel"] };
    case "spirometryScheduled":
      return { dateField: "spirometryScheduledDate", byField: "spirometryScheduledBy", notesField: "spirometryScheduledNotes", extra: ["spirometryFacility"] };
    case "preBdSpirometry":
      return { dateField: "preBdDate", byField: "preBdBy", notesField: "preBdNotes", extra: ["preBdFev1", "preBdFvc", "preBdRatio"] };
    case "screeningResult":
      return { dateField: "screeningResultDate", byField: "screeningResultBy", notesField: "screeningResultNotes", extra: ["screeningOutcome"] };
    case "referralConfirmatory":
      return { dateField: "referralDate", byField: "referralBy", notesField: "assessmentReferralNotes", extra: ["assessmentReferredTo", "referralUrgency"] };
    case "postBdSpirometry":
      return { dateField: "postBdDate", byField: "postBdBy", notesField: "postBdNotes", extra: ["postBdFev1", "postBdFvc", "postBdRatio", "postBdReversibility"] };
    case "diagnosisConfirmed":
      return { dateField: "diagnosisDate", byField: "diagnosisBy", notesField: "diagnosisNotes", extra: ["diagnosisResult", "assessmentGoldStage"] };
    case "treatmentInitiated":
      return { dateField: "treatmentDate", byField: "treatmentBy", notesField: "treatmentNotes", extra: ["treatmentPlan", "medications"] };
    case "followUpScheduled":
      return { dateField: "followUpDate", byField: "followUpBy", notesField: "followUpNotes", extra: ["followUpType", "followUpFacility"] };
  }
}

const EXTRA_LABELS: Record<string, string> = {
  cbacScore: "CBAC Score (0-8)",
  crdRiskLevel: "CRD Risk Level",
  spirometryFacility: "Facility",
  preBdFev1: "FEV1 (mL)",
  preBdFvc: "FVC (mL)",
  preBdRatio: "FEV1/FVC %",
  screeningOutcome: "Outcome",
  assessmentReferredTo: "Referred To",
  referralUrgency: "Urgency",
  postBdFev1: "FEV1 (mL)",
  postBdFvc: "FVC (mL)",
  postBdRatio: "FEV1/FVC %",
  postBdReversibility: "Reversibility",
  diagnosisResult: "Diagnosis",
  assessmentGoldStage: "GOLD Stage",
  treatmentPlan: "Treatment Plan",
  medications: "Medications",
  followUpType: "Follow-up Type",
  followUpFacility: "Facility",
};

const stepFormSchema = z.object({
  date: z.string().min(1, "Date is required"),
  by: z.string().min(1, "Performed by is required"),
  notes: z.string().optional().or(z.literal("")),
});

function StepCompletionForm({
  assessment,
  step,
  onClose,
}: {
  assessment: Assessment;
  step: (typeof STEPS)[number];
  onClose: () => void;
}) {
  const { toast } = useToast();
  const fields = getStepFields(step.key);
  const [extras, setExtras] = useState<Record<string, any>>({});

  const form = useForm({
    resolver: zodResolver(stepFormSchema),
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
      by: "",
      notes: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof stepFormSchema>) => {
      const payload: Record<string, any> = {
        [step.key]: "completed",
        [fields.dateField]: data.date,
        [fields.byField]: data.by,
        [fields.notesField]: data.notes || null,
        currentStep: Math.max((assessment.currentStep ?? 1), step.num + 1),
      };
      for (const ex of fields.extra) {
        if (extras[ex] !== undefined && extras[ex] !== "") {
          payload[ex] = extras[ex];
        }
      }
      const res = await apiRequest("PATCH", `/api/assessments/${assessment.id}`, payload);
      return res.json();
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["/api/assessments"] });
      toast({ title: `${step.label} completed` });
      onClose();
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const isNumeric = (key: string) =>
    ["cbacScore", "preBdFev1", "preBdFvc", "preBdRatio", "postBdFev1", "postBdFvc", "postBdRatio"].includes(key);
  const isBool = (key: string) => key === "postBdReversibility";
  const isSelect = (key: string) =>
    ["crdRiskLevel", "referralUrgency", "assessmentGoldStage", "screeningOutcome", "followUpType"].includes(key);

  const selectOptions: Record<string, { value: string; label: string }[]> = {
    crdRiskLevel: [
      { value: "low", label: "Low" },
      { value: "moderate", label: "Moderate" },
      { value: "high", label: "High" },
      { value: "very_high", label: "Very High" },
    ],
    referralUrgency: [
      { value: "routine", label: "Routine" },
      { value: "urgent", label: "Urgent" },
      { value: "emergency", label: "Emergency" },
    ],
    assessmentGoldStage: [
      { value: "GOLD 1 - Mild", label: "GOLD 1 - Mild" },
      { value: "GOLD 2 - Moderate", label: "GOLD 2 - Moderate" },
      { value: "GOLD 3 - Severe", label: "GOLD 3 - Severe" },
      { value: "GOLD 4 - Very Severe", label: "GOLD 4 - Very Severe" },
      { value: "Not COPD", label: "Not COPD" },
    ],
    screeningOutcome: [
      { value: "positive", label: "Positive (Abnormal)" },
      { value: "negative", label: "Negative (Normal)" },
      { value: "inconclusive", label: "Inconclusive" },
    ],
    followUpType: [
      { value: "spirometry_retest", label: "Spirometry Retest" },
      { value: "medication_review", label: "Medication Review" },
      { value: "specialist_follow_up", label: "Specialist Follow-up" },
      { value: "general_checkup", label: "General Checkup" },
    ],
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((d) => mutation.mutate(d))} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} data-testid="input-step-date" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="by"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Performed By</FormLabel>
                <FormControl>
                  <Input placeholder="Name / designation" {...field} data-testid="input-step-by" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {fields.extra.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {fields.extra.map((exKey) => {
              if (isBool(exKey)) {
                return (
                  <div key={exKey} className="flex items-center justify-between gap-2 rounded-md border p-3">
                    <span className="text-sm font-medium">{EXTRA_LABELS[exKey]}</span>
                    <Switch
                      checked={!!extras[exKey]}
                      onCheckedChange={(v) => setExtras((p) => ({ ...p, [exKey]: v }))}
                      data-testid={`switch-${exKey}`}
                    />
                  </div>
                );
              }
              if (isSelect(exKey) && selectOptions[exKey]) {
                return (
                  <div key={exKey}>
                    <label className="text-sm font-medium mb-1 block">{EXTRA_LABELS[exKey]}</label>
                    <Select
                      onValueChange={(v) => setExtras((p) => ({ ...p, [exKey]: v }))}
                      value={extras[exKey] || ""}
                    >
                      <SelectTrigger data-testid={`select-${exKey}`}>
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                      <SelectContent>
                        {selectOptions[exKey].map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                );
              }
              return (
                <div key={exKey}>
                  <label className="text-sm font-medium mb-1 block">{EXTRA_LABELS[exKey]}</label>
                  <Input
                    type={isNumeric(exKey) ? "number" : "text"}
                    placeholder={EXTRA_LABELS[exKey]}
                    value={extras[exKey] ?? ""}
                    onChange={(e) =>
                      setExtras((p) => ({
                        ...p,
                        [exKey]: isNumeric(exKey) ? (e.target.value ? parseInt(e.target.value) : "") : e.target.value,
                      }))
                    }
                    data-testid={`input-${exKey}`}
                  />
                </div>
              );
            })}
          </div>
        )}

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes (Optional)</FormLabel>
              <FormControl>
                <Textarea placeholder="Additional notes..." {...field} data-testid="input-step-notes" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-2">
          <Button type="submit" className="flex-1" disabled={mutation.isPending} data-testid="button-complete-step">
            {mutation.isPending ? "Saving..." : `Complete ${step.label}`}
          </Button>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}

function AssessmentPipeline({
  assessment,
  patient,
}: {
  assessment: Assessment;
  patient: Patient;
}) {
  const [activeStep, setActiveStep] = useState<(typeof STEPS)[number] | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center justify-center w-10 h-10 rounded-md bg-muted text-sm font-semibold shrink-0">
          {patient.firstName[0]}{patient.lastName[0]}
        </div>
        <div>
          <p className="text-sm font-medium">
            {patient.firstName} {patient.lastName}
            {patient.age && <span className="text-muted-foreground ml-1">({patient.age} yrs)</span>}
          </p>
          <p className="text-xs text-muted-foreground">
            {patient.abhaId && `ABHA: ${patient.abhaId} | `}
            {patient.localPatientId && `ID: ${patient.localPatientId} | `}
            {patient.phone}
          </p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Badge variant="secondary">{completedCount(assessment)}/10 Steps</Badge>
          {completedCount(assessment) === 10 && (
            <Badge variant="default">Assessment Complete</Badge>
          )}
        </div>
      </div>

      <div className="space-y-1">
        {STEPS.map((step, idx) => {
          const status = stepStatus(assessment, step.key);
          const Icon = step.icon;
          const fields = getStepFields(step.key);
          const dateVal = (assessment as any)[fields.dateField];
          const byVal = (assessment as any)[fields.byField];

          return (
            <div key={step.key}>
              <div
                className={`flex items-center gap-3 p-3 rounded-md border cursor-pointer hover-elevate ${
                  status === "completed" ? "border-green-600/20 bg-green-50/50 dark:bg-green-950/20" : ""
                }`}
                onClick={() => status !== "completed" && status !== "skipped" && setActiveStep(step)}
                data-testid={`step-row-${step.key}`}
              >
                <StepIndicator status={status} num={step.num} />
                <Icon className="w-4 h-4 text-muted-foreground shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{step.label}</p>
                  {status === "completed" && dateVal && (
                    <p className="text-xs text-muted-foreground">
                      {dateVal}{byVal ? ` by ${byVal}` : ""}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {statusBadge(status)}
                  {status !== "completed" && status !== "skipped" && (
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
              </div>
              {idx < STEPS.length - 1 && (
                <div className="flex justify-start pl-6">
                  <div
                    className={`w-0.5 h-3 ${
                      status === "completed" ? "bg-green-600" : "bg-muted"
                    }`}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <Dialog open={!!activeStep} onOpenChange={(open) => !open && setActiveStep(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {activeStep && (
                <span className="flex items-center gap-2">
                  {activeStep && <activeStep.icon className="w-5 h-5" />}
                  Step {activeStep.num}: {activeStep.label}
                </span>
              )}
            </DialogTitle>
          </DialogHeader>
          {activeStep && (
            <StepCompletionForm
              assessment={assessment}
              step={activeStep}
              onClose={() => setActiveStep(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function AssessmentsPage() {
  const [search, setSearch] = useState("");
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);

  const { data: patients = [], isLoading: loadingPatients } = useQuery<Patient[]>({
    queryKey: ["/api/patients"],
  });

  const { data: allAssessments = [], isLoading: loadingAssessments } = useQuery<Assessment[]>({
    queryKey: ["/api/assessments"],
  });

  const { toast } = useToast();

  const createMutation = useMutation({
    mutationFn: async (patientId: string) => {
      const res = await apiRequest("POST", "/api/assessments", { patientId });
      return res.json();
    },
    onSuccess: (data: Assessment) => {
      queryClient.invalidateQueries({ queryKey: ["/api/assessments"] });
      setSelectedPatientId(data.patientId);
      toast({ title: "Assessment workflow started" });
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const selectedPatient = patients.find((p) => p.id === selectedPatientId);
  const patientAssessment = allAssessments.find((a) => a.patientId === selectedPatientId);

  const assessmentMap = new Map<string, Assessment>();
  allAssessments.forEach((a) => assessmentMap.set(a.patientId, a));

  const filtered = patients.filter(
    (p) =>
      p.firstName.toLowerCase().includes(search.toLowerCase()) ||
      p.lastName.toLowerCase().includes(search.toLowerCase()) ||
      p.phone.includes(search) ||
      (p.abhaId && p.abhaId.includes(search)) ||
      (p.localPatientId && p.localPatientId.toLowerCase().includes(search.toLowerCase()))
  );

  if (loadingPatients || loadingAssessments) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      </div>
    );
  }

  if (selectedPatientId && selectedPatient) {
    return (
      <div className="p-6 space-y-6 max-w-4xl mx-auto">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSelectedPatientId(null)}
            data-testid="button-back-to-list"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight" data-testid="text-assessment-title">
              Patient Assessment Workflow
            </h1>
            <p className="text-sm text-muted-foreground">
              10-step clinical pathway from CBAC to follow-up
            </p>
          </div>
        </div>

        {patientAssessment ? (
          <Card>
            <CardContent className="p-5">
              <AssessmentPipeline assessment={patientAssessment} patient={selectedPatient} />
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 gap-4">
              <ClipboardCheck className="w-10 h-10 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">No assessment started for this patient</p>
              <Button
                onClick={() => createMutation.mutate(selectedPatient.id)}
                disabled={createMutation.isPending}
                data-testid="button-start-assessment"
              >
                <Plus className="w-4 h-4 mr-2" />
                {createMutation.isPending ? "Starting..." : "Start Assessment Workflow"}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight" data-testid="text-assessments-title">
          Patient Assessments
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Select a patient to view or start their 10-step clinical assessment workflow
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search patients by name, phone, ABHA ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
          data-testid="input-search-assessments"
        />
      </div>

      {filtered.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 gap-3">
            <ClipboardCheck className="w-10 h-10 text-muted-foreground" />
            <p className="text-muted-foreground text-sm">
              {search ? "No patients match your search" : "No patients registered yet. Register patients first."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {filtered.map((patient) => {
            const assessment = assessmentMap.get(patient.id);
            const done = assessment ? completedCount(assessment) : 0;

            return (
              <Card
                key={patient.id}
                className="hover-elevate cursor-pointer"
                onClick={() => setSelectedPatientId(patient.id)}
                data-testid={`card-assessment-patient-${patient.id}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-10 h-10 rounded-md bg-muted text-sm font-semibold shrink-0">
                        {patient.firstName[0]}{patient.lastName[0]}
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          {patient.firstName} {patient.lastName}
                          {patient.age && <span className="text-muted-foreground ml-1">({patient.age} yrs)</span>}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {patient.abhaId && `ABHA: ${patient.abhaId} | `}
                          {patient.localPatientId && `ID: ${patient.localPatientId} | `}
                          {patient.phone}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {assessment ? (
                        <>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <div className="w-20 h-2 rounded-full bg-muted overflow-hidden">
                              <div
                                className="h-full rounded-full bg-green-600 transition-all"
                                style={{ width: `${(done / 10) * 100}%` }}
                              />
                            </div>
                            <span>{done}/10</span>
                          </div>
                          {done === 10 ? (
                            <Badge variant="default">Complete</Badge>
                          ) : (
                            <Badge variant="secondary">In Progress</Badge>
                          )}
                        </>
                      ) : (
                        <Badge variant="outline">Not Started</Badge>
                      )}
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>
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
