import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { TodoCardComponent } from './todo/todo-card/todo-card.component';
import { TodoListComponent } from './todo/todo-list/todo-list.component';
import { Routes, RouterModule, Router } from '@angular/router';
import { AddTodoDrawerComponent } from './todo/add-todo-drawer/add-todo-drawer.component';


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
    RouterModule.forRoot(routes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
