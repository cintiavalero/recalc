const $display = document.querySelector('.display')
const $buttons = document.querySelector('.buttons')
const modeButton = document.getElementById('mode');
const borrarHistorial = document.getElementById('borrar-historial');
const root = document.querySelector(':root');

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
$buttons.addEventListener( 'click', async (e) => {
    const nextAction = e.target.tagName === 'BUTTON' ? e.target.name : 'no-button';
        
    if (nextAction === "=") {

        currentDisplay= currentDisplay.replace(/\(|\)/g, "");

        const regex = /(-?\d+|[+\-*/]|^2|raiz|decimalABinario)/g;

        const elementos = currentDisplay.match(regex);
        var firstArg,secondArg;
        if(elementos.length===2){
            if(currentDisplay.startsWith("-") && !["2","raiz", "decimalABinario"].includes(elementos[1])){
                operation="-"
                currentDisplay=currentDisplay.slice(1);
                [firstArg,secondArg] = currentDisplay.split(operation);
                firstArg="-"+firstArg
            }
            else{
                [firstArg,secondArg] = currentDisplay.split(operation);
            }
        }
        else{
            firstArg=elementos[0]
            operation=elementos[1]
            secondArg=elementos[2]
        }

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
    }else if (nextAction === "c") {
        return renderDisplay('');
    }else if (nextAction === "claro-oscuro"){
        cambiarModo();
    }else {
        if (nextAction !== "no-button") {

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
    }

})

//Listener para borrar el historial
borrarHistorial.addEventListener( 'click', async () => {
    await eliminarHistorial()
    await mostrarHistorial();
});

//Funciones
async function calculateSub(firstArg, secondArg) {
    const resp = await fetch(`/api/v1/sub/${firstArg}/${secondArg}`)
    const { result } = await resp.json();
    return result;
}

async function calculatePow(firstArg) {
    if(firstArg > 100000){
        return "Math error"
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
        return "Math error"
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
    if(firstArg < 0){
        return "Math error"
    }
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

async function cambiarModo() {
    root.classList.toggle('light-mode');
    if (root.classList.contains('light-mode')) {
      modeButton.innerHTML  = 'Modo <i class="fas fa-solid fa-moon"></i>'; 
    } else {
      modeButton.innerHTML  = 'Modo <i class="fas fa-solid fa-sun"></i>'; 
    }
    return;
}