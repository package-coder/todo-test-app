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
      tasks: new FormArray([] as any[], { 
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
      const value = e?.target?.value;
      if(!value) return;

      this.form.get('tasks')?.value?.push({ name: value, isCompleted: false })
      this.form.get('task')?.setValue('')
    }
  }

  
  completeTask(index: number) {
    const task = this.form.get('tasks')?.value[index]
    if(task) {
      task.isCompleted = !task.isCompleted
    }
  }

  removeTask(index: number) {
    
  }

  handleSubmit() {
    this.submitting = true

    const value = {
      ...omit(this.form.value, ['task']),
      createdAt: moment().toISOString()
    }
    this.todoService.saveTodo(value)
      .subscribe(() => {
        this.submitting = false
        this.router.navigate(['/'], { queryParams: { "refresh": true } })
      })
  }
}
