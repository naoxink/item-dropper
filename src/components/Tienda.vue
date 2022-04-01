<template>
  <div v-if="tienda.mostrando">
    <div class="tienda">
      <p>Créditos disponibles: <strong>{{ creditoTotal }}</strong>¢</p>
      <p>La tienda se renovará en <strong>{{ 5 - (totalDrops % 5) }}</strong> muertes</p>
      <div class="contenedor-tienda">
        <div v-if="hayMejorasDisponibles">
          <h2>Mejoras</h2>
          <div class="item" v-if="!recogerLootCompleto">
            <button @click="$store.commit('comprarRecogerLootCompleto', 350)" :disabled="350 > creditoTotal">Comprar</button>
            <small>
              <span class="item-stat unico">Precio: {{ formatoNumero(350) }}¢</span>
            </small>
            Recoger todo el drop con un click
          </div>
          <div class="item" v-if="!equiparMejor">
            <button @click="$store.commit('comprarEquiparMejor', 550)" :disabled="550 > creditoTotal">Comprar</button>
            <small>
              <span class="item-stat unico">Precio: {{ formatoNumero(550) }}¢</span>
            </small>
            Equipa con un click el mejor objeto del inventario
          </div>
          <div class="item" v-if="!venderInventarioCompleto">
            <button @click="$store.commit('comprarVenderInventarioCompleto', 850)" :disabled="850 > creditoTotal">Comprar</button>
            <small>
              <span class="item-stat unico">Precio: {{ formatoNumero(850) }}¢</span>
            </small>
            Vender con un click todos los objetos del inventario de menor rango
          </div>
          <div class="item" v-if="!autoLoot">
            <button @click="$store.commit('comprarAutoLoot', 5000)" :disabled="5000 > creditoTotal">Comprar</button>
            <small>
              <span class="item-stat unico">Precio: {{ formatoNumero(5000) }}¢</span>
            </small>
            Recoger recompensas automáticamente
          </div>
          <div class="item" v-if="!autoEquip">
            <button @click="$store.commit('comprarAutoEquip', 10000)" :disabled="10000 > creditoTotal">Comprar</button>
            <small>
              <span class="item-stat unico">Precio: {{ formatoNumero(10000) }}¢</span>
            </small>
            Equipar objetos de mayor rango automáticamente
          </div>
          <div class="item" v-if="!autoSell">
            <button @click="$store.commit('comprarAutoSell', 15000)" :disabled="15000 > creditoTotal">Comprar</button>
            <small>
              <span class="item-stat unico">Precio: {{ formatoNumero(15000) }}¢</span>
            </small>
            Vender objetos de inventario de inferior rango automáticamente
          </div>
        </div>
        <div>
          <h2>Pociones</h2>
          <div class="item pocion" v-for="pocion of tienda.pociones" :key="pocion.id">
            <button @click="comprarObjeto(pocion)" :disabled="pocion.precio > creditoTotal">Comprar</button>
            <small>
              <span class="item-stat unico">Precio: {{ pocion.precio }}¢</span>
            </small>
            {{ pocion.nombre }} {{ pocion.permanente ? 'permanente' : '' }} (+{{ formatoNumero(pocion.incremento) }})
          </div>
        </div>
        <div>
          <h2>Objetos</h2>
          <Objeto v-for="objeto of tienda.objetos" :objeto="objeto" :enTienda="true" :key="objeto.id"></Objeto>
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
        'inventario',
        'autoLoot',
        'autoSell',
        'autoEquip',
        'recogerLootCompleto',
        'equiparMejor',
        'venderInventarioCompleto',
      ]),
      hayMejorasDisponibles(){
        return !this.autoEquip || !this.autoLoot || !this.autoSell
      }
    }
  }
</script>

<style scoped>
  .contenedor-tienda {
    overflow: hidden
  }
</style>