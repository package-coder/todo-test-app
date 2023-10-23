import { FormArray, FormControl } from "@angular/forms"
import { TagList } from "./tag.inteface"
import { TaskFormControl, TaskList } from "./task.inteface"


export interface Todo {
  id?: number
  name: string
  isArchived?: boolean
  createdAt?: Date | string
  tasks?: TaskList
  tags?: TagList
}

export interface TodoForm {
  name: FormControl<string | null>
  tasks: FormArray<TaskFormControl>
}



export interface TodoList extends Array<Todo> {}