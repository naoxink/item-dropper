import { EstadisticasPersonaje } from "./EstadisticasPersonaje";

export class Personaje {
    constructor(nombre, estadisticas, equipado = null){
        if(!(estadisticas instanceof EstadisticasPersonaje)){
            throw new Error('Las estadísticas no son estadísticas correctas')
        }
        this.nombre = nombre
        this.estadisticas = estadisticas
        this.equipado = equipado
    }

    atacar(objetivo){
        let cantidad = 0
        // TODO: cancular daño según estadísticas, crítico y demás.
        objetivo.recibirAtaqueDe(cantidad)
    }

    recibirAtaqueDe(cantidad){
        // TODO: Lógica de recibir daño, esquivar, defensa, etc.
    }

    esquiva(){
        // FIXME: Por ahora esto es estático, quizás más adelante se añada a las estadísticas
        return Math.random < .2
    }

    seDefiende(){
        // TODO: Calcular según estadísticas
        // TODO: Añadir al cálculo las estadísticas del inventario
        return Math.random() > .5
    }

    esCritico(){
        // FIXME: Por ahora esto es estático, quizás más adelante se añada a las estadísticas
        return Math.random < .2
    }

    totalEstadistica(estadistica){
        // TODO: Hay que sumar las pociones temporales (cuando estén bien implementadas)
        return this.estadisticas.obtener(estadistica) + (this.equipado ? this.equipado.obtener(campo) : 0)
    }

    totalEstadisticaInicial(estadistica){
        return this.estadisticas.obtenerInicial(estadistica) + (this.equipado ? this.equipado.obtenerInicial(campo) : 0)
    }

}