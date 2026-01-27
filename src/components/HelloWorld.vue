<script setup lang="js">
  import Groq from "groq-sdk";
  import { ref } from 'vue';

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
          content: "Explique a teoria da relatividade de forma simples.",
        },
      ],
      model: "openai/gpt-oss-20b",
    });
  }

</script>

<template>
  <div>
    <button @click="main" :disabled="loading">
      {{ loading ? 'A carregar...' : 'Obter mensagem do Groq' }}
    </button>
    
    <div v-if="mensagem" style="margin-top: 20px; padding: 10px; border: 1px solid #ccc; border-radius: 5px;">
      <h3>Resposta:</h3>
      <p>{{ mensagem }}</p>
    </div>
  </div>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
