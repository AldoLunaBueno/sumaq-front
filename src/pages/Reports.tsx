import { FileText, Download, Calendar, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MobileNavigation } from "@/components/MobileNavigation";
import { useSensorData } from "@/hooks/useSensorData";
import { useRoyaDetection } from "@/hooks/useRoyaDetection";
import { useReports } from "@/hooks/useReports";
import { useState } from "react";
import jsPDF from 'jspdf';

export default function Reports() {
  const { currentData, history } = useSensorData();
  const { detection } = useRoyaDetection();
  const { reports } = useReports();
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
    const doc = new jsPDF();
    const date = new Date().toLocaleDateString('es-ES');
    
    // Header
    doc.setFontSize(20);
    doc.text('REPORTE DIARIO - SUMAQ TREE', 20, 20);
    
    doc.setFontSize(12);
    doc.text(`Fecha: ${date}`, 20, 35);
    
    // Sensor data
    doc.setFontSize(16);
    doc.text('DATOS DE SENSORES:', 20, 55);
    
    doc.setFontSize(12);
    let yPos = 70;
    doc.text(`• Temperatura: ${currentData.temperature}°C`, 25, yPos);
    doc.text(`• Humedad: ${currentData.humidity}%`, 25, yPos + 10);
    doc.text(`• CO₂: ${currentData.co2} ppm`, 25, yPos + 20);
    doc.text(`• Humedad del Suelo: ${currentData.soilHumidity}%`, 25, yPos + 30);
    doc.text(`• Luz Solar: ${currentData.sunlight}%`, 25, yPos + 40);
    
    // Roya detection
    yPos += 60;
    doc.setFontSize(16);
    doc.text('DETECCIÓN DE ROYA:', 20, yPos);
    
    doc.setFontSize(12);
    yPos += 15;
    doc.text(`• Estado: ${detection.status}`, 25, yPos);
    doc.text(`• Nivel de Riesgo: ${detection.risk}`, 25, yPos + 10);
    doc.text(`• Confianza: ${detection.confidence}%`, 25, yPos + 20);
    
    // Reports and observations
    if (reports.length > 0) {
      yPos += 40;
      doc.setFontSize(16);
      doc.text('REPORTES Y OBSERVACIONES:', 20, yPos);
      
      // Sort reports by date
      const sortedReports = [...reports].sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      
      doc.setFontSize(12);
      sortedReports.forEach((report, index) => {
        yPos += 20;
        
        // Check if we need a new page
        if (yPos > 250) {
          doc.addPage();
          yPos = 20;
        }
        
        const reportDate = report.timestamp.toLocaleDateString('es-ES');
        const reportTime = report.timestamp.toLocaleTimeString('es-ES');
        
        doc.text(`${index + 1}. Fecha: ${reportDate} ${reportTime}`, 25, yPos);
        yPos += 10;
        
        // Split long descriptions into multiple lines
        const splitDescription = doc.splitTextToSize(report.description, 160);
        doc.text(splitDescription, 30, yPos);
        yPos += splitDescription.length * 5;
        
        if (report.photos && report.photos.length > 0) {
          yPos += 5;
          doc.text(`   Fotos adjuntas: ${report.photos.length}`, 30, yPos);
          yPos += 10;
        }
      });
    }
    
    // Summary
    yPos += 30;
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }
    yPos += 10;
    doc.setFontSize(16);
    doc.text('RESUMEN:', 20, yPos);
    
    doc.setFontSize(12);
    yPos += 15;
    doc.text(`• Total de mediciones: ${history.length}`, 25, yPos);
    doc.text(`• Total de reportes de campo: ${reports.length}`, 25, yPos + 10);
    doc.text('• Generado automáticamente por SUMAQ TREE Dashboard', 25, yPos + 20);
    
    // Save the PDF
    doc.save(`reporte-sumaq-${new Date().toISOString().split('T')[0]}.pdf`);
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