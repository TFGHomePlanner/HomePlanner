import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const datetoday = new Date();

async function main() {
  const hashedPassword = "homeplanner2023";

  const juan = await prisma.user.create({
    data: {
      name: "Juan",
      email: "johnny.altes1@gmail.com",
      passwordHash: hashedPassword,
    },
  });

  const marta = await prisma.user.create({
    data: {
      name: "Marta",
      email: "marta.yun.lopez@gmail.com",
      passwordHash: hashedPassword,
    },
  });

  const a = await prisma.user.create({
    data: {
      name: "a",
      email: "a",
      passwordHash: "a",
    },
  });

  const minigrupo = await prisma.group.create({
    data: {
      codeGroup: "lasminissonmonas",
      name: "Grupo de minis",
      admin: { connect: { id: marta.id } },
      favouritesProducts: {
        createMany: {
          data: [
            {
              name: "macarrones",
            },
            {
              name: "calabaza",
            },
            {
              name: "chuches",
            },
          ],
        },
      },
      messages: {
        createMany: {
          data: [
            {
              day: datetoday,
              userId: marta.id,
              text: "Holi caracoli",
            },
            {
              day: datetoday,
              userId: a.id,
              text: "Hola Buenas tardes",
            },
            {
              day: datetoday,
              userId: a.id,
              text: "SOy un macarron",
            },
            {
              day: datetoday,
              userId: marta.id,
              text: "Que pesado",
            },
            {
              day: datetoday,
              userId: juan.id,
              text: "Hola Buenas Tardes",
            },
          ],
        },
      },
      users: {
        connect: [{ id: a.id }, { id: juan.id }],
      },
    },
  });

  const tarea1 = await prisma.task.create({
    data: {
      name: "Limpiar baño",
      description: "Limpieza a fondo.",
      frequency: "never",
      groupId: minigrupo.id,
    },
  });

  const tarea2 = await prisma.task.create({
    data: {
      name: "Fregar platos",
      frequency: "oncePerDay",
      groupId: minigrupo.id,
      isDone: true,
      userId: marta.id,
    },
  });

  const tarea3 = await prisma.task.create({
    data: {
      id: "1",
      name: "Limpiar cristales",
      frequency: "oncePerWeek",
      groupId: minigrupo.id,
    },
  });

  const tarea4 = await prisma.task.create({
    data: {
      name: "Cook zome minitrotila.",
      description: "Pliz!!",
      frequency: "oncePerDay",
      groupId: minigrupo.id,
    },
  });

  const lista1 = await prisma.list.create({
    data: {
      name: "Lista de la compra1",
      description: "Lista de la compra",
      groupId: minigrupo.id,
      isClosed: false,
      isPublic: true,
      creatorId: juan.id,
      items: {
        createMany: {
          data: [
            {
              name: "Leche",
              isPurchased: false,
            },
            {
              name: "Pan",
              isPurchased: false,
            },
            {
              name: "Huevos",
              isPurchased: false,
            },
          ],
        },
      },
    },
  });
  const lista2 = await prisma.list.create({
    data: {
      name: "Lista de la compra2",
      description: "Lista de la compra",
      groupId: minigrupo.id,
      isClosed: false,
      isPublic: false,
      creatorId: a.id,
      items: {
        createMany: {
          data: [
            {
              name: "Leche",
              isPurchased: false,
            },
            {
              name: "Pan",
              isPurchased: false,
            },
            {
              name: "Huevos",
              isPurchased: false,
            },
          ],
        },
      },
    },
  });
  const lista3 = await prisma.list.create({
    data: {
      name: "Lista de la compra cerrada",
      description: "Lista de la compra",
      groupId: minigrupo.id,
      isClosed: true,
      isPublic: true,
      creatorId: juan.id,
      items: {
        createMany: {
          data: [
            {
              name: "Leche",
              isPurchased: false,
            },
            {
              name: "Pan",
              isPurchased: false,
            },
            {
              name: "Huevos",
              isPurchased: false,
            },
          ],
        },
      },
    },
  });
  const lista4 = await prisma.list.create({
    data: {
      name: "Lista de la compra cerrada2",
      description: "Lista de la compra",
      groupId: minigrupo.id,
      isClosed: true,
      isPublic: true,
      creatorId: juan.id,
      items: {
        createMany: {
          data: [
            {
              name: "Leche",
              isPurchased: false,
            },
            {
              name: "Pan",
              isPurchased: false,
            },
            {
              name: "Huevos",
              isPurchased: false,
            },
            {
              name: "Maccarones",
              isPurchased: false,
            },
            {
              name: "Sal",
              isPurchased: false,
            },
            {
              name: "Pizza",
              isPurchased: false,
            },
          ],
        },
      },
    },
  });
  const lista5 = await prisma.list.create({
    data: {
      name: "Lista de la cerrda3",
      description: "Lista de la compra",
      groupId: minigrupo.id,
      isClosed: true,
      isPublic: true,
      creatorId: juan.id,
      items: {
        createMany: {
          data: [
            {
              name: "Leche",
              isPurchased: false,
            },
            {
              name: "Pan",
              isPurchased: false,
            },
            {
              name: "Huevos",
              isPurchased: false,
            },
          ],
        },
      },
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
