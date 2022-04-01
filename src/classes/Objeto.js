export class Objeto {
    constructor(id, nombre, drop, unico = false){
        this.id = id
        this.nombre = nombre
        this.drop = drop
        this.unico = unico
    }

    obtener(campo){
        if(!this.estadisticas) return 0
        return this.estadisticas.obtener(campo)
    }

    obtenerInicial(campo){
        if(!this.estadisticas) return 0
        return this.estadisticas.obtenerInicial(campo)
    }
}