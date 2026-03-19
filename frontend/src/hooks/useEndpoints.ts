import { useState, useCallback } from "react";
import toast from "react-hot-toast";
import { endpointsService } from "../services/endpoints";
import type { Endpoint } from "../services/endpoints";

export function useEndpoints() {
  const [endpoints, setEndpoints] = useState<Endpoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEndpoints = useCallback(async (background = false) => {
    if (!background) setLoading(true);
    try {
      const data = await endpointsService.getAll();
      setEndpoints(data);
      setError(null);
    } catch (err: any) {
      setError("Failed to fetch endpoints");
      if (!background) toast.error("Failed to load endpoints");
    } finally {
      if (!background) setLoading(false);
    }
  }, []);

  const addEndpoint = async (endpointData: any) => {
    try {
      await endpointsService.create(endpointData);
      toast.success('Endpoint added successfully!');
      await fetchEndpoints(true);
    } catch {
      toast.error('Failed to add endpoint.');
      throw new Error("Failed");
    }
  };

  const updateEndpoint = async (id: number, endpointData: any) => {
    try {
      await endpointsService.update(id, endpointData);
      toast.success('Endpoint updated.');
      await fetchEndpoints(true);
    } catch {
      toast.error('Failed to update endpoint.');
      throw new Error("Failed");
    }
  };

  const deleteEndpoint = async (id: number) => {
    try {
      await endpointsService.delete(id);
      toast.success('Endpoint deleted.');
      await fetchEndpoints(true);
    } catch {
      toast.error('Failed to delete endpoint.');
    }
  };

  const toggleEndpoint = async (id: number, isActive: boolean) => {
    setEndpoints(prev => prev.map(e => e.id === id ? { ...e, is_active: isActive } : e));
    try {
      await endpointsService.toggleActive(id, isActive);
      toast.success(isActive ? 'Endpoint enabled' : 'Endpoint paused');
    } catch (err) {
      await fetchEndpoints(true);
      toast.error('Failed to toggle active state');
      throw err;
    }
  };

  const triggerManualCheck = async (id: number) => {
    try {
      await endpointsService.manualCheck(id);
      toast.success('Manual ping dispatched!');
      setTimeout(() => fetchEndpoints(true), 1500);
    } catch {
      toast.error('Failed to dispatch manual check');
    }
  };

  return {
    endpoints,
    loading,
    error,
    fetchEndpoints,
    addEndpoint,
    updateEndpoint,
    deleteEndpoint,
    toggleEndpoint,
    triggerManualCheck
  };
}
