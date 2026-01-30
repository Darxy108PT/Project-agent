<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue'
import { SidebarProvider } from '@/components/ui/sidebar'
</script>

<template>
  <SidebarProvider>
    <HelloWorld />
  </SidebarProvider>
</template>
