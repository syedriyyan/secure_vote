const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function createTestUser() {
  try {
    // Check if a test user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: "test@example.com" },
    });

    if (existingUser) {
      console.log("Test user already exists:", existingUser.email);
      return;
    }

    // Create a test user
    const hashedPassword = await bcrypt.hash("password123", 10);

    const user = await prisma.user.create({
      data: {
        name: "Test User",
        email: "test@example.com",
        password: hashedPassword,
        role: "VOTER",
      },
    });

    console.log("Test user created successfully:", user.email);

    // Also create an admin user
    const adminExists = await prisma.user.findUnique({
      where: { email: "admin@example.com" },
    });

    if (!adminExists) {
      const adminUser = await prisma.user.create({
        data: {
          name: "Admin User",
          email: "admin@example.com",
          password: hashedPassword,
          role: "ADMIN",
        },
      });
      console.log("Admin user created successfully:", adminUser.email);
    }
  } catch (error) {
    console.error("Error creating test user:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUser();
