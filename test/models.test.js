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
    });

    test("Se debe guardar el segundo argumento en la tabla history", async () => {
        await createHistoryEntry({
            firstArg: 6,
            secondArg: 4,
            result: 2,
            operationName: "SUB"
        })
    
        const histories = await History.findAll({
            include: [Operation]
        })
    
        expect(histories.length).toEqual(1)
        expect(histories[0].firstArg).toEqual(6)
        expect(histories[0].secondArg).not.toBeNull() // Si el segundo argumento es Nulo, no pasa el test.
        expect(histories[0].secondArg).toEqual(4)
        expect(histories[0].result).toEqual(2)
        expect(histories[0].Operation.name).toEqual("SUB")
    });
    
})


