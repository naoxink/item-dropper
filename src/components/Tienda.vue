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
          <Objeto v-for="objeto of tienda.objetos" :objeto="objeto" :enTienda="true"></Objeto>
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
  import Pocion from '@/components/Pocion.vue'
  import Objeto from '@/components/Objeto.vue'

  export default {
    name: 'Tienda',
    components: { Pocion, Objeto },
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