<script setup lang="ts">
import { ArrowUpIcon } from 'lucide-vue-next'
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupText, InputGroupTextarea } from '@/components/ui/input-group'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { reactive, watch, ref } from 'vue'

const props = defineProps<{
  main: (prompt: string) => void
  loading: boolean
  prompt: string
  model: string
}>()

const data = reactive({
  main: props.main,
  loading: props.loading,
  prompt: props.prompt,
  model: props.model,
})

const emit = defineEmits(['update:model'])


let isDisabled = ref(true)
let model = ref('smart')

watch(() => props.loading, v => {data.loading = v})
watch(() => props.main, v => data.main = v)
watch(() => props.prompt, v => {data.prompt = v, enableButton()})
watch(model, (value) => {
  const mapped =
    value === "smart"
      ? "openai/gpt-oss-120b"
      : "openai/gpt-oss-20b"

  data.model = mapped
  emit('update:model', mapped)
})

function checkKey(event: KeyboardEvent) {
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
  <InputGroup class="fixed bottom-5 w-full max-w-3xl bg-zinc-800 text-white p-4 max-h-[160px] overflow-y-auto left-1/2 -translate-x-1/2 rounded-xl">
      <InputGroupTextarea
        placeholder="Ask, Search or Chat..."
        v-model="data.prompt"
        @update:modelValue="enableButton"
        @keydown="checkKey"
        autofocus
      />
      <InputGroupAddon align="block-end">
        <Select v-model="model" align="start" side="top">
          <SelectTrigger class="w-[100px] rounded-full">
            <SelectValue :placeholder="`${model === 'smart' ? 'Smart' : 'Fast'}`" class="text-white"/>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="smart">Smart</SelectItem>
              <SelectItem value="fast">Fast</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <InputGroupText class="ml-auto">
        </InputGroupText>
        <InputGroupButton
          variant="default"
          class="rounded-full"
          size="icon-xs"
          @click="data.main(data.prompt); data.prompt=''"
          :disabled="isDisabled" >
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
