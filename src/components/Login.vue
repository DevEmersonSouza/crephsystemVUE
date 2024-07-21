<template>
  <div class="flex align-items-center justify-content-center h-screen">
    <div class="surface-card p-4 shadow-2 border-round width: 7rem max-w-30rem">
      <div class="flex flex-column justify-content-center text-center mb-5">
        <a href="" class="flex justify-content-center">
          <img
            src="../assets/logoCREPH.png"
            alt="Image"
            height="100"
            class="mb-3"
          />
        </a>
        <div class="text-900 text-3xl font-medium mb-3">Bem Vindo</div>
      </div>
      <div >
        <Dialog :closable="false" v-model:visible="loading" modal>
          <ProgressSpinner />
        </Dialog>
        <form
          @submit.prevent="login"
          class="flex flex-column align-items-center justify-content-center"
        >
          <FloatLabel>
            <label for="username" class="-mt-4 text-900 font-medium mb-2"
              >Usuário:</label
            >
            <InputText
              id="username"
              type="text"
              v-model="username"
              class="mb-5 w-full mb-3"
              required
            />
          </FloatLabel>
          <FloatLabel>
            <label for="password" class="-mt-3 text-900 font-medium mb-2"
              >Senha:</label
            >
            <InputText
              id="password"
              type="password"
              v-model="password"
              class="mb-2	w-full mb-3"
              required
            />
          </FloatLabel>
          <Button
            class="w-6"
            type="submit"
            label="Entrar"
            severity="secondary"
            icon="pi pi-user"
            :loading="loading"
          />
        </form>
        <p class="text-center" v-if="errorMessage">{{ errorMessage }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import FloatLabel from "primevue/floatlabel";
import Dialog from "primevue/dialog";
import ProgressSpinner from "primevue/progressspinner";
ProgressSpinner
export default {
  name: "LoginUser",
  components: {
    Button,
    InputText,
    FloatLabel,
    Dialog,
    ProgressSpinner
  },
  data() {
    return {
      loading: false,
      username: "",
      password: "",
      errorMessage: "",
      maxAttempts: 3, // Número máximo de tentativas
    };
  },
  methods: {
    async login() {
      this.loading = true;
      let tentativasRestantes = this.maxAttempts;

      while (tentativasRestantes > 0) {
        try {
          this.loading = true;
          const response = await fetch("https://backendcreph.onrender.com/api/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username: this.username,
              password: this.password,
            }),
          });

          const data = await response.json();
          this.loading = false;

          if (response.ok) {
            localStorage.setItem("token", data.token);
            localStorage.setItem("isAdmin", data.is_admin.toString()); // Salvar o status de admin no localStorage
            if (data.is_admin) {
              this.$router.push("/users-admin"); // Rota para o componente de administração de usuários
            } else {
              this.$router.push("/panel"); // Rota para a seleção de PMAs
            }
            return; // Sai da função após login bem-sucedido
          } else {
            this.errorMessage = "Credenciais Incorretas";
            return; // Sai da função se houver erro de resposta
          }
        } catch (error) {
          console.error("Erro ao tentar fazer login:", error);
          this.errorMessage = ("Aguarde...");
          tentativasRestantes--;
          this.loading = false;
          await new Promise((resolve) => setTimeout(resolve, 1000)); // Pausa antes de tentar novamente
        }
      }

      if (tentativasRestantes === 0) {
        this.loading = false;
        this.errorMessage =
          "Falha ao tentar fazer login após várias tentativas. Por favor, tente novamente mais tarde.";
      }
    },
  },
};
</script>

<style scoped>
/* Seus estilos aqui */
p {
  color: black;
}

</style>
