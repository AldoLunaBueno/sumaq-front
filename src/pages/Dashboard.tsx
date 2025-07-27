import { Thermometer, Droplets, Cloud, Sprout, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SensorCard } from "@/components/SensorCard";
import { useSensorData } from "@/hooks/useSensorData";
import { MobileNavigation } from "@/components/MobileNavigation";

export default function Dashboard() {
  const { currentData, isRefreshing, refreshData } = useSensorData();

  const getSoilStatus = (status: string) => {
    switch (status) {
      case "Crítico": return "critical";
      case "Regular": return "warning";
      default: return "good";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header
        className="relative text-white px-6 pt-12 pb-8 bg-cover bg-center"
        style={{ backgroundImage: "url('fondo1.jpg')" }}
      >
        <div className="bg-black bg-opacity-40 absolute inset-0"></div>
        <div className="relative text-center flex flex-col items-center">
          <div className="flex items-center gap-3">
            <img
              src="logo_sq.png"
              alt="Logo SUMAQ TREE"
              className="w-18 h-18 object-contain"
            />
            <h1 className="text-2xl font-bold">SUMAQ TREE</h1>
          </div>
          <h2 className="text-lg font-medium opacity-90 mt-2">
            Monitoreo de Cultivo
          </h2>
        </div>
      </header>


      {/* Main Content */}
      <main className="px-6 py-6 pb-24">
        {/* Refresh Button */}
        <div className="flex justify-center mb-6">
          <Button
            onClick={refreshData}
            disabled={isRefreshing}
            variant="outline"
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Actualizando...' : 'Refrescar Datos'}
          </Button>
        </div>

        {/* Sensor Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SensorCard
            title="Temperatura"
            value={currentData.temperature}
            unit="°C"
            icon={Thermometer}
            colorClass="bg-temperature"
            status="good"
          />
          
          <SensorCard
            title="Humedad"
            value={currentData.humidity}
            unit="%"
            icon={Droplets}
            colorClass="bg-humidity"
            status="good"
          />
          
          <SensorCard
            title="CO₂"
            value={currentData.co2}
            unit="ppm"
            icon={Cloud}
            colorClass="bg-co2"
            status="good"
          />
          
          <SensorCard
            title="Estado del Suelo"
            value={currentData.soilStatus}
            unit=""
            icon={Sprout}
            colorClass="bg-soil"
            status={getSoilStatus(currentData.soilStatus) as "good" | "warning" | "critical"}
          />
        </div>

        {/* Last Update Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Última actualización: {new Date().toLocaleTimeString('es-ES')}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Los datos se actualizan automáticamente cada 5 segundos
          </p>
        </div>
      </main>

      <MobileNavigation />
    </div>
  );
}