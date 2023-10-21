import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import env from 'src/environments/environment.dev'

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  constructor(private client: HttpClient) { }

  getAllTodo(): Observable<any[]> {
    const url = `${env.API_BASE_URL}/${env.API_PATHS.TODO}`
    return this.client.get<any[]>(url)
  }

  saveTodo(todo: any): Observable<any> {
    const url = `${env.API_BASE_URL}/${env.API_PATHS.TODO}`
    return this.client.post<any>(url, todo);
  }
}
