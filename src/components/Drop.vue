<template>
  <div class="drops">
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
    <Pocion v-for="pocion of dropPociones" :pocion="pocion" :onclick="agregarAlInventario" accion="Recoger" :key="`dp-${pocion.id}`"></Pocion>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import mx from '@/mixins'
  import Pocion from '@/components/Pocion.vue'

  export default {
    name: 'Drop',
    mixins: [ mx ],
    components: { Pocion },
    computed: {
      ...mapState([
        'dropActual',
        'monstruoActivo',
        'equipado',
        'atributosBase',
        'dropPociones',
        'inventario',
        'bolsaPociones'
      ])
    }
  }
</script>