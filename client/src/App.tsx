import { useState, useCallback } from "react";
import {
  HashRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";

import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import PatientsPage from "@/pages/patients";
import ScreeningsPage from "@/pages/screenings";
import LungFunctionPage from "@/pages/lung-function";
import ReferralsPage from "@/pages/referrals";
import FollowUpsPage from "@/pages/follow-ups";
import AssessmentsPage from "@/pages/assessments";
import LoginPage from "@/pages/login";

const ROLE_LABELS: Record<string, string> = {
  asha: "ASHA",
  anm: "ANM",
  mo: "Medical Officer",
  technician: "Technician",
  pulmonologist: "Pulmonologist",
  dpm: "District Programme Manager",
  admin: "Administrator",
};

/* ✅ Protected Layout */
function ProtectedLayout({
  currentRole,
  onLogout,
}: {
  currentRole: string;
  onLogout: () => void;
}) {
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar
          role={currentRole}
          roleLabel={ROLE_LABELS[currentRole] || currentRole}
          onLogout={onLogout}
        />

        <div className="flex flex-col flex-1 min-w-0">
          <header className="flex items-center justify-between gap-2 p-2 border-b sticky top-0 z-50 bg-background">
            <SidebarTrigger />
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                {ROLE_LABELS[currentRole] || currentRole}
              </span>
              <ThemeToggle />
            </div>
          </header>

          <main className="flex-1 overflow-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/patients" element={<PatientsPage />} />
              <Route path="/screenings" element={<ScreeningsPage />} />
              <Route path="/lung-function" element={<LungFunctionPage />} />
              <Route path="/referrals" element={<ReferralsPage />} />
              <Route path="/follow-ups" element={<FollowUpsPage />} />
              <Route path="/assessments" element={<AssessmentsPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

function App() {
  const [currentRole, setCurrentRole] = useState<string | null>(() =>
    sessionStorage.getItem("breathesafe_role")
  );

  const handleLogin = useCallback((role: string) => {
    sessionStorage.setItem("breathesafe_role", role);
    setCurrentRole(role);
  }, []);

  const handleLogout = useCallback(() => {
    sessionStorage.removeItem("breathesafe_role");
    setCurrentRole(null);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <HashRouter>
          {!currentRole ? (
            <LoginPage onLogin={handleLogin} />
          ) : (
            <ProtectedLayout
              currentRole={currentRole}
              onLogout={handleLogout}
            />
          )}
        </HashRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
