import { BarChart3, Home, List, Shield, FileText } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/", icon: Home, label: "Dashboard" },
  { to: "/roya", icon: Shield, label: "Roya" },
  { to: "/charts", icon: BarChart3, label: "Gráficas" },
  { to: "/history", icon: List, label: "Historial" },
  { to: "/reports", icon: FileText, label: "Reportes" },
];

export function MobileNavigation() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t shadow-soft z-50">
      <div className="grid grid-cols-5 py-2">
        {navItems.map(({ to, icon: Icon, label }) => {
          const isActive = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={cn(
                "flex flex-col items-center px-2 py-2 rounded-lg transition-all duration-200",
                isActive
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-primary"
              )}
            >
              <Icon className="h-4 w-4 mb-1" />
              <span className="text-xs font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}