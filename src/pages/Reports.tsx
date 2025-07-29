import { FileText, Download, Calendar, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MobileNavigation } from "@/components/MobileNavigation";
import { useSensorData } from "@/hooks/useSensorData";
import { useRoyaDetection } from "@/hooks/useRoyaDetection";
import { useState } from "react";

export default function Reports() {
  const { currentData, history } = useSensorData();
  const { detection } = useRoyaDetection();
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const generateReport = async () => {
    setIsGenerating(true);
    
    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsGenerating(false);
    setShowPreview(true);
  };

  const downloadReport = () => {
    // Simulate PDF download
    const reportData = {
      date: new Date().toLocaleDateString('es-ES'),
      sensors: currentData,
      roya: detection,
      historyCount: history.length
    };
    
    console.log('Downloading report:', reportData);
    
    // Create a blob with sample PDF content
    const content = `REPORTE DIARIO - SUMAQ TREE
Fecha: ${reportData.date}

DATOS DE SENSORES:
- Temperatura: ${currentData.temperature}°C
- Humedad: ${currentData.humidity}%
- CO₂: ${currentData.co2} ppm
- Humedad del Suelo: ${currentData.soilHumidity}%
- Luz Solar: ${currentData.sunlight}%

DETECCIÓN DE ROYA:
- Estado: ${detection.status}
- Nivel de Riesgo: ${detection.risk}
- Confianza: ${detection.confidence}%

RESUMEN:
- Total de mediciones: ${history.length}
- Generado automáticamente por SUMAQ TREE Dashboard`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reporte-sumaq-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-coffee text-white px-6 pt-12 pb-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">SUMAQ TREE</h1>
          <h2 className="text-lg font-medium opacity-90">Reportes del Sistema</h2>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-6 pb-24 space-y-6">
        {/* Generate Report Card */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Generar Reporte Diario
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Crea un reporte completo con los datos actuales de sensores, 
              estado del cultivo y detección de roya.
            </p>
            
            <Button
              onClick={generateReport}
              disabled={isGenerating}
              className="w-full gap-2 min-h-[56px] text-base font-semibold"
            >
              <FileText className={`h-4 w-4 ${isGenerating ? 'animate-pulse' : ''}`} />
              {isGenerating ? 'Generando reporte...' : 'Generar Reporte'}
            </Button>
          </CardContent>
        </Card>

        {/* Report Preview */}
        {showPreview && (
          <Card className="shadow-card animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Vista Previa del Reporte
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">Reporte Diario</h3>
                  <span className="text-sm text-muted-foreground">
                    {new Date().toLocaleDateString('es-ES')}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="font-medium">Temperatura</p>
                    <p className="text-muted-foreground">{currentData.temperature}°C</p>
                  </div>
                  <div>
                    <p className="font-medium">Humedad</p>
                    <p className="text-muted-foreground">{currentData.humidity}%</p>
                  </div>
                  <div>
                    <p className="font-medium">CO₂</p>
                    <p className="text-muted-foreground">{currentData.co2} ppm</p>
                  </div>
                  <div>
                    <p className="font-medium">Humedad del Suelo</p>
                    <p className="text-muted-foreground">{currentData.soilHumidity}%</p>
                  </div>
                  <div>
                    <p className="font-medium">Luz Solar</p>
                    <p className="text-muted-foreground">{currentData.sunlight}%</p>
                  </div>
                </div>
                
                <div className="border-t border-border pt-3">
                  <p className="font-medium text-sm">Detección de Roya</p>
                  <p className="text-sm text-muted-foreground">
                    {detection.status} - Riesgo: {detection.risk}
                  </p>
                </div>
              </div>
              
              <Button
                onClick={downloadReport}
                className="w-full gap-2 min-h-[56px] text-base font-semibold"
                variant="outline"
              >
                <Download className="h-4 w-4" />
                Descargar Reporte
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Statistics Card */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Estadísticas del Sistema
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Total de mediciones</span>
              <span className="font-semibold">{history.length}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Humedad del suelo actual</span>
              <span className="font-semibold">{currentData.soilHumidity}%</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Luz solar actual</span>
              <span className="font-semibold">{currentData.sunlight}%</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Estado de roya</span>
              <span className="font-semibold">{detection.status}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Última actualización</span>
              <span className="font-semibold">
                {new Date().toLocaleTimeString('es-ES')}
              </span>
            </div>
          </CardContent>
        </Card>
      </main>

      <MobileNavigation />
    </div>
  );
}