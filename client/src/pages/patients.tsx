import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Plus,
  Search,
  UserPlus,
  MapPin,
  CreditCard,
  Navigation,
  GraduationCap,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Patient } from "@shared/schema";

const patientFormSchema = z.object({
  abhaId: z.string().optional().or(z.literal("")),
  localPatientId: z.string().optional().or(z.literal("")),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  age: z.coerce.number().optional(),
  gender: z.enum(["male", "female", "other"]),
  phone: z.string().min(1, "Phone is required"),
  email: z.string().email().optional().or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
  district: z.string().optional().or(z.literal("")),
  state: z.string().optional().or(z.literal("")),
  pincode: z.string().optional().or(z.literal("")),
  smokingHistory: z.boolean().default(false),
  smokingYears: z.coerce.number().optional(),
  occupationalExposure: z.boolean().default(false),
  isTargetPopulation: z.boolean().default(false),
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),
  serviceType: z.enum(["community", "facility"]).default("facility"),
  facilityName: z.string().optional().or(z.literal("")),
  assignedAsha: z.string().optional().or(z.literal("")),
  householdId: z.string().optional().or(z.literal("")),
  enrolledForEducation: z.boolean().default(false),
  enrolledForScreening: z.boolean().default(false),
  censusListSource: z.string().optional().or(z.literal("")),
});

function riskBadge(risk: string | null) {
  const map: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; label: string }> = {
    low: { variant: "secondary", label: "Low" },
    moderate: { variant: "outline", label: "Moderate" },
    high: { variant: "destructive", label: "High" },
    very_high: { variant: "destructive", label: "Very High" },
  };
  const config = map[risk ?? "low"] ?? map.low;
  return <Badge variant={config.variant}>{config.label}</Badge>;
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide pt-2 pb-1 border-b mb-3">
      {children}
    </h4>
  );
}

function PatientForm({ onSuccess }: { onSuccess: () => void }) {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof patientFormSchema>>({
    resolver: zodResolver(patientFormSchema),
    defaultValues: {
      abhaId: "",
      localPatientId: "",
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      age: undefined,
      gender: "male",
      phone: "",
      email: "",
      address: "",
      district: "",
      state: "",
      pincode: "",
      smokingHistory: false,
      smokingYears: 0,
      occupationalExposure: false,
      isTargetPopulation: false,
      latitude: undefined,
      longitude: undefined,
      serviceType: "facility",
      facilityName: "",
      assignedAsha: "",
      householdId: "",
      enrolledForEducation: false,
      enrolledForScreening: false,
      censusListSource: "",
    },
  });

  const dob = form.watch("dateOfBirth");
  const computedAge = dob
    ? Math.floor((Date.now() - new Date(dob).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
    : null;
  const isOver30 = computedAge !== null && computedAge >= 30;

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast({ title: "Geolocation not supported", variant: "destructive" });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        form.setValue("latitude", parseFloat(pos.coords.latitude.toFixed(6)));
        form.setValue("longitude", parseFloat(pos.coords.longitude.toFixed(6)));
        toast({ title: "Location captured" });
      },
      () => {
        toast({ title: "Could not get location", variant: "destructive" });
      }
    );
  };

  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof patientFormSchema>) => {
      const payload = {
        ...data,
        age: computedAge ?? data.age,
        isTargetPopulation: isOver30,
      };
      const res = await apiRequest("POST", "/api/patients", payload);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/patients"] });
      toast({ title: "Patient registered successfully" });
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

        <SectionHeading>Identity & ABHA Linkage</SectionHeading>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="abhaId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ABHA ID</FormLabel>
                <FormControl>
                  <Input placeholder="XX-XXXX-XXXX-XXXX" {...field} data-testid="input-abha-id" />
                </FormControl>
                <FormDescription>Ayushman Bharat Health Account</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="localPatientId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Local Patient ID</FormLabel>
                <FormControl>
                  <Input placeholder="PHC-XXX-2026-001" {...field} data-testid="input-local-id" />
                </FormControl>
                <FormDescription>NDHM & NCD Portal compliant</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <SectionHeading>Demographics</SectionHeading>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter first name" {...field} data-testid="input-first-name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter last name" {...field} data-testid="input-last-name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="dateOfBirth"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date of Birth</FormLabel>
                <FormControl>
                  <Input type="date" {...field} data-testid="input-dob" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sex</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger data-testid="select-gender">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-col justify-end">
            <div className="rounded-md border p-3 text-center">
              <p className="text-xs text-muted-foreground">Computed Age</p>
              <p className="text-lg font-bold" data-testid="text-computed-age">
                {computedAge !== null ? `${computedAge} yrs` : "--"}
              </p>
              {isOver30 && (
                <Badge variant="default" className="mt-1">NP-NCD Target</Badge>
              )}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input placeholder="+91 98765 43210" {...field} data-testid="input-phone" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="patient@email.com" {...field} data-testid="input-email" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <SectionHeading>Address</SectionHeading>
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Street / Locality</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter address" {...field} data-testid="input-address" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="district"
            render={({ field }) => (
              <FormItem>
                <FormLabel>District</FormLabel>
                <FormControl>
                  <Input placeholder="District" {...field} data-testid="input-district" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State</FormLabel>
                <FormControl>
                  <Input placeholder="State" {...field} data-testid="input-state" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="pincode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>PIN Code</FormLabel>
                <FormControl>
                  <Input placeholder="110001" {...field} data-testid="input-pincode" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <SectionHeading>GPS / GIS Location</SectionHeading>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="serviceType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Service Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger data-testid="select-service-type">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="community">Community-based (GPS)</SelectItem>
                    <SelectItem value="facility">Facility-based (GIS)</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  GPS for community activities, GIS for facility services
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="facilityName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Facility Name</FormLabel>
                <FormControl>
                  <Input placeholder="PHC / CHC / UHC name" {...field} data-testid="input-facility" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-5 gap-4 items-end">
          <div className="col-span-2">
            <FormField
              control={form.control}
              name="latitude"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Latitude</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="any"
                      placeholder="28.6139"
                      {...field}
                      value={field.value ?? ""}
                      data-testid="input-latitude"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="col-span-2">
            <FormField
              control={form.control}
              name="longitude"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Longitude</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="any"
                      placeholder="77.2090"
                      {...field}
                      value={field.value ?? ""}
                      data-testid="input-longitude"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={handleGetLocation}
            data-testid="button-get-location"
          >
            <Navigation className="w-4 h-4 mr-1" />
            Capture
          </Button>
        </div>

        <SectionHeading>Household & ASHA Mapping</SectionHeading>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="assignedAsha"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Assigned ASHA Worker</FormLabel>
                <FormControl>
                  <Input placeholder="ASHA worker name" {...field} data-testid="input-asha" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="householdId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Household ID</FormLabel>
                <FormControl>
                  <Input placeholder="HH-XXX-001" {...field} data-testid="input-household" />
                </FormControl>
                <FormDescription>Household-to-ASHA / facility mapping</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <SectionHeading>Census & Enrollment</SectionHeading>
        <FormField
          control={form.control}
          name="censusListSource"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Census List Source</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Census 2024 - Ward 15" {...field} data-testid="input-census" />
              </FormControl>
              <FormDescription>Reference from uploaded census-based eligible population list</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="enrolledForEducation"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between gap-2 rounded-md border p-3">
                <div>
                  <FormLabel className="text-sm">Respiratory Health Education</FormLabel>
                  <FormDescription className="text-xs">Enroll for health awareness</FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    data-testid="switch-education"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="enrolledForScreening"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between gap-2 rounded-md border p-3">
                <div>
                  <FormLabel className="text-sm">COPD Screening</FormLabel>
                  <FormDescription className="text-xs">Enroll for screening programme</FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    data-testid="switch-screening"
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <SectionHeading>Risk Factors</SectionHeading>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="smokingHistory"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between gap-2 rounded-md border p-3">
                <FormLabel className="text-sm">Smoking History</FormLabel>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    data-testid="switch-smoking"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="occupationalExposure"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between gap-2 rounded-md border p-3">
                <FormLabel className="text-sm">Occupational Exposure</FormLabel>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    data-testid="switch-exposure"
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        {form.watch("smokingHistory") && (
          <FormField
            control={form.control}
            name="smokingYears"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Smoking Years</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="0" {...field} data-testid="input-smoking-years" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <Button type="submit" className="w-full" disabled={mutation.isPending} data-testid="button-submit-patient">
          {mutation.isPending ? "Registering..." : "Register Patient"}
        </Button>
      </form>
    </Form>
  );
}

export default function PatientsPage() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const { data: patients = [], isLoading } = useQuery<Patient[]>({
    queryKey: ["/api/patients"],
  });

  const filtered = patients.filter(
    (p) =>
      p.firstName.toLowerCase().includes(search.toLowerCase()) ||
      p.lastName.toLowerCase().includes(search.toLowerCase()) ||
      p.phone.includes(search) ||
      (p.abhaId && p.abhaId.includes(search)) ||
      (p.localPatientId && p.localPatientId.toLowerCase().includes(search.toLowerCase()))
  );

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
          <h1 className="text-2xl font-bold tracking-tight" data-testid="text-patients-title">
            Patient Registration
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            NP-NCD compliant patient registration and management
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-patient">
              <Plus className="w-4 h-4 mr-2" />
              Register Patient
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Register New Patient</DialogTitle>
            </DialogHeader>
            <PatientForm onSuccess={() => setOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, phone, ABHA ID, or local ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
          data-testid="input-search-patients"
        />
      </div>

      {filtered.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 gap-3">
            <UserPlus className="w-10 h-10 text-muted-foreground" />
            <p className="text-muted-foreground text-sm">
              {search ? "No patients match your search" : "No patients registered yet"}
            </p>
            {!search && (
              <Button variant="outline" onClick={() => setOpen(true)} data-testid="button-empty-add">
                Register First Patient
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {filtered.map((patient) => (
            <Card key={patient.id} className="hover-elevate" data-testid={`card-patient-${patient.id}`}>
              <CardContent className="p-4 space-y-2">
                <div className="flex items-start justify-between gap-4 flex-wrap">
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
                        {patient.gender} | DOB: {patient.dateOfBirth} | {patient.phone}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {patient.isTargetPopulation && (
                      <Badge variant="outline">NP-NCD Target</Badge>
                    )}
                    {patient.smokingHistory && (
                      <Badge variant="outline">Smoker</Badge>
                    )}
                    {patient.occupationalExposure && (
                      <Badge variant="outline">Occ. Exposure</Badge>
                    )}
                    {riskBadge(patient.riskLevel)}
                  </div>
                </div>
                <div className="flex items-center gap-4 flex-wrap text-xs text-muted-foreground">
                  {patient.abhaId && (
                    <span className="flex items-center gap-1">
                      <CreditCard className="w-3 h-3" />
                      ABHA: {patient.abhaId}
                    </span>
                  )}
                  {patient.localPatientId && (
                    <span className="flex items-center gap-1">
                      <CreditCard className="w-3 h-3" />
                      ID: {patient.localPatientId}
                    </span>
                  )}
                  {patient.district && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {patient.district}{patient.state ? `, ${patient.state}` : ""}
                    </span>
                  )}
                  {patient.assignedAsha && (
                    <span className="flex items-center gap-1">
                      <GraduationCap className="w-3 h-3" />
                      ASHA: {patient.assignedAsha}
                    </span>
                  )}
                  {patient.serviceType && (
                    <Badge variant="secondary" className="text-[10px]">
                      {patient.serviceType === "community" ? "Community" : "Facility"}
                    </Badge>
                  )}
                  {patient.enrolledForScreening && (
                    <Badge variant="secondary" className="text-[10px]">Screening Enrolled</Badge>
                  )}
                  {patient.enrolledForEducation && (
                    <Badge variant="secondary" className="text-[10px]">Education Enrolled</Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
