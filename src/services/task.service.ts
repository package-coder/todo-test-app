import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


import env from 'src/environments/environment.dev'
import { Task } from 'src/interfaces/task.inteface';


@Injectable({
  providedIn: 'root'
})
export class TaskService {
  constructor(private client: HttpClient) { }

  updateTask(taskId: number, task: Task): Observable<Task> {
    const url = `${env.API_BASE_URL}/${env.API_PATHS.TASK}/${taskId}`
    return this.client.patch<Task>(url, task);
  }

  addTodoTask(todoId: number, task: Task): Observable<Task> {
    const url = `${env.API_BASE_URL}/${env.API_PATHS.TASK}/todo/${todoId}`
    return this.client.post<Task>(url, task);
  }
}
