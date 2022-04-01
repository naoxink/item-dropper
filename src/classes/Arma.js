import { Objeto } from './Objeto'
import { EstadisticasArma } from './EstadisticasArma'

export class Arma extends Objeto {
    constructor(id, nombre, { nivel, rango, estadisticas, autoataque, precio, drop, unico }){
        if(!(estadisticas instanceof EstadisticasArma)){
            throw new Error('Las estadísticas no son "EstadisticasArma"')
        }
        super(id, nombre, drop, unico)
        this.nivel = nivel
        this.rango = rango
        this.estadisticas = estadisticas
        this.autoataque = autoataque
        this.precio = precio
    }
}