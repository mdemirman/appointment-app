You are a senior full-stack engineer. Build a **modern clinic queue / appointment management system**.

The application should be production-quality, cleanly structured, and scalable.

---

# Tech Stack

* Next.js (App Router)
* TypeScript
* TailwindCSS
* shadcn/ui
* Prisma ORM
* PostgreSQL
* Better Auth (authentication)
* Responsive modern UI

---

# Application Overview

This system will run inside a clinic or hospital.

Patients arrive and take a queue number from a public screen.

Doctors log into a private dashboard to call patients.

The system must be simple, fast, and very clear visually.

---

# Public Landing Page (Queue Display)

This page acts as a **display screen in the clinic**.

It should contain:

### Queue Display

Large visible sections:

Current Patient
Queue Number
Patient Name

Waiting Queue List

Show the next patients in order.

The design should be **large, readable, and suitable for TV screens**.

---

# Header (Top Right)

Buttons:

Get Appointment
Doctor Login

---

# Patient Flow

When user clicks **Get Appointment**

Open a form.

Fields:

* Turkish ID Number (TC Kimlik No)
* First Name
* Last Name

Validation:

* TC number must be exactly 11 digits
* Prevent duplicate active queue entries

---

# After Form Submission

1. Create a queue record
2. Automatically generate queue number
3. Show confirmation screen

Confirmation screen displays:

* Queue number
* Patient name
* Position in queue

This screen stays visible for **5 seconds**.

After that the system **automatically redirects back to the landing display screen**.

---

# Authentication (Better Auth)

Use **Better Auth** for authentication.

Requirements:

* Only doctors can log in
* Use email + password login
* Secure session handling
* Protected doctor dashboard routes
* Middleware protection

Database must store doctor accounts.

---

# Doctor Dashboard

After login doctor sees a **queue management panel**.

Sections:

Current Patient
Waiting Queue
Completed Patients (optional)

Each patient card shows:

Queue Number
Patient Name
TC Number
Status

---

# Doctor Actions

Call Next Patient

Moves the next waiting patient to "current".

Finish Patient

Marks the current patient as completed and prepares the next patient.

Optional actions:

Skip patient
Recall patient

---

# Database Design (Prisma)

Models:

Doctor

* id
* email
* password
* name
* createdAt

PatientQueue

* id
* tc
* firstName
* lastName
* queueNumber
* status (waiting, called, completed)
* createdAt

---

# UI Requirements

Use shadcn components:

Card
Button
Dialog
Table
Badge
Toast

Design style:

Modern
Clean
Medical themed
Large typography for display screen

---

# Responsiveness

Must work well on:

Large TV screens
Tablets
Mobile devices

---

# Real-time Updates

Queue updates must reflect instantly on screens.

Use one of these:

WebSockets
Server Actions with polling

---

# Extra Features (Nice To Have)

Sound notification when patient is called

Fullscreen display mode

Dark mode

Daily queue reset

Doctor statistics

---

# Folder Structure

Use a clean scalable architecture.

/app
/components
/lib
/actions
/prisma
/hooks

---

# Additional Requirements

Generate:

* Full Prisma schema
* Better Auth setup
* Database connection
* Example doctor seed account
* Queue logic
* Realtime updates
* Modern UI with shadcn
* Type-safe server actions

Write production-quality code.
