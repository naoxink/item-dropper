import { Personaje } from "./Personaje";

export class Enemigo extends Personaje {
    constructor(nombre, { estadisticas, esJefe, creditos }) {
        super(nombre, estadisticas)
        this.esJefe = esJefe
        this.creditos = creditos
    }
}