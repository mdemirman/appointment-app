"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// ─── Validation ───────────────────────────────────────────────

const appointmentSchema = z.object({
  tc: z
    .string()
    .length(11, "TC Kimlik No must be exactly 11 digits")
    .regex(/^\d+$/, "TC Kimlik No must contain only digits"),
  firstName: z.string().min(1, "First name is required").trim(),
  lastName: z.string().min(1, "Last name is required").trim(),
});

// ─── Types ────────────────────────────────────────────────────

export type QueuePatient = {
  id: string;
  tc: string;
  firstName: string;
  lastName: string;
  queueNumber: number;
  status: string;
  createdAt: Date;
};

export type QueueStatus = {
  currentPatient: QueuePatient | null;
  waitingPatients: QueuePatient[];
  completedPatients: QueuePatient[];
};

// ─── Get Queue Status ─────────────────────────────────────────

export async function getQueueStatus(): Promise<QueueStatus> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [currentPatient, waitingPatients, completedPatients] =
    await Promise.all([
      prisma.patientQueue.findFirst({
        where: { status: "called", createdAt: { gte: today } },
        orderBy: { queueNumber: "asc" },
      }),
      prisma.patientQueue.findMany({
        where: { status: "waiting", createdAt: { gte: today } },
        orderBy: { queueNumber: "asc" },
      }),
      prisma.patientQueue.findMany({
        where: { status: "completed", createdAt: { gte: today } },
        orderBy: { queueNumber: "desc" },
      }),
    ]);

  return { currentPatient, waitingPatients, completedPatients };
}

// ─── Create Appointment ───────────────────────────────────────

export async function createAppointment(formData: {
  tc: string;
  firstName: string;
  lastName: string;
}) {
  const parsed = appointmentSchema.safeParse(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { tc, firstName, lastName } = parsed.data;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Check for duplicate active queue entry
  const existing = await prisma.patientQueue.findFirst({
    where: {
      tc,
      status: { in: ["waiting", "called"] },
      createdAt: { gte: today },
    },
  });

  if (existing) {
    return { error: "You already have an active queue entry for today." };
  }

  // Get next queue number for today
  const lastEntry = await prisma.patientQueue.findFirst({
    where: { createdAt: { gte: today } },
    orderBy: { queueNumber: "desc" },
  });

  const queueNumber = (lastEntry?.queueNumber ?? 0) + 1;

  const patient = await prisma.patientQueue.create({
    data: { tc, firstName, lastName, queueNumber },
  });

  // Count how many patients are ahead
  const position = await prisma.patientQueue.count({
    where: {
      status: "waiting",
      createdAt: { gte: today },
      queueNumber: { lt: queueNumber },
    },
  });

  revalidatePath("/");

  return {
    success: true,
    patient,
    position: position + 1,
  };
}

// ─── Call Next Patient ────────────────────────────────────────

export async function callNextPatient() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Complete any currently called patient first
  await prisma.patientQueue.updateMany({
    where: { status: "called", createdAt: { gte: today } },
    data: { status: "completed" },
  });

  // Get next waiting patient
  const nextPatient = await prisma.patientQueue.findFirst({
    where: { status: "waiting", createdAt: { gte: today } },
    orderBy: { queueNumber: "asc" },
  });

  if (!nextPatient) {
    return { error: "No patients in the waiting queue." };
  }

  const updated = await prisma.patientQueue.update({
    where: { id: nextPatient.id },
    data: { status: "called" },
  });

  revalidatePath("/");
  revalidatePath("/dashboard");

  return { success: true, patient: updated };
}

// ─── Finish Current Patient ──────────────────────────────────

export async function finishPatient() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const currentPatient = await prisma.patientQueue.findFirst({
    where: { status: "called", createdAt: { gte: today } },
  });

  if (!currentPatient) {
    return { error: "No patient is currently being served." };
  }

  await prisma.patientQueue.update({
    where: { id: currentPatient.id },
    data: { status: "completed" },
  });

  revalidatePath("/");
  revalidatePath("/dashboard");

  return { success: true };
}

// ─── Skip Patient ─────────────────────────────────────────────

export async function skipPatient() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const currentPatient = await prisma.patientQueue.findFirst({
    where: { status: "called", createdAt: { gte: today } },
  });

  if (!currentPatient) {
    return { error: "No patient is currently being served." };
  }

  // Move to end of waiting queue with a new higher queue number
  const lastEntry = await prisma.patientQueue.findFirst({
    where: { createdAt: { gte: today } },
    orderBy: { queueNumber: "desc" },
  });

  await prisma.patientQueue.update({
    where: { id: currentPatient.id },
    data: {
      status: "waiting",
      queueNumber: (lastEntry?.queueNumber ?? 0) + 1,
    },
  });

  revalidatePath("/");
  revalidatePath("/dashboard");

  return { success: true };
}

// ─── Recall Patient ───────────────────────────────────────────

export async function recallPatient(patientId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Complete any currently called patient
  await prisma.patientQueue.updateMany({
    where: { status: "called", createdAt: { gte: today } },
    data: { status: "completed" },
  });

  const patient = await prisma.patientQueue.findUnique({
    where: { id: patientId },
  });

  if (!patient) {
    return { error: "Patient not found." };
  }

  await prisma.patientQueue.update({
    where: { id: patientId },
    data: { status: "called" },
  });

  revalidatePath("/");
  revalidatePath("/dashboard");

  return { success: true };
}
