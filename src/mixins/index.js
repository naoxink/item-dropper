export default {
  methods: {
    alternarTienda(){
      this.$store.commit('alternarTienda')
    },
    rellenarTienda(){
      this.$store.commit('vaciarTienda')

      let objetosNuevos = [
        this.generaObjeto(),
        this.generaObjeto(),
        this.generaObjeto()
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
      this.$store.commit('incrementarCreditoTotal', objeto.estadisticas.precio)
      this.desechar(objeto)
    },
    formatoNumero(n){
      return n.toLocaleString('es-ES')
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

      const esJefe = (this.totalDrops + 1) % 15 === 0
      const monstruo = {
        vidaInicial: this.atributosBase.vidaEnemigo * (esJefe ? 2 : 1),
        vida: this.atributosBase.vidaEnemigo * (esJefe ? 2 : 1),
        atq: this.atributosBase.atqEnemigo,
        def: this.atributosBase.atqEnemigo * (esJefe ? 2 : 1),
        atacando: false,
        esJefe,
        creditos: Math.ceil(this.atributosBase.vidaEnemigo / 3)
      }
      this.$store.commit('establecerMonstruoActivo', monstruo)
    },
    golpearMonstruoActivo(){
      // Fallo
      if(this.random(1, 25) == 1){
        this.log('¡Has fallado el ataque!', 'normal')
        // if(this.equipado && this.equipado.tieneAutoataque){
        //   this.golpearMonstruoActivo()
        // }
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
        let porcentageDefensa = (this.random(0, this.monstruoActivo.def) / 100) + 1
        let ataqueAbsorvido = Math.round(totalAtaque * porcentageDefensa)
        let restoAtaque = this.monstruoActivo.def - totalAtaque
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
        console.log(restoAtaque, restoAtaqueNoAbsorvido)

        this.log(`El enemigo ha absorvido ${ataqueAbsorvido} de daño`, 'info')

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
        this.establecerAtributos()
        if(this.totalDrops % 5 === 0){
          this.rellenarTienda()
        }
        // if(this.equipado && this.equipado.tieneAutoataque){
        //   this.generaMonstruoActivo()
        //   this.golpearMonstruoActivo()
        // }
      }else{
        this.monstruoActivoAtaque()
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
        // if(this.equipado && this.equipado.tieneAutoataque){
        //   this.golpearMonstruoActivo()
        // }
        return true
      }
      // Defensa
      let probDefensa = this.random(0, this.total('def'))
      if(probDefensa > this.total('def') / 100){
        let porcentageDefensa = (this.random(1, this.total('def')) / 100)
        let ataqueAbsorvido = Math.ceil(this.monstruoActivo.atq * porcentageDefensa)
        let restoAtaque = this.total('def') - this.monstruoActivo.atq
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
        this.log(`¡Has absorvido ${ataqueAbsorvido} con tu defensa!`)
      }else{
        this.reducirAtributo('vida', this.monstruoActivo.atq)
      }

      if(this.total('vida') <= 0){
        this.establecerAtributos()
        this.generaMonstruoActivo()
      }
      // if(this.equipado && this.equipado.tieneAutoataque){
      //   this.golpearMonstruoActivo()
      // }
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

      this.$store.commit('incrementarAtributoBase', {
        objetivo: 'Enemigo',
        atributo: 'vida',
        cantidad: 1.1
      })
      this.$store.commit('incrementarAtributoBase', {
        objetivo: 'Enemigo',
        atributo: 'atq',
        cantidad: 1.1
      })
      this.$store.commit('incrementarAtributoBase', {
        objetivo: 'Enemigo',
        atributo: 'def',
        cantidad: 1.1
      })

      this.$store.commit('establecerIncrementoObjetos', this.totalDrops / 15)
    },
    total(campo){
      return this.atributos[campo] + this.atributosBase[`${campo}Pociones`] + (this.equipado ? this.equipado.estadisticas[campo] : 0)
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
          return this.log('¡No tienes hueco en la bolsa de pociones!', 'normal')
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
    generaObjeto(){
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
      this.estadisticas[clase]++
      if(unico) this.estadisticas.unico++

      const objeto = {
        nombre,
        nivel,
        unico,
        clase,
        id,
        // tieneAutoataque: tieneAutoataque,
        'drop': this.totalDrops
      }
      objeto.estadisticas = this.obtenerEstadisticas(objeto)
      return objeto
    },
    random(min, max){
      return Math.floor(Math.random() * (max - min + 1) + min)
    },
    obtenerEstadisticas(objeto){
      const valores = {
        r1: [1, 10],
        r2: [10, 25],
        r3: [25, 50],
        r4: [50, 75],
        r5: [75, 100]
      }

      let vida = 0
      let atq = this.random(...valores[objeto.clase])
      let def = this.random(...valores[objeto.clase])
      let precio = 0
      // objeto.unico = true
      if(objeto.unico){
        atq = this.random(valores[objeto.clase][1], valores[objeto.clase][1] * 2)
        def = this.random(valores[objeto.clase][1], valores[objeto.clase][1] * 2)
        vida = this.random(valores[objeto.clase][1], valores[objeto.clase][1] * 2)
      }
      if(this.random(1, 15) > 7){
        vida = this.random(valores[objeto.clase][0] * 2, valores[objeto.clase][1] * 2)
      }
      vida += Math.round(vida * this.atributosBase.incrementoObjetos)
      atq += Math.round(atq * this.atributosBase.incrementoObjetos)
      def += Math.round(def * this.atributosBase.incrementoObjetos)

      if(this.monstruoActivo.esJefe){
        vida = Math.round(vida * this.random(120, 130) / 100)
        atq = Math.round(atq * this.random(120, 130) / 100)
        def = Math.round(def * this.random(120, 130) / 100)
      }

      precio = Math.round((atq + vida + def) / (objeto.unico ? 1 : 2))

      return {
        atq,
        def,
        vida,
        vidaInicial: vida,
        defInicial: def,
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
          }
        ]
      }

      const pocion = tipos[this.random(0, tipos.length - 1)]

      pocion.tipo = 'pocion'
      pocion.id = Date.now().toString() + Math.random(1)
      pocion.precio = Math.ceil(pocion.incremento * this.atributosBase.incrementoObjetos)

      if(pocion.usable){
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
