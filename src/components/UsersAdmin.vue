<template>
  <div>
    <PainelFichas @toggleUserList="toggleUserList" />
    <div v-if="showUsersPanel">
      <ListaDeUsuarios />
    </div>
  </div>
</template>

<script>
import ListaDeUsuarios from './ListaDeUsuarios.vue';
import PainelFichas from './PainelFichas.vue';

export default {
  components: {
    ListaDeUsuarios,
    PainelFichas,
  },
  data() {
    return {
      showUsersPanel: false
    };
  },
  methods: {
    toggleUserList() {
      this.showUsersPanel = !this.showUsersPanel; // Alternar o estado de showUsersPanel
    }
  }
};
</script>

<style>
/* Estilos específicos para este componente, se necessário */
</style>