import { Enemigo } from '../classes/Enemigo'
import { Arma } from '../classes/Arma'
import { Pocion } from '../classes/Pocion'
import { EstadisticasPersonaje } from '../classes/EstadisticasPersonaje'
import { EstadisticasArma } from '../classes/EstadisticasArma'

export default {
  methods: {
    alternarTienda(){
      this.$store.commit('alternarTienda')
    },
    rellenarTienda(){
      this.$store.commit('vaciarTienda')

      let objetosNuevos = [
        this.generaObjeto(true),
        this.generaObjeto(true),
        this.generaObjeto(true)
      ]

      objetosNuevos = objetosNuevos.sort((a, b) => {
        if (a.estadisticas.precio < b.estadisticas.precio) return -1
        if (a.estadisticas.precio > b.estadisticas.precio) return 1
        return 0
      })

      objetosNuevos.forEach(obj => this.$store.commit('agregarObjetoTienda', obj))

      let pocionesNuevas = [
        this.generaPocion(),
        this.generaPocion(),
        this.generaPocion()
      ]

      pocionesNuevas.forEach(poc => this.$store.commit('agregarPocionTienda', poc))

      this.log('¡Tienda renovada!', 'info')
    },
    venderObjeto(objeto){
      this.$store.commit('incrementarCreditoTotal', objeto.precio)
      this.desechar(objeto)
    },
    formatoNumero(n){
      let str = n.toFixed(2)
      if(n > 1000000000000){
        str = (n / 1000000000000).toFixed(2) + 'b'
      }else if(n > 1000000){
        str = (n / 1000000).toFixed(2) + 'm'
      }else if(n > 1000){
        str = (n / 1000).toFixed(2) + 'k'
      }
      return str.replace('.00', '').replace('.', ',')
    },
    timestamp(){
      const d = new Date()
      return [
        d.getHours().toString().padStart(2, '0'),
        d.getMinutes().toString().padStart(2, '0'),
        d.getSeconds().toString().padStart(2, '0')
      ].join(':')
    },
    log(texto, clase){
      const fecha = this.timestamp()
      this.$store.commit('agregarAHistorico', { fecha, texto, clase })
    },
    generaMonstruoActivo(){
      this.$store.commit('vaciarDropActual')
      this.$store.commit('limpiaHistorico')

      const esJefe = (this.totalDrops + 1) % 15 === 0
      const vidaEnemigo = Math.round(this.atributosBase.vidaJugadorFloat * 0.85)
      const ataqueEnemigo = Math.round(this.atributosBase.atqJugadorFloat * 0.85)
      const defensaEnemigo = Math.round(this.atributosBase.defJugadorFloat * 0.85)

      const monstruo = {
        vidaInicial: esJefe ? Math.round(this.total('vida') * 1.15) : vidaEnemigo,
        vida: esJefe ? Math.round(this.total('vida') * 1.15) : vidaEnemigo,
        atq: esJefe ? Math.round(this.total('atq') * 1.15) : ataqueEnemigo,
        def: esJefe ? Math.round(this.total('def') * 1.15) : defensaEnemigo,
        atacando: false,
        esJefe,
      }
      monstruo.creditos = Math.round(monstruo.vidaInicial / (this.totalDrops + 1)) + 1
      if(monstruo.esJefe){
        monstruo.creditos *= 1.25
      }

      // NUEVO
      const monstruoClase = new Enemigo('Enemigo principal', {
        estadisticas: new EstadisticasPersonaje({
          atq: monstruo.atq,
          def: monstruo.def,
          vida: monstruo.vida
        }),
        esJefe: monstruo.esJefe,
        creditos: monstruo.creditos
      })
      this.$store.commit('establecerEnemigo', monstruoClase)
      // !NUEVO

      this.$store.commit('establecerMonstruoActivo', monstruo)
    },
    golpearMonstruoActivo(){
      // Fallo
      if(this.random(1, 25) == 1){
        this.log('¡Has fallado el ataque!', 'normal')
        if(this.equipado && this.equipado.tieneAutoataque){
          this.golpearMonstruoActivo()
        }
        return true
      }

      let totalAtaque = this.total('atq')
      if(this.random(1, 10) <= 2){
        totalAtaque = Math.round(totalAtaque * 1.5)
        this.log(`¡Golpe crítico! (${totalAtaque})`, 'critico')
      }
      let probDefensa = this.random(0, this.monstruoActivo.def)
       // El enemigo defiende
      if(probDefensa > this.monstruoActivo.def / 100){
        let porcentageDefensa = (this.random(0, this.monstruoActivo.def)) + 1
        let ataqueAbsorvido = Math.ceil(totalAtaque * (porcentageDefensa / 100))
        let restoAtaque = totalAtaque - ataqueAbsorvido
        let restoAtaqueNoAbsorvido = 0
        this.$store.commit('decrementarAtributoMonstruo', {
          estadistica: 'def',
          cantidad: ataqueAbsorvido
        })

        if(this.monstruoActivo.def < 0){
          restoAtaqueNoAbsorvido = restoAtaqueNoAbsorvido * -1
          this.$store.commit('decrementarAtributoMonstruo', {
            estadistica: 'def',
            cantidad: this.monstruoActivo.def
          })
        }

        this.$store.commit('decrementarAtributoMonstruo', {
          estadistica: 'vida',
          cantidad: restoAtaque + restoAtaqueNoAbsorvido
        })

        this.log(`El enemigo ha absorvido ${ataqueAbsorvido} de daño y ha recibido ${restoAtaque + restoAtaqueNoAbsorvido} de daño`, 'info')

      }else{
        this.$store.commit('decrementarAtributoMonstruo', {
          estadistica: 'vida',
          cantidad: totalAtaque
        })
      }
      if(this.monstruoActivo.vida <= 0){
        this.$store.commit('decrementarAtributoMonstruo', {
          estadistica: 'vida',
          cantidad: this.monstruoActivo.vida
        })
        this.$store.commit('incrementarCreditoTotal', this.monstruoActivo.creditos)
        this.nuevoDrop()
        this.aumentarAtributosBase()
        if(this.monstruoActivo.esJefe){
          this.establecerAtributos()
        }
        if(this.totalDrops % 5 === 0){
          this.rellenarTienda()
        }
        this.ejecutarAutos()
      }else{
        this.monstruoActivoAtaque()
      }
    },
    ejecutarAutos(){
      if(this.autoLoot){
        this.ejecutarAutoLoot()
      }
      if(this.autoEquip){
        this.ejecutarAutoEquip()
      }
      if(this.autoSell){
        this.ejecutarAutoSell()
      }
    },
    ejecutarAutoLoot(){
      this.dropActual.forEach(item => {
        if(this.inventario.length < this.capacidadMaxima){
          this.agregarAlInventario(item)
        }
      })
      this.dropPociones.forEach(pocion => {
        if(this.bolsaPociones.length < this.capacidadMaximaBolsaPociones){
          this.agregarAlInventario(pocion)
        }
      })
    },
    ejecutarAutoEquip(){
      let itemEquipado = null
      this.inventario.forEach(item => {
        if(!this.equipado){
          this.equipar(item)
          itemEquipado = item
        }
        if(this.equipado.id === item.id){
          return false
        }
        if(item.tieneAutoataque){
          this.equipar(item)
          itemEquipado = item
        }
        if(
          (item.estadisticas.vida > this.equipado.estadisticas.vida || item.estadisticas.atq > this.equipado.estadisticas.atq) &&
          item.estadisticas.atq > this.equipado.estadisticas.atq
        ){
          this.equipar(item)
          itemEquipado = item
        }
        console.log(item)
      })
      if(itemEquipado){
        this.log(`Se ha auto-equipado ${itemEquipado.nombre}`, 'info')
      }
    },
    ejecutarAutoSell(){
      let totalGanado = 0
      this.inventario.forEach(item => {
        if(!this.equipado){
          totalGanado += item.estadisticas.precio
          return this.venderObjeto(item)
        }
        if(this.equipado.id === item.id){
          return false
        }
        totalGanado += item.estadisticas.precio
        this.venderObjeto(item)
      })
      if(totalGanado){
        this.log(`Has ganado ${this.formatoNumero(totalGanado)}¢ auto-vendiendo`, 'info')
      }
    },
    establecerAtributos(){
      this.atributos.vida = this.atributosBase.vidaJugador
      this.atributos.atq = this.atributosBase.atqJugador
      this.atributos.def = this.atributosBase.defJugador
      if(this.equipado){
        this.equipado.estadisticas.vida = this.equipado.estadisticas.vidaInicial
        this.equipado.estadisticas.def = this.equipado.estadisticas.defInicial
      }
      this.inventario.map(item => {
        item.estadisticas.vida = item.estadisticas.vidaInicial
        return item
      })
    },
    reducirAtributo(atributo, cantidad){
      if(this.equipado){
        if(this.equipado.estadisticas[atributo] && this.equipado.estadisticas[atributo] > cantidad){
          this.equipado.estadisticas[atributo] -= cantidad
        }else{
          if(this.equipado.estadisticas[atributo] <= cantidad){
            const resto = cantidad - this.equipado.estadisticas[atributo]
            this.equipado.estadisticas[atributo] = 0
            this.atributos[atributo] -= resto
            if(this.atributos[atributo] < 0) this.atributos[atributo] = 0
          }
        }
      }else{
        this.atributos[atributo] -= cantidad
        if(this.atributos[atributo] < 0) this.atributos[atributo] = 0
      }
    },
    golpeaJugador(){
      // Esquivado
      if(this.random(1, 10) <= 2){
        this.log('¡Has esquivado el ataque!', 'normal')
        if(this.equipado && this.equipado.tieneAutoataque){
          this.golpearMonstruoActivo()
        }
        return true
      }
      // Defensa
      let probDefensa = this.random(0, this.total('def'))
      if(probDefensa > this.total('def') / 100){
        let porcentageDefensa = (this.random(0, this.total('def'))) + 1
        let ataqueAbsorvido = Math.ceil(this.monstruoActivo.atq * (porcentageDefensa / 100))
        let restoAtaque = this.monstruoActivo.atq - ataqueAbsorvido

        // Si tiene más defensa que el ataque que defiende
        // se le resta de la defensa y listo
        if(this.total('def') >= ataqueAbsorvido){
          this.reducirAtributo('def', ataqueAbsorvido)
        }else{
          // Si tiene menos defensa se le pone la defensa a 0
          // y el resto se le resta a la vida
          this.reducirAtributo('def', this.total('def'))
          this.reducirAtributo('vida', restoAtaque)
          ataqueAbsorvido = this.total('def')
        }
        this.log(`¡Has absorvido ${ataqueAbsorvido} con tu defensa y has recibido ${restoAtaque} de daño!`)
      }else{
        this.reducirAtributo('vida', this.monstruoActivo.atq)
      }

      if(this.total('vida') <= 0){
        this.$store.commit('establederCantidadDrops', this.totalDrops > 15 ? this.totalDrops - (this.totalDrops % 15 === 0 ? 15 : this.totalDrops % 15) : 0)
        this.establecerAtributos()
        this.generaMonstruoActivo()
        this.$store.commit('limpiaHistorico')
        this.log('Has muerto, has perdido tus objetos pero vuelves a resucitar volviendo en el tiempo', 'critico')
      }
      if(this.equipado && this.equipado.tieneAutoataque){
        this.golpearMonstruoActivo()
      }
    },
    monstruoActivoAtaque(){
      const _v = this
      _v.monstruoActivo.atacando = true
      setTimeout(function(){
        _v.golpeaJugador()
        _v.monstruoActivo.atacando = false
      }, this.random(1, 1000))
    },
    aumentarAtributosBase(){
      this.$store.commit('incrementarAtributoBase', {
        objetivo: 'Jugador',
        atributo: 'vida',
        cantidad: 1.1
      })
      this.$store.commit('incrementarAtributoBase', {
        objetivo: 'Jugador',
        atributo: 'atq',
        cantidad: 1.1
      })
      this.$store.commit('incrementarAtributoBase', {
        objetivo: 'Jugador',
        atributo: 'def',
        cantidad: 1.1
      })

      // this.$store.commit('incrementarAtributoBase', {
      //   objetivo: 'Enemigo',
      //   atributo: 'vida',
      //   cantidad: 1.1
      // })
      // this.$store.commit('incrementarAtributoBase', {
      //   objetivo: 'Enemigo',
      //   atributo: 'atq',
      //   cantidad: 1.1
      // })
      // this.$store.commit('incrementarAtributoBase', {
      //   objetivo: 'Enemigo',
      //   atributo: 'def',
      //   cantidad: 1.1
      // })

      this.$store.commit('establecerIncrementoObjetos', this.totalDrops / 15)
    },
    total(campo){
      return this.jugador.estadisticas[campo] + this.atributosBase[`${campo}Pociones`] + (this.equipado ? this.equipado.estadisticas[campo] : 0)
    },
    tituloDeObjeto(objeto, recogido){
      // const stats = `Ataque: ${objeto.estadisticas.atq} | Defensa: ${objeto.estadisticas.def}${objeto.estadisticas.vida ? ` | Vida: ${objeto.estadisticas.vida}` : ''}`
      const stats = `Ataque: ${objeto.estadisticas.atq} ${objeto.estadisticas.vida ? ` | Vida: ${objeto.estadisticas.vida}` : ''}`
      return `${stats} ${recogido ? `(Recogido en el drop nº ${objeto.drop})` : ''}`
    },
    equipar(objeto){
      this.$store.commit('equiparObjeto', objeto)
    },
    clasesDeObjeto(objeto){
      return objeto.clase + (objeto.unico ? ' unico' : '')
    },
    desechar(objeto){
      this.$store.commit('desecharObjeto', objeto)
    },
    estaEquipado(objeto){
      return this.equipado && objeto.id === this.equipado.id
    },
    agregarAlInventario(objeto){
      if(objeto.tipo && objeto.tipo === 'pocion'){
        if(this.bolsaPociones.length >= this.capacidadMaximaBolsaPociones){
          return this.log('¡No tienes hueco en la bolsa de pociones!', 'critico')
        }
        this.$store.commit('agregarPocionAInventario', objeto)
        return this.eliminarDelDropPociones(objeto)
      }
      if(this.inventario.length >= this.capacidadMaxima){
        return this.log('¡No tienes hueco en el inventario!', 'normal')
      }
      this.$store.commit('agregarObjetoAInventario', objeto)
      this.eliminarDelDrop(objeto)
    },
    eliminarDelDrop(objeto){
      this.$store.commit('eliminarObjetoDeDrop', objeto)
    },
    eliminarDelDropPociones(pocion){
      this.$store.commit('eliminarPocionDeDrop', pocion)
    },
    nuevoDrop(){
      this.$store.commit('vaciarDropActual')
      this.$store.commit('aumentarCantidadDrops')

      let objetosPorDrop = this.random(1, 3)
      if(this.monstruoActivo.esJefe){
        objetosPorDrop = 6
      }
      for(let i = 0; i < objetosPorDrop; i++) this.nuevoObjeto()

      if(this.random(1, 10) > 8){
        let nPociones = 1;
        if(this.monstruoActivo.esJefe){
          nPociones = this.random(1, 2);
        }
        for(let p = 0; p < nPociones; p++){
          this.$store.commit('agregarPocionADrop', this.generaPocion())
        }
      }
    },
    nuevoObjeto(){
      this.$store.commit('agregarObjetoADrop', this.generaObjeto())
      this.$store.commit('caparInventario')
    },
    generaObjeto(desdeTienda = false){
      let id = Date.now().toString() + Math.random(1)
      let multiplicador = this.totalDrops / 100
      let maxUnicoProb = 1000 - multiplicador
      if(this.monstruoActivo.esJefe){
        maxUnicoProb = 50
      }
      let unico = this.random(0, maxUnicoProb) === 1
      let nombre = Object.keys(this.datos).reduce((acc, val) => {
        if(val === Object.keys(this.datos)[0] || this.random(0, 1) > 0){ // Primera key
          return acc + ' ' + this.datos[val][this.random(0, this.datos[val].length-1)]
        }
        return acc
      }, '').trim()

      let nivelDesde = this.totalDrops
      if(nivelDesde > 6 && !this.monstruoActivo.esJefe){
        nivelDesde -= 2
      }
      let nivel = this.random(nivelDesde, nivelDesde * multiplicador + 1)
      nivel = nivel > this.nivelMax ? this.nivelMax : nivel

      let tieneAutoataque = false
      nombre += ` [nivel ${nivel}]`
      let clase = 'r1'
      if(nivel >= this.nivelMax / 5){
        clase = 'r2'
        tieneAutoataque = this.random(1, 100) >= 90; // 10%
      }
      if(nivel >= this.nivelMax / 3){
        clase = 'r3'
        tieneAutoataque = this.random(1, 100) >= 75; // 25%
      }
      if(nivel >= this.nivelMax / 2){
        clase = 'r4'
        tieneAutoataque = this.random(1, 100) >= 50; // 50%
      }
      if(nivel === this.nivelMax){
        clase = 'r5'
        tieneAutoataque = true;
      }
      if(!desdeTienda){
        this.estadisticas[clase]++
        if(unico) this.estadisticas.unico++
      }

      const estadisticasObj = this.obtenerEstadisticas(clase, unico)

      const objetoClase = new Arma(id, nombre, {
        estadisticas: new EstadisticasArma({
          atq: estadisticasObj.atq,
          def: estadisticasObj.def,
          vida: estadisticasObj.vida
        }),
        precio: estadisticasObj.precio,
        autoataque: tieneAutoataque,
        rango: clase,
        nivel,
        unico,
        drop: this.dropActual
      })
      return objetoClase
    },
    random(min, max){
      return Math.floor(Math.random() * (max - min + 1) + min)
    },
    obtenerEstadisticas(clase, unico){
      const valores = {
        r1: [1, 10],
        r2: [10, 25],
        r3: [25, 50],
        r4: [50, 75],
        r5: [75, 100]
      }

      let vida = 0
      let atq = this.random(...valores[clase])
      let def = this.random(...valores[clase])
      let precio = 0
      // unico = true
      if(unico){
        atq = this.random(valores[clase][1], valores[clase][1] * 2)
        def = this.random(valores[clase][1], valores[clase][1] * 2)
        vida = this.random(valores[clase][1], valores[clase][1] * 2)
      }
      if(this.random(1, 15) > 7){
        vida = this.random(valores[clase][0] * 2, valores[clase][1] * 2)
      }
      vida += Math.round(vida * this.atributosBase.incrementoObjetos)
      atq += Math.round(atq * this.atributosBase.incrementoObjetos)
      def += Math.round(def * this.atributosBase.incrementoObjetos)

      if(this.monstruoActivo.esJefe){
        vida = Math.round(vida * this.random(120, 130) / 100)
        atq = Math.round(atq * this.random(120, 130) / 100)
        def = Math.round(def * this.random(120, 130) / 100)
      }

      precio = Math.round((atq + vida + def) / (unico ? 1 : 2))

      return {
        atq,
        def,
        vida,
        precio
      }
    },
    generaPocion(){
      let tipos = [
        {
          'id': this.random(1000, 9000) + Date.now().toFixed(0),
          'nombre': 'Poción de vida',
          'campo': 'vida',
          'incremento': 1
        },
        {
          'id': this.random(1000, 9000) + Date.now().toFixed(0),
          'nombre': 'Poción de ataque',
          'campo': 'atq',
          'incremento': 1
        }
      ]

      if(this.random(1, 100) > 95){ // 5%
        tipos = [
          {
            'id': this.random(1000, 9000) + Date.now().toFixed(0),
            'nombre': 'Bolsa de pociones',
            'campo': 'capacidadMaximaBolsaPociones',
            'usable': true,
            'incremento': 1
          },
          {
            'id': this.random(1000, 9000) + Date.now().toFixed(0),
            'nombre': 'Inventario',
            'campo': 'capacidadMaxima',
            'usable': true,
            'incremento': 1
          },
          {
            'id': this.random(1000, 9000) + Date.now().toFixed(0),
            'nombre': 'Inventario',
            'campo': 'capacidadMaxima',
            'usable': true,
            'incremento': Math.floor(this.inventario.length / 2) + 1
          },
        ]
      }

      const pocion = tipos[this.random(0, tipos.length - 1)]

      pocion.tipo = 'pocion'
      pocion.id = Date.now().toString() + Math.random(1)
      pocion.precio = Math.ceil(pocion.incremento * this.atributosBase.incrementoObjetos)

      if(pocion.usable){
        // NUEVO
        const pocionClase = new Pocion(pocion.id, pocion.nombre, {
          campo: pocion.campo,
          incremento: pocion.incremento,
          usable: pocion.usable,
          drop: this.dropActual,
          precio: pocion.precio,
          tipo: pocion.tipo,
        })
        console.log('TODO: Implementar pociones', pocionClase)
        // !NUEVO
        return pocion
      }

      pocion.porcentaje = this.random(25, 75)
      const totalActual = this.atributosBase[`${pocion.campo}Jugador`] + this.atributosBase[`${pocion.campo}Pociones`] + (this.equipado ? this.equipado.estadisticas[pocion.campo] : 0)
      pocion.incremento = Math.ceil((totalActual * pocion.porcentaje) / 100)
      pocion.permanente = this.monstruoActivo.esJefe ? this.random(1, 15) > 13 : this.random(1, 15) === 15
      pocion.precio = Math.ceil(pocion.incremento * (this.atributosBase.incrementoObjetos + 1))
      if(pocion.permanente){
        pocion.precio *= 3
      }
      const pocionClase = new Pocion(pocion.id, pocion.nombre, {
        campo: pocion.campo,
        incremento: pocion.incremento,
        usable: pocion.usable,
        drop: this.dropActual,
        precio: pocion.precio,
        tipo: pocion.tipo,
        permanente: pocion.permanente,
        porcentaje: pocion.porcentaje
      })
      console.log('TODO: Implementar pociones', pocionClase)
      return pocion
    },
    usarPocion(pocion){
      if(pocion.usable){
        this.$store.commit('usarPocion', pocion)
        this.$store.commit('eliminarPocionDeInventario', pocion)
        return
      }
      if(pocion.permanente){
        this.$store.commit('incrementarAtributoBase', {
          atributo: `${pocion.campo}Pociones`,
          cantidad: pocion.incremento
        })
      }else{
        this.$store.commit('incrementarAtributo', {
          atributo: pocion.campo,
          cantidad: pocion.incremento
        })
      }
      this.$store.commit('eliminarPocionDeInventario', pocion)
    },
    comprarObjeto(objeto){
      if(objeto.tipo === 'pocion'){
        this.$store.commit('incrementarCreditoTotal', objeto.precio * -1)
        this.$store.commit('eliminarPocionDeTienda', objeto)
      }else{
        this.$store.commit('incrementarCreditoTotal', objeto.estadisticas.precio * -1)
        this.$store.commit('eliminarObjetoDeTienda', objeto)
      }
      this.agregarAlInventario(objeto)
    }
  }
}
