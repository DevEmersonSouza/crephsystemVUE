<template>
  <div>
    <Toolbar class="flex w-screen">
      <template #start>
        <div class="flex justify-content-center items-center gap-1">
          <img
            src="../assets/logoCREPH.png"
            alt="LogoCREPH"
            style="height: 3.7rem; width: 3rem"
          />
          <Button @click="showComponentB" label="Lista de Fichas" text plain />
          <Button
            v-if="isAdmin"
            @click="toggleUserList"
            label="Lista de Usuários"
            text
            plain
          />
        </div>
      </template>
      
      <template #end>
        <div class="flex items-center gap-2">
          <LogoutButton/>
        </div>
      </template>
    </Toolbar>
    
    <div class="flex justify-content-center">
      <Pma v-if="currentComponent === 'B'" />
      <!-- Não é necessário adicionar ListaDeUsuarios aqui -->
    </div>
  </div>
  
  <div 
    class="flex justify-content-center align-content-center card bg-white m-3 border-1 border-round-xl h-30rem shadow-3 surface-border"
    v-if="currentComponent !== 'B'">
    <a class="text-5xl"> 
      Bem vindo!
    </a>
  </div>
</template>

<script>
import Toolbar from "primevue/toolbar";
import Pma from "./Pma.vue";
import LogoutButton from "./LogoutButton.vue";
import Button from "primevue/button";

export default {
  components: {
    Button,
    Toolbar,
    Pma,
    LogoutButton,
  },
  data() {
    return {
      currentComponent: null,
      isAdmin: false, // Inicializa isAdmin como false
    };
  },
  methods: {
    showComponentB() {
      if (this.currentComponent === "B") {
        this.currentComponent = null; // Oculta o componente se já estiver visível
      } else {
        this.currentComponent = "B"; // Mostra o componente
      }
    },
    toggleUserList() {
      this.$emit("toggleUserList"); // Emitir evento para alternar a lista de usuários em UsersAdmin.vue
    },
    checkAdminStatus() {
      // Verifica o status de administrador no localStorage
      const isAdmin = localStorage.getItem("isAdmin");
      if (isAdmin === "true") {
        this.isAdmin = true;
      }
    },
  },
  created() {
    // Verifica o status de administrador quando o componente é criado
    this.checkAdminStatus();
  },
};
</script>

<style scoped>
@media (max-width: 576px) {
    button{
      width: 6em;
  }
}

.header-panel {
  display: flex;
  flex-direction: column;
}

@media (max-width: 600px) {
  /* Adicione regras de mídia aqui */
}
</style>