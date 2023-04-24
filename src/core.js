function add(a, b) {
	return a+b;
}

function subtract(a, b) {
	return a-b;
}

function multiply(a, b) {
	return a*b;
}

function divide(a, b){
	if (b == 0) { 
		return "No se puede dividir por 0";
	} else {
	return a/b;
	}
}

function pow(a) {
	return a*a; 
}

export default {
    add: add,
    sub: subtract,
    mul: multiply,
    div: divide,
    pow: pow,
}
