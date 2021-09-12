<template>
  <div class="monstruo" v-if="datosMonstruo">
    <h2>Enemigo</h2>
    <p v-if="datosMonstruo && datosMonstruo.vida > 0"><button @click="golpearMonstruoActivo()" :disabled="datosMonstruo.atacando">¡Atacar enemigo!</button></p>
    <p v-else><button @click="generaMonstruoActivo()">¡Nuevo enemigo!</button></p>
    <div class="progress-bar-container vida">
      <div class="progress-bar" :style="'width: ' + porcentageVidaEnemigo + '%'"></div>
    </div>
    <p>Vida: {{ formatoNumero(datosMonstruo.vida) }} | Ataque: {{ formatoNumero(datosMonstruo.atq) }} | Defensa: {{ datosMonstruo.def }}</p>
    <p v-if="datosMonstruo.esJefe"><small style="color: red;"><strong>¡Es un jefe poderoso!</strong></small></p>
  </div>
</template>

<script>
  import mx from '@/mixins'
  import { mapState } from 'vuex'

  export default {
    name: 'Monstruo',
    props: [ 'datosMonstruo' ],
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
        'datos',
        'equipado'
      ]),
      porcentageVidaEnemigo(){
        return Math.round(this.datosMonstruo.vida * 100 / this.datosMonstruo.vidaInicial)
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
