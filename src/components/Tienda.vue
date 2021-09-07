<template>
  <div v-if="tienda.mostrando">
    <div class="tienda">
      <p>Créditos disponibles: <strong>{{ creditoTotal }}</strong>¢</p>
      <p>La tienda se renovará en <strong>{{ 5 - (totalDrops % 5) }}</strong> muertes</p>
      <div class="contenedor-tienda">
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
</template>

<script>
  import mx from '@/mixins'
  import { mapState } from 'vuex'

  export default {
    name: 'Tienda',
    mixins: [ mx ],
    computed: {
      ...mapState([
        'atributosBase',
        'tienda',
        'creditoTotal',
        'totalDrops',
        'equipado',
        'bolsaPociones',
        'inventario'
      ])
    }
  }
</script>

<style scoped>
  .contenedor-tienda {
    overflow: hidden
  }
</style>