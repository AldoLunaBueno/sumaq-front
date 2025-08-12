import { useState, useEffect, useCallback } from "react";

export interface SensorReading {
  id: string;
  timestamp: Date;
  temperature: number;
  humidity: number;
  ph: number;
  npk: number;
  soilHumidity: number;
  sunlight: number;
}

export function useSensorData() {
  const apiUrl = "https://api.tarpuqkuna.lat";

  const zeroData = {
    temperature: 0,
    humidity: 0,
    ph: 0,
    npk: 0,
    soilHumidity: 0,
    sunlight: 0
  };

  const [currentData, setCurrentData] = useState<Omit<SensorReading, "id" | "timestamp">>(zeroData);
  const [history, setHistory] = useState<SensorReading[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshData = useCallback(async () => {
    console.log("%c[FRONT] Iniciando petición a API...", "color: blue; font-weight: bold");

    try {
      setIsRefreshing(true);

      const res = await fetch(`${apiUrl}/latest`);
      console.log("%c[FRONT] Respuesta cruda recibida:", "color: green; font-weight: bold", res);

      if (!res.ok) throw new Error(`Error ${res.status}`);

      const realData = await res.json();
      console.log("%c[FRONT] Datos procesados (JSON):", "color: purple; font-weight: bold", realData);

      setCurrentData({
        temperature: realData.temperature ?? 0,
        humidity: realData.humidity ?? 0,
        ph: 0,
        npk: 0,
        soilHumidity: realData.soilMoisture ?? 0,
        sunlight: 0
      });

      const newReading: SensorReading = {
        id: Date.now().toString(),
        timestamp: new Date(realData.timestamp || Date.now()),
        temperature: realData.temperature ?? 0,
        humidity: realData.humidity ?? 0,
        ph: 0,
        npk: 0,
        soilHumidity: realData.soilMoisture ?? 0,
        sunlight: 0
      };

      setHistory(prev => {
        const updated = [newReading, ...prev].slice(0, 50);
        console.log("%c[FRONT] Historial actualizado:", "color: orange; font-weight: bold", updated);
        return updated;
      });

    } catch (err) {
      console.error("%c[FRONT] Error obteniendo datos:", "color: red; font-weight: bold", err);
    } finally {
      setIsRefreshing(false);
      console.log("%c[FRONT] Finalizó ciclo de actualización", "color: gray; font-weight: bold");
    }
  }, [apiUrl]);

  // Llamar a refreshData cada 5 segundos
  useEffect(() => {
    console.log("%c[FRONT] Cargando datos iniciales...", "color: teal; font-weight: bold");
    refreshData();
    const interval = setInterval(refreshData, 5000);
    return () => {
      console.log("%c[FRONT] Deteniendo actualizaciones", "color: darkred; font-weight: bold");
      clearInterval(interval);
    };
  }, [refreshData]);

  return {
    currentData,
    history,
    isRefreshing,
    refreshData
  };
}
