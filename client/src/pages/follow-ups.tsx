import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, CalendarClock, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import type { Patient, FollowUp } from "@shared/schema";

const followUpFormSchema = z.object({
  patientId: z.string().min(1, "Select a patient"),
  scheduledDate: z.string().min(1, "Date is required"),
  type: z.string().min(1, "Type is required"),
  notes: z.string().optional(),
});

function FollowUpForm({ onSuccess }: { onSuccess: () => void }) {
  const { toast } = useToast();
  const { data: patients = [] } = useQuery<Patient[]>({ queryKey: ["/api/patients"] });

  const form = useForm<z.infer<typeof followUpFormSchema>>({
    resolver: zodResolver(followUpFormSchema),
    defaultValues: {
      patientId: "",
      scheduledDate: "",
      type: "",
      notes: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof followUpFormSchema>) => {
      const res = await apiRequest("POST", "/api/follow-ups", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/follow-ups"] });
      toast({ title: "Follow-up scheduled successfully" });
      form.reset();
      onSuccess();
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((d) => mutation.mutate(d))} className="space-y-4">
        <FormField
          control={form.control}
          name="patientId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Patient</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger data-testid="select-followup-patient">
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
          name="scheduledDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Scheduled Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} data-testid="input-followup-date" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Follow-up Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger data-testid="select-followup-type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="screening_review">Screening Review</SelectItem>
                  <SelectItem value="spirometry_retest">Spirometry Re-test</SelectItem>
                  <SelectItem value="medication_review">Medication Review</SelectItem>
                  <SelectItem value="specialist_follow_up">Specialist Follow-up</SelectItem>
                  <SelectItem value="general_checkup">General Check-up</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes (Optional)</FormLabel>
              <FormControl>
                <Textarea placeholder="Additional notes..." {...field} data-testid="input-followup-notes" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={mutation.isPending} data-testid="button-submit-followup">
          {mutation.isPending ? "Scheduling..." : "Schedule Follow-up"}
        </Button>
      </form>
    </Form>
  );
}

function statusBadge(status: string | null) {
  const map: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; label: string }> = {
    scheduled: { variant: "outline", label: "Scheduled" },
    completed: { variant: "default", label: "Completed" },
    missed: { variant: "destructive", label: "Missed" },
    cancelled: { variant: "secondary", label: "Cancelled" },
  };
  const config = map[status ?? "scheduled"] ?? map.scheduled;
  return <Badge variant={config.variant}>{config.label}</Badge>;
}

function typeLabel(type: string) {
  const map: Record<string, string> = {
    screening_review: "Screening Review",
    spirometry_retest: "Spirometry Re-test",
    medication_review: "Medication Review",
    specialist_follow_up: "Specialist Follow-up",
    general_checkup: "General Check-up",
  };
  return map[type] || type;
}

export default function FollowUpsPage() {
  const [open, setOpen] = useState(false);
  const { data: followUps = [], isLoading } = useQuery<FollowUp[]>({
    queryKey: ["/api/follow-ups"],
  });
  const { data: patients = [] } = useQuery<Patient[]>({
    queryKey: ["/api/patients"],
  });

  const { toast } = useToast();

  const updateMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const res = await apiRequest("PATCH", `/api/follow-ups/${id}`, { status });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/follow-ups"] });
      toast({ title: "Follow-up updated" });
    },
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
          <h1 className="text-2xl font-bold tracking-tight" data-testid="text-followups-title">
            Follow-ups
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track patient follow-up appointments
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-new-followup">
              <Plus className="w-4 h-4 mr-2" />
              Schedule Follow-up
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Schedule Follow-up</DialogTitle>
            </DialogHeader>
            <FollowUpForm onSuccess={() => setOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {followUps.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 gap-3">
            <CalendarClock className="w-10 h-10 text-muted-foreground" />
            <p className="text-muted-foreground text-sm">No follow-ups scheduled</p>
            <Button variant="outline" onClick={() => setOpen(true)}>
              Schedule First Follow-up
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {followUps.map((f) => (
            <Card key={f.id} data-testid={`card-followup-${f.id}`}>
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-md bg-muted">
                      <CalendarClock className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{getPatientName(f.patientId)}</p>
                      <p className="text-xs text-muted-foreground">
                        {typeLabel(f.type)} | {f.scheduledDate}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {statusBadge(f.status)}
                  </div>
                </div>
                {f.notes && (
                  <p className="text-sm text-muted-foreground pl-14">{f.notes}</p>
                )}
                {f.status === "scheduled" && (
                  <div className="flex items-center gap-2 pl-14 flex-wrap">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateMutation.mutate({ id: f.id, status: "completed" })}
                      data-testid={`button-complete-followup-${f.id}`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                      Mark Complete
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateMutation.mutate({ id: f.id, status: "missed" })}
                      data-testid={`button-missed-followup-${f.id}`}
                    >
                      Mark Missed
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
