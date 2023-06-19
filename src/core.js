function add(a, b) {
	if(isNaN(a) || isNaN(b)){
		throw Error("Los números ingresados deben ser valores numéricos");
	}
	return a+b;
}

function subtract(a, b) {
	return a-b;
}

function multiply(a, b) {
	if(isNaN(a) || isNaN(b)){
		throw Error("Los parametros ingresados deben ser numericos");
	}
	return a*b;
}

function divide(a, b){
	if(isNaN(a) || isNaN(b)){
		throw Error("Los números ingresados deben ser valores numéricos");
	} else {
		if (b === 0) { 
			return "No se puede dividir por 0";
		}
		return a/b;
	}
	}



function pow(a) {
	if(isNaN(a)){
		throw Error("La base ingresada por parametro debe ser un numero");
	}
	return a*a; 
}

function sqrt(a) {
	if(isNaN(a)){
		throw Error("El número ingresado por parametro debe ser un valor númerico");
	}
	return Math.sqrt(a); 
}

function decimalABinario(a) {
    if(isNaN(a)){
        throw Error("El parametro ingresado debe ser un numero");
    }
    return a.toString(2);
}

export default {
    add: add,
    sub: subtract,
    mul: multiply,
    div: divide,
    pow: pow,
	sqrt: sqrt,
	bin: decimalABinario
}
