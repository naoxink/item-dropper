<template>
  <div id="app">
    <Tienda></Tienda>
    <div class="container">
      <div class="mitad">
        <Jugador></Jugador>
      </div>
      <div class="mitad">
        <Monstruo :datosMonstruo="monstruoActivo"></Monstruo>
        <Drop></Drop>
      </div>
    </div>

    <div class="container">
      <div class="mitad">
        <Inventario></Inventario>
      </div>

      <div class="mitad">
        <Log></Log>
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
  import Drop from './components/Drop.vue'
  import mx from '@/mixins'
  import { mapState } from 'vuex'

  export default {
    name: 'app',
    mixins: [ mx ],
    components: { Monstruo, Jugador, Tienda, Log, Inventario, Drop },
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
    /*width: 1200px;*/
    width: 100%;
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
