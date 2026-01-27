<script setup lang="ts">
import { ArrowUpIcon, PlusIcon } from 'lucide-vue-next'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupText, InputGroupTextarea } from '@/components/ui/input-group'
//import { Separator } from '@/components/ui/separator'
import { reactive, watch, ref } from 'vue'

const props = defineProps<{
  main: (prompt: string) => void
  loading: boolean
  prompt: string
}>()

const data = reactive({
  main: props.main,
  loading: props.loading,
  prompt: props.prompt,
})

let isDisabled = ref(true)


watch(() => props.loading, v => {data.loading = v})

watch(() => props.prompt, v => {
  data.prompt = v
  enableButton()
})

watch(() => props.main, v => data.main = v)

function verifyKey(event: KeyboardEvent) {
  if (event.key === "Enter") {
    if (event.shiftKey) {
      return
    }
    event.preventDefault()
    if(isDisabled.value == false) {
      data.main(data.prompt)
      data.prompt = ""
    }
  }
}


function enableButton() {
  isDisabled.value = data.loading || data.prompt.trim() === ""
}
</script>

<template>
<div class="fixed bottom-0 left-0 w-full bg-neutral-900 pb-8 pl-8 h-[180px]">
  <InputGroup class="fixed bottom-5 w-full max-w-3xl bg-zinc-800 text-white p-4 max-h-[150px] overflow-y-auto left-1/2 -translate-x-1/2 rounded-4xl">
      <InputGroupTextarea
        v-model="data.prompt"
        @update:modelValue="enableButton"
        @keydown="verifyKey"
      />
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
          <!--52% used-->
        </InputGroupText>
        <!--<Separator orientation="vertical" class="!h-4" />-->
        <InputGroupButton
          variant="default"
          class="rounded-full"
          size="icon-xs"
          @click="data.main(data.prompt); data.prompt=''"
          :disabled="isDisabled"
        >
          <ArrowUpIcon class="size-4" />
          <span class="sr-only">Send</span>
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
</div>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
