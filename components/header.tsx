"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { AppointmentDialog } from "@/components/appointment-dialog";

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <svg
                className="h-5 w-5 text-primary-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            <span className="text-lg font-semibold">ClinicQueue</span>
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={() => setOpen(true)} size="lg">
              Get Appointment
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/login">Doctor Login</Link>
            </Button>
          </div>
        </div>
      </header>
      <AppointmentDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
