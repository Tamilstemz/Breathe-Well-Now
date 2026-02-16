import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  Users,
  ClipboardCheck,
  Activity,
  Send,
  AlertTriangle,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

/* ✅ Local types */
type Patient = {
  id: string;
  riskLevel?: "low" | "moderate" | "high" | "very_high";
};

type Screening = {
  id: string;
  patientId: string;
  totalScore?: number;
  status: "completed" | "in_progress" | "pending";
};

type Referral = {
  id: string;
  status: "pending" | "completed";
};

export default function Dashboard() {
  const navigate = useNavigate();

  const { data: patients = [], isLoading: pLoading } =
    useQuery<Patient[]>({ queryKey: ["/api/patients"] });

  const { data: screenings = [], isLoading: sLoading } =
    useQuery<Screening[]>({ queryKey: ["/api/screenings"] });

  const { data: referrals = [], isLoading: rLoading } =
    useQuery<Referral[]>({ queryKey: ["/api/referrals"] });

  const isLoading = pLoading || sLoading || rLoading;

  const completedScreenings = screenings.filter(
    (s) => s.status === "completed"
  ).length;

  const pendingReferrals = referrals.filter(
    (r) => r.status === "pending"
  ).length;

  const highRisk = patients.filter(
    (p) => p.riskLevel === "high" || p.riskLevel === "very_high"
  ).length;

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-4 w-72" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">
            Quick Actions
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-2">
          <div
            onClick={() => navigate("/patients")}
            className="p-3 rounded-md bg-muted cursor-pointer"
          >
            Register New Patient
          </div>

          <div
            onClick={() => navigate("/screenings")}
            className="p-3 rounded-md bg-muted cursor-pointer"
          >
            Start Screening
          </div>

          <div
            onClick={() => navigate("/lung-function")}
            className="p-3 rounded-md bg-muted cursor-pointer"
          >
            Record Spirometry
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
