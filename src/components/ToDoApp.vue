<script setup lang="ts">
import { tasksList } from '@/services/task';
import { todoList } from '@/services/todoList';
import { Button } from '@/components/ui/button'
import { computed, ref } from 'vue'

const activeTab = ref('all')


const filteredTasks = computed(() => {
  if (activeTab.value === 'pending') return tasksList.value.filter(t => !t.isDone)
  if (activeTab.value === 'completed') return tasksList.value.filter(t => t.isDone)
  return tasksList.value
})


const sortedTasks = computed(() => {
  return [...filteredTasks.value].sort(
    (a, b) => (b.priorityLvl - a.priorityLvl) * 1
  )
})
</script>


<template>
  <div class="w-[900px] h-[70%] ml-auto mr-[30px] mt-[10px] relative right-[30px]">

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

    <div class="bg-neutral-800 w-full h-full overflow-x-auto border rounded-[10px]">
      <div class="w-full">
        <div class="todo-container overflow-y-auto h-[470px] p-4 scrollbar-custom">
          <slot />
            <div v-for="task in sortedTasks" :key="task.id"
                class="flex flex-col gap-1 p-4 mb-3 rounded-lg border border-gray-300 shadow-sm bg-neutral-500">

              <div class="flex justify-between items-center">
                <p class="text-lg font-bold text-emerald-300">{{ task.title }}</p>
                <p class="text-sm text-teal-300 font-semibold">{{ new Date(task.date).toLocaleDateString() }}</p>

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

                <button class="bg-green-800 pt-[5px] pb-[5px] pr-[10px] pl-[10px] rounded-[12px] border hover:bg-green-600 cursor-pointer" 
                @click="todoList.checkTask(task)">
                  Check Task
                </button>
                
                <button class="bg-cyan-800 pt-[5px] pb-[5px] pr-[10px] pl-[10px] rounded-[12px] border hover:bg-cyan-600 cursor-pointer" 
                @click="todoList.updateTask(task, 'Task ' + task.id + ' V2', 'Test for the update method', Math.floor(Math.random() * 5) + 1, task.isDone)">
                  Update Task
                </button>
                
                <button class="bg-red-800 pt-[5px] pb-[5px] pr-[10px] pl-[10px] rounded-[12px] border hover:bg-red-600 cursor-pointer" 
                @click="todoList.removeTask(task)">
                  Remove Task
                </button>

                <span class="text-sm font-bold"
                  :class="task.isDone ? 'text-green-300' : 'text-gray-300'">
                  {{ task.isDone ? 'Completed' : 'Pending' }}
                </span>
              </div>
            </div>

            <div class="fixed top-18 right-4 grid grid-rows-5 gap-[20px]">

              <Button 
                variant="outline"
                @click="todoList.createTask('Task ' + Date.now(), 'Just a test', Math.floor(Math.random() * 5) + 1, new Date())"
                class="bg-neutral-400 hover:bg-neutral-300 cursor-pointer text-[18px]">
                Create Task
              </Button>

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
