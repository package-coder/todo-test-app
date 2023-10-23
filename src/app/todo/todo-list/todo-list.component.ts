import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Todo, TodoList } from 'src/interfaces/todo.inteface';
import { TodoService } from 'src/services/todo.service';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: []
})
export class TodoListComponent implements OnInit {

  fetching: boolean = false;
  todos?: TodoList = []
  archivedTodos?: TodoList = []

  @Input() showArchives: boolean = false;
  constructor(private route: ActivatedRoute, private todoService: TodoService) {
  }

  ngOnInit() {
    this.fetchTodos()
    this.route.queryParamMap.subscribe(params => {
      const tagId = params.get('tag')
      const search = params.get('search') as string
      this.fetchTodos(
        tagId ? Number(tagId) : undefined, 
        search
      )
    });
  }

  fetchTodos(tagIdFilter?: number, search?: string) {
    this.fetching = true
    this.todoService.getAllTodo(tagIdFilter, search)
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
