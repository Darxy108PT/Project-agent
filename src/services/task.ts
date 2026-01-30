import { ref } from 'vue'

export class Task {
    id: number
    title: string
    description: string
    priorityLvl: number
    isDone: boolean
    date: Date

    constructor(id: number, title: string, description: string, 
        priorityLvl: number, isDone: boolean, date: Date) {

        this.id = id
        this.title = title
        this.description = description
        this.priorityLvl = priorityLvl
        this.isDone = isDone
        this.date = date
    }
}

export const tasksList = ref<Task[]>([])