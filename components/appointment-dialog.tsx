"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createAppointment, type QueuePatient } from "@/actions/queue";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function AppointmentDialog({ open, onOpenChange }: Props) {
  const [step, setStep] = useState<"form" | "confirmation">("form");
  const [tc, setTc] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    patient: QueuePatient;
    position: number;
  } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await createAppointment({ tc, firstName, lastName });

    if (res.error) {
      setError(res.error);
      setLoading(false);
      return;
    }

    if (res.success && res.patient) {
      setResult({ patient: res.patient, position: res.position! });
      setStep("confirmation");
      setLoading(false);

      // Auto-close after 5 seconds
      setTimeout(() => {
        resetAndClose();
      }, 5000);
    }
  }

  function resetAndClose() {
    setStep("form");
    setTc("");
    setFirstName("");
    setLastName("");
    setError("");
    setResult(null);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={resetAndClose}>
      <DialogContent className="sm:max-w-md">
        {step === "form" ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl">Get Appointment</DialogTitle>
              <DialogDescription>
                Fill in your information to get a queue number.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tc">TC Kimlik No</Label>
                <Input
                  id="tc"
                  placeholder="12345678901"
                  value={tc}
                  onChange={(e) => setTc(e.target.value)}
                  maxLength={11}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  placeholder="First name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  placeholder="Last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
              {error && (
                <p className="text-sm font-medium text-destructive">{error}</p>
              )}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Creating..." : "Get Queue Number"}
              </Button>
            </form>
          </>
        ) : (
          result && (
            <div className="py-6 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <svg
                  className="h-8 w-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="mb-2 text-2xl font-bold">Appointment Created!</h2>
              <div className="mb-4 space-y-1 text-muted-foreground">
                <p>
                  {result.patient.firstName} {result.patient.lastName}
                </p>
              </div>
              <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                <span className="text-4xl font-bold">
                  {result.patient.queueNumber}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                Your position in queue:{" "}
                <span className="font-semibold text-foreground">
                  #{result.position}
                </span>
              </p>
              <p className="mt-4 text-xs text-muted-foreground">
                This screen will close automatically in 5 seconds...
              </p>
            </div>
          )
        )}
      </DialogContent>
    </Dialog>
  );
}
