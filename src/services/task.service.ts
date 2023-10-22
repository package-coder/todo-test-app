import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


import env from 'src/environments/environment.dev'


@Injectable({
  providedIn: 'root'
})
export class TaskService {
  constructor(private client: HttpClient) { }

  updateTask(taskId: number, task: any): Observable<any> {
    const url = `${env.API_BASE_URL}/${env.API_PATHS.TASK}/${taskId}`
    return this.client.patch<any>(url, task);
  }

}
