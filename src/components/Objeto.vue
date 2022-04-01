<template>
  <div class="item" :class="clasesDeObjeto(objeto)" :title="tituloDeObjeto(objeto)">
    <button v-if="enDrop" @click="agregarAlInventario(objeto)">Recoger</button>

    <button v-if="enInventario" @click="equipar(objeto)" :disabled="estaEquipado(objeto)">Equipar</button>
    <button v-if="enInventario" @click="venderObjeto(objeto)" :disabled="estaEquipado(objeto)">Vender</button>

    <button v-if="enTienda" @click="comprarObjeto(objeto)" :disabled="objeto.precio > creditoTotal">Comprar</button>

    <small>
      <span class="item-stat" v-if="objeto.tieneAutoataque">🔨</span>
      <span class="item-stat" :class="[ equipado && atributosBase.atqJugador + equipado.estadisticas.atq >= atributosBase.atqJugador + objeto.estadisticas.atq ? 'r1' : 'r2' ]">a: {{ formatoNumero(objeto.estadisticas.atq) }}</span>
      <span class="item-stat" :class="[ equipado && atributosBase.defJugador + equipado.estadisticas.def >= atributosBase.defJugador + objeto.estadisticas.def ? 'r1' : 'r2' ]">d: {{ formatoNumero(objeto.estadisticas.def) }}</span>
      <span class="item-stat" :class="[ equipado && atributosBase.vidaJugador + equipado.estadisticas.vida >= atributosBase.vidaJugador + objeto.estadisticas.vida ? 'r1' : 'r2' ]">v: {{ formatoNumero(objeto.estadisticas.vida) }}</span>
    </small>
    {{ objeto.nombre }} ({{ objeto.precio }}¢)
  </div>
</template>

<script>
  import mx from '@/mixins'
  import { mapState } from 'vuex'
  export default {
    name: 'Objeto',
    props: [ 'objeto', 'enInventario', 'enTienda', 'enDrop' ],
    mixins: [ mx ],
    computed: {
      ...mapState([
        'atributosBase',
        'equipado',
        'inventario',
        'creditoTotal',
        'capacidadMaxima',
      ])
    }
  }
</script>