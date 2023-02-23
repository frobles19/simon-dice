const botonStart = document.querySelector('.start');
const score = document.getElementById('score');
const botonSimon = document.querySelectorAll('.cuadro');

class Simon {
    constructor(botonSimon, botonStart, score) {
        this.score = 0;
        this.posUsuario = 0; // pos del jugador a medida que va tocando los botones
        this.rondaGanador = 10;
        this.secuencia = [];
        this.velocidad = 1000;
        this.bloquearBoton = true;
        this.botones = Array.from(botonSimon);
        this.display = {
            botonStart,
            score
        }
        this.sonidoError = new Audio("./sonidos/error.mp3");
        this.sonidoGanador = new Audio("./sonidos/winner.mp3");
        this.sonidoBoton = [
            new Audio("./sonidos/1.mp3"),
            new Audio("./sonidos/2.mp3"),
            new Audio("./sonidos/3.mp3"),
            new Audio("./sonidos/4.mp3"),
        ]
    }

    init() {
        this.display.botonStart.onclick = () => this.comenzarJuego();
    }

    comenzarJuego() { // comienza el juego
        this.display.botonStart.disabled = true; // desactiva el boton start
        this.actualizarRonda(0); // llama al metodo y pone la ronda en 0
        this.posUsuario = 0; // ubica al usuario en la pos 0
        this.secuencia = this.crearSecuencia(); // llama al metodo para crear una secuencia
        this.botones.forEach((element, i) => {
            element.classList.remove('ganador');
            element.onclick = () => this.clickBoton(i); // a cada elemento lo agrega un onclick definido en el metodo clickBoton()
        })
        this.mostrarSecuencia(); // llama el metodo para mostrar la secuencia
    }

    actualizarRonda(value) {
        this.score = value; // actualiza la ronda
        this.display.score.textContent = this.score; // muestra la ronda por pantalla
    }

    crearSecuencia() {
        return Array.from({ length: this.rondaGanador }, () => this.colorAleatorio()); // agrega al array un numero del siguiente metodo
    }

    colorAleatorio() {
        return Math.floor(Math.random() * 4); // numero aleatorio y lo agrega al array de la secuencia de arriba
    }

    clickBoton(value) {
        !this.bloquearBoton && this.validarEleccion(value);
        // si los botones no estan bloqueados entonces llama al metodo validarEleccion()
    }

    validarEleccion(value) {
        if (this.secuencia[this.posUsuario] === value) { // (1) compara si la eleccion del usuario es la que corresponde
            this.sonidoBoton[value].play();
            if (this.score === this.posUsuario) { // (2) compara si el usuario ya termino de ingresar la secuencia
                this.actualizarRonda(this.score + 1); // aumenta la ronda en 1
                this.velocidad /= 1.02; // reduce la velocidad en la que se muestra la secuencia
                this.validarFin(); // llama al metodo - verifica si se llego al limite de rondas
            } else { // (2) si el usuario debe seguir tocando botones para completar la secuencia
                this.posUsuario++; // aumenta su posicion en 1 para seguir comparando
            }
        } else { // (1) si el usuario eligio mal
            this.juegoPerdido(); // llama al metodo - se perdio el juego
        }
    }

    validarFin() {
        if (this.score === this.rondaGanador) { // verifica si se llego al limite de rondas
            this.juegoGanado();
        } else { // si no llego al limite de rondas
            this.posUsuario = 0; // vuelve a poner al usuario al inicio de la secuencia
            this.mostrarSecuencia();
        }
    }

    mostrarSecuencia() {
        this.bloquearBoton = true; // bloquea los botones mientras se muestra la secuencia
        let indiceSecuencia = 0; // declaramos una variable para saber en que momento de la secuencia estamos
        let timer = setInterval(() => { // creamos un timer que ejecute la siguiente funcion cada cierto tiempo (this.velocidad)
            const boton = this.botones[this.secuencia[indiceSecuencia]]; // variable para almacenar el valor del boton a señalar
            this.pintarBotones(boton); // señalamos el boton
            this.sonidoBoton[this.secuencia[indiceSecuencia]].play();
            setTimeout(() => this.pintarBotones(boton), this.velocidad / 2) // esperamos la mitad del tiempo y lo dejamos de señalar
            indiceSecuencia++; // aumentamos el indice de la secuencia
            if (indiceSecuencia > this.score) { // compara si el indice es mayor al nivel
                this.bloquearBoton = false; // desbloquea los botones
                clearInterval(timer); // frena el intervalo
            }
        }, this.velocidad);
    }

    pintarBotones(boton) {
        boton.classList.toggle('secuencia'); // agrega o quita la clase para señalar el boton
    }

    juegoPerdido() {
        this.display.botonStart.disabled = false; // desbloquea el boton de inicio
        this.bloquearBoton = true; // bloquea los botones del simon
        this.sonidoError.play();
    }

    juegoGanado() {
        this.display.botonStart.disabled = false; // desbloquea el boton de inicio
        this.bloquearBoton = true; // bloquea los botones del simon
        this.botones.forEach(element => {
            element.classList.add('ganador');
        })
        this.actualizarRonda('🏆')
        this.sonidoGanador.play();
    }
}

const simon = new Simon(botonSimon, botonStart, score);
simon.init();