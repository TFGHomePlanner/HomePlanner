import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = "homeplanner2023";

  const juan = await prisma.user.create({
    data: {
      name: "JuanA",
      email: "johnny.altes1@gmail.com",
    },
  });

  const marta = await prisma.user.create({
    data: {
      name: "Marta",
      email: "marta.yun.lopez@gmail.com",
    },
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
