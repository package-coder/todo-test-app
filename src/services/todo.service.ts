import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import env from 'src/environments/environment.dev'
import { Todo, TodoList } from 'src/interfaces/todo.inteface';

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  constructor(private client: HttpClient) { }

  getAllTodo(tagIdFilter?: number, search?: string): Observable<TodoList> {
    let url = `${env.API_BASE_URL}/${env.API_PATHS.TODO}`
    if(tagIdFilter) {
      url = url.concat(`/?tagIdFilter=${tagIdFilter}`)
    }
    if(search) {
      url = url.concat(`/?search=${search}`)
    }
    return this.client.get<TodoList>(url)
  }
  
  getTodo(todoId: number): Observable<Todo> {
    const url = `${env.API_BASE_URL}/${env.API_PATHS.TODO}/${todoId}`
    return this.client.get<Todo>(url)
  }

  saveTodo(todo: Todo): Observable<Todo> {
    const url = `${env.API_BASE_URL}/${env.API_PATHS.TODO}`
    return this.client.post<Todo>(url, todo);
  }

  updateTodo(todoId: number, todo: Todo): Observable<Todo> {
    const url = `${env.API_BASE_URL}/${env.API_PATHS.TODO}/${todoId}`
    return this.client.patch<Todo>(url, todo);
  }
  
  archiveTodo(todoId: number, archive: boolean): Observable<Todo> {
    const url = `${env.API_BASE_URL}/${env.API_PATHS.TODO}/${todoId}?archive=${archive}`
    return this.client.delete<Todo>(url);
  }
}
