<script setup lang="ts">
  import Index from './Index.vue';
  import { AgentService } from '@/services/agent';
  import { Markdown2HtmlService } from '@/services/markdown2html';
  import { ChatService } from '@/services/chats';
  
  const agentService = new AgentService("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");

  const markdown2HtmlService = new Markdown2HtmlService();
  const chatService = new ChatService('','');
  const prompt = '';
  
  // Create a chat if it doesn't exist
  let currentChatId = localStorage.getItem('currentChatId');
  if (!currentChatId) {
    currentChatId = chatService.createChat('Chat Novo');
    localStorage.setItem('currentChatId', currentChatId);
  }

  function Chat(message: string){
    if (!message.trim()) return;
    chatService.saveMessage(currentChatId!, 'user', message);
    const messages = chatService.buildPrompt(currentChatId!, message);
    agentService.prompt.value = messages;
    agentService.main(message);
  }

</script>

<template>
<div class="flex justify-center items-center pb-[200px]">
  <div class="bg-neutral-900 pb-8 pr-8 pl-8 max-w-4xl">
    <a class="text-white font-bold"> {{ agentService.loading.value ? 'Loading...' : '' }} </a>
    <div v-if="agentService.message.value" class="prose prose-invert max-w-none [&_table]:w-full [&_table]:border-collapse [&_table]:mt-[30px] [&_table]:mb-[30px] [&_th]:bg-neutral-800 [&_th]:text-white [&_th]:px-4 [&_th]:py-2 [&_td]:px-4 [&_td]:py-2 [&_tbody_tr]:border-b [&_tbody_tr]:border-neutral-700">
      <h3 class="text-white font-bold">Answer:</h3>
      <div class="text-white font-semibold" v-html="markdown2HtmlService.Markdown2Html(agentService.message.value)"></div>
    </div>
  </div>
</div>

<Index v-model:model="agentService.Model" :main="Chat" :loading="agentService.loading" :prompt="prompt" />
<KeyTemplate :apiKey="apiKey"/>
<ChatsHistory />

</template>

<style scoped>
div {
  color: #ffffff;
}
</style>
