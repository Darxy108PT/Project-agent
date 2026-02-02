<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger} from '@/components/ui/sheet'
import { reactive, watch } from 'vue'


const emit = defineEmits(['update:apiKey'])

const props = defineProps<{
  apiKey: string,
}>()

const data = reactive({
  apiKey: props.apiKey,
})

watch(() => props.apiKey, v => {data.apiKey = v})

function storeKey() {
    localStorage.setItem('API Key', data.apiKey)
}

data.apiKey = localStorage.getItem('API Key') || ''
</script>

<template>
<Sheet>
    <div class="fixed top-4 right-4">
      <SheetTrigger as-child>
        <Button variant="outline" class="bg-neutral-400 hover:bg-neutral-300 cursor-pointer text-[18px] text-black" >
            Open API Key Menu
        </Button>
      </SheetTrigger>
    </div>


  <SheetContent side="right" class="bg-neutral-900">
    <SheetHeader>
      <SheetTitle class="text-white text-3xl pb-[30px]">Hi! Welcome to Groq</SheetTitle>
      <SheetDescription class="text-white">
        <p> Put here your API Key to start using Groq. You can change it when you want by clicking the button.</p>
        <p class="pt-[15px]"> If it's your first time, <b> save it before you close !!! </b></p>
        <p class="pt-[15px] text-lg"><b> Don't Forget: When you update the API Key Refresh the page after saving it!! </b></p>
      </SheetDescription>
    </SheetHeader>

    <div class="grid flex-1 auto-rows-min gap-6 px-4">
      <div class="grid gap-3">
        <Label for="api-key" class="text-white">API Key</Label>
        <Input v-model="data.apiKey" @input="emit('update:apiKey', data.apiKey)" class="text-white selection:bg-blue-800" />
      </div>
    </div>

    <SheetFooter>
      <SheetClose as-child>
        <Button class="bg-sky-800 hover:bg-sky-600 cursor-pointer" @click="storeKey(); emit('update:apiKey', data.apiKey)">Save changes</Button>
      </SheetClose>
      <SheetClose as-child>
        <Button class="bg-gray-400 hover:bg-gray-300 cursor-pointer text-black"> Close </Button>
      </SheetClose>
    </SheetFooter>
  </SheetContent>
</Sheet>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
