export class Personaje {
    constructor(nombre, estadisticas, equipado = null) {
        this.nombre = nombre
        this.estadisticas = estadisticas
        this.equipado = equipado
    }

    atacar(objetivo) {
        return objetivo.recibirAtaqueDe(this)
    }

    recibirAtaqueDe(golpeador) {
        const results = {
            'decrementar': {},
            'incrementar': {},
            'esquivado': false,
            'critico': false,
            'creditos': 0,
            'finished': false
        }
        let totalAtaque = golpeador.totalEstadistica('atq')
        if (golpeador.esCritico()) {
            totalAtaque = Math.round(totalAtaque * 1.5)
            results.critico = true
        }
        let probDefensa = this.random(0, this.totalEstadistica('def'))
        // El enemigo defiende
        if (probDefensa > this.totalEstadistica('def') / 100) {
            let porcentageDefensa = (this.random(0, this.totalEstadistica('def'))) + 1
            let ataqueAbsorvido = Math.ceil(totalAtaque * (porcentageDefensa / 100))
            let restoAtaque = totalAtaque - ataqueAbsorvido
            let restoAtaqueNoAbsorvido = 0
            results.decrementar.def = ataqueAbsorvido
            this.estadisticas.reducirDefensa(ataqueAbsorvido)
            // this.$store.commit('decrementarAtributoMonstruo', {
            //     estadistica: 'def',
            //     cantidad: ataqueAbsorvido
            // })

            if (this.totalEstadistica('def') < 0) {
                restoAtaqueNoAbsorvido = restoAtaqueNoAbsorvido * -1
                results.decrementar.def = this.totalEstadistica('def')
                this.estadisticas.reducirDefensa(this.totalEstadistica('def'))
                // this.$store.commit('decrementarAtributoMonstruo', {
                //     estadistica: 'def',
                //     cantidad: this.monstruoActivo.def
                // })
            }

            results.decrementar.vida = restoAtaque + restoAtaqueNoAbsorvido
            this.estadisticas.reducirVida(restoAtaque + restoAtaqueNoAbsorvido)
            // this.$store.commit('decrementarAtributoMonstruo', {
            //     estadistica: 'vida',
            //     cantidad: restoAtaque + restoAtaqueNoAbsorvido
            // })

            // this.log(`El enemigo ha absorvido ${ataqueAbsorvido} de daño y ha recibido ${restoAtaque + restoAtaqueNoAbsorvido} de daño`, 'info')

        } else {
            results.decrementar.vida = totalAtaque
            this.estadisticas.reducirVida(totalAtaque)
            console.log(this.nombre, this.totalEstadistica('vida'))
            // this.$store.commit('decrementarAtributoMonstruo', {
            //     estadistica: 'vida',
            //     cantidad: totalAtaque
            // })
        }
        if (this.totalEstadistica('vida') <= 0) {
            results.decrementar.vida = this.totalEstadistica('vida')
            this.estadisticas.reducirVida(this.totalEstadistica('vida'))
            results.creditos = this.creditos ? this.creditos : 0
            results.finished = true
            // this.nuevoDrop()
            // this.aumentarAtributosBase()
            // if (this.monstruoActivo.esJefe) {
            //     this.establecerAtributos()
            // }
            // if (this.totalDrops % 5 === 0) {
            //     this.rellenarTienda()
            // }
            // this.ejecutarAutos()
        } else {
            //this.monstruoActivoAtaque()
        }
        return results
    }

    esquiva() {
        // FIXME: Por ahora esto es estático, quizás más adelante se añada a las estadísticas
        return Math.random < .2
    }

    seDefiende() {
        // TODO: Calcular según estadísticas
        // TODO: Añadir al cálculo las estadísticas del inventario
        return Math.random() > .5
    }

    esCritico() {
        // FIXME: Por ahora esto es estático, quizás más adelante se añada a las estadísticas
        return Math.random < .2
    }

    totalEstadistica(estadistica) {
        // TODO: Hay que sumar las pociones temporales (cuando estén bien implementadas)
        return this.estadisticas.obtener(estadistica) + (this.equipado ? this.equipado.obtener(campo) : 0)
    }

    totalEstadisticaInicial(estadistica) {
        return this.estadisticas.obtenerInicial(estadistica) + (this.equipado ? this.equipado.obtenerInicial(campo) : 0)
    }

    random(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min)
    }

}