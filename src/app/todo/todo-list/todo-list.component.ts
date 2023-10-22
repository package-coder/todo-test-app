import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TodoService } from 'src/services/todo.service';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent implements OnInit {

  fetching: boolean = false;
  todos: any[] = []
  archivedTodos: any[] = []

  @Input() showArchives: boolean = false;
  constructor(private route: ActivatedRoute, private todoService: TodoService) {
  }

  ngOnInit() {
    this.fetchTodos()
    this.route.queryParams.subscribe(params => {
      if(params["refresh"]) {
        this.fetchTodos()
      }
    });
  }

  fetchTodos() {
    this.fetching = true
    this.todoService.getAllTodo()
      .subscribe(
        data => {
          this.todos = data.filter(data => !data.isArchived)
          this.archivedTodos = data.filter(data => data.isArchived)
        }, 
        null, 
        () => this.fetching = false
      )
  }
}
