import { Component, Input, OnInit } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-todo-card',
  templateUrl: './todo-card.component.html',
  styleUrls: ['./todo-card.component.css']
})
export class TodoCardComponent implements OnInit {
  @Input() todo: any;
  constructor() { }

  ngOnInit() {
    this.todo.createdAt = moment(this.todo.createdAt).format('ddd, MMM DD')
  }

}
