import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Activity, Wind } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import type { Patient, LungFunctionTest } from "@shared/schema";

const lungTestFormSchema = z.object({
  patientId: z.string().min(1, "Select a patient"),
  fev1: z.coerce.number().min(0, "Must be positive"),
  fvc: z.coerce.number().min(0, "Must be positive"),
  fev1FvcRatio: z.coerce.number().min(0).max(100).optional(),
  pef: z.coerce.number().min(0).optional(),
  fev1Predicted: z.coerce.number().min(0).max(200).optional(),
  interpretation: z.string().optional(),
  goldStage: z.string().optional(),
  performedBy: z.string().optional(),
});

function getGoldStage(fev1Predicted: number | undefined, ratio: number | undefined): string {
  if (!ratio || ratio >= 70) return "Normal";
  if (!fev1Predicted) return "COPD (stage unknown)";
  if (fev1Predicted >= 80) return "GOLD 1 - Mild";
  if (fev1Predicted >= 50) return "GOLD 2 - Moderate";
  if (fev1Predicted >= 30) return "GOLD 3 - Severe";
  return "GOLD 4 - Very Severe";
}

function LungTestForm({ onSuccess }: { onSuccess: () => void }) {
  const { toast } = useToast();
  const { data: patients = [] } = useQuery<Patient[]>({ queryKey: ["/api/patients"] });

  const form = useForm<z.infer<typeof lungTestFormSchema>>({
    resolver: zodResolver(lungTestFormSchema),
    defaultValues: {
      patientId: "",
      fev1: 0,
      fvc: 0,
      fev1FvcRatio: undefined,
      pef: undefined,
      fev1Predicted: undefined,
      interpretation: "",
      goldStage: "",
      performedBy: "",
    },
  });

  const fev1 = form.watch("fev1");
  const fvc = form.watch("fvc");
  const fev1Predicted = form.watch("fev1Predicted");

  const computedRatio = fvc > 0 ? Math.round((fev1 / fvc) * 100) : 0;
  const autoGold = getGoldStage(fev1Predicted, computedRatio);

  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof lungTestFormSchema>) => {
      const payload = {
        ...data,
        fev1FvcRatio: computedRatio,
        goldStage: autoGold,
      };
      const res = await apiRequest("POST", "/api/lung-function-tests", payload);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/lung-function-tests"] });
      queryClient.invalidateQueries({ queryKey: ["/api/patients"] });
      toast({ title: "Lung function test recorded" });
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
                  <SelectTrigger data-testid="select-lung-patient">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="fev1"
            render={({ field }) => (
              <FormItem>
                <FormLabel>FEV1 (mL)</FormLabel>
                <FormControl>
                  <Input type="number" min={0} {...field} data-testid="input-fev1" />
                </FormControl>
                <FormDescription>Forced expiratory volume in 1 second</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="fvc"
            render={({ field }) => (
              <FormItem>
                <FormLabel>FVC (mL)</FormLabel>
                <FormControl>
                  <Input type="number" min={0} {...field} data-testid="input-fvc" />
                </FormControl>
                <FormDescription>Forced vital capacity</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Card>
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span className="text-sm font-medium">FEV1/FVC Ratio</span>
              <span
                className={`text-lg font-bold ${
                  computedRatio < 70
                    ? "text-red-600 dark:text-red-400"
                    : "text-emerald-600 dark:text-emerald-400"
                }`}
                data-testid="text-ratio"
              >
                {computedRatio}%
              </span>
            </div>
            <div className="h-2 rounded-md bg-muted overflow-hidden">
              <div
                className={`h-full rounded-md transition-all ${
                  computedRatio < 70 ? "bg-red-500 dark:bg-red-400" : "bg-emerald-500 dark:bg-emerald-400"
                }`}
                style={{ width: `${Math.min(computedRatio, 100)}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {computedRatio < 70
                ? "Below 70% threshold - suggests obstructive airway disease"
                : "Within normal range (>= 70%)"}
            </p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="pef"
            render={({ field }) => (
              <FormItem>
                <FormLabel>PEF (L/min)</FormLabel>
                <FormControl>
                  <Input type="number" min={0} {...field} data-testid="input-pef" />
                </FormControl>
                <FormDescription>Peak expiratory flow</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="fev1Predicted"
            render={({ field }) => (
              <FormItem>
                <FormLabel>FEV1 % Predicted</FormLabel>
                <FormControl>
                  <Input type="number" min={0} max={200} {...field} data-testid="input-fev1-predicted" />
                </FormControl>
                <FormDescription>Percentage of predicted normal</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Card>
          <CardContent className="flex items-center justify-between gap-4 p-4">
            <div>
              <p className="text-sm font-medium">GOLD Classification</p>
              <p className="text-xs text-muted-foreground">Auto-calculated from spirometry</p>
            </div>
            <Badge
              variant={autoGold === "Normal" ? "secondary" : "destructive"}
              data-testid="text-gold-stage"
            >
              {autoGold}
            </Badge>
          </CardContent>
        </Card>

        <FormField
          control={form.control}
          name="performedBy"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Performed By</FormLabel>
              <FormControl>
                <Input placeholder="Technician name" {...field} data-testid="input-performed-by" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="interpretation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Interpretation (Optional)</FormLabel>
              <FormControl>
                <Textarea placeholder="Clinical interpretation..." {...field} data-testid="input-interpretation" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={mutation.isPending} data-testid="button-submit-lung-test">
          {mutation.isPending ? "Recording..." : "Record Test Results"}
        </Button>
      </form>
    </Form>
  );
}

export default function LungFunctionPage() {
  const [open, setOpen] = useState(false);
  const { data: tests = [], isLoading } = useQuery<LungFunctionTest[]>({
    queryKey: ["/api/lung-function-tests"],
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
          <h1 className="text-2xl font-bold tracking-tight" data-testid="text-lung-title">
            Lung Function Tests
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Spirometry results and GOLD classification
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-new-lung-test">
              <Plus className="w-4 h-4 mr-2" />
              Record Test
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Record Spirometry Results</DialogTitle>
            </DialogHeader>
            <LungTestForm onSuccess={() => setOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {tests.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 gap-3">
            <Wind className="w-10 h-10 text-muted-foreground" />
            <p className="text-muted-foreground text-sm">No lung function tests recorded</p>
            <Button variant="outline" onClick={() => setOpen(true)}>
              Record First Test
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {tests.map((t) => (
            <Card key={t.id} data-testid={`card-lung-test-${t.id}`}>
              <CardContent className="flex items-center justify-between gap-4 flex-wrap p-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-md bg-muted">
                    <Activity className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{getPatientName(t.patientId)}</p>
                    <p className="text-xs text-muted-foreground">
                      FEV1: {t.fev1}mL | FVC: {t.fvc}mL | Ratio: {t.fev1FvcRatio}%
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  {t.fev1Predicted && (
                    <span className="text-xs text-muted-foreground">
                      {t.fev1Predicted}% predicted
                    </span>
                  )}
                  <Badge
                    variant={t.goldStage === "Normal" ? "secondary" : "destructive"}
                  >
                    {t.goldStage || "Pending"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
