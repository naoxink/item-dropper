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
        <Jugador></Jugador>
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
            <span class="item-stat" :class="[ equipado && atributosBase.defJugador + equipado.estadisticas.def >= atributosBase.defJugador + equipado.estadisticas.def ? 'r1' : 'r2' ]">d: {{ formatoNumero(equipado.estadisticas.def) }}</span>
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
  import Jugador from './components/Jugador.vue'
  import mx from '@/mixins'
  import { mapState } from 'vuex'

  export default {
    name: 'app',
    mixins: [ mx ],
    components: { Monstruo, Jugador },
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
      ]),
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
    mounted(){
      this.generaMonstruoActivo()
      this.rellenarTienda()
      this.agregarAlInventario(this.generaPocion()) // TEST
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
