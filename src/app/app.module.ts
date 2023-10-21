import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { TodoCardComponent } from './todo/todo-card/todo-card.component';
import { TodoListComponent } from './todo/todo-list/todo-list.component';
import { AddTodoDrawerComponent } from './todo/add-todo-drawer/add-todo-drawer.component';

import { TodoService } from 'src/services/todo.service';


const routes: Routes = [
  
  { path: 'todos/add', component: AddTodoDrawerComponent },
]
@NgModule({
  declarations: [		
    AppComponent,
    TodoCardComponent,
    TodoListComponent,
    AddTodoDrawerComponent
   ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(routes)
  ],
  providers: [
    TodoService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
