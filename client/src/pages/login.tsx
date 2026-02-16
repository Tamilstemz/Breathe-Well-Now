import loginBg from "@/assets/images/login-bg.png";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  HeartPulse,
  LogIn,
  Microscope,
  ShieldCheck,
  Stethoscope,
  UserCog,
  Wind,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ added

const roles = [
  {
    id: "asha",
    label: "ASHA",
    description: "Accredited Social Health Activist",
    icon: HeartPulse,
    color: "bg-emerald-500/15 text-emerald-300",
  },
  {
    id: "anm",
    label: "ANM",
    description: "Auxiliary Nurse Midwife",
    icon: Stethoscope,
    color: "bg-sky-500/15 text-sky-300",
  },
  {
    id: "mo",
    label: "MO",
    description: "Medical Officer",
    icon: UserCog,
    color: "bg-violet-500/15 text-violet-300",
  },
  {
    id: "technician",
    label: "Technician",
    description: "Lab & Spirometry Technician",
    icon: Microscope,
    color: "bg-amber-500/15 text-amber-300",
  },
  {
    id: "pulmonologist",
    label: "Pulmonologist",
    description: "Lung Specialist",
    icon: Wind,
    color: "bg-rose-500/15 text-rose-300",
  },
  {
    id: "dpm",
    label: "DPM",
    description: "District Programme Manager",
    icon: BarChart3,
    color: "bg-teal-500/15 text-teal-300",
  },
  {
    id: "admin",
    label: "Admin",
    description: "System Administrator",
    icon: ShieldCheck,
    color: "bg-slate-400/15 text-slate-300",
  },
];

interface LoginPageProps {
  onLogin: (role: string) => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const navigate = useNavigate(); // ✅ added

  const handleLoginClick = () => {
    if (!selectedRole) return;

    onLogin(selectedRole); // keep your session logic
    navigate("/"); // ✅ redirect after login
  };

  return (
    <div className="relative min-h-screen flex flex-col">
      <img
        src={loginBg}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80" />

      <div className="relative flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-2xl space-y-8">
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="flex items-center justify-center w-14 h-14 rounded-md bg-white/10 backdrop-blur-sm border border-white/20">
              <Stethoscope className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white">
                BreatheSafe
              </h1>
              <p className="text-sm text-white/70 mt-1">
                COPD Screening &amp; Early Diagnosis Platform
              </p>
            </div>
          </div>

          {/* Role grid */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-center text-white/60">
              Select your role to continue
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {roles.map((role) => {
                const Icon = role.icon;
                const isSelected = selectedRole === role.id;

                return (
                  <div
                    key={role.id}
                    className={`cursor-pointer rounded-md border transition-all p-4 flex flex-col items-center gap-2 text-center backdrop-blur-xl shadow-lg ${
                      isSelected
                        ? "bg-white/20 border-white/40 ring-2 ring-white/30 shadow-white/5"
                        : "bg-white/[0.07] border-white/15 hover:bg-white/[0.12] hover:border-white/25"
                    }`}
                    onClick={() => setSelectedRole(role.id)}
                    data-testid={`card-role-${role.id}`}
                  >
                    <div
                      className={`flex items-center justify-center w-10 h-10 rounded-md ${role.color}`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-white">
                        {role.label}
                      </p>
                      <p className="text-[11px] text-white/50 leading-tight mt-0.5">
                        {role.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Login button */}
          <div className="flex justify-center">
            <Button
              disabled={!selectedRole}
              onClick={handleLoginClick}
              className="w-full max-w-xs gap-2"
            >
              <LogIn className="w-4 h-4" />
              Sign In
            </Button>
          </div>

          <p className="text-[11px] text-center text-white/40">
            National Programme for Prevention &amp; Control of Non-Communicable Diseases
          </p>
        </div>
      </div>
    </div>
  );
}
