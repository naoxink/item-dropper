<template>
  <div id="app">
    <Tienda></Tienda>
    <div class="container">
      <div class="mitad">
        <Jugador></Jugador>
      </div>
      <div class="mitad">
        <Log></Log>
      </div>
    </div>

    <div class="container">
      <div class="mitad">
        <Inventario></Inventario>
      </div>

      <div class="mitad">
        <Monstruo :datos="monstruoActivo"></Monstruo>
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
  import Jugador from './components/Jugador.vue'
  import Tienda from './components/Tienda.vue'
  import Log from './components/Log.vue'
  import Inventario from './components/Inventario.vue'
  import mx from '@/mixins'
  import { mapState } from 'vuex'

  export default {
    name: 'app',
    mixins: [ mx ],
    components: { Monstruo, Jugador, Tienda, Log, Inventario },
    computed: {
      ...mapState([
        'tienda',
        'monstruoActivo',
        'atributos',
        'atributosBase',
        'creditoTotal',
        'dropActual',
        'dropPociones',
        'inventario',
        'bolsaPociones',
        'capacidadMaximaBolsaPociones',
        'equipado',
        'capacidadMaxima',
        'totalDrops',
        'datos',
        'nivelMax',
        'estadisticas',
        'historico',
      ])
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
