"use client";

import { useQueue } from "@/hooks/use-queue";
import {
  callNextPatient,
  finishPatient,
  skipPatient,
  recallPatient,
} from "@/actions/queue";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { toast } from "sonner";

export function DoctorDashboard() {
  const {
    currentPatient,
    waitingPatients,
    completedPatients,
    loading,
    refresh,
  } = useQueue();
  const [actionLoading, setActionLoading] = useState(false);

  async function handleAction(action: () => Promise<{ error?: string }>) {
    setActionLoading(true);
    const res = await action();
    if (res.error) {
      toast.error(res.error);
    }
    await refresh();
    setActionLoading(false);
  }

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Row */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Current</p>
              <p className="text-3xl font-bold">
                {currentPatient ? `#${currentPatient.queueNumber}` : "—"}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Waiting</p>
              <p className="text-3xl font-bold">{waitingPatients.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Completed</p>
              <p className="text-3xl font-bold">{completedPatients.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Current Patient */}
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Now Serving
            {currentPatient && (
              <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {currentPatient ? (
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                  <span className="text-3xl font-bold">
                    {currentPatient.queueNumber}
                  </span>
                </div>
                <div>
                  <p className="text-xl font-semibold">
                    {currentPatient.firstName} {currentPatient.lastName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    TC: {currentPatient.tc}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => handleAction(finishPatient)}
                  disabled={actionLoading}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Finish Patient
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleAction(skipPatient)}
                  disabled={actionLoading}
                >
                  Skip
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4 py-4">
              <p className="text-muted-foreground">
                No patient is currently being served.
              </p>
              <Button
                size="lg"
                onClick={() => handleAction(callNextPatient)}
                disabled={actionLoading || waitingPatients.length === 0}
              >
                Call Next Patient
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Call Next Button (when there IS a current patient) */}
      {currentPatient && waitingPatients.length > 0 && (
        <Button
          size="lg"
          className="w-full"
          onClick={() => handleAction(callNextPatient)}
          disabled={actionLoading}
        >
          Finish Current & Call Next Patient
        </Button>
      )}

      {/* Waiting Queue Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Waiting Queue
            <Badge variant="secondary">{waitingPatients.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {waitingPatients.length === 0 ? (
            <p className="py-6 text-center text-muted-foreground">
              No patients waiting.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20">#</TableHead>
                  <TableHead>Patient Name</TableHead>
                  <TableHead>TC Number</TableHead>
                  <TableHead className="w-24">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {waitingPatients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell className="font-bold">
                      {patient.queueNumber}
                    </TableCell>
                    <TableCell>
                      {patient.firstName} {patient.lastName}
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {patient.tc}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">Waiting</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Completed Patients */}
      {completedPatients.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Completed Today
              <Badge variant="secondary">{completedPatients.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20">#</TableHead>
                  <TableHead>Patient Name</TableHead>
                  <TableHead>TC Number</TableHead>
                  <TableHead className="w-24">Status</TableHead>
                  <TableHead className="w-24">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {completedPatients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell className="font-bold">
                      {patient.queueNumber}
                    </TableCell>
                    <TableCell>
                      {patient.firstName} {patient.lastName}
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {patient.tc}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-700"
                      >
                        Done
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          handleAction(() => recallPatient(patient.id))
                        }
                        disabled={actionLoading}
                      >
                        Recall
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
