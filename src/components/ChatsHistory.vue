<script setup lang="ts">
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarRail ,SidebarTrigger } from '@/components/ui/sidebar'
import { GalleryVerticalEnd } from 'lucide-vue-next'; 
</script>

<template>

  <Sidebar class="w-[260px] bg-[#202123] text-gray-200 border-r border-neutral-700">

    <!-- HEADER -->
    <SidebarHeader class="px-3 py-4 border-b border-neutral-700 bg-[#202123]">
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" class="hover:bg-neutral-700/40 rounded-lg">
            <SidebarTrigger class="text-gray-300" />
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>

    <!-- CONTENT -->
    <SidebarContent class="bg-[#202123]">
      <SidebarGroup>
        <SidebarGroupLabel class="text-xs uppercase tracking-wide text-gray-400 px-3">
          Platform
        </SidebarGroupLabel>

        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton class="hover:bg-neutral-700/40 rounded-md px-3 py-2 hover:text-white">
                Dashboard
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>

    <!-- FOOTER -->
    <SidebarFooter class="border-t border-neutral-700 px-3 py-4 gap-3 bg-[#202123]">
      <div class="grid grid-cols-5 gap-[10px]">
        <div class="flex items-center justify-center w-8 h-8 rounded-md bg-neutral-600">
          <GalleryVerticalEnd class="size-4 text-white" />
        </div>
        <span class="font-semibold text-gray-200 col-span-4">User</span>
      </div>
    </SidebarFooter>

    <SidebarRail class="bg-[#202123]" />
  </Sidebar>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
