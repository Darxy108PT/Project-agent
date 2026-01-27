<script setup lang="ts">
import { ArrowUpIcon, PlusIcon } from 'lucide-vue-next'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupText, InputGroupTextarea } from '@/components/ui/input-group'
import { Separator } from '@/components/ui/separator'
</script>

<template>
  <InputGroup class="fixed bottom-5 w-full bg-zinc-800 text-white p-4 max-w-3xl justify-self-center ">
      <InputGroupTextarea placeholder="Ask, Search or Chat..." />
      <InputGroupAddon align="block-end">
        <InputGroupButton
          variant="outline"
          class="rounded-full"
          size="icon-xs"
        >
          <PlusIcon class="size-4" />
        </InputGroupButton>
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <InputGroupButton variant="ghost">
              Auto
            </InputGroupButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="top"
            align="start"
            class="[--radius:0.95rem]"
          >
            <DropdownMenuItem>Auto</DropdownMenuItem>
            <DropdownMenuItem>Agent</DropdownMenuItem>
            <DropdownMenuItem>Manual</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <InputGroupText class="ml-auto">
          52% used
        </InputGroupText>
        <Separator orientation="vertical" class="!h-4" />
        <InputGroupButton
          variant="default"
          class="rounded-full"
          size="icon-xs"
          disabled
        >
          <ArrowUpIcon class="size-4" />
          <span class="sr-only">Send</span>
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
