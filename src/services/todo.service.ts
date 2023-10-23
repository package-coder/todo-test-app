import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import env from 'src/environments/environment.dev'

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  constructor(private client: HttpClient) { }

  getAllTodo(tagIdFilter?: number, search?: string): Observable<any[]> {
    let url = `${env.API_BASE_URL}/${env.API_PATHS.TODO}`
    if(tagIdFilter) {
      url = url.concat(`/?tagIdFilter=${tagIdFilter}`)
    }
    if(search) {
      url = url.concat(`/?search=${search}`)
    }
    return this.client.get<any[]>(url)
  }
  
  getTodo(todoId: number): Observable<any> {
    const url = `${env.API_BASE_URL}/${env.API_PATHS.TODO}/${todoId}`
    return this.client.get<any>(url)
  }

  saveTodo(todo: any): Observable<any> {
    const url = `${env.API_BASE_URL}/${env.API_PATHS.TODO}`
    return this.client.post<any>(url, todo);
  }

  updateTodo(todoId: number, todo: any): Observable<any> {
    const url = `${env.API_BASE_URL}/${env.API_PATHS.TODO}/${todoId}`
    return this.client.patch<any>(url, todo);
  }
  
  archiveTodo(todoId: number, archive: boolean): Observable<any> {
    const url = `${env.API_BASE_URL}/${env.API_PATHS.TODO}/${todoId}?archive=${archive}`
    return this.client.delete<any>(url);
  }
}
