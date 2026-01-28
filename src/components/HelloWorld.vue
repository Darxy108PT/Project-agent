<script setup lang="ts">
  import Index from './Index.vue';
  import { AgentService } from '@/services/agent';
  import { Markdown2HtmlService } from '@/services/markdown2html';
  
  const agentService = new AgentService("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");

  const markdown2HtmlService = new Markdown2HtmlService();
</script>

<template>
<div class="flex justify-center items-center">
  <div class="bg-neutral-900 pb-8 pr-8 pl-8 max-w-4xl">
    <a class="text-white font-bold"> {{ agentService.loading.value ? 'Loading...' : '' }} </a>

    <div v-if="agentService.message.value" class="mt-5 p-2.5 border border-gray-300 rounded-md">
      <div class="text-white font-semibold" v-html="markdown2HtmlService.Markdown2Html(agentService.message.value)"></div>
    </div>
  </div>
</div>

<Index :main="agentService.main" :loading="agentService.loading" :prompt="agentService.prompt"/>
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
