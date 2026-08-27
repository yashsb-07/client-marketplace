const bcrypt = require("bcryptjs");
const prisma = require("./prisma");

const seedSeller = async () => {
  const email = "seller@marketplace.demo";
  const password = "Seller@12345";

  const existingSeller = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingSeller) {
    console.log("Seller account already exists.");
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const seller = await prisma.user.create({
    data: {
      name: "Marketplace Seller",
      email,
      passwordHash,
      role: "SELLER",
      isBlocked: false,
    },
  });

  console.log("Seller account created:");
  console.log(`Email: ${seller.email}`);
  console.log(`Password: ${password}`);
};

seedSeller()
  .catch((error) => {
    console.error("Failed to create seller:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });