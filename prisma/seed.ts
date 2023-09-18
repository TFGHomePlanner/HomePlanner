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
      imageprofile:
        "https://homeplannerimages.s3.eu-north-1.amazonaws.com/imagenes/16950560096761.jpg",
    },
  });

  const marta = await prisma.user.create({
    data: {
      name: "Marta",
      email: "marta",
      passwordHash: "a",
      imageprofile:
        "https://homeplannerimages.s3.eu-north-1.amazonaws.com/imagenes/16950560149521.jpg",
    },
  });

  const mama = await prisma.user.create({
    data: {
      name: "Mamá",
      email: "m",
      passwordHash: "m",
    },
  });

  const papa = await prisma.user.create({
    data: {
      name: "Papá",
      email: "p",
      passwordHash: "p",
    },
  });

  const a = await prisma.user.create({
    data: {
      name: "Alfredo",
      email: "a",
      passwordHash: "contraseña",
      imageprofile:
        "https://homeplannerimages.s3.eu-north-1.amazonaws.com/imagenes/16950560198471.jpg",
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
            {
              name: "papel higiénico",
            },
            {
              name: "calabacín",
            },
            {
              name: "agua",
            },
            {
              name: "leche",
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
              text: "Cómo vas?",
            },
            {
              day: datetoday,
              userId: a.id,
              text: "Yo muy bien",
            },
            {
              day: datetoday,
              userId: marta.id,
              text: "Voy a hacer la compra",
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

  const familia = await prisma.group.create({
    data: {
      codeGroup: "000000",
      name: "Familia",
      admin: { connect: { id: marta.id } },
      users: {
        connect: [{ id: marta.id }, { id: mama.id }, { id: papa.id }],
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
      groupId: familia.id,
      createdBy: marta.id,
    },
  });

  const tarea4 = await prisma.task.create({
    data: {
      name: "Sacar la basura",
      frequency: "oncePerDay",
      groupId: familia.id,
      userId: marta.id,
      createdBy: mama.id,
    },
  });

  const tarea5 = await prisma.task.create({
    data: {
      name: "Ordenar habitación",
      frequency: "never",
      groupId: familia.id,
      userId: marta.id,
      createdBy: mama.id,
    },
  });

  const tarea6 = await prisma.task.create({
    data: {
      name: "Barrer terraza",
      description: "Es la escoba roja.",
      frequency: "oncePerWeek",
      groupId: familia.id,
      userId: marta.id,
      createdBy: mama.id,
    },
  });

  const tarea7 = await prisma.task.create({
    data: {
      name: "Poner lavavajillas",
      description: "Las pastillas están en el armario de la cocina.",
      frequency: "oncePerDay",
      groupId: familia.id,
      userId: papa.id,
      createdBy: papa.id,
    },
  });

  const tarea8 = await prisma.task.create({
    data: {
      name: "Pintar marco de la puerta",
      description: "Terraza",
      frequency: "never",
      groupId: familia.id,
      userId: mama.id,
      createdBy: marta.id,
    },
  });

  const tarea9 = await prisma.task.create({
    data: {
      name: "Ordenar caja de herramientas.",
      frequency: "oncePerMonth",
      groupId: familia.id,
      userId: papa.id,
      createdBy: marta.id,
    },
  });

  const tarea10 = await prisma.task.create({
    data: {
      name: "Sacar hamacas",
      description: "A la terraza. Están en el trastero.",
      frequency: "never",
      groupId: familia.id,
      userId: papa.id,
      createdBy: marta.id,
    },
  });

  // Tareas del grupo estudiantes
  const grupoTareas1 = await prisma.taskGroup.create({
    data: {
      name: "Limpieza",
      groupId: minigrupo.id,
      Tasks: {
        connect: [{ id: tarea1.id }, { id: tarea2.id }],
      },
    },
  });

  // Tareas del grupo familia
  const grupoTareas2 = await prisma.taskGroup.create({
    data: {
      name: "Limpieza",
      groupId: familia.id,
      Tasks: {
        connect: [{ id: tarea3.id }, { id: tarea6.id }],
      },
    },
  });

  const grupoTareas3 = await prisma.taskGroup.create({
    data: {
      name: "Terraza",
      groupId: familia.id,
      Tasks: {
        connect: [{ id: tarea6.id }, { id: tarea10.id }, { id: tarea8.id }],
      },
    },
  });

  const calendario = await prisma.calendar.create({
    data: {
      name: "Casa",
      groupId: familia.id,
    },
  });

  const evento1 = await prisma.event.create({
    data: {
      name: "Boda Ana y Luis",
      isEvent: true,
      location: "Masía Venta l'Home, Buñol",
      allDay: false,
      startsAt: new Date(2023, 8, 22, 10, 0), // Septiembre = 8
      calendarId: calendario.id,
      notes: "Llevar regalos.",
      userId: a.id,
      groupId: familia.id,
    },
  });

  const evento2 = await prisma.event.create({
    data: {
      name: "Musical: El rey león",
      isEvent: true,
      location: "Teatro Lope de Vega, Madrid",
      allDay: false,
      startsAt: new Date(2023, 8, 24, 10, 0),
      endsAt: new Date(2023, 8, 24, 12, 30),
      calendarId: calendario.id,
      notes: "Llevar entradas.",
      userId: a.id,
      groupId: familia.id,
    },
  });

  const recordatorio1 = await prisma.event.create({
    data: {
      name: "Cumpleaños de Ana",
      isEvent: false,
      allDay: true,
      startsAt: new Date(2023, 8, 10, 10, 0),
      calendarId: calendario.id,
      userId: marta.id,
      groupId: familia.id,
    },
  });

  const reservaCasa = await prisma.reservation.create({
    data: {
      room: "Casa entera",
      description: "Despedida María",
      allDay: true,
      startsAt: new Date(2023, 8, 30),
      notes: "El garaje estará ocupado.",
      groupId: familia.id,
      userId: marta.id,
    },
  });

  const reservaSalon = await prisma.reservation.create({
    data: {
      room: "Salón",
      description: "Viene Pablo a ver una peli",
      allDay: false,
      startsAt: new Date(2023, 8, 27, 18, 0),
      groupId: familia.id,
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
              isPurchased: true,
            },
            {
              name: "Pan",
              isPurchased: true,
            },
            {
              name: "Huevos",
              isPurchased: true,
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
              isPurchased: true,
            },
            {
              name: "Pan",
              isPurchased: true,
            },
            {
              name: "Huevos",
              isPurchased: true,
            },
            {
              name: "Maccarones",
              isPurchased: true,
            },
            {
              name: "Sal",
              isPurchased: true,
            },
            {
              name: "Pizza",
              isPurchased: true,
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
              isPurchased: true,
            },
            {
              name: "Pan",
              isPurchased: true,
            },
            {
              name: "Huevos",
              isPurchased: true,
            },
          ],
        },
      },
    },
  });

  const notaCompartida1 = await prisma.sharedNote.create({
    data: {
      title: "Arreglar tapa del váter",
      text: "Baño pequeño.",
      userId: marta.id,
      groupId: minigrupo.id,
    },
  });

  const notaCompartida2 = await prisma.sharedNote.create({
    data: {
      title: "Arreglar tapa del váter",
      text: "Baño pequeño.",
      userId: marta.id,
      groupId: familia.id,
    },
  });

  const notaCompartida3 = await prisma.sharedNote.create({
    data: {
      title: "Desperfectos de la casa",
      text: "- Cambiar pilas mando aire. \n- Arreglar asa puerta nevera. \n- Revisar cisterna baño pequeño.",
      userId: marta.id,
      groupId: familia.id,
    },
  });

  const notaCompartida4 = await prisma.sharedNote.create({
    data: {
      title: "Cuentas",
      text: "Netflix - usuario: FamiliaLH, contraseña: famNetflix23",
      userId: marta.id,
      groupId: familia.id,
    },
  });

  const paymentSection1 = await prisma.paymentSection.create({
    data: {
      group: { connect: { id: minigrupo.id } },
      title: "Section 1",
      totalAmount: 50.0,
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
