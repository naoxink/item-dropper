<template>
  <div class="player">
    <h2>Estadísticas</h2>
    <p><strong>Enemigos eliminados</strong>: {{ (this.totalDrops) }}</p>
    <p><strong>Créditos</strong>: {{ (this.creditoTotal) }}¢ <button @click="alternarTienda()">Mostrar tienda</button></p>
    <span title="Rango 1" class="muestra r1">{{ estadisticas.r1 }}</span>
    <span title="Rango 2" class="muestra r2">{{ estadisticas.r2 }}</span>
    <span title="Rango 3" class="muestra r3">{{ estadisticas.r3 }}</span>
    <span title="Rango 4" class="muestra r4">{{ estadisticas.r4 }}</span>
    <span title="Rango 5" class="muestra r5">{{ estadisticas.r5 }}</span>
    <span title="Único" class="muestra unico">{{ estadisticas.unico }}</span>
    <p>
      <strong>Vida</strong>: {{ (total('vida')) }}
      | <strong>Ataque</strong>: {{ (total('atq')) }}
      <!-- | <strong>Defensa</strong>: {{ total('def') }} -->
    </p>
    <div class="progress-bar-container vida">
      <div class="progress-bar" :style="'width: ' + porcentageVidaJugador + '%'"></div>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import mx from '@/mixins'

  export default {
    name: 'Jugador',
    mixins: [ mx ],
    computed: {
      ...mapState([
        'creditoTotal',
        'atributos',
        'atributosBase',
        'estadisticas',
        'totalDrops',
        'tienda',
        'equipado'
      ]),
      porcentageVidaJugador(){
        let totalInicial = this.atributosBase.vidaJugador + this.atributosBase.vidaPociones + (this.equipado ? this.equipado.estadisticas.vida : 0)
        return Math.round(this.total('vida') * 100 / totalInicial)
      }
    }
  }
</script>

<style>
  
</style>