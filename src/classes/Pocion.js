import { Objeto } from './Objeto'

export class Pocion extends Objeto {
    constructor(id, nombre, { campo, incremento, usable, tipo, precio, porcentaje, permanente, drop }){
        super(id, nombre, drop)
        this.campo = campo
        this.incremento = incremento
        this.usable = usable
        this.tipo = tipo
        this.precio = precio
        this.porcentaje = porcentaje
        this.permanente = permanente
    }
}