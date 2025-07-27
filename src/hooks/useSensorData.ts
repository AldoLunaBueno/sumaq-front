import { useState, useEffect, useCallback } from "react";

export interface SensorReading {
  id: string;
  timestamp: Date;
  temperature: number;
  humidity: number;
  co2: number;
  soilStatus: "Bueno" | "Regular" | "Crítico";
}

export function useSensorData() {
  const [currentData, setCurrentData] = useState<Omit<SensorReading, 'id' | 'timestamp'>>({
    temperature: 22.5,
    humidity: 65,
    co2: 400,
    soilStatus: "Bueno"
  });
  
  const [history, setHistory] = useState<SensorReading[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const generateRandomData = useCallback(() => {
    const temperature = Math.round((Math.random() * 10 + 18) * 10) / 10; // 18-28°C
    const humidity = Math.round(Math.random() * 40 + 40); // 40-80%
    const co2 = Math.round(Math.random() * 200 + 350); // 350-550 ppm
    
    let soilStatus: "Bueno" | "Regular" | "Crítico";
    const soilRandom = Math.random();
    if (soilRandom < 0.6) soilStatus = "Bueno";
    else if (soilRandom < 0.9) soilStatus = "Regular";
    else soilStatus = "Crítico";

    return { temperature, humidity, co2, soilStatus };
  }, []);

  const refreshData = useCallback(async () => {
    setIsRefreshing(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newData = generateRandomData();
    setCurrentData(newData);
    
    // Add to history
    const newReading: SensorReading = {
      id: Date.now().toString(),
      timestamp: new Date(),
      ...newData
    };
    
    setHistory(prev => [newReading, ...prev].slice(0, 50)); // Keep last 50 readings
    setIsRefreshing(false);
  }, [generateRandomData]);

  // Auto-refresh every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const newData = generateRandomData();
      setCurrentData(newData);
      
      const newReading: SensorReading = {
        id: Date.now().toString(),
        timestamp: new Date(),
        ...newData
      };
      
      setHistory(prev => [newReading, ...prev].slice(0, 50));
    }, 5000);

    return () => clearInterval(interval);
  }, [generateRandomData]);

  // Initialize with some sample data
  useEffect(() => {
    const initialHistory: SensorReading[] = [];
    const now = new Date();
    
    for (let i = 0; i < 10; i++) {
      const timestamp = new Date(now.getTime() - i * 5 * 60 * 1000); // Every 5 minutes
      const data = generateRandomData();
      initialHistory.push({
        id: `initial-${i}`,
        timestamp,
        ...data
      });
    }
    
    setHistory(initialHistory.reverse());
  }, [generateRandomData]);

  return {
    currentData,
    history,
    isRefreshing,
    refreshData
  };
}