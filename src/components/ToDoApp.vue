<script setup lang="ts">
import { todoList } from '@/services/todoList';
import { computed, ref, watch } from 'vue'

const activeTab = ref(localStorage.getItem("activeTab") || "all")
const search = ref(localStorage.getItem("search") || "")


watch(search, v => localStorage.setItem("search", v))
watch(activeTab, v => localStorage.setItem("activeTab", v))


const todoListTasks = computed(() => todoList.tasksArray)


const filteredTasks = computed(() => {
  let list = todoListTasks.value

  if (activeTab.value === "pending")
    list = list.filter(t => !t.isDone)

  if (activeTab.value === "completed")
    list = list.filter(t => t.isDone)

  if (search.value.trim() !== "")
    list = list.filter(t =>
      t.title.toLowerCase().includes(search.value.toLowerCase())
    )

  return list
})


const sortedTasks = computed(() =>
  [...filteredTasks.value].sort((a, b) => b.priorityLvl - a.priorityLvl)
)
</script>



<template>
  <div class="w-[900px] h-[70%] ml-auto mr-auto mt-[10px] relative right-[30px]">

    <button
      aria-label="All"
      :class="['ml-[10px] w-[80px] h-[30px] border-t border-r border-l cursor-pointer rounded-t-[18px]', 
      activeTab === 'all' ? 'bg-teal-600 text-white' : 'bg-neutral-800 text-gray-300']"
      @click="activeTab = 'all'">
      All
    </button>
    

    <button
      aria-label="All"
      :class="['ml-[10px] w-[100px] h-[30px] border-t border-r border-l cursor-pointer rounded-t-[18px]', 
      activeTab === 'pending' ? 'bg-cyan-600 text-white' : 'bg-neutral-800 text-gray-300']"
      @click="activeTab = 'pending'">
      Pending
    </button>


    <button
      aria-label="All"
      :class="['ml-[10px] w-[120px] h-[30px] border-t border-r border-l cursor-pointer rounded-t-[18px]', 
      activeTab === 'completed' ? 'bg-emerald-600 text-white' : 'bg-neutral-800 text-gray-300']"
      @click="activeTab = 'completed'">
      Completed
    </button>

    <input type="text" v-model="search" placeholder="Search name.." class="ml-[265px] w-[300px]"/>

    <div class="bg-neutral-800 w-full h-full overflow-x-auto border rounded-[10px]">
      <div class="w-full">
        <div class="todo-container overflow-y-auto h-[470px] p-4 scrollbar-custom">
          <slot />
           <div v-for="task in sortedTasks" :key="task.id"
              class="flex flex-col gap-1 p-4 mb-3 rounded-lg border border-gray-300 shadow-sm bg-neutral-500">

              <div class="flex justify-between items-center">
                <p class="text-lg font-bold text-emerald-300">{{ task.title }}</p>
                <p class="text-sm text-tal-300 font-semibold">{{ new Date(task.date).toLocaleDateString() }}</p>
              </div>

              <p class="text-white text-[15px] leading-snug font-semibold">
                {{ task.description }}
              </p>

              <div class="flex justify-between items-center mt-2">
                <span class="px-2 py-1 text-xs rounded-md bg-gray-700"
                  :class="{
                    'bg-purple-500 text-purple-950': task.priorityLvl === 5,
                    'bg-red-400 text-red-900': task.priorityLvl === 4,
                    'bg-orange-300 text-orange-900': task.priorityLvl === 3,
                    'bg-yellow-200 text-yellow-900': task.priorityLvl === 2,
                    'bg-green-400 text-green-900': task.priorityLvl === 1
                  }">
                  {{ task.priorityLvl }} Priority
                </span>

                <span class="text-sm font-bold"
                  :class="task.isDone ? 'text-green-300' : 'text-gray-300'">
                  {{ task.isDone ? 'Completed' : 'Pending' }}
                </span>
              </div>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
