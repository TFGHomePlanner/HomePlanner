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
      passwordHash: hashedPassword,
    },
  });

  const minigrupo = await prisma.group.create({
    data: {
      CodeGroup: "lasminissonmonas",
      Name: "Grupo de minis",
      Admin: { connect: { id: marta.id } },
      Messages: {
        createMany: {
          data: [
            {
              Day: datetoday,
              UserId: marta.id,
              Text: "Holi caracoli",
            },
            {
              Day: datetoday,
              UserId: a.id,
              Text: "Hola Buenas tardes",
            },
            {
              Day: datetoday,
              UserId: a.id,
              Text: "SOy un macarron",
            },
            {
              Day: datetoday,
              UserId: marta.id,
              Text: "Que pesado",
            },
            {
              Day: datetoday,
              UserId: juan.id,
              Text: "Hola Buenas Tardes",
            },
          ],
        },
      },
      Users: {
        connect: [{ id: a.id }, { id: juan.id }],
      },
    },
  });
  const tarea1 = await prisma.task.create({
    data: {
      name: "Limpiar baño",
      description: "Limpieza a fondo.",
      userInCharge: { connect: { id: marta.id } },
      frequency: "never",
    },
  });  
  const lista1 = await prisma.list.create({
    data: {
      Name: "Lista de la compra1",
      Description: "Lista de la compra",
      GroupId: minigrupo.id,
      IsClosed: false,
      items : {
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
            }
        ]
  
      }
    }
  },
});
const lista2 = await prisma.list.create({
  data: {
    Name: "Lista de la compra2",
    Description: "Lista de la compra",
    GroupId: minigrupo.id,
    IsClosed: false,
    items : {
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
          }
      ]

    }
  }
},
});
const lista3 = await prisma.list.create({
  data: {
    Name: "Lista de la compra cerrada",
    Description: "Lista de la compra",
    GroupId: minigrupo.id,
    IsClosed: false,
    items : {
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
          }
      ]

    }
  }
},
});
const lista4 = await prisma.list.create({
  data: {
    Name: "Lista de la compra cerrada2",
    Description: "Lista de la compra",
    GroupId: minigrupo.id,
    IsClosed: false,
    items : {
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
          }
      ]

    }
  }
},
});
const lista5 = await prisma.list.create({
  data: {
    Name: "Lista de la cerrda3",
    Description: "Lista de la compra",
    GroupId: minigrupo.id,
    IsClosed: false,
    items : {
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
          }
      ]

    }
  }
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
