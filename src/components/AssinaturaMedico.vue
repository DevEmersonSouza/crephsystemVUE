<template>
  <div class="flex justify-content-center w-full">
    <button type="button" @click="toggleFullScreen">Assinatura do Médico</button>
    <div v-if="showSignature" ref="signatureContainer" class="signature-container">
      <vueSignature
        class="border-1 border-solid border-primary"
        ref="signature"
        :w="'1000px'"
        :h="'200px'"
      ></vueSignature>
      <div class="flex">
        <button class="w-3 h-3rem m-2" @click="saveSignature">Salvar</button>
        <button class="w-3 h-3rem m-2" @click="clearSignature">Limpar</button>
        <button class="w-3 h-3rem m-2" @click="undoSignature">Desfazer</button>
        <button class="w-3 h-3rem m-2" @click="exitFullScreen">Minimizar</button>
      </div>
    </div>
  </div>
</template>

<script>
import vueSignature from "vue-signature";

export default {
  name: "AssinaturaMedico",
  components: {
    vueSignature,
  },
  data() {
    return {
      showSignature: false,
    };
  },
  methods: {
    toggleFullScreen() {
      this.showSignature = true;
      this.$nextTick(() => {
        const container = this.$refs.signatureContainer;
        if (container) {
          container.requestFullscreen().catch(err => {
            alert(`Erro ao tentar ativar o modo tela cheia: ${err.message} (${err.name})`);
          });
        } else {
          console.error("Container de assinatura não encontrado.");
        }
      });
    },
    exitFullScreen() {
      if (document.fullscreenElement) {
        document.exitFullscreen();
        this.showSignature = false;
      }
    },
    saveSignature() {
      localStorage.removeItem('svg-medico');
      if (this.$refs.signature) {
        const svg = this.$refs.signature.save("image/png");
        localStorage.setItem('svg-medico', svg);
        this.exitFullScreen();
        alert("Assinatura do Médico salva com sucesso!");
      } else {
        console.error("Componente de assinatura não encontrado.");
      }
    },
    clearSignature() {
      if (this.$refs.signature) {
        this.$refs.signature.clear();
      } else {
        console.error("Componente de assinatura não encontrado.");
      }
    },
    undoSignature() {
      if (this.$refs.signature) {
        this.$refs.signature.undo();
      } else {
        console.error("Componente de assinatura não encontrado.");
      }
    },
  },
};
</script>

<style scoped>

.signature-container {
  width: 800px;
  height: 400px;
  transition: width 0.3s, height 0.3s;
}

.signature-container:fullscreen {
  width: 100vw;
  height: 100vh;
  background: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>