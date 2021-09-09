<template>
  <div class="inventario">
    <h2 v-if="equipado">Equipado</h2>
    <div v-if="equipado" class="item" :class="clasesDeObjeto(equipado)" :title="tituloDeObjeto(equipado, true)">
      <button @click="$store.commit('desequiparObjeto', equipado)">Desequipar</button>
      <small>
        <span class="item-stat" :class="[ equipado && atributosBase.atqJugador + equipado.estadisticas.atq >= atributosBase.atqJugador + equipado.estadisticas.atq ? 'r1' : 'r2' ]">a: {{ formatoNumero(equipado.estadisticas.atq) }}</span>
        <span class="item-stat" :class="[ equipado && atributosBase.defJugador + equipado.estadisticas.def >= atributosBase.defJugador + equipado.estadisticas.def ? 'r1' : 'r2' ]">d: {{ formatoNumero(equipado.estadisticas.def) }}</span>
        <span class="item-stat" :class="[ equipado && atributosBase.vidaJugador + equipado.estadisticas.vida >= atributosBase.vidaJugador + equipado.estadisticas.vida ? 'r1' : 'r2' ]">
          v: {{ formatoNumero(equipado.estadisticas.vida) }}
          <span class="contenedor-vida-item">
            <span class="item-porcentage-vida" :style="`width: ${porcentageVidaObjetoEquipado}%;`"></span>
          </span>
        </span>
      </small>
      {{ equipado.nombre }} (p: {{ equipado.estadisticas.precio }}¢)
    </div>

    <h2>Bolsa de pociones <small>{{ bolsaPociones.length }}/{{ capacidadMaximaBolsaPociones }}</small></h2>
    <Pocion v-for="pocion of bolsaPociones" :pocion="pocion" :key="`bp-${pocion.id}`" accion="Usar" :onclick="usarPocion"></Pocion>

    <h2>Inventario <small>{{inventario.length}}/{{capacidadMaxima}}</small></h2>
    <div class="item" v-for="objeto of inventario" :class="clasesDeObjeto(objeto)" :title="tituloDeObjeto(objeto, true)">
      <button @click="equipar(objeto)" :disabled="estaEquipado(objeto)">Equipar</button>
      <button @click="venderObjeto(objeto)":disabled="estaEquipado(objeto)">Vender</button>
      <small>
        <span class="item-stat" :class="[ equipado && atributosBase.atqJugador + equipado.estadisticas.atq >= atributosBase.atqJugador + objeto.estadisticas.atq ? 'r1' : 'r2' ]">a: {{ formatoNumero(objeto.estadisticas.atq) }}</span>
        <!-- <span class="item-stat" :class="[ equipado && atributosBase.defJugador + equipado.estadisticas.def >= atributosBase.defJugador + objeto.estadisticas.def ? 'r1' : 'r2' ]">d: {{ formatoNumero(objeto.estadisticas.def) }}</span> -->
        <span class="item-stat" :class="[ equipado && atributosBase.vidaJugador + equipado.estadisticas.vida >= atributosBase.vidaJugador + objeto.estadisticas.vida ? 'r1' : 'r2' ]">v: {{ formatoNumero(objeto.estadisticas.vida) }}</span>
      </small>
      {{ objeto.nombre }} (p: {{ objeto.estadisticas.precio }}¢)
    </div>

  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import mx from '@/mixins'
  import Pocion from '@/components/Pocion.vue'
  export default {
    name: 'Inventario',
    components: { Pocion },
    mixins: [ mx ],
    computed: {
      ...mapState([
        'inventario',
        'atributosBase',
        'equipado',
        'bolsaPociones',
        'capacidadMaxima',
        'capacidadMaximaBolsaPociones'
      ]),
      porcentageVidaObjetoEquipado(){
        return Math.round(this.equipado.estadisticas.vida * 100 / this.equipado.estadisticas.vidaInicial)
      }
    }
  }
</script>