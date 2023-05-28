import express from 'express';
import core from './core.js';

import { createHistoryEntry,getAllHistory,deleteAllHistory } from './models.js'

const router = express.Router();

router.get("/sub/:a/:b", async function (req, res) {
    const params = req.params;
    const a = Number(params.a);
    const b = Number(params.b);

    if (isNaN(a) || isNaN(b)) {
        res.status(400).send({error:'Uno de los parámetros no es un número'});
    } else {
        const result = core.sub(a, b);

        await createHistoryEntry({ firstArg: a, operationName: "ADD" })
        return res.send({ result });
    }
});

router.get("/mul/:a/:b", async function (req, res) {
    const params = req.params;
    const a = Number(params.a);
    const b = Number(params.b);

    if (isNaN(a) || isNaN(b)) {
        res.status(400).send({error:'Uno de los parámetros no es un número'});
    } else {
        const result = core.mul(a, b);
        await createHistoryEntry({ firstArg: a, secondArg: b,result: result , operationName: "MUL"})
        return res.send({ result });
    }
});


router.get("/pow/:a", async function (req, res) {
    const params = req.params;
    const a = Number(params.a);
    if (isNaN(a)) {
        res.status(400).send({error:'La base ingresada por parametro no es un numero'});
    } else {
        const result = core.pow(a);
        await createHistoryEntry({ firstArg: a, secondArg: a,result: result , operationName: "POW"})
        return res.send({ result });
    }
});


router.get("/div/:a/:b", async function (req, res) {
    const params = req.params;
    const a = Number(params.a);
    const b = Number(params.b);

    if (isNaN(a) || isNaN(b)) {
        res.status(400).send({error:'Uno de los parámetros no es un número'});
    } else if (b === 0) {
        res.status(400).send({error:'No se puede dividir por cero'});
    } else {
        const result = core.div(a, b);
        await createHistoryEntry({ firstArg: a, secondArg: b, result, operationName: "DIV" });
        return res.send({ result });
    }
});

router.get("/sum/:a/:b", async function (req, res) {
    const params = req.params;
    const a = Number(params.a);
    const b = Number(params.b);
    if (isNaN(a) || isNaN(b)) {
        res.status(400).send({error:'Uno de los parámetros no es un número'});
    } else {
        const result = core.add(a, b);
        await createHistoryEntry({ firstArg: a, secondArg: b,result: result, operationName: "ADD"});
        return res.send({ result });
    }
});


router.get("/getHistory",async function(req,res){
    const historial=await getAllHistory()
    return res.json((historial))
});


router.delete("/deleteHistory",async function(req,res){
    try {
        await deleteAllHistory();
        res.status(200).send({ message: "Historial eliminado con exito" });
      } catch (error) {
        res.status(500).send({ error: "Ocurrio un error al eliminar el historial" });
      }
});

router.get("/sqrt/:a", async function (req, res) {
    const params = req.params;
    const a = Number(params.a);
    if (isNaN(a)) {
        res.status(400).send({error:'Parametro ingresado no es un número'});
    } else {
        const result = core.sqrt(a);
        await createHistoryEntry({ firstArg: a,result: result, operationName: "SQRT"});
        return res.send({ result });
    }
});


router.get("/bin/:a", async function (req, res) {
    const params = req.params;
    const a = Number(params.a);

    if (isNaN(a)) {
        return res.status(400).send({error:'El parametro ingresado no es un numero'});
    } else {
        const result = core.bin(a);
        await createHistoryEntry({ firstArg: a,result: result, operationName: "BIN"});
        return res.send({ result });
    }
});



export default router;
