<template>
  <div class="pocion" :class="pocion.campo">
    <button @click="onclick(pocion)">{{ accion }}</button>
    {{ pocion.nombre }} {{ pocion.permanente ? 'permanente' : '' }} (+{{ formatoNumero(pocion.incremento) }})
  </div>
</template>

<script>
  import mx from '@/mixins'
  export default {
    name: 'Pocion',
    props: [ 'pocion', 'onclick', 'accion' ],
    mixins: [ mx ]
  }
</script>