import { PrismaClient } from "@prisma/client";
import { publicProcedure } from "../app/server/trpc/trpc";

describe("createTaskProcedure", () => {
	const prisma = new PrismaClient();

	afterEach(async () => {
		// Limpiar la base de datos después de cada prueba
		await prisma.task.deleteMany();
	});

	afterAll(async () => {
		// Cerrar la conexión a la base de datos después de todas las pruebas
		await prisma.$disconnect();
	});

	it("should create a task successfully", async () => {
		// Define los datos de entrada para la prueba
		const input = {
			name: "Test Task",
			description: "This is a test task",
			frequency: "never",
			startsAt: new Date(),
			groupId: "cll9eegg100053q2oekcnlibl",
			userId: "cll9eef6v00013q2oguikd5u4",
			taskGroupId: "",
			createdBy: "cll9eef6v00013q2oguikd5u4",
		};

		// Ejecuta el procedimiento con los datos de entrada
		const result = await publicProcedure.runInContext({
			ctx: {
				prisma,
			},
			input,
		});

		// Verifica los resultados esperados
		expect(result).toMatchObject({
			name: "Test Task",
			description: "This is a test task",
			frequency: "never",
			startsAt: new Date(),
			groupId: "cll9eegg100053q2oekcnlibl",
			userId: "cll9eef6v00013q2oguikd5u4",
			taskGroupId: "",
			createdBy: "cll9eef6v00013q2oguikd5u4",
		});
	});

	it("should handle validation errors", async () => {
		// Define datos de entrada inválidos para forzar un error de validación
		const invalidInput = {
			name: "",
			description: 123,
			frequency: "always",
			startsAt: "123"
		};

		// Ejecuta el procedimiento con los datos de entrada inválidos
		const resultPromise = publicProcedure.runInContext({
			ctx: {
				prisma,
			},
			input: invalidInput,
		});

		// Verifica que el procedimiento rechace la promesa con un error de validación
		await expect(resultPromise).rejects.toThrow(z.ZodError);
	});
});
