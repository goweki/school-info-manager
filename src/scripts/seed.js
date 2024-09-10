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
  const _mediaNames = (await prisma.media.findMany()).map(({ title }) => title);
  for (const mediaDoc of media) {
    // Create new record if it does not exist
    if (!_mediaNames.includes(mediaDoc.name)) {
      await prisma.media.create({
        data: mediaDoc,
      });
    }
  }

  console.log("Seeding courses...");
  const _courseNames = (await prisma.course.findMany()).map(({ name }) => name);
  for (const courseDoc of courses) {
    // Create new record if it does not exist
    if (!_courseNames.includes(courseDoc.name)) {
      await prisma.course.create({
        data: courseDoc,
      });
    }
  }

  console.log("Seeding guardians...");
  const _guardianNames = (await prisma.guardian.findMany()).map(
    ({ name }) => name
  );
  for (const guadianDoc of guardians) {
    // Create new record if it does not exist
    if (!_guardianNames.includes(guadianDoc.name)) {
      await prisma.guardian.create({
        data: guadianDoc,
      });
    }
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
