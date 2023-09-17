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
      name: "Grupo Casa estudiantes",
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
              text: "Hola",
            },
            {
              day: datetoday,
              userId: a.id,
              text: "Como Vas",
            },
            {
              day: datetoday,
              userId: a.id,
              text: "Yo muy bien",
            },
            {
              day: datetoday,
              userId: marta.id,
              text: "Voy ha hacer la compra",
            },
            {
              day: datetoday,
              userId: juan.id,
              text: "Okeyy",
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

  const grupoTareas = await prisma.taskGroup.create({
    data: {
      name: "Flusis",
      groupId: minigrupo.id,
      Tasks: {
        connect: [{ id: tarea1.id }, { id: tarea2.id }, { id: tarea3.id }],
      },
    },
  });

  const calendario = await prisma.calendar.create({
    data: {
      name: "Casa",
      groupId: minigrupo.id,
    },
  });

  const evento1 = await prisma.event.create({
    data: {
      name: "Boda Ana y Luis",
      isEvent: true,
      location: "Masía Venta l'Home, Buñol",
      allDay: false,
      startsAt: new Date(2023, 7, 22, 10, 0), // Agosto = 7
      calendarId: calendario.id,
      notes: "Llevar regalos.",
      userId: a.id,
      groupId: minigrupo.id,
    },
  });

  const evento2 = await prisma.event.create({
    data: {
      name: "Musical: El rey león",
      isEvent: true,
      location: "Teatro Lope de Vega, Madrid",
      allDay: false,
      startsAt: new Date(2023, 7, 24, 10, 0),
      endsAt: new Date(2023, 7, 24, 12, 30),
      calendarId: calendario.id,
      notes: "Llevar entradas.",
      userId: a.id,
      groupId: minigrupo.id,
    },
  });

  const recordatorio1 = await prisma.event.create({
    data: {
      name: "Cumpleaños de a",
      isEvent: false,
      allDay: true,
      startsAt: new Date(2023, 7, 10, 10, 0),
      calendarId: calendario.id,
      userId: marta.id,
      groupId: minigrupo.id,
    },
  });

  const reservaCasa = await prisma.reservation.create({
    data: {
      room: "Casa entera",
      description: "Despedida María",
      allDay: true,
      startsAt: new Date(2023, 7, 30),
      notes: "Garaje ocupado.",
      groupId: minigrupo.id,
      userId: marta.id,
    },
  });

  const reservaSalon = await prisma.reservation.create({
    data: {
      room: "Salón",
      description: "Viene Pablo a ver una peli",
      allDay: false,
      startsAt: new Date(2023, 7, 27, 18, 0),
      groupId: minigrupo.id,
      userId: a.id,
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
      participants: {
        connect: [{ id: marta.id }, { id: juan.id }, { id: a.id }],
      },
      payments: {
        create: {
          title: "Payment 1",
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
      participants: {
        connect: [{ id: marta.id }, { id: juan.id }, { id: a.id }],
      },
      payments: {
        create: {
          title: "Payment 1",
          payingUser: { connect: { id: juan.id } },
          amount: 150.0,
          debtorUsers: {
            create: [
              {
                debtor: { connect: { id: juan.id } },
                amount: 50.0,
              },
              {
                debtor: { connect: { id: marta.id } },
                amount: 50.0,
              },
              {
                debtor: { connect: { id: a.id } },
                amount: 50.0,
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
