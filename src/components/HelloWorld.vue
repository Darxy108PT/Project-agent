<script setup lang="ts">
  import Groq from "groq-sdk";
  import Index from './Index.vue';
  import { ref, computed } from 'vue';
  import MarkdownIt from 'markdown-it'

  const GROQ_API_KEY= "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"

  const groq = new Groq({ apiKey: GROQ_API_KEY, dangerouslyAllowBrowser: true });
  
  const message = ref('');
  const loading = ref(false)
  const model = ref('openai/gpt-oss-120b')
  const prompt = ref('')

  async function main(prompt: string) {
    loading.value = true;
    try {
      const chatCompletion = await getGroqChatCompletion(prompt);
      message.value = chatCompletion.choices[0]?.message?.content || "";
      console.log(message.value);
    } catch (error) {
      console.error('Erro:', error);
      message.value = 'Error obtaining Groq\'s answer';
    } finally {
      loading.value = false;
    }
  }

  async function getGroqChatCompletion(prompt: string) {
    return groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: model.value,
    });
  }

  const htmlResposta = computed(() => md.render(message.value || ''))

  const md = new MarkdownIt({
    html: false,
    linkify: true,
    typographer: true
  })
</script>

<template>
<div class="flex justify-center items-center pb-[200px]">
  <div class="bg-neutral-900 pb-8 pr-8 pl-8 max-w-4xl">
    <a class="text-white font-bold"> {{ loading ? 'Loading...' : '' }} </a>
    <div v-if="message" class="mt-5 p-2.5 border border-gray-300 rounded-md">
      <h3 class="text-white font-bold">Answer:</h3>
      <div class="text-white font-semibold" v-html="htmlResposta"></div>
    </div>
  </div>
</div>

<Index v-model:model="model" :main="main" :loading="loading" :prompt="prompt" />

</template>

<style scoped>
div {
  color: #ffffff;
}
</style>
