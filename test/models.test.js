const { seed } = require('../src/seed.js')
const {
    createHistoryEntry,
    History,
    Operation
} = require('../src/models.js')

beforeEach(async () => {
    await seed()
})

describe("History", () => {
    test("Deberia poder crear una resta en el history", async () => {
        await createHistoryEntry({
            firstArg: 2,
            secondArg: 2,
            result: 0,
            operationName: "SUB"
        })

        const histories = await History.findAll({
            include: [Operation]
        })

        expect(histories.length).toEqual(1)
        expect(histories[0].firstArg).toEqual(2)
        expect(histories[0].result).toEqual(0)
        expect(histories[0].Operation.name).toEqual("SUB")
    })
    test("Debería guardar el atributo 'error' en el historial", async () => {
        await createHistoryEntry({
            firstArg: 10,
            operationName: "DIV",
            error: "No se puede dividir por cero"
        });

        const histories = await History.findAll();

        expect(histories.length).toEqual(1);
        expect(histories[0].firstArg).toEqual(10);
        expect(histories[0].error).toEqual("No se puede dividir por cero");
    })
})
