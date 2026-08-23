const prisma = require("./prisma");

const categories = [
  {
    name: "Cars",
    slug: "cars",
  },
  {
    name: "Bikes",
    slug: "bikes",
  },
  {
    name: "Electronics",
    slug: "electronics",
  },
  {
    name: "Accessories",
    slug: "accessories",
  },
  {
    name: "Other",
    slug: "other",
  },
];

const seedCategories = async () => {
  for (const category of categories) {
    await prisma.category.upsert({
      where: {
        slug: category.slug,
      },
      update: {
        name: category.name,
      },
      create: category,
    });
  }

  console.log("Categories seeded successfully.");
};

seedCategories()
  .catch((error) => {
    console.error("Failed to seed categories:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });