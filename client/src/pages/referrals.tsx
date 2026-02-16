import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Send, ArrowUpRight } from "lucide-react";
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
import type { Patient, Referral } from "@shared/schema";

const referralFormSchema = z.object({
  patientId: z.string().min(1, "Select a patient"),
  referredTo: z.string().min(1, "Specialist name is required"),
  reason: z.string().min(1, "Reason is required"),
  urgency: z.string().default("routine"),
  notes: z.string().optional(),
  referredBy: z.string().optional(),
});

function ReferralForm({ onSuccess }: { onSuccess: () => void }) {
  const { toast } = useToast();
  const { data: patients = [] } = useQuery<Patient[]>({ queryKey: ["/api/patients"] });

  const form = useForm<z.infer<typeof referralFormSchema>>({
    resolver: zodResolver(referralFormSchema),
    defaultValues: {
      patientId: "",
      referredTo: "",
      reason: "",
      urgency: "routine",
      notes: "",
      referredBy: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof referralFormSchema>) => {
      const res = await apiRequest("POST", "/api/referrals", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/referrals"] });
      toast({ title: "Referral created successfully" });
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
                  <SelectTrigger data-testid="select-referral-patient">
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
          name="referredTo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Refer To (Specialist)</FormLabel>
              <FormControl>
                <Input placeholder="Dr. Smith - Pulmonology" {...field} data-testid="input-referred-to" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="reason"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reason for Referral</FormLabel>
              <FormControl>
                <Textarea placeholder="Clinical reason for referral..." {...field} data-testid="input-referral-reason" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="urgency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Urgency</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger data-testid="select-urgency">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="routine">Routine</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                    <SelectItem value="emergency">Emergency</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="referredBy"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Referred By</FormLabel>
                <FormControl>
                  <Input placeholder="Your name" {...field} data-testid="input-referred-by" />
                </FormControl>
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
              <FormLabel>Additional Notes (Optional)</FormLabel>
              <FormControl>
                <Textarea placeholder="Any additional information..." {...field} data-testid="input-referral-notes" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={mutation.isPending} data-testid="button-submit-referral">
          {mutation.isPending ? "Creating..." : "Create Referral"}
        </Button>
      </form>
    </Form>
  );
}

function statusBadge(status: string | null) {
  const map: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; label: string }> = {
    pending: { variant: "outline", label: "Pending" },
    accepted: { variant: "secondary", label: "Accepted" },
    completed: { variant: "default", label: "Completed" },
    cancelled: { variant: "destructive", label: "Cancelled" },
  };
  const config = map[status ?? "pending"] ?? map.pending;
  return <Badge variant={config.variant}>{config.label}</Badge>;
}

function urgencyBadge(urgency: string | null) {
  if (urgency === "emergency") return <Badge variant="destructive">Emergency</Badge>;
  if (urgency === "urgent") return <Badge variant="outline">Urgent</Badge>;
  return null;
}

export default function ReferralsPage() {
  const [open, setOpen] = useState(false);
  const { data: referrals = [], isLoading } = useQuery<Referral[]>({
    queryKey: ["/api/referrals"],
  });
  const { data: patients = [] } = useQuery<Patient[]>({
    queryKey: ["/api/patients"],
  });

  const { toast } = useToast();

  const updateMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const res = await apiRequest("PATCH", `/api/referrals/${id}`, { status });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/referrals"] });
      toast({ title: "Referral updated" });
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
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" data-testid="text-referrals-title">
            Referrals
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Specialist referral management
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-new-referral">
              <Plus className="w-4 h-4 mr-2" />
              New Referral
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Referral</DialogTitle>
            </DialogHeader>
            <ReferralForm onSuccess={() => setOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {referrals.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 gap-3">
            <Send className="w-10 h-10 text-muted-foreground" />
            <p className="text-muted-foreground text-sm">No referrals created yet</p>
            <Button variant="outline" onClick={() => setOpen(true)}>
              Create First Referral
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {referrals.map((r) => (
            <Card key={r.id} data-testid={`card-referral-${r.id}`}>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-md bg-muted">
                      <ArrowUpRight className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{getPatientName(r.patientId)}</p>
                      <p className="text-xs text-muted-foreground">
                        To: {r.referredTo}
                        {r.referredBy && ` | By: ${r.referredBy}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {urgencyBadge(r.urgency)}
                    {statusBadge(r.status)}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{r.reason}</p>
                {r.status === "pending" && (
                  <div className="flex items-center gap-2 pt-1 flex-wrap">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateMutation.mutate({ id: r.id, status: "accepted" })}
                      data-testid={`button-accept-${r.id}`}
                    >
                      Accept
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateMutation.mutate({ id: r.id, status: "completed" })}
                      data-testid={`button-complete-${r.id}`}
                    >
                      Complete
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
