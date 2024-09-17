// Mostrar advertencia usando SweetAlert
const mostrarAdvertencia = (mensaje) => {
    Swal.fire({
        icon: 'error',
        title: 'Advertencia',
        text: mensaje,
        confirmButtonText: 'Aceptar'
    });
};

// Validar expresión matemática (números, operadores, letras y paréntesis)
const validarExpresion = (expresion) => {
    if (expresion.trim() === '') {
        mostrarAdvertencia('Por favor, ingresa una expresión matemática.');
        return false;
    }

    const expresionValida = /^[a-zA-Z0-9+\-*/().\s]+$/; // Permitir letras, números, operadores y paréntesis
    if (!expresionValida.test(expresion)) {
        mostrarAdvertencia('La expresión contiene caracteres no válidos. Usa solo letras, números, operadores (+, -, *, /) y paréntesis.');
        return false;
    }

    // Validar que no empiece con un número negativo
    if (/^-/.test(expresion)) {
        mostrarAdvertencia('La expresión no puede comenzar con un número negativo.');
        return false;
    }

    return true;
};

// Validar que se haya seleccionado un recorrido válido
const validarRecorrido = (recorrido) => {
    if (recorrido === 'id') {
        mostrarAdvertencia('Por favor, selecciona un recorrido válido.');
        return false;
    }
    return true;
};

// Función para generar el árbol de expresión
const generarArbol = () => {
    const expresion = document.getElementById('expresion').value.trim();
    const recorrido = document.getElementById('recorridoSelect').value;

    // Validar la expresión matemática
    if (!expresion) {
        mostrarAdvertencia('Por favor, ingresa una expresión matemática.');
        return;
    }

    if (!validarExpresion(expresion)) return;

    // Validar el recorrido seleccionado
    if (!validarRecorrido(recorrido)) return;

    // Limpiar los resultados anteriores
    document.getElementById('preorden').textContent = '';
    document.getElementById('inorden').textContent = '';
    document.getElementById('postorden').textContent = '';
    document.getElementById('tree').innerHTML = '';

    // Construir el árbol de expresión
    const arbol = construirArbolDeExpresion(expresion);
    if (arbol) {
        mostrarArbol(arbol, document.getElementById('tree'));
    }

    // Mostrar los recorridos seleccionados
    if (recorrido === 'todos' || recorrido === 'preorden') {
        document.getElementById('preorden').textContent = preorden(arbol).join(' ');
    }
    if (recorrido === 'todos' || recorrido === 'inorden') {
        document.getElementById('inorden').textContent = inorden(arbol).join(' ');
    }
    if (recorrido === 'todos' || recorrido === 'postorden') {
        document.getElementById('postorden').textContent = postorden(arbol).join(' ');
    }
};

// Función para limpiar el contenido
const limpiarArbol = () => {
    document.getElementById('expresion').value = '';
    document.getElementById('recorridoSelect').value = 'id'; // Restablecer selección de recorrido a "Seleccionar recorrido"
    document.getElementById('tree').innerHTML = '';
    document.getElementById('preorden').textContent = '';
    document.getElementById('inorden').textContent = '';
    document.getElementById('postorden').textContent = '';
};
 


// Función para construir el árbol de expresión de forma recursiva
const construirArbolDeExpresion = (expresion) => {
    const operadores = ['+', '-', '*', '/'];
    let nivelParentesis = 0;
    let operadorPrincipal = -1;
    let menorPrecedencia = Infinity;

    const precedencia = { '+': 1, '-': 1, '*': 2, '/': 2 };

    // Buscar el operador de menor precedencia fuera de paréntesis
    for (let i = 0; i < expresion.length; i++) {
        const caracter = expresion[i];
        if (caracter === '(') nivelParentesis++;
        else if (caracter === ')') nivelParentesis--;
        else if (nivelParentesis === 0 && operadores.includes(caracter)) {
            if (precedencia[caracter] <= menorPrecedencia) {
                menorPrecedencia = precedencia[caracter];
                operadorPrincipal = i;
            }
        }
    }

    // Si no hay operador, es un número o una expresión entre paréntesis
    if (operadorPrincipal === -1) {
        if (expresion.startsWith('(') && expresion.endsWith(')')) {
            return construirArbolDeExpresion(expresion.slice(1, -1));
        }
        return { valor: expresion.trim() }; // Retornar un nodo con el valor numérico o letra
    }

    // Dividir la expresión en dos partes alrededor del operador
    const operador = expresion[operadorPrincipal];
    const izquierda = expresion.substring(0, operadorPrincipal);
    const derecha = expresion.substring(operadorPrincipal + 1);

    return {
        valor: operador,
        izquierda: construirArbolDeExpresion(izquierda),
        derecha: construirArbolDeExpresion(derecha)
    };
};

// Mostrar el árbol de forma visual
const mostrarArbol = (nodo, elementoPadre) => {
    if (!nodo) return;

    const elementoNodo = document.createElement('div');
    elementoNodo.className = 'tree-node';
    elementoNodo.innerText = nodo.valor;
    elementoPadre.appendChild(elementoNodo);

    if (nodo.izquierda || nodo.derecha) {
        const contenedorHijos = document.createElement('div');
        contenedorHijos.className = 'tree-children';

        if (nodo.izquierda) {
            const contenedorIzquierda = document.createElement('div');
            contenedorIzquierda.className = 'tree-container';
            mostrarArbol(nodo.izquierda, contenedorIzquierda);
            contenedorHijos.appendChild(contenedorIzquierda);
        }

        if (nodo.derecha) {
            const contenedorDerecha = document.createElement('div');
            contenedorDerecha.className = 'tree-container';
            mostrarArbol(nodo.derecha, contenedorDerecha);
            contenedorHijos.appendChild(contenedorDerecha);
        }

        elementoPadre.appendChild(contenedorHijos);
    }
};

// Recorridos del árbol
const preorden = (nodo) => nodo ? [nodo.valor, ...preorden(nodo.izquierda), ...preorden(nodo.derecha)] : [];
const inorden = (nodo) => nodo ? [...inorden(nodo.izquierda), nodo.valor, ...inorden(nodo.derecha)] : [];
const postorden = (nodo) => nodo ? [...postorden(nodo.izquierda), ...postorden(nodo.derecha), nodo.valor] : [];

// Asignar eventos a los botones
document.getElementById('generarBtn').addEventListener('click', generarArbol);
document.getElementById('limpiarBtn').addEventListener('click', limpiarArbol);
