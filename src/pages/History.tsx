import { Clock, Thermometer, Droplets, Cloud, Sprout } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MobileNavigation } from "@/components/MobileNavigation";
import { useSensorData } from "@/hooks/useSensorData";
import { cn } from "@/lib/utils";

export default function History() {
  const { history } = useSensorData();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Crítico": return "bg-destructive text-destructive-foreground";
      case "Regular": return "bg-yellow-500 text-white";
      default: return "bg-primary text-primary-foreground";
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-sky text-white px-6 pt-12 pb-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">SUMAQ TREE</h1>
          <h2 className="text-lg font-medium opacity-90">Historial de Mediciones</h2>
        </div>
      </header>

      {/* History Content */}
      <main className="px-4 py-6 pb-24">
        <div className="space-y-4">
          {history.length === 0 ? (
            <Card className="shadow-card">
              <CardContent className="p-8 text-center">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No hay mediciones disponibles</p>
              </CardContent>
            </Card>
          ) : (
            history.map((reading, index) => (
              <Card key={reading.id} className={cn(
                "shadow-card animate-fade-in transition-all duration-300",
                index === 0 && "ring-2 ring-primary/20"
              )}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {formatTime(reading.timestamp)}
                    </CardTitle>
                    {index === 0 && (
                      <Badge variant="outline" className="text-xs">
                        Más reciente
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-2 gap-4">
                    {/* Temperature */}
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-temperature/20">
                        <Thermometer className="h-4 w-4 text-temperature" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Temperatura</p>
                        <p className="text-sm font-semibold">{reading.temperature}°C</p>
                      </div>
                    </div>

                    {/* Humidity */}
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-humidity/20">
                        <Droplets className="h-4 w-4 text-humidity" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Humedad</p>
                        <p className="text-sm font-semibold">{reading.humidity}%</p>
                      </div>
                    </div>

                    {/* CO2 */}
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-co2/20">
                        <Cloud className="h-4 w-4 text-co2" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">CO₂</p>
                        <p className="text-sm font-semibold">{reading.co2} ppm</p>
                      </div>
                    </div>

                    {/* Soil Status */}
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-soil/20">
                        <Sprout className="h-4 w-4 text-soil" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Suelo</p>
                        <Badge 
                          className={cn("text-xs", getStatusColor(reading.soilStatus))}
                        >
                          {reading.soilStatus}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Mostrando las últimas {history.length} mediciones
          </p>
        </div>
      </main>

      <MobileNavigation />
    </div>
  );
}