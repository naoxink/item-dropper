<template>
  <div class="drops">
    <div v-if="dropActual.length">
      <h2>Recompensas</h2>
      <strong>Créditos:</strong> {{ formatoNumero(monstruoActivo.creditos) }}¢
      <Objeto v-for="objeto of dropActual" :objeto="objeto" :enDrop="true"></Objeto>
    </div>
    <Pocion v-for="pocion of dropPociones" :pocion="pocion" :onclick="agregarAlInventario" accion="Recoger" :key="`dp-${pocion.id}`"></Pocion>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import mx from '@/mixins'
  import Pocion from '@/components/Pocion.vue'
  import Objeto from '@/components/Objeto.vue'

  export default {
    name: 'Drop',
    mixins: [ mx ],
    components: { Pocion, Objeto },
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