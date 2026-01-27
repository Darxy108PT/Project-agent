<script setup lang="js">
  import Groq from "groq-sdk";
  import { ref, computed } from 'vue';
  import MarkdownIt from 'markdown-it'

  const GROQ_API_KEY= "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"

  const groq = new Groq({ apiKey: GROQ_API_KEY, dangerouslyAllowBrowser: true });
  
  const mensagem = ref('');
  const loading = ref(false);

  async function main() {
    loading.value = true;
    try {
      const chatCompletion = await getGroqChatCompletion();
      mensagem.value = chatCompletion.choices[0]?.message?.content || "";
      console.log(mensagem.value);
    } catch (error) {
      console.error('Erro:', error);
      mensagem.value = 'Erro ao obter resposta do Groq';
    } finally {
      loading.value = false;
    }
  }

  async function getGroqChatCompletion() {
    return groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: "Cria tabelas em markdown com 3 colunas: Nome, Idade, Cidade. Adiciona 5 linhas com dados fictícios.",
        },
      ],
      model: "openai/gpt-oss-20b",
    });
  }

  const htmlResposta = computed(() => md.render(mensagem.value || ''))

  const md = new MarkdownIt({
    html: false,
    linkify: true,
    typographer: true
  })


</script>

<template>
  <div>
    <button @click="main" :disabled="loading">
      {{ loading ? 'A carregar...' : 'Obter mensagem do Groq' }}
    </button>
    
    <div v-if="mensagem" style="margin-top: 20px; padding: 10px; border: 1px solid #ccc; border-radius: 5px;margin-left: 100px;margin-right: 100px;">
      <h3>Resposta:</h3>
      <div v-html="htmlResposta"></div> <!-- precisa de class para formatar as tabelas -->
    </div>
  </div>
</template>

<style scoped>
button {
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  color: #ffffff;
}
button:hover {
  background-color: #343434;
}
div {
  color: #ffffff;
}

</style>
