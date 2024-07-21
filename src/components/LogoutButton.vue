<template>
  <Button
    @click="logout"
    label="Sair"
    icon="pi pi-sign-out"
  />
</template>

<script>
import Button from "primevue/button";
export default {
  name: "LogoutButton",
  components: {
    Button,
  },
  methods: {
    logout() {
      // Limpa o localStorage
      localStorage.clear();

      // Redireciona para a tela de login
      this.$router.push("/");
    },
  },
};
</script>

<style scoped>

/* Adicione estilos conforme necessário */
button {
  /* Estilos para o botão */
  color: rgb(0, 0, 0);
  background-color: rgb(207, 139, 139);
  border: none;
  cursor: pointer;
  height: 4em;
}

button:hover {
  color: red;
  background-color: rgb(252, 221, 221);
}
@media (max-width: 576px) {
    button{
      height: 4em;
  }
}
</style>
