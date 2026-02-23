/**
 * Seed the database with a default doctor account.
 *
 * Run with: npx tsx prisma/seed.ts
 *
 * IMPORTANT: The dev server must be running (npm run dev) for this to work,
 * because it uses the Better Auth API to create the user with proper password hashing.
 */

const API_URL = process.env.BETTER_AUTH_URL || "http://localhost:3000";

async function main() {
  // First clean up any existing users via direct DB access
  const { PrismaClient } = await import("@prisma/client");
  const prisma = new PrismaClient();
  await prisma.account.deleteMany({});
  await prisma.session.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.$disconnect();

  // Create doctor via Better Auth API (ensures correct password hashing)
  const res = await fetch(`${API_URL}/api/auth/sign-up/email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Dr. Ahmet Yilmaz",
      email: "doctor@clinic.com",
      username: "doctor",
      password: "doctor123",
    }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(`Failed to create doctor: ${JSON.stringify(error)}`);
  }

}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
