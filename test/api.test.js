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
