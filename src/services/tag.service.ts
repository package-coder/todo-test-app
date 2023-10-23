import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import env from 'src/environments/environment.dev'

@Injectable({
  providedIn: 'root'
})
export class TagService {


  constructor(private client: HttpClient) { }

  getAllActiveTag() {
    const url = `${env.API_BASE_URL}/${env.API_PATHS.TAG}/?activeTags=true`
    return this.client.get<any[]>(url)
  }

  addTodoTag(todoId: number, tag: object): Observable<any> {
    const url = `${env.API_BASE_URL}/${env.API_PATHS.TAG}/todo/${todoId}`
    return  this.client.post<any>(url, tag);
  }

  addTodoTagById(tagId: number, todoId: number): Observable<any> {
    const url = `${env.API_BASE_URL}/${env.API_PATHS.TAG}/${tagId}/todo/${todoId}`
    return  this.client.post<any>(url, {});
  }

  untagTodo(todoId: number, tagId: number): Observable<any> {
    const url = `${env.API_BASE_URL}/${env.API_PATHS.TAG}/${tagId}/todo/${todoId}`
    return this.client.delete<any>(url);
  }

}
