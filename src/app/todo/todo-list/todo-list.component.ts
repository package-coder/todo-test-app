import { Component, OnInit } from '@angular/core';
import { TodoService } from 'src/services/todo.service';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent implements OnInit {

  todos: any[] = []
  constructor(private todoService: TodoService) { }

  ngOnInit() {
    this.todoService.getAllTodo().subscribe(data => this.todos = data)
  }

}
