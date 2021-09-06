<template>
  <div class="monstruo">
    <div class="progress-bar-container vida">
      <div class="progress-bar" :style="'width: ' + porcentageVidaEnemigo + '%'"></div>
    </div>
    <p>Vida: {{ formatoNumero(datos.vida) }} | Ataque: {{ formatoNumero(datos.atq) }}<!--  | Defensa: {{ datos.def }} --></p>
    <p v-if="datos.esJefe"><small style="color: red;"><strong>¡Es un jefe poderoso!</strong></small></p>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import mx from '@/mixins'

  export default {
    name: 'Monstruo',
    props: [ 'datos' ],
    mixins: [ mx ],
    computed: {
      ...mapState([
        'monstruoActivo'
      ]),
      porcentageVidaEnemigo(){
        return Math.round(this.monstruoActivo.vida * 100 / this.monstruoActivo.vidaInicial)
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
