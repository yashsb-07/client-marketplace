const bcrypt = require("bcryptjs");
const prisma = require("./prisma");

const seedAdmin = async () => {
  const email = "admin@marketplace.demo";
  const password = "Admin@12345";

  const existingAdmin = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingAdmin) {
    console.log("Admin account already exists.");
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const admin = await prisma.user.create({
    data: {
      name: "Marketplace Admin",
      email,
      passwordHash,
      role: "ADMIN",
      isBlocked: false,
    },
  });

  console.log("Admin account created:");
  console.log(`Email: ${admin.email}`);
  console.log(`Password: ${password}`);
};

seedAdmin()
  .catch((error) => {
    console.error("Failed to create admin:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });