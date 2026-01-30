import { Task, tasksList } from "./task.ts"
import { reactive, shallowReactive } from "vue"

export class ToDoList {
    tasks: Map<any, any>
    LSkey: string

    constructor() {
        this.tasks = shallowReactive(new Map<number, Task>())
        this.LSkey = 'tasks'
        this.loadFromLocalStorage()
    }

    addTask(task: Task) {
        this.tasks.set(task.id, task)
        tasksList.value.push(task)

        this.updateLocalStorage(this.tasks)
    }

    removeTask(task: Task){
        console.log("You deleted the task: " + task.title)
        this.tasks.delete(task.id)
        tasksList.value = tasksList.value.filter(t => t.id !== task.id)

        this.updateLocalStorage(this.tasks)
    }

    updateTask(task: Task, title: string, description: string, priorityLvl: number, isDone: boolean){
        task.title = title
        task.description = description
        task.priorityLvl = priorityLvl
        task.isDone = isDone

        this.tasks.set(task.id, task)
        this.updateLocalStorage(this.tasks)
    }

    checkTask(task: Task) {
        this.updateTask(task, task.title, task.description, task.priorityLvl, true)
    }

    createTask(title: string, description: string, priorityLvl: number, date: Date) {
        const taskID = Date.now()
        const newTask = new Task (taskID, title, description, priorityLvl, false, date)
        this.addTask(newTask)
        console.log(this)
    }

    getProduct(id: number){
        for (let task of this.tasks.keys()) {
            if (task.id === id) {
                return task
            }
        }
    }

    updateLocalStorage(taskMap: Map<number, Task>) {
        const LSArray = Array.from(taskMap.entries())
        localStorage.removeItem(this.LSkey)
        localStorage.setItem(this.LSkey, JSON.stringify(LSArray))
    }

    loadFromLocalStorage() {
        const raw = localStorage.getItem(this.LSkey)
        if (!raw) return

        const parsed: [number, Task][] = JSON.parse(raw)

        parsed.forEach(([id, task]) => {
            this.tasks.set(id, task)
            tasksList.value.push(task)
        })
    }
}

export const todoList = reactive(new ToDoList())