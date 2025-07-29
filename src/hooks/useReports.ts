import { useState, useCallback } from "react";

export interface CropReport {
  id: string;
  timestamp: Date;
  description: string;
  photo?: File;
  photoUrl?: string;
}

export function useReports() {
  const [reports, setReports] = useState<CropReport[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addReport = useCallback(async (description: string, photo?: File) => {
    setIsSubmitting(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newReport: CropReport = {
      id: Date.now().toString(),
      timestamp: new Date(),
      description,
      photo,
      photoUrl: photo ? URL.createObjectURL(photo) : undefined
    };
    
    setReports(prev => [newReport, ...prev]);
    setIsSubmitting(false);
    
    return newReport;
  }, []);

  return {
    reports,
    isSubmitting,
    addReport
  };
}