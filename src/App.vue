<template>
  <div id="app">
    <div v-if="tienda.mostrando">
      <div class="tienda">
        <p>Créditos disponibles: <strong>{{ creditoTotal }}</strong>¢</p>
        <p>La tienda se renovará en <strong>{{ 5 - (totalDrops % 5) }}</strong> muertes</p>
        <div style="overflow:hidden;">
          <div>
            <h2>Pociones</h2>
            <div class="item pocion" v-for="pocion of tienda.pociones">
              <button @click="comprarObjeto(pocion)" :disabled="pocion.precio > creditoTotal">Comprar</button>
              <small>
                <span class="item-stat unico">Precio: {{ pocion.precio }}¢</span>
              </small>
              {{ pocion.nombre }} {{ pocion.permanente ? 'permanente' : '' }} (+{{ formatoNumero(pocion.incremento) }})
            </div>
          </div>
          <div>
            <h2>Objetos</h2>
            <div class="item" :class="objeto.clase" v-for="objeto of tienda.objetos">
              <button @click="comprarObjeto(objeto)" :disabled="objeto.estadisticas.precio > creditoTotal">Comprar</button>
              <small>
                <span class="item-stat unico">Precio: {{ objeto.estadisticas.precio }}¢</span>
                <span class="item-stat" :class="[ equipado && atributosBase.atqJugador + equipado.estadisticas.atq >= atributosBase.atqJugador + objeto.estadisticas.atq ? 'r1' : 'r2' ]">a: {{ formatoNumero(objeto.estadisticas.atq) }}</span>
                <!-- <span class="item-stat" :class="[ equipado && atributosBase.defJugador + equipado.estadisticas.def >= atributosBase.defJugador + objeto.estadisticas.def ? 'r1' : 'r2' ]">d: {{ formatoNumero(objeto.estadisticas.def) }}</span> -->
                <span class="item-stat" :class="[ equipado && atributosBase.vidaJugador + equipado.estadisticas.vida >= atributosBase.vidaJugador + objeto.estadisticas.vida ? 'r1' : 'r2' ]">v: {{ formatoNumero(objeto.estadisticas.vida) }}</span>
              </small>
              {{ objeto.nombre }}
            </div>
          </div>
        </div>
        <div class="espaciado">
          <button @click="alternarTienda()">Cerrar tienda</button>
        </div>
      </div>
      <div class="tienda-fondo"></div>
    </div>
    <div class="container">
      <div class="mitad">
        <h2>Estadísticas</h2>
        <p><strong>Enemigos eliminados</strong>: {{ formatoNumero(this.totalDrops) }}</p>
        <p><strong>Créditos</strong>: {{ this.formatoNumero(this.creditoTotal) }}¢ <button @click="alternarTienda()">Mostrar tienda</button></p>
        <span title="Rango 1" class="muestra r1">{{ estadisticas.r1 }}</span>
        <span title="Rango 2" class="muestra r2">{{ estadisticas.r2 }}</span>
        <span title="Rango 3" class="muestra r3">{{ estadisticas.r3 }}</span>
        <span title="Rango 4" class="muestra r4">{{ estadisticas.r4 }}</span>
        <span title="Rango 5" class="muestra r5">{{ estadisticas.r5 }}</span>
        <span title="Único" class="muestra unico">{{ estadisticas.unico }}</span>
        <p>
          <strong>Vida</strong>: {{ formatoNumero(total('vida')) }}
          | <strong>Ataque</strong>: {{ formatoNumero(total('atq')) }}
          <!-- | <strong>Defensa</strong>: {{ total('def') }} -->
        </p>
        <div class="progress-bar-container vida">
          <div class="progress-bar" :style="'width: ' + porcentageVidaJugador + '%'"></div>
        </div>
      </div>
      <div class="mitad">
        <div class="log-container">
          <h2>Log</h2>
          <p v-for="p in historico" class="linea" :class="p.clase">{{ p.fecha }}: {{ p.texto }}</p>
        </div>
      </div>
    </div>

    <div class="container">
      <div class="mitad">
        <h2 v-if="equipado">Equipado</h2>
        <div v-if="equipado" class="item" :class="clasesDeObjeto(equipado)" :title="tituloDeObjeto(equipado, true)">
          <button @click="equipado = null">Desequipar</button>
          <small>
            <span class="item-stat" :class="[ equipado && atributosBase.atqJugador + equipado.estadisticas.atq >= atributosBase.atqJugador + equipado.estadisticas.atq ? 'r1' : 'r2' ]">a: {{ formatoNumero(equipado.estadisticas.atq) }}</span>
            <!-- <span class="item-stat" :class="[ equipado && atributosBase.defJugador + equipado.estadisticas.def >= atributosBase.defJugador + equipado.estadisticas.def ? 'r1' : 'r2' ]">d: {{ formatoNumero(equipado.estadisticas.def) }}</span> -->
            <span class="item-stat" :class="[ equipado && atributosBase.vidaJugador + equipado.estadisticas.vida >= atributosBase.vidaJugador + equipado.estadisticas.vida ? 'r1' : 'r2' ]">
              v: {{ formatoNumero(equipado.estadisticas.vida) }}
              <span class="contenedor-vida-item">
                <span class="item-porcentage-vida" :style="`width: ${porcentageVidaObjetoEquipado}%;`"></span>
              </span>
            </span>
          </small>
          {{ equipado.nombre }} (p: {{ equipado.estadisticas.precio }}¢)
        </div>
        <h2>Bolsa de pociones <small>{{ bolsaPociones.length }}/{{ capacidadMaximaBolsaPociones }}</small></h2>
        <div class="pocion" :class="pocion.campo" v-for="pocion of bolsaPociones">
          <button @click="usarPocion(pocion)">Usar</button>
          {{ pocion.nombre }} {{ pocion.permanente ? 'permanente' : '' }} (+{{ formatoNumero(pocion.incremento) }})
        </div>
        <h2>Inventario <small>{{inventario.length}}/{{capacidadMaxima}}</small></h2>
        <div class="item" v-for="objeto of inventario" :class="clasesDeObjeto(objeto)" :title="tituloDeObjeto(objeto, true)">
          <button @click="equipar(objeto)" :disabled="estaEquipado(objeto)">Equipar</button>
          <button @click="venderObjeto(objeto)":disabled="estaEquipado(objeto)">Vender</button>
          <small>
            <span class="item-stat" :class="[ equipado && atributosBase.atqJugador + equipado.estadisticas.atq >= atributosBase.atqJugador + objeto.estadisticas.atq ? 'r1' : 'r2' ]">a: {{ formatoNumero(objeto.estadisticas.atq) }}</span>
            <!-- <span class="item-stat" :class="[ equipado && atributosBase.defJugador + equipado.estadisticas.def >= atributosBase.defJugador + objeto.estadisticas.def ? 'r1' : 'r2' ]">d: {{ formatoNumero(objeto.estadisticas.def) }}</span> -->
            <span class="item-stat" :class="[ equipado && atributosBase.vidaJugador + equipado.estadisticas.vida >= atributosBase.vidaJugador + objeto.estadisticas.vida ? 'r1' : 'r2' ]">v: {{ formatoNumero(objeto.estadisticas.vida) }}</span>
          </small>
          {{ objeto.nombre }} (p: {{ objeto.estadisticas.precio }}¢)
        </div>
      </div>

      <div class="mitad">
        <template v-if="monstruoActivo">
          <h2>Enemigo</h2>
          <p v-if="monstruoActivo && monstruoActivo.vida > 0"><button @click="golpearMonstruoActivo()" :disabled="monstruoActivo.atacando">¡Atacar enemigo!</button></p>
          <p v-else><button @click="generaMonstruoActivo()">¡Nuevo enemigo!</button></p>
          <div class="progress-bar-container vida">
            <div class="progress-bar" :style="'width: ' + porcentageVidaEnemigo + '%'"></div>
          </div>
          <Monstruo :datos="monstruoActivo"></Monstruo>
        </template>
        <div v-if="dropActual.length">
          <h2>Recompensas</h2>
          <strong>Créditos:</strong> {{ formatoNumero(monstruoActivo.creditos) }}¢
          <div v-for="objeto of dropActual" class="item" :class="clasesDeObjeto(objeto)" :title="tituloDeObjeto(objeto)">
            <button @click="agregarAlInventario(objeto)">Recoger</button>
            <small>
              <span class="item-stat" :class="[ equipado && atributosBase.atqJugador + equipado.estadisticas.atq >= atributosBase.atqJugador + objeto.estadisticas.atq ? 'r1' : 'r2' ]">a: {{ formatoNumero(objeto.estadisticas.atq) }}</span>
              <!-- <span class="item-stat" :class="[ equipado && atributosBase.defJugador + equipado.estadisticas.def >= atributosBase.defJugador + objeto.estadisticas.def ? 'r1' : 'r2' ]">d: {{ formatoNumero(objeto.estadisticas.def) }}</span> -->
              <span class="item-stat" :class="[ equipado && atributosBase.vidaJugador + equipado.estadisticas.vida >= atributosBase.vidaJugador + objeto.estadisticas.vida ? 'r1' : 'r2' ]">v: {{ formatoNumero(objeto.estadisticas.vida) }}</span>
            </small>
            {{ objeto.nombre }} ({{ objeto.estadisticas.precio }}¢)
          </div>
        </div>
        <div v-for="pocion of dropPociones" class="pocion" :class="pocion.campo">
          <button @click="agregarAlInventario(pocion)">Recoger</button>
          {{ pocion.nombre }} {{ pocion.permanente ? 'permanente' : '' }} (+{{ formatoNumero(pocion.incremento) }})
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  import Monstruo from './components/Monstruo.vue'

  export default {
    name: 'app',
    components: { Monstruo },
    computed: {
      porcentageVidaJugador(){
        let totalInicial = this.atributosBase.vidaJugador + this.atributosBase.vidaPociones + (this.equipado ? this.equipado.estadisticas.vida : 0)
        return Math.round(this.total('vida') * 100 / totalInicial)
      },
      porcentageVidaEnemigo(){
        return Math.round(this.monstruoActivo.vida * 100 / this.monstruoActivo.vidaInicial)
      },
      porcentageVidaObjetoEquipado(){
        return Math.round(this.equipado.estadisticas.vida * 100 / this.equipado.estadisticas.vidaInicial)
      }
    },
    data: () => { return {
      monstruoActivo: null,
      creditoTotal: 0,
      atributos: {
        vida: 6,
        atq: 1,
        def: 0
      },
      atributosBase: {
        vidaJugador: 6,
        atqJugador: 1,
        defJugador: 0,

        atqPociones: 0,
        vidaPociones: 0,

        vidaEnemigo: 5,
        atqEnemigo: 1,
        defEnemigo: 0,

        vidaJugadorFloat: 6,
        atqJugadorFloat: 1,
        defJugadorFloat: 0,

        vidaEnemigoFloat: 5,
        atqEnemigoFloat: 1,
        defEnemigoFloat: 0,

        incrementoObjetos: 0.1
      },
      capacidadMaximaBolsaPociones: 3,
      bolsaPociones: [],
      inventario: [],
      dropActual: [],
      dropPociones: [],
      equipado: null,
      capacidadMaxima: 5,
      totalDrops: 0,
      datos: {
        'p1': [ 'Vara', 'Hacha', 'Arco', 'Daga', 'Martillo', 'Báculo', 'Espada', 'Teclado', 'Cosa' ],
        'p2': [ 'de la oscuridad', 'de la luz', 'ardiente', 'de la naturaleza', 'de los muertos', 'de Nico', 'de las leyendas', 'de noobs', 'inútil', 'guapal' ],
        'p3': [ 'para mancos', 'que no sirve pa ná' ]
      },
      nivelMax: 150,
      estadisticas: {
        r1: 0,
        r2: 0,
        r3: 0,
        r4: 0,
        r5: 0,
        unico: 0
      },
      historico: [],
      tienda: {
        mostrando: false,
        pociones: [],
        objetos: []
      }
    } },
    methods: {
      alternarTienda(){
        this.$set(this.tienda, 'mostrando', !this.tienda.mostrando)
      },
      rellenarTienda(){
        this.tienda = {
          pociones: [],
          objetos: []
        }

        this.tienda.objetos.push(this.generaObjeto())
        this.tienda.objetos.push(this.generaObjeto())
        this.tienda.objetos.push(this.generaObjeto())

        this.tienda.objetos = this.tienda.objetos.sort((a, b) => {
          if (a.estadisticas.precio < b.estadisticas.precio) return -1
          if (a.estadisticas.precio > b.estadisticas.precio) return 1
          return 0
        })

        this.tienda.pociones.push(this.generaPocion())
        this.tienda.pociones.push(this.generaPocion())
        this.tienda.pociones.push(this.generaPocion())

        this.log('¡Tienda renovada!', 'info')
      },
      venderObjeto(objeto){
        this.creditoTotal += objeto.estadisticas.precio
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
        this.historico.unshift({ fecha, texto, clase })
        if(this.historico.length > 5) this.historico.length = 5
      },
      generaMonstruoActivo(){
        this.dropActual = []
        this.dropPociones = []
        const esJefe = this.random(1, 10) === 5
        this.monstruoActivo = {
          vidaInicial: this.atributosBase.vidaEnemigo * (esJefe ? 2 : 1),
          vida: this.atributosBase.vidaEnemigo * (esJefe ? 2 : 1),
          atq: this.atributosBase.atqEnemigo,
          def: this.atributosBase.atqEnemigo * (esJefe ? 2 : 1),
          atacando: false,
          esJefe,
          creditos: Math.ceil(this.atributosBase.vidaEnemigo / 3)
        }
      },
      golpearMonstruoActivo(){
        let totalAtaque = this.total('atq')
        if(this.random(1, 10) <= 2){
          totalAtaque = Math.round(totalAtaque * 1.5)
          this.log(`¡Golpe crítico! (${totalAtaque})`, 'critico')
        }
        let probDefensa = this.random(0, this.monstruoActivo.def)
         // El enemigo defiende
        if(false && probDefensa > this.monstruoActivo.def / 5){
          let porcentageDefensa = (this.random(0, this.monstruoActivo.def) / 100) + 1
          let ataqueAbsorvido = Math.round(totalAtaque * porcentageDefensa)
          let restoAtaque = this.monstruoActivo.def - totalAtaque
          let restoAtaqueNoAbsorvido = 0

          this.monstruoActivo.def -= ataqueAbsorvido

          if(this.monstruoActivo.def < 0){
            restoAtaqueNoAbsorvido = restoAtaqueNoAbsorvido * -1
            this.monstruoActivo.def = 0
          }

          this.monstruoActivo.vida -= restoAtaque + restoAtaqueNoAbsorvido

          log(`total daño: ${this.total('atq')} | Absorvido: ${ataqueAbsorvido} | Resto no absorvido: ${restoAtaqueNoAbsorvido} | Resto ataque: ${restoAtaque}`, 'info')

        }else{
          this.monstruoActivo.vida -= totalAtaque
        }
        if(this.monstruoActivo.vida <= 0){
          this.monstruoActivo.vida = 0
          this.creditoTotal += this.monstruoActivo.creditos
          this.nuevoDrop()
          this.aumentarAtributosBase()
          this.establecerAtributos()
          if(this.totalDrops % 5 === 0){
            this.rellenarTienda()
          }
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
          return this.log('¡Has esquivado el ataque!', 'normal')
        }
        // Defensa
        let probDefensa = this.random(0, this.total('def'))
        if(false && probDefensa > this.total('def') / 5){
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
          }
        }else{
          this.reducirAtributo('vida', this.monstruoActivo.atq)
        }

        if(this.total('vida') <= 0){
          this.establecerAtributos()
          this.generaMonstruoActivo()
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
        this.atributosBase.vidaJugadorFloat *= 1.1
        this.atributosBase.atqJugadorFloat *= 1.1
        this.atributosBase.defJugadorFloat *= 1.1

        this.atributosBase.vidaEnemigoFloat *= 1.1
        this.atributosBase.atqEnemigoFloat *= 1.1
        this.atributosBase.defEnemigoFloat *= 1.1

        this.atributosBase.vidaJugador = Math.round(this.atributosBase.vidaJugadorFloat)
        this.atributosBase.atqJugador = Math.round(this.atributosBase.atqJugadorFloat)
        this.atributosBase.defJugador = Math.round(this.atributosBase.defJugadorFloat)

        this.atributosBase.vidaEnemigo = Math.round(this.atributosBase.vidaEnemigoFloat)
        this.atributosBase.atqEnemigo = Math.round(this.atributosBase.atqEnemigoFloat)
        this.atributosBase.defEnemigo = Math.round(this.atributosBase.defEnemigoFloat)

        this.atributosBase.incrementoObjetos = this.totalDrops / 15
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
        this.equipado = objeto
      },
      clasesDeObjeto(objeto){
        return objeto.clase + (objeto.unico ? ' unico' : '')
      },
      desechar(objeto){
        this.inventario = this.inventario.filter(i => i.id !== objeto.id)
        if(this.equipado && objeto.id === this.equipado.id) this.equipado = null
      },
      estaEquipado(objeto){
        return this.equipado && objeto.id === this.equipado.id
      },
      agregarAlInventario(objeto){
        if(objeto.tipo && objeto.tipo === 'pocion'){
          if(this.bolsaPociones.length >= this.capacidadMaximaBolsaPociones){
            return this.log('¡No tienes hueco en la bolsa de pociones!', 'normal')
          }
          this.bolsaPociones.push(objeto)
          return this.eliminarDelDropPociones(objeto.id)
        }
        if(this.inventario.length >= this.capacidadMaxima){
          return this.log('¡No tienes hueco en el inventario!', 'normal')
        }
        this.inventario.push(objeto)
        this.eliminarDelDrop(objeto.id)
      },
      eliminarDelDrop(id){
        this.dropActual = this.dropActual.filter(i => i.id !== id)
      },
      eliminarDelDropPociones(id){
        this.dropPociones = this.dropPociones.filter(p => p.id !== id)
      },
      nuevoDrop(){
        this.dropActual = []
        this.totalDrops++
        let objetosPorDrop = this.random(1, 5)
        if(this.monstruoActivo.esJefe){
          objetosPorDrop = 5
        }
        for(let i = 0; i < objetosPorDrop; i++) this.nuevoObjeto()

        this.dropPociones = []
        if(this.random(1, 10) > 8){
          const nPociones = this.random(1, 2)
          for(let p = 0; p < nPociones; p++){
            this.dropPociones.push(this.generaPocion())
          }
        }
      },
      nuevoObjeto(){
        this.dropActual.unshift(this.generaObjeto())
        if(this.inventario.length > this.capacidadMaxima) this.inventario.length = this.capacidadMaxima
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

        nombre += ` [nivel ${nivel}]`
        let clase = 'r1'
        if(nivel >= this.nivelMax / 5){
          clase = 'r2'
        }
        if(nivel >= this.nivelMax / 3){
          clase = 'r3'
        }
        if(nivel >= this.nivelMax / 2){
          clase = 'r4'
        }
        if(nivel === this.nivelMax){
          clase = 'r5'
        }
        this.estadisticas[clase]++
        if(unico) this.estadisticas.unico++
        const objeto = {
          nombre,
          nivel,
          unico,
          clase,
          id,
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

        // Temporalmente desactivada
        def = 0
        precio = Math.round((atq + vida + def) / (objeto.unico ? 1 : 2))

        return { atq, def, vida, 'vidaInicial': vida, precio }
      },
      generaPocion(){
        let tipos = [
          {
            'nombre': 'Poción de vida',
            'campo': 'vida',
            'incremento': 1
          },
          {
            'nombre': 'Poción de ataque',
            'campo': 'atq',
            'incremento': 1
          }
        ]

        if(this.random(1, 100) > 95){ // 5%
          tipos = [
            {
              'nombre': 'Bolsa de pociones',
              'campo': 'capacidadMaximaBolsaPociones',
              'usable': true,
              'incremento': 1
            },
            {
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
        pocion.permanente = this.random(1, 15) > 13
        pocion.precio = Math.ceil(pocion.incremento * (this.atributosBase.incrementoObjetos + 1))
        if(pocion.permanente){
          pocion.precio *= 3
        }
        return pocion
      },
      usarPocion(pocion){
        if(pocion.usable){
          this[pocion.campo] += pocion.incremento
          this.bolsaPociones = this.bolsaPociones.filter(p => p.id !== pocion.id)
          return
        }
        if(pocion.permanente){
          this.atributosBase[`${pocion.campo}Pociones`] += pocion.incremento
        }else{
          this.atributos[pocion.campo] += pocion.incremento
        }
        this.bolsaPociones = this.bolsaPociones.filter(p => p.id !== pocion.id)
      },
      comprarObjeto(objeto){
        if(objeto.tipo === 'pocion'){
          this.creditoTotal -= objeto.precio
          this.tienda.pociones = this.tienda.pociones.filter(p => p.id !== objeto.id)
        }else{
          this.creditoTotal -= objeto.estadisticas.precio
          this.tienda.objetos = this.tienda.objetos.filter(o => o.id !== objeto.id)
        }
        this.agregarAlInventario(objeto)
      }
    },
    mounted(){
      this.generaMonstruoActivo()
      this.rellenarTienda()
    }
  }
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
    font-size: 14px;
  }
  .tienda {
    position: fixed;
    top: 15%;
    width: 750px;
    background-color: #fff;
    border: 1px solid rgba(0, 0, 0, .2);
    padding: 20px;
    left: 50%;
    margin-left: -375px;
    z-index: 2;
  }
  .tienda h2 {
    text-align: left;
  }
  .tienda-fondo {
    background-color: rgba(0, 0, 0, .5);
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1;
  }
  .espaciado {
    margin: 10px;
  }
  .container {
    width: 1200px;
    margin: 10px auto;
    overflow: hidden;
    padding: 10px;
  }
  .mitad {
    width: 50%;
    float: left;
  }
  .item, .pocion {
    padding: 5px;
    border: 1px solid rgba(0, 0, 0, .1);
    margin: 2px;
    text-align: left;
  }
  .unico {
    border-color: gold;
    box-shadow: 0 0 3px gold;
    color: #8a7400 !important;
  }
  .r1 {
    color: grey;
  }
  .r2 {
    color: green;
  }
  .r3 {
    color: blue;
  }
  .r4 {
    color: purple;
  }
  .r5 {
    color: purple;
    box-shadow: 0 0 3px purple
  }
  .muestra {
    display: inline-block;
    padding: 5px 10px;
    cursor: help;
  }
  .item-stat {
    padding: 2px 5px;
    border: 1px solid rgba(0, 0, 0, .2);
    margin: 1px;
    position: relative;
  }
  button {
    cursor: pointer;
  }
  .progress-bar-container {
    margin: 0 auto;
    width: 40%;
    background-color: #EEE;
    padding: 1px;
    border: 1px solid rgba(0, 0, 0, .1);
  }
  .progress-bar {
    height: 10px;
  }
  .progress-bar-container.vida .progress-bar {
    background-color: green;
    -webkit-transition: all .5s;
    -o-transition: all .5s;
    transition: all .5s;
  }
  .log-container {
    overflow: auto;
  }

  .log-container .linea {
    margin: 2px;
    text-align: left;
  }

  .critico {
    color: orangered;
  }
  .normal {
    color: #333;
  }
  .info {
    color: steelblue;
  }

  .contenedor-vida-item {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    top: 0;
  }

  .item-porcentage-vida {
    -webkit-transition: all .5s;
    -o-transition: all .5s;
    transition: all .5s;
    height: 100%;
    background-color: rgba(0, 128, 0, 0.3);
    display: block;
  }

  .pocion.vida {
    color: #0c7f00ff;
    background-color: #e7ffe2ff;
  }
  .pocion.atq {
    color: #c30000ff;
    background-color: #FFE2E2;
  }
  button:disabled {
    opacity: .3;
  }
</style>
