const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const seedData = require("../scripts/data/seedData.json");
const { users, media, courses, guardians } = seedData;

// Function definition
async function seed() {
  console.log("Seeding users...");
  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email }, // Unique constraint for email
      update: {}, // No updates if the record exists
      create: user, // Create new record if it does not exist
    });
  }

  console.log("Seeding media...");
  for (const mediaDoc of media) {
    await prisma.media.upsert({
      where: { title: mediaDoc.title }, // Ensure `title` is unique in your schema
      update: {}, // No updates if the record exists
      create: mediaDoc, // Create new record if it does not exist
    });
  }

  console.log("Seeding courses...");
  for (const course_ of courses) {
    await prisma.course.upsert({
      where: { name: course_.name }, // Ensure `name` is unique in your schema
      update: {}, // No updates if the record exists
      create: course_, // Create new record if it does not exist
    });
  }

  console.log("Seeding guardians...");
  // await prisma.guardian.createMany({
  //   data: guardians,
  //   skipDuplicates: true, // Skip if a guardian with the same unique field already exists
  // });
  for (const guardian of guardians) {
    await prisma.guardian.upsert({
      where: { name: guardian.name }, // Ensure `name` is unique in your schema
      update: guardian, // No updates if the record exists
      create: guardian, // Create new record if it does not exist
    });
  }
}

// Function call
seed()
  .then(async () => {
    console.log("SEEDING COMPLETE\n");
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
