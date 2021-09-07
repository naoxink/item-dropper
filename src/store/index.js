import Vue from 'vue'
import Vuex from 'vuex'
import mx from '@/mixins'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
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
  },
  mutations: {
    alternarTienda(state){
      state.tienda.mostrando = !state.tienda.mostrando
    },
    vaciarTienda(state){
      state.tienda.objetos = []
      state.tienda.pociones = []
    },
    agregarObjetoTienda(state, obj){
      state.tienda.objetos.push(obj)
    },
    agregarPocionTienda(state, poc){
      state.tienda.pociones.push(poc)
    },
    desecharObjeto(state, objeto){
      state.inventario = state.inventario.filter(i => i.id !== objeto.id)
      if(state.equipado && objeto.id === state.equipado.id) state.equipado = null
    },
    incrementarCreditoTotal(state, cantidad){
      state.creditoTotal += +cantidad
    },
    vaciarDropActual(state){
      state.dropActual = []
      state.dropPociones = []
    },
    establecerMonstruoActivo(state, monstruo){
      state.monstruoActivo = monstruo
    },
    incrementarAtributoMonstruo(state, { estadistica, cantidad }){
      state.monstruoActivo[estadistica] += +cantidad
    },
    decrementarAtributoMonstruo(state, { estadistica, cantidad }){
      state.monstruoActivo[estadistica] -= +cantidad
    },
    aumentarCantidadDrops(state){
      state.totalDrops++
    },
    agregarObjetoADrop(state, objeto){
      state.dropActual.unshift(objeto)
    },
    agregarObjetoAInventario(state, objeto){
      state.inventario.push(objeto)
    },
    agregarPocionADrop(state, pocion){
      state.dropPociones.unshift(pocion)
    },
    caparInventario(state){
      if(state.inventario.length > state.capacidadMaxima){
        state.inventario.length = state.capacidadMaxima
      }
    },
    agregarPocionAInventario(state, pocion){
      state.bolsaPociones.push(pocion)
    },
    incrementarAtributoBase(state, { objetivo, atributo, cantidad }){
      if(state.atributosBase[`${atributo}${objetivo}Float`]){
        state.atributosBase[`${atributo}${objetivo}Float`] *= cantidad
        state.atributosBase[atributo + objetivo] = Math.round(state.atributosBase[`${atributo}${objetivo}Float`])
      }else if(!objetivo && atributo){
        state.atributosBase[atributo] += cantidad
      }
    },
    incrementarAtributo(state, { atributo, cantidad }){
      state.atributos[atributo] += cantidad
    },
    equiparObjeto(state, objeto){
      state.equipado = objeto
    },
    desequiparObjeto(state, objeto){
      // Aquí paso el objeto para cuando haya más
      // ranuras de equipamiento, no sólo el arma.
      state.equipado = null
    },
    eliminarPocionDeDrop(state, pocion){
      state.dropPociones = state.dropPociones.filter(p => p.id !== pocion.id)
    },
    eliminarPocionDeInventario(state, pocion){
      state.bolsaPociones = state.bolsaPociones.filter(p => p.id !== pocion.id)
    },
    eliminarPocionDeTienda(state, pocion){
      state.tienda.pociones = state.tienda.pociones.filter(p => p.id !== pocion.id)
    },
    eliminarObjetoDeDrop(state, objeto){
      state.dropActual = state.dropActual.filter(p => p.id !== objeto.id)
    },
    usarPocion(state, pocion){
      state[pocion.campo] += pocion.incremento
    },
    eliminarObjetoDeTienda(state, objeto){
      state.tienda.objetos = state.tienda.objetos.filter(o => o.id !== objeto.id)
    },
    agregarAHistorico(state, obj){
      state.historico.unshift(obj)
      if(state.historico.length > 5) state.historico.length = 5
    }
  }
})