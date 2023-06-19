import { Sequelize, DataTypes } from 'sequelize';

const inTest = process.env.NODE_ENV === 'test';

const sequelize = new Sequelize({
    dialect: 'sqlite',
    logging: !inTest,
    storage: inTest ? './db.sqlite3' : './db.sqlite3'
})

export const History = sequelize.define('History', {
    firstArg: {
        type: DataTypes.NUMBER,
        allowNull: false
    },
    secondArg: {
        type: DataTypes.NUMBER,
        allowNull: true
    },
    result: {
        type: DataTypes.NUMBER,
        allowNull: true
    },
    error: {
        type: DataTypes.STRING,
        allowNull: true
    }
});

export const Operation = sequelize.define('Operation', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
});

Operation.hasMany(History)
History.belongsTo(Operation)

export async function createHistoryEntry({ firstArg, secondArg, operationName, result, error }) {
    const operation = await Operation.findOne({
        where: {
            name: operationName
        }
    });

    return History.create({
        firstArg,
        secondArg,
        result,
        error,
        OperationId: operation.id
    })
}

export async function getAllHistory() {
    return History.findAll();
}

export async function deleteAllHistory() {
    History.destroy({ truncate: true });
}

export function createTables() {
    return Promise.all([
        History.sync({ force: true }),
        Operation.sync({ force: true })
    ]);
}

export async function getAllHistoryParseado() {
    var history= await History.findAll();
    var listaHistoriales=[];
    var historialParseado;
    for(var i=0;i<history.length;i++){
        historialParseado=await parsearHistorial(history[i]);
        listaHistoriales.unshift(historialParseado);
    }
    return listaHistoriales;
}

async function parsearHistorial(historial){
    var operation=await Operation.findByPk(historial.OperationId);
    var nombreOperacion=operation.name;
    var historialParseado={
        "primerArgumento": historial.firstArg,
        "segundoArgumento": historial.secondArg,
        "resultado": historial.result,
        'nombreOperacion': nombreOperacion
    }
    return historialParseado;
}

