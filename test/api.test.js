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

describe("API divide", () => {
    test("Debería responder con un 400 y error cuando el segundo parámetro es 0", async () => {
        const app = await api.build()

        const res=await request(app).get('/api/v1/div/10/0')
            .expect(400)
            .expect('Content-Type', "application/json; charset=utf-8")

        expect(res.body).toEqual({ error: 'No se puede dividir por cero' });
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

        const res1 = await request(app)
            .delete('/api/v1/deleteHistory')
            .expect(200);

        expect(res1.body).toEqual({ message: "Historial eliminado con exito" });


        const resGetHistory = await request(app)
            .get('/api/v1/getHistory')
            .expect(200);

        expect(resGetHistory.body).toEqual([]); 
    }); 
});


describe("API decimalABinario", () => {
    test("Deberia responder con un status 200 si como argumento se recibe por parametro un valor numerico", async () => {
        const app = await api.build()

        const res=await request(app).get('/api/v1/bin/2')
            .expect(200)
            .expect('Content-Type', "application/json; charset=utf-8")

    })

    test("Deberia responder con un status 400 si como argumento se recibe por parametro un valor no numerico", async () => {
        const app = await api.build()

        const res=await request(app).get('/api/v1/bin/a')
            .expect(400)
            .expect('Content-Type', "application/json; charset=utf-8")

        expect(res.body).toEqual({ error: 'El parametro ingresado no es un numero'});
    })

    test("Al recibir como parametro el numero 2 deberia retornar el valor binario 10", async () => {
        const app = await api.build()

        const res=await request(app).get('/api/v1/bin/2')
            .expect(200)
            .expect('Content-Type', "application/json; charset=utf-8")

        expect(res.body.result).toEqual("10");
    })
})

describe("API raiz cuadrada", () => {
    test("Deberia responder con un 200 ok si se calcula la raiz cuadrada de 16 y dar como resultado 4", async () => {
        const app = await api.build()

        const res = await request(app).get('/api/v1/sqrt/16')
            .expect(200)
            .expect('Content-Type', "application/json; charset=utf-8")
            
        expect(res.body.result).toEqual(4);
    })
})

describe('API history', () => {
    test('Debe poder obtener una entrada del historial por ID', async () => {
      const app = await api.build();
  
      // Crear una operación en el historial para obtener su ID
      const createdEntry = await createHistoryEntry({
        firstArg: 2,
        secondArg: 2,
        result: 4,
        operationName: 'ADD',
      });


      const res = await request(app).get(`/api/v1/history/${createdEntry.dataValues.id}`)
        .expect(200)
        .expect('Content-Type', 'application/json; charset=utf-8');

      expect(res.body.result.firstArg).toEqual(2);
      expect(res.body.result.secondArg).toEqual(2);
      expect(res.body.result.result).toEqual(4);
      expect(res.body.result.OperationId).toEqual(1);
    });
  });