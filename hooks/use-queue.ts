"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { getQueueStatus, type QueueStatus } from "@/actions/queue";

const POLL_INTERVAL = 3000;

export function useQueue() {
  const [queue, setQueue] = useState<QueueStatus>({
    currentPatient: null,
    waitingPatients: [],
    completedPatients: [],
  });
  const [loading, setLoading] = useState(true);
  const previousCalledId = useRef<string | null>(null);
  const [patientCalled, setPatientCalled] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const status = await getQueueStatus();
      setQueue(status);

      // Detect new patient being called
      if (
        status.currentPatient &&
        status.currentPatient.id !== previousCalledId.current
      ) {
        previousCalledId.current = status.currentPatient.id;
        setPatientCalled(true);
        setTimeout(() => setPatientCalled(false), 3000);
      }
    } catch {
      // Silent fail for polling
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [refresh]);

  return { ...queue, loading, refresh, patientCalled };
}
