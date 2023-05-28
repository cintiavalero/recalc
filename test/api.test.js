const request = require('supertest');
const api = require('../src/api.js');
const { seed } = require('../src/seed.js');
const { createHistoryEntry } = require('../src/models.js');

beforeEach(async () => {
    await seed()
})

describe("API substract", () => {
    test("Deberia responder con un 200 ok", async () => {
        const app = await api.build()

        const res = await request(app).get('/api/v1/sub/2/1')
            .expect(200)
            .expect('Content-Type', "application/json; charset=utf-8")
            
        expect(res.body.result).toEqual(1);

    })
})

describe("API multiply", () => {
    test("Deberia responder con un status 200 si como argumento se recibe algun numero con decimales", async () => {
        const app = await api.build()

        const res=await request(app).get('/api/v1/mul/2.5/1')
            .expect(200)
            .expect('Content-Type', "application/json; charset=utf-8")

        expect(res.body.result).toEqual(2.5);
    })
})


describe("API sum", () => {
    test("Si b es negativo, resultado deber ser menor a a y status 200.", async () => {
        const app = await api.build()

        const res=await request(app).get('/api/v1/sum/2/-1')
            .expect(200)
            .expect('Content-Type', "application/json; charset=utf-8")
        expect(res.body.result).toBeLessThan(2);
    });

    test("el resultado debería ser 0,3 si se le pasa los argumentos 0,1 y 0,2 ", async () => {
        const app = await api.build()

        const res=await request(app).get('/api/v1/sum/0.1/0.2')
            .expect(200)
            .expect('Content-Type', "application/json; charset=utf-8")
        expect(res.body.result).toBeCloseTo(0.30,2);
    });

});


describe("API pow", () => {
    test("Si uno de los parámetros no es un número, el endpoint debe devolver el mensaje de error correspondiente, junto a un status 400",
     async () => {
        const app = await api.build()

        const res=await request(app).get('/api/v1/pow/a')
            .expect(400)
            .expect('Content-Type', "application/json; charset=utf-8")

        expect(res.body).toEqual({ error: 'La base ingresada por parametro no es un numero' });
    })
})

describe("API getHistory", () => {
    test("Debería devolver todo el historial", async () => {
        const app = await api.build();

        await createHistoryEntry({ firstArg: 1, secondArg: 2, operationName: "ADD", result: 5 });

        const res = await request(app)
            .get('/api/v1/getHistory')
            .expect(200)

        const historialEsperado = [
            { firstArg: 1, secondArg: 2,OperationId:1, result: 5 }
        ];

        expect(res.body[0].firstArg).toEqual(historialEsperado[0].firstArg);
        expect(res.body[0].secondArg).toEqual(historialEsperado[0].secondArg);
        expect(res.body[0].OperationId).toEqual(1);
        expect(res.body[0].result).toEqual(historialEsperado[0].result);

    });
});


describe("API deleteHistory", () => {
    test("Debería eliminar todo el historial", async () => {
        const app = await api.build();

        await createHistoryEntry({ firstArg: 1, secondArg: 2, result: 5, operationName: "ADD" });

        const historial = await request(app)
            .get('/api/v1/getHistory')
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8');

        const historialEsperado = [
            { firstArg: 1, secondArg: 2,OperationId:1, result: 5 }
        ];

        expect(historial.body[0].firstArg).toEqual(historialEsperado[0].firstArg);
        expect(historial.body[0].secondArg).toEqual(historialEsperado[0].secondArg);
        expect(historial.body[0].OperationId).toEqual(1);
        expect(historial.body[0].result).toEqual(historialEsperado[0].result); 

        const res = await request(app)
            .delete('/api/v1/deleteHistory')
            .expect(200);

        expect(res.body).toEqual({ message: "Historial eliminado con exito" });


        const resGetHistory = await request(app)
            .get('/api/v1/getHistory')
            .expect(200);

        expect(resGetHistory.body).toEqual([]); 
    }); 
})
