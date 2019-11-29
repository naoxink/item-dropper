<template>
  <div class="monstruo">
    <p>Vida: {{ formatoNumero(datos.vida) }} | Ataque: {{ formatoNumero(datos.atq) }}<!--  | Defensa: {{ datos.def }} --></p>
    <p v-if="datos.esJefe"><small style="color: red;"><strong>¡Es un jefe poderoso!</strong></small></p>
  </div>
</template>

<script>
export default {
  name: 'Monstruo',
  props: [ 'datos' ],
  methods: {
    formatoNumero(n){
      return n.toLocaleString()
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
