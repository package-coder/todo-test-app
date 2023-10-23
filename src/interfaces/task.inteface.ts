import { FormControl } from "@angular/forms"


export interface Task {
  id?: number
  name: string
  isCompleted?: boolean
  isArchived?: boolean
  color: string
  todoId?: number
}


export interface TaskFormControl extends FormControl<Task> {}

export interface TaskList extends Array<Task> {}