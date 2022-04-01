<template>
  <div class="log-container">
    <h2>Log</h2>
    <p v-for="p in historico" class="linea" :class="p.clase">{{ p.fecha }}: {{ p.texto }}</p>
  </div>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    name: 'Log',
    computed: {
      ...mapState([
        'historico'
      ])
    }
  }
</script>

<style scoped>
  .log-container {
    overflow: auto;
  }
  .log-container .linea {
    margin: 2px;
    text-align: left;
  }
  .critico {
    color: orangered;
  }
  .normal {
    color: #333;
  }
  .info {
    color: steelblue;
  }
  .dev {
    color: purple;
  }
</style>