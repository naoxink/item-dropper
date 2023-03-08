<template>
  <div class="monstruo" v-if="enemigo">
    <h2>Oleada actual: {{ (this.totalDrops + 1) % 15 === 0 ? '15' : (this.totalDrops + 1) % 15 }}/15</h2>
    <h2>Enemigo</h2>
    <p v-if="enemigo && enemigo.totalEstadistica('vida') > 0"><button @click="golpearMonstruoActivo()">¡Atacar enemigo!</button></p>
    <p v-else><button @click="generaMonstruoActivo()">¡Nuevo enemigo!</button></p>
    <div class="progress-bar-container vida">
      <div class="progress-bar" :style="'width: ' + porcentageVidaEnemigo + '%'"></div>
    </div>
    <p>Vida: {{ formatoNumero(enemigo.totalEstadistica('vida')) }} | Ataque: {{ formatoNumero(enemigo.totalEstadistica('atq')) }} | Defensa: {{ enemigo.totalEstadistica('def') }}</p>
    <p v-if="enemigo.totalEstadistica('esJefe')"><small style="color: red;"><strong>¡Es un jefe poderoso!</strong></small></p>
  </div>
</template>

<script>
  import mx from '@/mixins'
  import { mapState } from 'vuex'

  export default {
    name: 'Monstruo',
    props: [ 'enemigo' ],
    mixins: [ mx ],
    computed: {
      ...mapState([
        'monstruoActivo',
        'atributos',
        'atributosBase',
        'totalDrops',
        'nivelMax',
        'estadisticas',
        'inventario',
        'bolsaPociones',
        'datos',
        'equipado',
        'autoLoot',
        'autoEquip',
        'autoSell',
        'dropActual',
        'dropPociones',
        'capacidadMaxima',
        'capacidadMaximaBolsaPociones',
        'jugador'
      ]),
      porcentageVidaEnemigo(){
        return Math.round(this.enemigo.totalEstadistica('vida') * 100 / this.enemigo.totalEstadisticaInicial('vida'))
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
