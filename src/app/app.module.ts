import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { TodoCardComponent } from './todo/todo-card/todo-card.component';
import { TodoListComponent } from './todo/todo-list/todo-list.component';
import { AddTodoDrawerComponent } from './todo/add-todo-drawer/add-todo-drawer.component';
import { TodoDetailDrawerComponent } from './todo/todo-detail-drawer/todo-detail-drawer.component';

import { TodoService } from 'src/services/todo.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TaskService } from 'src/services/task.service';
import { TagsComponent } from './tags/tags.component';
import { TagsFilterComponent } from './tags-filter/tags-filter.component';


const routes: Routes = [
  { path: 'todos/add', component: AddTodoDrawerComponent },
  { path: 'todos/:id', component: TodoDetailDrawerComponent },
]
@NgModule({
  declarations: [
    AppComponent,
    TagsComponent,
    TodoCardComponent,
    TodoListComponent,
    TagsFilterComponent,
    AddTodoDrawerComponent,
    TodoDetailDrawerComponent,
   ],
  imports: [
    FormsModule,
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes)
  ],
  providers: [
    TodoService,
    TaskService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
