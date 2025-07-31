import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface SensorCardProps {
  title: string;
  value: string | number;
  unit: string;
  icon: LucideIcon;
  colorClass: string;
  status?: "good" | "warning" | "critical";
}

export function SensorCard({ title, value, unit, icon: Icon, colorClass, status = "good" }: SensorCardProps) {
  const statusColors = {
    good: "text-primary",
    warning: "text-yellow-600",
    critical: "text-destructive"
  };

  return (
    <Card className="overflow-hidden shadow-card hover:shadow-soft transition-all duration-300 animate-fade-in">
      <CardContent className="p-0">
        <div className={cn("h-2", colorClass)} />
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className={cn("p-2 rounded-full", colorClass)}>
              <Icon className="h-5 w-5 text-white" />
            </div>

            <div className={cn("w-2.5 h-2.5 rounded-full", statusColors[status])} />
          </div>
          
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">{title}</p>
            <p className="text-xl font-bold text-foreground">
              {value}
              <span className="text-xs font-normal text-muted-foreground ml-1">{unit}</span>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}