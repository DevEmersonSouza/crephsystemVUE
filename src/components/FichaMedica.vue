<template>
  <div class="flex flex-column">
    <Dialog :closable="false" v-model:visible="loading" modal>
      <ProgressSpinner />
    </Dialog>
    <Toolbar
      class="p-toolbar sm:flex justify-content-between gap-5 lg:justify-content-between"
    >
      <template #start>
          <div class="flex">
            <a class="flex align-items-center" href="">
              <img
                src="../assets/logoCREPH.png"
                alt="LogoCREPH"
                class="h-4rem mr-5"
                />
            </a>
            <Button @Click="back" label="Retornar" text plain />
          </div>
      </template>
      <template #end>
        <div>
          <LogoutButton/>
        </div>
      </template>
    </Toolbar>
    <div class="card">
      <div class="flex flex-column justify-content-center">
        <h2 class="text-center" v-if="selectedPmaName">Fichas Médicas no {{ selectedPmaName }}</h2>
        <div class="flex justify-content-end gap-2 mb-4">
          <Calendar v-model="selectedDate" placeholder="Selecione a data" @change="applyDateFilter" dateFormat="dd/mm/yy" showIcon />
          <Button label="Filtrar" @click="applyDateFilter" />
          <Button label="Limpar Filtro" @click="clearFilter" />
        </div>
        <DataTable
          :value="filteredFichasMedicas"
          dataKey="id"
          :expandedRows="expandedRows"
          @rowExpand="onRowExpand"
          @rowCollapse="onRowCollapse"
        >
          <template #header>
            <div class="flex flex-wrap justify-end gap-2">
              <Button
                text
                icon="pi pi-plus"
                label="Expandir Tudo"
                @click="expandAll"
                class="m-0 mb-4"
              />
              <Button
                text
                icon="pi pi-minus"
                label="Recolher Tudo"
                @click="collapseAll"
                class="m-0 mb-4"
              />
              <div>
                <Button
                  @click="toggleDiv"
                  class="m-0"
                  label="Criar Ficha"
                />
                <div v-if="isDivVisible" class="expandable-div">
                  <CriarFichaMedica />
                  <Button
                    @click="cancel"
                    class="w-3 h-3rem ml-3"
                    label="Cancelar"
                  />
                </div>
              </div>
            </div>
          </template>
          <Column expander class="w-1" :header="'expandir'" />
          <Column
            :field="'hora_entrada'"
            :header="'Hora de Entrada'"
            :sortable="true"
            class="text-center w-1"
          ></Column>
          <Column
            :field="'data'"
            :header="'Data do Atendimento'"
            :sortable="true"
            class="text-center w-1"
          >
          <template #body="slotProps">
              {{ formatarData(slotProps.data.data) }}
            </template>    
          </Column>
          <Column
            :field="'nome_paciente'"
            :header="'Nome do Paciente'"
            :sortable="true"
            :body="expandableBodyTemplate"
            class="text-center w-2"
          ></Column>
          <Column :header="'Idade'" :sortable="true" class="text-center">
            <template #body="slotProps">
              {{ calcularIdade(slotProps.data.nascimento) }}
            </template>
          </Column>
          <Column
            :field="'sexo'"
            :header="'Sexo'"
            :sortable="true"
            class="text-center w-1"
          ></Column>
          <Column
            :field="'queixas'"
            :header="'Queixas'"
            :sortable="true"
            class="text-center"
          ></Column>
          <Column class="w-1" :header="'Status'">
            <template #body="slotProps">
              <div
                :class="{
                  'status-em-atendimento':
                    slotProps.data.liberado === 'Em atendimento',
                  'status-liberado': slotProps.data.liberado === 'Liberado',
                  'status-removido': slotProps.data.liberado === 'Removido',
                }"
                class="text-center"
              >
                {{ slotProps.data.liberado }}
              </div>
            </template>
          </Column>
          <Column  :header="'Ações'" class="text-center w-1">
            <template #body="slotProps">
              <div class="flex flex-column align-items-center">
                <Button
                  expander
                  class="w-8"
                  label="Editar"
                  @click="editFicha(slotProps.data)"
                />
                <Button
                  label="Excluir"
                  @click="excluirFicha(slotProps.data.id)"
                  class="w-8"
                />
              </div>
            </template>
          </Column>
          <template #expansion="slotProps">
            <h3 class="my-3">Detalhes do Paciente</h3>
            <table class="mb-2">
              <thead>
                <tr>
                  <th>Local</th>
                  <th>Data de Atendimento</th>
                  <th>Hora da Entrada</th>
                  <th>Hora da Saida</th>
                  <th>Nome</th>
                  <th>Sexo</th>
                  <th>Idade</th>
                  <th>Data de Nascimento</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{{ slotProps.data.local }}</td>
                  <td>{{ formatarData(slotProps.data.data) }}</td>
                  <td>{{ slotProps.data.hora_entrada }}</td>
                  <td>{{ slotProps.data.hora_saida }}</td>
                  <td>{{ slotProps.data.nome_paciente }}</td>
                  <td>{{ slotProps.data.sexo }}</td>
                  <td>{{ calcularIdade(slotProps.data.nascimento) }}</td>
                  <td>{{ formatarData(slotProps.data.nascimento) }}</td>
                </tr>
              </tbody>
            </table>
            <table class="mb-2">
              <thead>
                <tr>
                  <th>Acompanhante</th>
                  <th>Telefone</th>
                  <th>Queixas</th>
                  <th>Doenças</th>
                  <th>Hospitalização</th>
                  <th>Tratamento</th>
                  <th>Alergias</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{{ slotProps.data.acompanhante }}</td>
                  <td>{{ slotProps.data.telefone }}</td>
                  <td>{{ slotProps.data.queixas }}</td>
                  <td>{{ slotProps.data.doencas }}</td>
                  <td>{{ slotProps.data.hospitalizacao }}</td>
                  <td>{{ slotProps.data.tratamento }}</td>
                  <td>{{ slotProps.data.alergias }}</td>
                </tr>
              </tbody>
            </table>
            <table class="mb-2">
              <thead>
                <tr>
                  <th>P.A</th>
                  <th>FC</th>
                  <th>FR</th>
                  <th>Temperatura</th>
                  <th>SpO2</th>
                  <th>Dor</th>
                  <th>DX</th>
                  <th>Prescrição</th>
                  <th>Evolução</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{{ slotProps.data.pa }}</td>
                  <td>{{ slotProps.data.fc }}</td>
                  <td>{{ slotProps.data.fr }}</td>
                  <td>{{ slotProps.data.temperatura }}</td>
                  <td>{{ slotProps.data.sp02 }}</td>
                  <td>{{ slotProps.data.dor }}</td>
                  <td>{{ slotProps.data.dx }}</td>
                  <td>{{ slotProps.data.prescricao }}</td>
                  <td>{{ slotProps.data.evolucao }}</td>
                </tr>
              </tbody>
            </table>
            <table >
              <thead>
                <tr>
                  <th class="text-center">Assinatura Paciente</th>
                  <th class="text-center">Assinatura Enfermeiro</th>
                  <th class="text-center">Assinatura Médico</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="text-center">
                    <img style="width: 200px; height: auto;" :src="`${slotProps.data.assinatura_paciente}`" alt="Assinatura Paciente" />
                  </td>
                  <td class="text-center">
                    <img style="width: 200px; height: auto;" :src="`${slotProps.data.assinatura_enfermeiro}`" alt="Assinatura Enfermeiro" />
                  </td>
                  <td class="text-center">
                    <img style="width: 200px; height: auto;" :src="`${slotProps.data.assinatura_medico}`" alt="Assinatura Médico" />
                  </td>
                </tr>
              </tbody>
            </table>
            <table>
              <thead>
                <tr>
                  <th class="text-center">
                    Observação / Retorno:
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    {{ slotProps.data.observacao }}
                  </td>
                </tr>
              </tbody>
            </table>
            <div v-if="editMode[slotProps.data.id]">
              <h3>Editar Ficha Médica</h3>
              <form
                class="flex flex-wrap justify-content-between gap-2"
                @submit.prevent="updateFichaMedica(slotProps.data.id)"
              >
                <div class="flex">
                  <InputGroupAddon> Nome: </InputGroupAddon>
                  <InputText
                    id="nomePaciente"
                    v-model="editFormData.nome_paciente"
                    required
                  />
                </div>
                <div class="flex">
                  <InputGroupAddon> Sexo: </InputGroupAddon>
                  <InputText id="sexo" v-model="editFormData.sexo" required />
                </div>
                <div class="flex">
                  <InputGroupAddon> Nascimento </InputGroupAddon>
                  <InputText
                    type="date"
                    id="nascimento"
                    v-model="editFormData.nascimento"
                    required
                  />
                </div>
                <div class="flex">
                  <InputGroupAddon> Queixas: </InputGroupAddon>
                  <InputText
                    id="queixas"
                    v-model="editFormData.queixas"
                    required
                  />
                </div>
                <div class="flex">
                  <InputGroupAddon> Doenças: </InputGroupAddon>
                  <InputText
                    id="queixas"
                    v-model="editFormData.doencas"
                    required
                  />
                </div>
                <div class="flex">
                  <InputGroupAddon> Hora da Saida: </InputGroupAddon>
                  <InputText
                    id="hora_saida"
                    v-model="editFormData.hora_saida"
                    required
                  />
                </div>
                <div class="flex">
                  <InputGroupAddon> Acompanhante: </InputGroupAddon>
                  <InputText
                    id="acompanhante"
                    v-model="editFormData.acompanhante"
                    required
                  />
                </div>
                <div class="flex">
                  <InputGroupAddon> Telefone: </InputGroupAddon>
                  <InputText
                    id="acompanhante"
                    v-model="editFormData.telefone"
                    required
                  />
                </div>
                <div class="flex">
                  <InputGroupAddon> Hospitalização: </InputGroupAddon>
                  <InputText
                    id="hospitalizacao"
                    v-model="editFormData.hospitalizacao"
                    required
                  />
                </div>
                <div class="flex">
                  <InputGroupAddon> Tratamento: </InputGroupAddon>
                  <InputText
                    id="tratamento"
                    v-model="editFormData.tratamento"
                    required
                  />
                </div>
                <div class="flex">
                  <InputGroupAddon> Alergias: </InputGroupAddon>
                  <InputText
                    id="alergias"
                    v-model="editFormData.alergias"
                    required
                  />
                </div>
                <div class="flex">
                  <InputGroupAddon> PA: </InputGroupAddon>
                  <InputText id="pa" v-model="editFormData.pa" required />
                </div>
                <div class="flex">
                  <InputGroupAddon> FC: </InputGroupAddon>
                  <InputText id="fc" v-model="editFormData.fc" required />
                </div>
                <div class="flex">
                  <InputGroupAddon> FR: </InputGroupAddon>
                  <InputText id="fr" v-model="editFormData.fr" required />
                </div>
                <div class="flex">
                  <InputGroupAddon> Temperatura: </InputGroupAddon>
                  <InputText
                    id="temperatura"
                    v-model="editFormData.temperatura"
                    required
                  />
                </div>
                <div class="flex">
                  <InputGroupAddon> SpO2: </InputGroupAddon>
                  <InputText id="sp02" v-model="editFormData.sp02" required />
                </div>
                <div class="flex">
                  <InputGroupAddon> Escala de Dor: </InputGroupAddon>
                  <InputText id="dor" v-model="editFormData.dor" required />
                </div>
                <div class="flex">
                  <InputGroupAddon> DX: </InputGroupAddon>
                  <InputText id="dx" v-model="editFormData.dx" required />
                </div>
                <div class="flex">
                  <InputGroupAddon> Prescrição: </InputGroupAddon>
                  <InputText
                    id="prescricao"
                    v-model="editFormData.prescricao"
                    required
                  />
                </div>
                <div class="flex">
                  <InputGroupAddon> Evolução: </InputGroupAddon>
                  <InputText
                    id="evolucao"
                    v-model="editFormData.evolucao"
                    required
                  />
                </div>
                <div class="flex">
                  <InputGroupAddon> Observação / Retorno: </InputGroupAddon>
                  <InputText
                    id="evolucao"
                    v-model="editFormData.observacao"
                  />
                </div>
                <div class="flex">
                  <InputGroupAddon>
                    Status:
                  </InputGroupAddon>
                  <select id="status" v-model="editFormData.liberado" required>
                    <option value="Liberado">Liberado</option>
                    <option value="Removido">Removido</option>
                    <option value="Em atendimento">Em atendimento</option>
                  </select>
                </div>
                <Button class="w-2 m-0 m-0 my-3" label="Salvar" type="submit" />
                <Button
                  class="w-2 m-0 m-0 my-3"
                  label="Cancelar"
                  @click="cancelEdit(slotProps.data.id)"
                />
              </form>
            </div>
          </template>
        </DataTable>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Button from "primevue/button";
import CriarFichaMedica from "./CriarFichaMedica.vue";
import Toolbar from "primevue/toolbar";
import LogoutButton from "./LogoutButton.vue";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import InputText from "primevue/inputtext";
import InputGroupAddon from "primevue/inputgroupaddon";
import Dialog  from "primevue/dialog";
import ProgressSpinner from "primevue/progressspinner";
import Calendar from "primevue/calendar";

const fichasMedicas = ref([]);
const filteredFichasMedicas = ref([]);
const expandedRows = ref({});
const editMode = ref({});
const editFormData = ref({});
const isDivVisible = ref(false);
const selectedPmaName = ref("");
const loading = ref(false); // Inicializa como string vazia
const selectedDate = ref(new Date()); // Armazena a data selecionada para o filtro

const toggleDiv = () => {
  isDivVisible.value = !isDivVisible.value;
};

const cancel = () => {
  isDivVisible.value = false;
};

const back = () => {
  history.back();
};

const fetchFichasMedicas = async () => {
  const pmaId = localStorage.getItem("pma_id");
  const date = selectedDate.value;

  if (!pmaId) {
    console.error("pma_id não encontrado no localStorage.");
    loading.value = false;
    return;
  }

  if (!date) {
    console.error("Data não selecionada.");
    loading.value = false;
    return;
  }

  let tentativasRestantes = 2;
  while (tentativasRestantes > 0) {
    try {
      loading.value = true;
      const response = await fetch(
        `https://backendcreph.onrender.com/api/fichas-medicas/${pmaId}?date=${date}`
      );
      const data = await response.json();
      fichasMedicas.value = data;
      console.log(data);
      applyDateFilter(); // Aplica o filtro de data por padrão
      setSelectedPmaName(); // Chama função para definir o nome do PMA
      loading.value = false;
      return;
    } catch (error) {
      console.error("Erro ao buscar fichas médicas:", error);
      loading.value = false;
      tentativasRestantes--;
      if (tentativasRestantes > 0) {
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Pausa antes de tentar novamente
      } else {
        alert("Erro ao buscar fichas médicas. Tente novamente mais tarde.");
        loading.value = false;
      }
    }
  }
};

const formatarData = (dataString) => {
  const data = new Date(dataString);
  // Ajusta a data para o fuso horário local
  data.setMinutes(data.getMinutes() + data.getTimezoneOffset());
  return data.toLocaleDateString('pt-BR');
};

const applyDateFilter = () => {
  if (selectedDate.value) {
    const filtered = fichasMedicas.value.filter(ficha => {
      const fichaDate = new Date(ficha.data);
      // Ajusta a data para o fuso horário local
      fichaDate.setMinutes(fichaDate.getMinutes() + fichaDate.getTimezoneOffset());
      return (
        fichaDate.getDate() === selectedDate.value.getDate() &&
        fichaDate.getMonth() === selectedDate.value.getMonth() &&
        fichaDate.getFullYear() === selectedDate.value.getFullYear()
      );
    });
    filteredFichasMedicas.value = filtered;
  } else {
    filteredFichasMedicas.value = fichasMedicas.value;
  }
};

const clearFilter = () => {
  selectedDate.value = null;
  filteredFichasMedicas.value = fichasMedicas.value;
};

const excluirFicha = async (idFicha) => {
  if (confirm("Tem certeza que deseja excluir esta ficha médica?")) {
    let tentativasRestantes = 2;
    while (tentativasRestantes > 0) {
      try {
        loading.value = true;
        const response = await fetch(
          `https://backendcreph.onrender.com/api/ficha-medica/${idFicha}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (response.ok) {
          loading.value = false;
          alert("Ficha médica excluída com sucesso.");
          fichasMedicas.value = fichasMedicas.value.filter(
            (ficha) => ficha.id !== idFicha
          ); // Remove a ficha médica da lista local
          expandedRows.value = {}; // Limpa as linhas expandidas
          return;
        } else {
          const errorData = await response.json();
          throw new Error(errorData.message);
        }
      } catch (error) {
        console.error("Erro ao excluir ficha médica:", error);
        alert("Erro ao excluir ficha médica. Tente novamente mais tarde.");
        tentativasRestantes--;
        if (tentativasRestantes > 0) {
          await new Promise((resolve) => setTimeout(resolve, 1000)); // Pausa antes de tentar novamente
        }
      }
    }
  }
};

const expandAll = () => {
  const expandedRowsObject = {};
  fichasMedicas.value.forEach((ficha) => {
    expandedRowsObject[ficha.id] = true;
  });
  expandedRows.value = expandedRowsObject;
};

const collapseAll = () => {
  expandedRows.value = {};
};

const onRowExpand = (event) => {
  console.log("Row expanded:", event.data);
};

const onRowCollapse = (event) => {
  console.log("Row collapsed:", event.data);
};

const editFicha = (ficha) => {
  if (editMode.value[ficha.id]) {
    cancelEdit(ficha.id);
  } else {
    editMode.value[ficha.id] = true;
    expandedRows.value[ficha.id] = true;
    // Certifique-se de clonar o objeto para evitar mutações indesejadas
    editFormData.value = { ...ficha };
    // Formate a data de nascimento para o formato de entrada do tipo data
    editFormData.value.nascimento = new Date(ficha.nascimento).toISOString().split('T')[0];
  }
};

const cancelEdit = (fichaId) => {
  editMode.value = { ...editMode.value, [fichaId]: false };
};

const updateFichaMedica = async (idFicha) => {
  let tentativasRestantes = 2;
  while (tentativasRestantes > 0) {
    try {
      loading.value = true;
      const response = await fetch(
        `https://backendcreph.onrender.com/api/ficha-medica/${idFicha}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editFormData.value),
        }
      );
      if (response.ok) {
        loading.value = false;
        alert("Ficha médica atualizada com sucesso.");
        await fetchFichasMedicas();
        editMode.value = { ...editMode.value, [idFicha]: false };
        return;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
    } catch (error) {
      console.error("Erro ao atualizar ficha médica:", error);
      tentativasRestantes--;
      if (tentativasRestantes > 0) {
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Pausa antes de tentar novamente
      }
    }
  }
};

const calcularIdade = (nascimento) => {
  const hoje = new Date();
  const dataNascimento = new Date(nascimento);
  let idade = hoje.getFullYear() - dataNascimento.getFullYear();
  const mes = hoje.getMonth() - dataNascimento.getMonth();
  if (mes < 0 || (mes === 0 && hoje.getDate() < dataNascimento.getDate())) {
    idade--;
  }
  return idade;
};

const setSelectedPmaName = async () => {
  const pmaId = localStorage.getItem("pma_id");
  if (!pmaId) {
    console.error("pma_id não encontrado no localStorage.");
    return;
  }
  try {
    const response = await fetch(`https://backendcreph.onrender.com/api/pmas/${pmaId}`);
    const data = await response.json();
    console.log(data)
    selectedPmaName.value = data.nome_pma;
  } catch (error) {
    console.error("Erro ao buscar nome do PMA:", error);
  }
};

onMounted(() => {
  fetchFichasMedicas();
});
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

th {
  background-color: #f2f2f2;
}

.status-em-atendimento {
  border-radius: 10px;
  padding: 5px;
  background-color: orange;
  color: white;
}
.status-liberado {
  border-radius: 10px;
  padding: 5px;
  background-color: green;
  color: white;
}
.status-removido {
  border-radius: 10px;
  padding: 5px;
  background-color: red;
  color: white;
}



@media (max-width: 576px) {
    button{
  }
}

</style>
