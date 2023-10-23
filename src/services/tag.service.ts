import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import env from 'src/environments/environment.dev'
import { Tag, TagList } from 'src/interfaces/tag.inteface';

@Injectable({
  providedIn: 'root'
})
export class TagService {


  constructor(private client: HttpClient) { }

  getAllActiveTag(): Observable<TagList> {
    const url = `${env.API_BASE_URL}/${env.API_PATHS.TAG}/?activeTags=true`
    return this.client.get<TagList>(url)
  }

  addTodoTag(todoId: number, tag: Tag): Observable<Tag> {
    const url = `${env.API_BASE_URL}/${env.API_PATHS.TAG}/todo/${todoId}`
    return  this.client.post<Tag>(url, tag);
  }

  addTodoTagById(tagId: number, todoId: number): Observable<Tag> {
    const url = `${env.API_BASE_URL}/${env.API_PATHS.TAG}/${tagId}/todo/${todoId}`
    return  this.client.post<Tag>(url, {});
  }

  untagTodo(todoId: number, tagId: number): Observable<Tag> {
    const url = `${env.API_BASE_URL}/${env.API_PATHS.TAG}/${tagId}/todo/${todoId}`
    return this.client.delete<Tag>(url);
  }

}
