const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const super_admin = require("../scripts/data/super_admin.json");
const media = require("../scripts/data/media.json");
const students = require("../scripts/data/students.json");
const guardians = require("../scripts/data/guardians.json");

// funtion definition
async function seed() {
  console.log("Seeding super_admin...");
  await prisma.user.upsert({
    where: { email: super_admin.email },
    update: { ...super_admin },
    create: { ...super_admin },
  });

  console.log("Seeding media...");
  await prisma.media.createMany({
    data: media,
  });

  console.log("Seeding students...");
  await prisma.student.createMany({
    data: students,
  });

  console.log("Seeding guardians...");
  await prisma.guardian.createMany({
    data: guardians,
  });
}

//function call
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
