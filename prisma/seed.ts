import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const datetoday = new Date();

async function main() {
  const hashedPassword = "homeplanner2023";

  const juan = await prisma.user.create({
    data: {
      name: "Juan",
      email: "johnny",
      passwordHash: "a",
    },
  });

  const marta = await prisma.user.create({
    data: {
      name: "Marta",
      email: "marta",
      passwordHash: "a",
    },
  });

  const a = await prisma.user.create({
    data: {
      name: "a",
      email: "a",
      passwordHash: "a",
    },
  });

  const note = await prisma.note.create({
    data: {
      title: "Nota de prueba",
      text: "Esto es una nota de prueba",
      createdAt: new Date(),
      user: { connect: { id: a.id } },
    },
  });

  const note1 = await prisma.note.create({
    data: {
      title: "Nota de prueba",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum luctus elit a sem ullamcorper, vel scelerisque orci ultricies. Proin tincidunt justo vel libero faucibus hendrerit. Donec ut elit nulla. Sed et eleifend libero. Fusce facilisis tincidunt tellus, ut varius nunc congue nec. Duis in nisi arcu. Integer non nisi vel neque cursus luctus. Nunc sit amet elit consectetur, vehicula ipsum vel, feugiat ligula. Aliquam a vehicula dolor. In hac habitasse platea dictumst. Proin nec purus mauris. Nullam tincidunt metus eu erat cursus, vitae ullamcorper lorem sagittis. Donec at quam facilisis, faucibus ex id, fringilla nisl. Suspendisse potenti. Curabitur auctor nisl in velit tincidunt, eu gravida libero dapibus.",
      createdAt: new Date(),
      user: { connect: { id: a.id } },
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
        connect: [{ id: a.id }, { id: juan.id }, { id: marta.id }],
      },
    },
  });

  const tarea1 = await prisma.task.create({
    data: {
      name: "Limpiar baño",
      description: "Limpieza a fondo.",
      frequency: "never",
      groupId: minigrupo.id,
      createdBy: marta.id,
    },
  });

  const tarea2 = await prisma.task.create({
    data: {
      name: "Fregar platos",
      frequency: "oncePerDay",
      groupId: minigrupo.id,
      isDone: true,
      userId: marta.id,
      createdBy: marta.id,
    },
  });

  const tarea3 = await prisma.task.create({
    data: {
      id: "1",
      name: "Limpiar cristales",
      frequency: "oncePerWeek",
      groupId: minigrupo.id,
      createdBy: marta.id,
    },
  });

  const tarea4 = await prisma.task.create({
    data: {
      name: "Cook zome minitrotila.",
      description: "Pliz!!",
      frequency: "oncePerDay",
      groupId: minigrupo.id,
      createdBy: a.id,
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

  const notaCompartida = await prisma.sharedNote.create({
    data: {
      title: "Arreglar tapa del váter",
      text: "Baño pequeño.",
      userId: marta.id,
      groupId: minigrupo.id,
    },
  });
  
  const paymentSection1 = await prisma.paymentSection.create({
    data: {
      group: { connect: { id: minigrupo.id } },
      title: "Section 1",
      totalAmount: 100.0,
      description: "Payment Section 1 Description",
      payments: {
        create: {
          payingUser: { connect: { id: marta.id } },
          amount: 50.0,
          debtorUsers: {
            create: [
              {
                debtor: { connect: { id: marta.id } },
                amount: 25.0, 
              },
              {
                debtor: { connect: { id: juan.id } },
                amount: 25.0, 
              },
            ],
          },
        },
      },
    },
  });

  const paymentSection2 = await prisma.paymentSection.create({
    data: {
      group: { connect: { id: minigrupo.id } },
      title: "Section 2",
      totalAmount: 150.0, // Set the total amount for this section
      description: "Payment Section 2 Description",
      payments: {
        create: {
          payingUser: { connect: { id: juan.id } },
          amount: 150.0, 
          debtorUsers: {
            create: [
              {
                debtor: { connect: { id: marta.id } },
                amount: 75.0, 
              },
              {
                debtor: { connect: { id: a.id } },
                amount: 75.0,
              },
            ],
          },
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
