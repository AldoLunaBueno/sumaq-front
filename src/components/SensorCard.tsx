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
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className={cn("p-3 rounded-full", colorClass.replace('bg-', 'bg-').replace(/\/\d+/, '/20'))}>
              <Icon className={cn("h-6 w-6", colorClass.replace('bg-', 'text-'))} />
            </div>
            <div className={cn("w-3 h-3 rounded-full", statusColors[status])} />
          </div>
          
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold text-foreground">
              {value}
              <span className="text-sm font-normal text-muted-foreground ml-1">{unit}</span>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}