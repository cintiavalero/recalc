const request = require('supertest');
const api = require('../src/api.js');
const { seed } = require('../src/seed.js')

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