import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { TodoService } from 'src/services/todo.service';
import { omit } from 'lodash'
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-todo-drawer',
  templateUrl: './add-todo-drawer.component.html',
  styleUrls: ['./add-todo-drawer.component.css']
})
export class AddTodoDrawerComponent implements OnInit {

  form!: FormGroup;
  submitting: boolean = false;
  dateToday!: string;
  constructor(private router: Router, private todoService: TodoService) {}

  ngOnInit() {

    this.form = new FormGroup({
      taskList: new FormArray([] as any[], { 
        validators: [Validators.minLength(1)]
      }),
      task: new FormControl(),
      name: new FormControl(null, [Validators.required])

    })

    this.dateToday = moment().format('dddd, MMMM DD')
  }

  addTask(e: any) {
    if(e?.keyCode == 13) {
      e?.preventDefault()
      this.form.get('taskList')?.value?.push(e?.target?.value)
      this.form.get('task')?.setValue('')
    }
  }

  handleSubmit() {
    this.submitting = true

    const value = {
      ...omit(this.form.value, ['task', 'taskList']),
      createdAt: moment().toISOString()
    }
    this.todoService.saveTodo(value)
      .subscribe(() => {
        this.submitting = false
        this.router.navigate(['/'], { queryParams: { "refresh": true } })
      })
  }
}
