<template>
  <div class="monstruo" v-if="datos">
    <h2>Enemigo</h2>
    <p v-if="datos && datos.vida > 0"><button @click="golpearMonstruoActivo()" :disabled="datos.atacando">¡Atacar enemigo!</button></p>
    <p v-else><button @click="generaMonstruoActivo()">¡Nuevo enemigo!</button></p>
    <div class="progress-bar-container vida">
      <div class="progress-bar" :style="'width: ' + porcentageVidaEnemigo + '%'"></div>
    </div>
    <p>Vida: {{ formatoNumero(datos.vida) }} | Ataque: {{ formatoNumero(datos.atq) }}<!--  | Defensa: {{ datos.def }} --></p>
    <p v-if="datos.esJefe"><small style="color: red;"><strong>¡Es un jefe poderoso!</strong></small></p>
  </div>
</template>

<script>
  import mx from '@/mixins'
  import { mapState } from 'vuex'

  export default {
    name: 'Monstruo',
    props: [ 'datos' ],
    mixins: [ mx ],
    computed: {
      ...mapState([
        'monstruoActivo',
        'atributos',
        'atributosBase',
        'totalDrops',
        'nivelMax',
        'estadisticas',
        'inventario'
      ]),
      porcentageVidaEnemigo(){
        return Math.round(this.datos.vida * 100 / this.datos.vidaInicial)
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
