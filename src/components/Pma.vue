<template>
  <div class="flex flex-column justify-content-center w-8">
    <Dialog :closable="false" v-model:visible="loading" modal>
      <ProgressSpinner />
    </Dialog>
    <h2 class="flex justify-content-center">Selecione o PMA</h2>
    <ul class="text-center">
      <li v-for="pma in pmas" :key="pma.id" @click="selectPma(pma.id)">
        {{ pma.name }}
      </li>
    </ul>
    <p v-if="errorMessage">{{ errorMessage }}</p>
  </div>
</template>

<script>
import Dialog from 'primevue/dialog';
import ProgressSpinner from 'primevue/progressspinner';
export default {
  name: "PmaName",
  components: {
    Dialog,
    ProgressSpinner
  },
  data() {
    return {
      loading: false,
      pmas: [],
      errorMessage: "",
      maxAttempts: 3, // Número máximo de tentativas
    };
  },
  created() {
    this.fetchPmas();
  },
  methods: {
    async fetchPmas() {
      this.loading = true;
      let tentativasRestantes = this.maxAttempts;

      while (tentativasRestantes > 0) {
        try {
          const response = await fetch("https://backendcreph.onrender.com/api/pmas", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });

          if (response.ok) {
            this.loading = false;
            this.pmas = await response.json();
            this.errorMessage = "";
            return; // Sai da função após buscar PMAs com sucesso
          } else {
            const errorData = await response.json();
            throw new Error(`Erro ao buscar PMAs: ${errorData.message}`);
          }
        } catch (error) {
          console.error("Erro ao buscar PMAs:", error);
          this.errorMessage = `Aguarde...`;
          tentativasRestantes--;
          await new Promise((resolve) => setTimeout(resolve, 1000)); // Pausa antes de tentar novamente
        }
      }

      if (tentativasRestantes === 0) {
        this.loading = false;
        this.errorMessage =
          "Falha ao buscar PMAs após várias tentativas. Por favor, tente novamente mais tarde.";
      }
    },
    selectPma(pmaId) {
      localStorage.setItem("pma_id", pmaId);
      this.$router.push({ name: "FichaMedica", params: { pmaId } });
    },
  },
};
</script>

<style scoped>
/* Estilos específicos para este componente */
ul {
  list-style-type: none;
  padding: 0;
}

li {
  align-content: center;
  height: 70px;
  margin-bottom: 10px;
  /* background: rgb(2,0,36); */
  background: linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 35%, rgba(149,0,23,1) 100%);
  color: white;
  cursor: pointer;
  padding: 10px;
  border: 2px solid darkblue;
  border-radius: 15px;
  transition: background-color 0.3s;
}
li:hover {

  background-color: darkblue;
}



</style>
