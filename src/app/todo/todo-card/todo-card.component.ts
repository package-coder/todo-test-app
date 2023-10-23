import { Component, Input, OnInit } from '@angular/core';
import * as moment from 'moment';
import { Todo } from 'src/interfaces/todo.inteface';

@Component({
  selector: 'app-todo-card',
  templateUrl: './todo-card.component.html',
  styleUrls: ['./todo-card.component.css']
})
export class TodoCardComponent implements OnInit {
  @Input() todo!: Todo;
  constructor() { }

  ngOnInit() {
    this.todo.createdAt = moment(this.todo.createdAt).format('ddd, MMM DD')
  }

}
