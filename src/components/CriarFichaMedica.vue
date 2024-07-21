<template>
  <div>
    <Dialog :closable="false" v-model:visible="loading" modal>
      <ProgressSpinner />
    </Dialog>
  </div>
  <h2 class="text-center">Criar Ficha Médica</h2>
  <form @submit.prevent="enviarFichaMedica" class="flex flex-column card">
    <!-- Campos da ficha médica -->
    <div>
      <div class="flex gap-2 justify-content-between flex-column sm:flex-row flex-wrap">
        <div class="flex">
          <InputGroupAddon>
            <span class="material-icons">person</span>
          </InputGroupAddon>
          <InputText
            id="nomePaciente"
            v-model="ficha.nomePaciente"
            placeholder="Nome do Paciente"
            required
          />
        </div>
        <div class="flex">
          <InputGroupAddon class="w-10">
            <span class="material-icons">calendar_month</span>
            <label for="dataNascimento">Nascimento:</label>
          </InputGroupAddon>
          <InputText
            type="date"
            id="dataNascimento"
            v-model="ficha.nascimento"
            required
          />
        </div>
        <div class="flex align-items-center">
          <InputGroupAddon class="w-8">
            <span class="mr-2 ml-2 material-icons">wc</span>
            <label class="mr-1" for="sexo">Sexo:</label>
          </InputGroupAddon>
          <select
            id="sexo"
            v-model="ficha.sexo"
            required
          >
            <option value="" disabled selected>Selecione o sexo</option>
            <option value="Masculino">Masculino</option>
            <option value="Feminino">Feminino</option>
            <option value="Outro">Outro</option>
          </select>
        </div>
        <div class="flex">
          <InputGroupAddon>
            <span class="mr-2 material-icons">location_on</span>
          </InputGroupAddon>
          <InputText
            id="local"
            v-model="ficha.local"
            placeholder="Local do Atendimento"
            required
          />
        </div>
        <div class="flex">
          <InputGroupAddon class="w-10">
            <span class="material-icons">calendar_month</span>
            <label for="dataAtendimento">Atendimento:</label>
          </InputGroupAddon>
          <InputText
            type="date"
            id="dataAtendimento"
            v-model="ficha.data"
            required
          />
        </div>
        <div class="flex">
          <InputGroupAddon class="w-11">
            <span class="mr-1 material-icons">update</span>
            <label for="horaEntrada">Entrada:</label>
          </InputGroupAddon>
          <InputText
            type="time"
            id="horaEntrada"
            v-model="ficha.horaEntrada"
            required
          />
        </div>
        <div class="flex">
          <InputGroupAddon class="w-11">
            <span class="mr-1 material-icons">history</span>
            <label for="horaSaida">Saída:</label>
          </InputGroupAddon>
          <InputText type="time" id="horaSaida" v-model="ficha.horaSaida" />
        </div>
        <div class="flex">
          <InputGroupAddon>
            <span class="mr-1 material-icons">personal_injury</span>
          </InputGroupAddon>
          <InputText
            type="text"
            id="queixas"
            v-model="ficha.queixas"
            placeholder="Queixas"
            required
          />
        </div>
        <div class="flex">
          <InputGroupAddon>
            <span class="mr-1 material-icons">coronavirus</span>
          </InputGroupAddon>
          <InputText
            type="text"
            id="doencas"
            v-model="ficha.doencas"
            placeholder="Doenças"
            required
          />
        </div>
        <div class="flex">
          <InputGroupAddon>
            <span class="mr-1 material-icons">group</span>
          </InputGroupAddon>
          <InputText
            type="text"
            id="acompanhante"
            v-model="ficha.acompanhante"
            placeholder="Acompanhante"
          />
        </div>
        <div class="flex">
          <InputGroupAddon>
            <span class="mr-1 material-icons">phone_iphone</span>
          </InputGroupAddon>
          <InputText
            type="text"
            id="telefone"
            v-model="ficha.telefone"
            placeholder="Telefone para contato"
            required
          />
        </div>
        <div class="flex">
          <InputGroupAddon>
            <span class="mr-1 material-icons">local_hospital</span>
          </InputGroupAddon>
          <InputText
            type="text"
            id="hospitalizacao"
            v-model="ficha.hospitalizacao"
            placeholder="Hospitalização"
            required
          />
        </div>
        <div class="flex">
          <InputGroupAddon>
            <span class="mr-1 material-icons">medication</span>
          </InputGroupAddon>
          <InputText
            type="text"
            id="tratamento"
            v-model="ficha.tratamento"
            placeholder="Tratamento"
            required
          />
        </div>
        <div class="flex">
          <InputGroupAddon>
            <span class="mr-1 material-icons">masks</span>
          </InputGroupAddon>
          <InputText
            type="text"
            id="alergias"
            v-model="ficha.alergias"
            placeholder="Alergias"
            required
          />
        </div>
        <div class="flex">
          <InputGroupAddon>
            <span class="mr-1 material-icons">bloodtype</span>
          </InputGroupAddon>
          <InputText
            type="text"
            id="pa"
            v-model="ficha.pa"
            placeholder="PA"
            required
          />
          <InputGroupAddon class="w-3"> mmhg </InputGroupAddon>
        </div>
        <div class="flex">
          <InputGroupAddon>
            <span class="mr-1 material-icons">favorite</span>
          </InputGroupAddon>
          <InputText
            type="text"
            id="fc"
            v-model="ficha.fc"
            placeholder="FC"
            required
          />
          <InputGroupAddon class="w-3"> bpm </InputGroupAddon>
        </div>
        <div class="flex">
          <InputGroupAddon>
            <span class="material-symbols-outlined">respiratory_rate</span>
          </InputGroupAddon>
          <InputText
            type="text"
            id="fr"
            v-model="ficha.fr"
            placeholder="FR"
            required
          />
          <InputGroupAddon class="w-3"> mrpm </InputGroupAddon>
        </div>
        <div class="flex">
          <InputGroupAddon>
            <span class="material-symbols-outlined"> device_thermostat </span>
          </InputGroupAddon>
          <InputText
            type="text"
            id="temperatura"
            v-model="ficha.temperatura"
            placeholder="Temperatura"
            required
          />
          <InputGroupAddon> °C </InputGroupAddon>
        </div>
        <div class="flex">
          <InputGroupAddon>
            <span class="material-symbols-outlined">spo2</span>
          </InputGroupAddon>
          <InputText
            type="text"
            id="sp02"
            v-model="ficha.sp02"
            placeholder="sp02"
            required
          />
          <InputGroupAddon> % </InputGroupAddon>
        </div>
        <div class="flex">
          <InputGroupAddon>
            <span class="material-symbols-outlined"> sick </span>
          </InputGroupAddon>
          <InputText
            type="text"
            id="dor"
            v-model="ficha.dor"
            placeholder="Escala de Dor"
            required
          />
        </div>
        <div class="flex">
          <InputGroupAddon>
            <span class="material-symbols-outlined"> glucose </span>
          </InputGroupAddon>
          <InputText
            type="text"
            id="dx"
            v-model="ficha.dx"
            placeholder="DX"
            required
          />
          <InputGroupAddon class="w-3"> mg/dl </InputGroupAddon>
        </div>
        <div class="flex w-12">
          <InputGroupAddon>
            <span class="material-symbols-outlined"> prescriptions </span>
          </InputGroupAddon>
          <InputText
            type="text"
            id="prescricao"
            v-model="ficha.prescricao"
            placeholder="Prescrição"
            required
            class="w-12"
          />
        </div>
        <div class="flex w-12">
          <InputGroupAddon>
            <span class="material-symbols-outlined"> stethoscope_check </span>
          </InputGroupAddon>
          <InputText
            type="text"
            id="evolucao"
            v-model="ficha.evolucao"
            placeholder="Evolução"
            required
          />
        </div>
        <div class="flex w-12">
          <InputGroupAddon>
            <span class="material-symbols-outlined"> search </span>
          </InputGroupAddon>
          <InputText
            type="text"
            id="observacao"
            v-model="ficha.observacao"
            placeholder="Observação"
          />
        </div>
        <div class="flex align-items-center">
          <InputGroupAddon>
            <label class="mr-1" for="status">Status:</label>
          </InputGroupAddon>
          <select id="status" v-model="ficha.liberado" required>
            <option value="" disabled selected>Selecione o Status</option>
            <option value="Liberado">Liberado</option>
            <option value="Removido">Removido</option>
            <option value="Em atendimento">Em atendimento</option>
          </select>
        </div>
      </div>
    </div>
    <button type="submit" class="mt-2 w-3 h-3rem m-0 border-primary-500">
      Enviar
    </button>
  </form>
</template>

<script>
import InputGroupAddon from "primevue/inputgroupaddon";
import InputText from "primevue/inputtext";
import Dialog from "primevue/dialog";
import ProgressSpinner from "primevue/progressspinner";
import "material-icons/iconfont/material-icons.css"; // Importe os estilos CSS dos ícones

export default {
  name: "FichaMedica",
  components: {
    InputGroupAddon,
    InputText,
    Dialog,
    ProgressSpinner,
  },
  data() {
    return {
      loading: false,
      ficha: {
        nomePaciente: "",
        local: "",
        data: "",
        nascimento: "",
        sexo: "",
        queixas: "",
        doencas: "",
        horaEntrada: "",
        horaSaida: "",
        acompanhante: "",
        telefone: "",
        hospitalizacao: "",
        tratamento: "",
        alergias: "",
        pa: "",
        fc: "",
        fr: "",
        temperatura: "",
        sp02: "",
        dor: "",
        dx: "",
        prescricao: "",
        evolucao: "",
        liberado: "",
        observacao: "",
        assinatura_paciente: "",
        assinatura_enfermeiro: "",
        assinatura_medico: "",
      },
      fichasMedicas: [],
    };
  },
  methods: {
    async enviarFichaMedica() {
      if (!this.validarCampos()) {
        return;
      }

      // Verifica se as assinaturas estão presentes no localStorage
      // const assinatura_paciente = localStorage.getItem("svg-paciente");
      // const assinatura_medico = localStorage.getItem("svg-medico");
      // const assinatura_enfermeiro = localStorage.getItem("svg-enfermeiro");
      let tentativasRestantes = 2;
      while (tentativasRestantes > 0) {
        ///

        const pmaId = localStorage.getItem("pma_id");
        // if (!pmaId) {
          // console.error("pma_id não encontrado no localStorage.");
          // return;
        // }

        const fichaCompleta = {
          ...this.ficha,
          pma_id: pmaId,
          // assinatura_paciente,
          // assinatura_medico,
          // assinatura_enfermeiro,
        };

        try {
          this.loading = true;
          const response = await fetch(
            "https://backendcreph.onrender.com/api/ficha-medica",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
              body: JSON.stringify(fichaCompleta),
            }
          );

          if (response.ok) {
            this.loading = false;
            const data = await response.json();
            alert(data.message);
            this.resetForm();
            this.limparAssinaturasLocalStorage(); // Limpa as assinaturas após envio
            window.location.reload(); // Recarrega a página
            return;
          } else {
            const errorData = await response.json();
            console.error("Erro ao enviar ficha médica:", errorData);
            return;
          }
        } catch (error) {
          console.error("Erro ao enviar ficha médica:", error);
        } finally {
          this.loading = false;
        }
      }
    },
    validarCampos() {
      if (
        !this.ficha.data ||
        !this.ficha.local ||
        !this.ficha.nomePaciente ||
        !this.ficha.nascimento ||
        !this.ficha.sexo ||
        !this.ficha.queixas ||
        !this.ficha.doencas
      ) {
        alert("Por favor, preencha todos os campos obrigatórios.");
        return false;
      }
      return true;
    },
    resetForm() {
      this.ficha = {
        data: "",
        local: "",
        nomePaciente: "",
        nascimento: "",
        sexo: "",
        queixas: "",
        doencas: "",
        patientSignature: "",
        nurseSignature: "",
        doctorSignature: "",
      };
    },
    limparAssinaturasLocalStorage() {
      // Limpa as assinaturas do localStorage
      localStorage.removeItem("svg-paciente");
      localStorage.removeItem("svg-medico");
      localStorage.removeItem("svg-enfermeiro");
    },
  },
};
</script>

<style scoped>
@import "material-icons/iconfont/material-icons.scss";
teste {
  display: flex;
}

button {
  width: 7rem;
}

Input {
  width: 100%;
}

select{
  width: 100%;
  height: 3.2em;
}
@media (max-width: 576px) {
  Input {
    width: 120%;
  }
  teste {
    color: blue;
  }
  select {
    height: 3.2em;
    width: 100%;
  }
}

.signature-container {
  width: 200px;
  height: 100px;
  transition: width 0.3s, height 0.3s;
}

.signature-container:fullscreen {
  width: 100vw;
  height: 100vh;
  background: white; /* Adicione um fundo branco ou qualquer cor desejada */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
