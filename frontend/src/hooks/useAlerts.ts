import { useState, useCallback } from "react";
import { alertsService } from "../services/alerts";
import type { Alert } from "../services/alerts";

export function useAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAlerts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await alertsService.getAll();
      setAlerts(data);
      setError(null);
    } catch (err: any) {
      setError("Failed to fetch alerts");
    } finally {
      setLoading(false);
    }
  }, []);

  return { alerts, loading, error, fetchAlerts };
}
