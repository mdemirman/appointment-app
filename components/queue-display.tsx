"use client";

import { useQueue } from "@/hooks/use-queue";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEffect, useRef } from "react";

export function QueueDisplay() {
  const { currentPatient, waitingPatients, loading, patientCalled } =
    useQueue();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Play notification sound when new patient is called
  useEffect(() => {
    if (patientCalled && audioRef.current) {
      audioRef.current.play().catch(() => {});
    }
  }, [patientCalled]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Notification sound */}
      <audio ref={audioRef} preload="auto">
        <source src="/notification.mp3" type="audio/mpeg" />
      </audio>

      {/* Current Patient - Hero Section */}
      <div className="mb-8">
        <Card
          className={`overflow-hidden border-2 transition-all duration-500 ${
            patientCalled
              ? "border-green-500 shadow-lg shadow-green-100"
              : "border-primary/20"
          }`}
        >
          <CardHeader className="bg-primary/5 pb-3">
            <CardTitle className="text-center text-lg font-medium tracking-wide text-muted-foreground uppercase">
              Now Serving
            </CardTitle>
          </CardHeader>
          <CardContent className="py-10 text-center">
            {currentPatient ? (
              <div
                className={`transition-all duration-300 ${patientCalled ? "animate-pulse" : ""}`}
              >
                <div className="mx-auto mb-4 flex h-32 w-32 items-center justify-center rounded-3xl bg-primary text-primary-foreground shadow-lg md:h-40 md:w-40">
                  <span className="text-6xl font-bold md:text-7xl">
                    {currentPatient.queueNumber}
                  </span>
                </div>
                <p className="text-3xl font-semibold md:text-4xl">
                  {currentPatient.firstName} {currentPatient.lastName}
                </p>
              </div>
            ) : (
              <div className="text-muted-foreground">
                <div className="mx-auto mb-4 flex h-32 w-32 items-center justify-center rounded-3xl bg-muted md:h-40 md:w-40">
                  <span className="text-5xl font-bold md:text-6xl">—</span>
                </div>
                <p className="text-2xl md:text-3xl">No patient being served</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Waiting Queue */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">Waiting Queue</CardTitle>
            <Badge variant="secondary" className="text-sm">
              {waitingPatients.length} patient
              {waitingPatients.length !== 1 ? "s" : ""}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {waitingPatients.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">
              No patients in the waiting queue.
            </p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {waitingPatients.map((patient, index) => (
                <div
                  key={patient.id}
                  className="flex items-center gap-4 rounded-xl border p-4 transition-colors hover:bg-muted/50"
                >
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <span className="text-2xl font-bold">
                      {patient.queueNumber}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-lg font-medium">
                      {patient.firstName} {patient.lastName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Position #{index + 1}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
