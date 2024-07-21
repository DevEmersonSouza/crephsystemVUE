<template>
  <div>
    <Dialog :closable="false" v-model:visible="loading" modal>
      <ProgressSpinner />
    </Dialog>
    <button @click="toggleExpand" class="bg w-2 m-0 mb-4 expand-button">
      {{ expanded ? "Cancelar" : "Criar Usuário" }}
    </button>

    <div v-if="expanded" class="form-container">
      <form class="flex flex-column" @submit.prevent="createUser">
        <div class="flex justify-content-center flex-wrap gap-3">
          <div class="flex m-2">
            <InputGroupAddon>
              <span class="mr-2 material-symbols-outlined"> account_circle </span>
              <label for="username">Username:</label>
            </InputGroupAddon>
            <InputText type="text" id="username" v-model="formData.username" required />
          </div>
          <div class="flex m-2">
            <InputGroupAddon>
              <span class="mr-2 material-symbols-outlined"> key </span>
              <label for="password">Password:</label>
            </InputGroupAddon>
            <InputText type="password" id="password" v-model="formData.password" required />
          </div>
          <div class="flex align-items-center">
            <InputGroupAddon>
              <span class="material-symbols-outlined"> shield_person </span>
              <label for="isAdmin">Admin:</label>
            </InputGroupAddon>
            <Checkbox class="ml-3" id="isAdmin" v-model="formData.is_admin" :binary="true" />
          </div>
          <div class="flex align-items-center">
            <InputGroupAddon>
              <span class="material-symbols-outlined"> badge </span>
              <label for="cargo">Cargo:</label>
            </InputGroupAddon>
            <select class="h-3rem" id="cargo" v-model="formData.cargo" required>
              <option value="Enfermeiro">Enfermeiro</option>
              <option value="Médico">Médico</option>
            </select>
          </div>
          <div class="flex align-items-center">
            <InputGroupAddon>
              <span class="material-symbols-outlined"> id_card </span>
              <label for="registro">Registro:</label>
            </InputGroupAddon>
            <InputText id="registro" v-model="formData.registro" required />
          </div>
        </div>
        <button class="h-3rem w-2 m-0 my-4" type="submit">Salvar</button>
      </form>
      <p v-if="errorMessage">{{ errorMessage }}</p>
    </div>
  </div>
</template>

<script>
import InputText from "primevue/inputtext";
import Checkbox from "primevue/checkbox";
import InputGroupAddon from "primevue/inputgroupaddon";

export default {
  components: {
    InputText,
    Checkbox,
    InputGroupAddon,
  },
  data() {
    return {
      loading: false,
      formData: {
        username: "",
        password: "",
        is_admin: false,
        cargo: "",
        registro: "",
      },
      errorMessage: "",
      maxAttempts: 3, // Número máximo de tentativas
      expanded: false, // Inicialmente, o formulário não está expandido
    };
  },
  watch: {
    "formData.cargo"(newCargo) {
      if (newCargo === "Médico") {
        this.formData.registro = "CRM - ";
      } else if (newCargo === "Enfermeiro") {
        this.formData.registro = "COREN - ";
      }
    },
  },
  methods: {
    async createUser() {
      let tentativasRestantes = this.maxAttempts;

      while (tentativasRestantes > 0) {
        try {
          this.loading = true;
          const response = await fetch(
            "https://backendcreph.onrender.com/api/admin/user",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                username: this.formData.username,
                password: this.formData.password,
                is_admin: this.formData.is_admin,
                cargo: this.formData.cargo,
                registro: this.formData.registro,
              }),
            }
          );

          const data = await response.json();

          if (!response.ok) {
            if (response.status === 401) {
              throw new Error("Você não tem permissão para criar usuários.");
            } else if (response.status === 400) {
              alert("Dados inválidos");
              throw new Error(
                data.message || "Dados inválidos para criar usuário."
              );
            } else {
              alert("Usuário já está em uso");
              throw new Error(data.message || "Erro ao criar usuário.");
            }
          }

          this.loading = false;
          alert("Usuário criado com sucesso!");

          this.formData.username = "";
          this.formData.password = "";
          this.formData.is_admin = false;
          this.formData.cargo = "";
          this.formData.registro = "";
          this.errorMessage = "";

          // Recarrega a página para exibir a lista atualizada de usuários
          window.location.reload();

          return;
        } catch (error) {
          console.error("Erro ao criar usuário:", error);
          if (error.message === "Você não tem permissão para criar usuários.") {
            window.alert("Você não tem permissão para criar usuários.");
          } else if (error.message === "Dados inválidos para criar usuário.") {
            window.alert("Dados inválidos para criar usuário.");
          }
          this.errorMessage = `Aguarde... ${error.message}`;
          tentativasRestantes--;
          await new Promise((resolve) => setTimeout(resolve, 1000)); // Aguarda antes de tentar novamente
        }
      }

      if (tentativasRestantes === 0) {
        this.loading = false;
        this.errorMessage =
          "Falha ao criar usuário após várias tentativas. Por favor, tente novamente mais tarde.";
        window.alert(this.errorMessage);
      }
    },
    toggleExpand() {
      this.expanded = !this.expanded; // Alternar o estado de expansão do formulário
    },
  },
};
</script>


<style scoped>
/* Estilos específicos para este componente */

.form-container {
  margin-top: 20px;
}

.expand-button {
  height: 3rem;
  margin-bottom: 10px;
  background-color: darkblue;
  color: white;
  border: 1px solid #2196F3 ;
  padding: 8px 16px;
  cursor: pointer;
}

.expand-button:hover {
  background-color: white;
  color: darkblue;
}
</style>
