import { Thermometer, Droplets, Cloud, Sprout, RefreshCw, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SensorCard } from "@/components/SensorCard";
import { useSensorData } from "@/hooks/useSensorData";
import { MobileNavigation } from "@/components/MobileNavigation";

export default function Dashboard() {
  const { currentData, isRefreshing, refreshData } = useSensorData();

  const getSoilHumidityStatus = (humidity: number) => {
    if (humidity < 30) return "critical";
    if (humidity < 50) return "warning";
    return "good";
  };

  const getSunlightStatus = (sunlight: number) => {
    if (sunlight < 50) return "warning";
    if (sunlight > 90) return "critical";
    return "good";
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header
        className="relative text-white px-6 pt-12 pb-8 bg-cover bg-center"
        style={{ backgroundImage: "url('fondo1.jpg')" }}
      >
        <div className="bg-black bg-opacity-30 absolute inset-0"></div>
        <div className="relative text-center flex flex-col items-center">
          <div className="flex items-center gap-3">
            <img
              src="logo_sq1.png"
              alt="Logo SUMAQ TREE"
              className="w-12 h-12 object-contain opacity-100"
            />
            <h1 className="text-2xl font-bold drop-shadow-lg">SUMAQ TREE</h1>
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
            className="gap-2 min-h-[48px] px-6 text-base font-semibold active:scale-95 transition-transform"
          >
            <RefreshCw className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Actualizando...' : 'Refrescar Datos'}
          </Button>
        </div>

        {/* Sensor Cards Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <SensorCard
            title="Temperatura"
            value={currentData.temperature}
            unit="°C"
            icon={Thermometer}
            colorClass="bg-temperature"
            status="good"
            suggestion="Ideal: 20-25°C. Temperaturas constantes previenen estrés y roya"
          />
          
          <SensorCard
            title="Humedad"
            value={currentData.humidity}
            unit="%"
            icon={Droplets}
            colorClass="bg-humidity"
            status="good"
            suggestion="Ideal: 40-60%. Humedad alta favorece la roya del café"
          />
          
          <SensorCard
            title="CO₂"
            value={currentData.co2}
            unit="ppm"
            icon={Cloud}
            colorClass="bg-co2"
            status="good"
            suggestion="Ideal: 350-450 ppm. Niveles equilibrados mejoran resistencia"
          />
          
          <SensorCard
            title="Humedad del Suelo"
            value={currentData.soilHumidity}
            unit="%"
            icon={Sprout}
            colorClass="bg-soil"
            status={getSoilHumidityStatus(currentData.soilHumidity)}
            suggestion="Ideal: 50-70%. Evita encharcamiento que propicia roya"
          />
          
          <SensorCard
            title="Luz Solar"
            value={currentData.sunlight}
            unit="%"
            icon={Sun}
            colorClass="bg-sunlight"
            status={getSunlightStatus(currentData.sunlight)}
            suggestion="Ideal: 60-80%. Luz solar adecuada fortalece defensas naturales"
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