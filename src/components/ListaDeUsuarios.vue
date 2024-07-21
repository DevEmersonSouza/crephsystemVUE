<template>
  <div class="card">
    <Dialog :closable="false" v-model:visible="loading" modal>
      <ProgressSpinner />
    </Dialog>
    <h3>Lista de Usuários</h3>
    <AdicionarUsuario />
    <DataTable :value="userList" tableStyleClass="p-datatable-striped">
      <Column class="" field="username" header="Username"></Column>
      <Column field="is_admin" header="Administrador" :body="isAdminTemplate"></Column>
      <Column field="cargo" header="Cargo"></Column>
      <Column field="registro" header="Registro"></Column>
      <Column header="Ações">
        <template #body="{ data }">
          <button class="w-6 h-2rem" @click="editUser(data)">Editar</button>
          <button class="w-6 h-2rem" @click="deleteUser(data.id)">Excluir</button>
        </template>
      </Column>
    </DataTable>

    <div v-if="editingUser">
      <h3>Editar Usuário</h3>
      <form @submit.prevent="updateUser">
        <div class="flex flex-wrap justify-content-center">
          <div class="flex m-2">
            <InputGroupAddon>
              <label class="mr-2" for="editUsername">Username:</label>
            </InputGroupAddon>
            <InputText
              type="text"
              id="editUsername"
              v-model="formData.username"
              required
            />
          </div>
          <div class="flex m-2">
            <InputGroupAddon>
              <label class="mr-2" for="editPassword">Nova Senha:</label>
            </InputGroupAddon>
            <InputText type="password" id="editPassword" v-model="formData.password" />
          </div>
          <div class="flex m-2 align-items-center">
            <InputGroupAddon>
              <label class="mr-2" for="editIsAdmin">Admin:</label>
            </InputGroupAddon>
            <Checkbox class="ml-3" id="editIsAdmin" v-model="formData.is_admin" :binary="true"/>
          </div>
          <div class="flex m-2">
            <InputGroupAddon>
              <label class="mr-2" for="editCargo">Cargo:</label>
            </InputGroupAddon>
            <select class="h-3rem" id="editCargo" v-model="formData.cargo" required>
              <option value="Enfermeiro">Enfermeiro</option>
              <option value="Médico">Médico</option>
            </select>
          </div>
          <div class="flex m-2">
            <InputGroupAddon>
              <label class="mr-2" for="editRegistro">Registro:</label>
            </InputGroupAddon>
            <InputText id="editRegistro" v-model="formData.registro" />
          </div>
        </div>

        <button class="w-4 h-2rem m-0 my-2" type="submit">Salvar</button>
        <button class="w-4 h-2rem m-0 my-2" type="button" @click="cancelEdit">Cancelar</button>
      </form>
    </div>

    <p v-if="errorMessage">{{ errorMessage }}</p>
  </div>
</template>

<script>
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import AdicionarUsuario from "./AdicionarUsuario.vue";
import InputText from "primevue/inputtext";
import InputGroupAddon from "primevue/inputgroupaddon";
import Checkbox from "primevue/checkbox";
export default {
  components: {
    DataTable,
    Column,
    AdicionarUsuario,
    InputText,
    Checkbox,
    InputGroupAddon
  },
  data() {
    return {
      loading: false,
      userList: [],
      editingUser: null,
      formData: {
        username: "",
        password: "",
        is_admin: false,
        cargo: "",
        registro: ""
      },
      errorMessage: "",
      maxAttempts: 2,
    };
  },
  created() {
    this.loadUsers();
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
    async tryFetch(url, options, attempts = this.maxAttempts) {
      try {
        const response = await fetch(url, options);
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Erro na requisição.");
        }
        return data;
      } catch (error) {
        if (attempts > 1) {
          await new Promise((resolve) => setTimeout(resolve, 1000)); // Pausa antes de tentar novamente
          return this.tryFetch(url, options, attempts - 1);
        } else {
          throw error;
        }
      }
    },
    async deleteUser(userId) {
      this.loading = true;
      if (confirm("Tem certeza que deseja excluir este usuário?")) {
        try {
          await this.tryFetch(
            `https://backendcreph.onrender.com/api/admin/user/${userId}`,
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          this.userList = this.userList.filter((user) => user.id !== userId);
          alert("Usuário excluído com sucesso!");
          this.loadUsers(); // Atualiza a lista de usuários após exclusão
          this.loading = false;
        } catch (error) {
          this.errorMessage =
            "Erro ao excluir usuário após várias tentativas. Por favor, tente novamente mais tarde.";
            console.error("Erro ao excluir usuário:", error);
            this.loading = false;
        } finally {
          this.loading = false;
        }
      }
      this.loading = false;
    },
    async loadUsers() {
      this.loading = true;
      try {
        const userData = await this.tryFetch(
          "https://backendcreph.onrender.com/api/admin/users",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        this.userList = userData.filter(
          (user) => user && user.id !== undefined
        );
      } catch (error) {
        this.errorMessage =
          "Erro ao carregar lista de usuários. Por favor, tente novamente mais tarde.";
        console.error("Erro ao carregar lista de usuários:", error);
      } finally {
        this.loading = false;
      }
    },
    async editUser(user) {
      this.loading = true;
      try {
        const userData = await this.tryFetch(
          `https://backendcreph.onrender.com/api/admin/user/${user.id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        this.formData.username = userData.username;
        this.formData.password = "";
        this.formData.is_admin = userData.is_admin;
        this.formData.cargo = userData.cargo;
        this.formData.registro = userData.registro;
        this.editingUser = userData;
      } catch (error) {
        this.errorMessage =
          "Erro ao carregar dados do usuário para edição após várias tentativas. Por favor, tente novamente mais tarde.";
        console.error("Erro ao carregar dados do usuário para edição:", error);
      } finally {
        this.loading = false;
      }
    },
    async updateUser() {
      this.loading = true;
      try {
        const data = await this.tryFetch(
          `https://backendcreph.onrender.com/api/admin/user/${this.editingUser.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username: this.formData.username,
              password: this.formData.password,
              is_admin: this.formData.is_admin,
              cargo: this.formData.cargo,
              registro: this.registro
            }),
          }
        );
        const index = this.userList.findIndex(
          (user) => user.id === this.editingUser.id
        );
        if (index !== -1) {
          this.userList.splice(index, 1, data.user);
        }
        alert("Usuário editado com sucesso!");
        this.editingUser = null;
        this.loadUsers(); // Atualiza lista de usuários após edição
      } catch (error) {
        this.errorMessage =
          "Erro ao atualizar usuário após várias tentativas. Por favor, tente novamente mais tarde.";
        console.error("Erro ao atualizar usuário:", error);
      } finally {
        this.loading = false;
      }
    },
    cancelEdit() {
      this.editingUser = null;
      this.formData.username = "";
      this.formData.password = "";
      this.formData.is_admin = false;
    },
    isAdminTemplate(rowData) {
    const isAdmin = rowData.is_admin; // Acesse o campo is_admin do rowData
    return isAdmin ? "Admin" : "Usuário";
  },
    actionTemplate(user) {
      return ("div", [
        ("button", { onClick: () => this.editUser(user) }, "Editar"),
        ("button", { onClick: () => this.deleteUser(user.id) }, "Excluir"),
      ]);
    },
  },
};
</script>

<style scoped>
.card {
  margin: 20px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.p-datatable-striped {
  width: 100%;
}

button {
  margin-right: 5px;
}
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

table th,
table td {
  border: 1px solid #ddd;
  padding: 10px;
  text-align: center;
}

table th {
  background-color: #f2f2f2;
  font-weight: bold;
  text-transform: uppercase;
}
</style>
