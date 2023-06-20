const $display = document.querySelector('.display')
const $buttons = document.querySelector('.buttons')

const operations = ['-','^2','*','/', '+',"raiz","decimalABinario"];

let currentDisplay = "";
let operation = null;
let reset = false;

// Listener para los botones del teclado
document.addEventListener('keydown', (e) => {
    if (e.target === $display) {
      return;
    }
  
    const key = e.key;
    let matchingButton;
  
    if (key === "Backspace") {
      matchingButton = $buttons.querySelector('button[name="c"]');
    } else {
      matchingButton = Array.from($buttons.querySelectorAll('button')).find((button) => button.name === key);
    }
  
    if (matchingButton) {
      matchingButton.click();
    } else if (key === "Enter") {
      const equalsButton = $buttons.querySelector('button[name="="]');
      if (equalsButton) {
        equalsButton.click();
      }
    }
  });

// Listener para los botones dentro del contenedor con clase "buttons"
$buttons.addEventListener('click', async (e) => {
    const nextAction = e.target.tagName === 'BUTTON' ? e.target.name : 'no-button';
        
    if (nextAction === "=") {
        const [firstArg, secondArg] = currentDisplay.split(operation)

        let result;

        if (operation === "-") {
            result = await calculateSub(firstArg, secondArg)
            await mostrarHistorial();
        }

        if (operation === "^2"){
            result= await calculatePow(firstArg)
            await mostrarHistorial();
        }
            
        if (operation === "*") {
            result = await calculateMul(firstArg, secondArg)
            await mostrarHistorial();
        }
        if (operation === "/") {
            result = await calculateDiv(firstArg, secondArg)
            await mostrarHistorial();
        }
        if (operation === "+") {
            result = await calculateSum(firstArg, secondArg)
            await mostrarHistorial();
        }
        if (operation === "raiz") {
            result = await calculateRaiz(firstArg)
            await mostrarHistorial();
        }
        if (operation === "decimalABinario") {
            result = await convertirDecimalABinario(firstArg)
            await mostrarHistorial();
        }

        reset = true;
        return renderDisplay(result !== null && result !== undefined ? result : currentDisplay);
    }

    if (nextAction === "c") {
        return renderDisplay('');
    }

    if (nextAction === "CLR"){
         await eliminarHistorial();
         await mostrarHistorial();
    }

    if (nextAction !== "no-button") {
        if (operation && operations.includes(nextAction)) {
            return;
        }
        if (operations.includes(nextAction)) {
            operation = nextAction;
        }
        if (reset) {
            reset = false;
            operation = null;
            renderDisplay(nextAction);
        } else {
            renderDisplay(currentDisplay + nextAction);
        }
    }
})

async function calculateSub(firstArg, secondArg) {
    const resp = await fetch(`/api/v1/sub/${firstArg}/${secondArg}`)
    const { result } = await resp.json();
    return result;
}

async function calculatePow(firstArg) {
    if(firstArg > 100000){
        return "Error: El numero es muy grande"
    }
    const resp = await fetch(`/api/v1/pow/${firstArg}`)
    const { result } = await resp.json(); 
    return result;
}


async function calculateMul(firstArg, secondArg) {
    const resp = await fetch(`/api/v1/mul/${firstArg}/${secondArg}`)
    const { result } = await resp.json();
    return result;
}

async function calculateDiv(firstArg, secondArg) {
    if(secondArg === "0"){
        return "Error: el divisor no puede ser 0"
    }
    const resp = await fetch(`/api/v1/div/${firstArg}/${secondArg}`)
    const { result } = await resp.json();
    return result;
}

async function calculateSum(firstArg, secondArg) {
    const resp = await fetch(`/api/v1/sum/${firstArg}/${secondArg}`)
    const { result } = await resp.json();
    return result;
}

async function calculateRaiz(firstArg) {
    const resp = await fetch(`/api/v1/sqrt/${firstArg}`)
    const { result } = await resp.json();
    return result;
}
async function convertirDecimalABinario(firstArg) {
    const resp = await fetch(`/api/v1/bin/${firstArg}`)
    const { result } = await resp.json();
    return result;
}

function renderDisplay(chars) {
    currentDisplay = chars;
    $display.value = chars;
}


async function mostrarHistorial(){
    const historialResp = await fetch(`/api/v1/getHistoryParseado`)
    const historial = await historialResp.json();
    var operacion;
    var html="";
    for(let i=0;i<historial.length;i++){
        switch(historial[i].nombreOperacion){

            case 'ADD':
                operacion="+"
                break;
            case 'SUB':
                operacion="-"
                break;
            case 'MUL':
                operacion="*"
                break;
            case 'DIV':
                operacion="/"
                break;
            case 'POW':
                operacion="^2"
                break;
            case 'SQRT':
                operacion="RAIZ"
                break;
            case 'BIN':
                operacion="DecimalABinario"
                break;
        }
        if(operacion==='^2' || operacion==="RAIZ" || operacion==="DecimalABinario"){
            html+=historial[i].primerArgumento
            html+=operacion
            html+="="
            html+=historial[i].resultado
            html+="<br>"
        }
        else{
            html+=historial[i].primerArgumento,
            html+=operacion
            html+=historial[i].segundoArgumento,
            html+="="
            html+=historial[i].resultado,
            html+="<br>"
        }
    }
    document.getElementById('historial').innerHTML=html;

}

async function eliminarHistorial() {
    await fetch(`/api/v1/deleteHistory`, {
        method: 'DELETE'
      });
}

