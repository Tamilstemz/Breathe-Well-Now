import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  ClipboardCheck,
  ClipboardList,
  Activity,
  Send,
  CalendarClock,
  Stethoscope,
  LogOut,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const mainItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Patients", url: "/patients", icon: Users },
  { title: "Assessments", url: "/assessments", icon: ClipboardList },
  { title: "Screenings", url: "/screenings", icon: ClipboardCheck },
  { title: "Lung Function", url: "/lung-function", icon: Activity },
];

const managementItems = [
  { title: "Referrals", url: "/referrals", icon: Send },
  { title: "Follow-ups", url: "/follow-ups", icon: CalendarClock },
];

interface AppSidebarProps {
  role: string;
  roleLabel: string;
  onLogout: () => void;
}

export function AppSidebar({ roleLabel, onLogout }: AppSidebarProps) {
  const location = useLocation();

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <NavLink to="/">
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="flex items-center justify-center w-9 h-9 rounded-md bg-primary">
              <Stethoscope className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold tracking-tight">
                BreatheSafe
              </span>
              <span className="text-[11px] text-muted-foreground">
                COPD Screening Platform
              </span>
            </div>
          </div>
        </NavLink>
      </SidebarHeader>

      <SidebarContent>
        {/* Overview */}
        <SidebarGroup>
          <SidebarGroupLabel>Overview</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    data-active={location.pathname === item.url}
                    className="data-[active=true]:bg-sidebar-accent"
                  >
                    <NavLink to={item.url}>
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Management */}
        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {managementItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    data-active={location.pathname === item.url}
                    className="data-[active=true]:bg-sidebar-accent"
                  >
                    <NavLink to={item.url}>
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-medium truncate">
              {roleLabel}
            </span>
            <span className="text-[11px] text-muted-foreground">
              v1.0 - Primary Care
            </span>
          </div>

          <Button variant="ghost" size="icon" onClick={onLogout}>
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
