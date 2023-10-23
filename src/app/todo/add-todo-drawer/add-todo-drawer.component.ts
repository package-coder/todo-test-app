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

  form = new FormGroup({
    tasks: new FormArray<FormControl>([], { 
      validators: [Validators.minLength(1)]
    }),
    tagSelector: new FormControl(),
    taskInput: new FormControl<string | null>(null),
    name: new FormControl(null, [Validators.required]),
    colorPicker: new FormControl()
  }) ;
  submitting: boolean = false;
  dateToday = moment().format('dddd, MMMM DD');

  constructor(private router: Router, private todoService: TodoService) {}
  ngOnInit() {}

  addTask(e: any) {
    const tasks = this.form.get('tasks') as FormArray
    const taskInput = this.form.get('taskInput') as FormControl
    const colorPicker = this.form.get('colorPicker')?.value


    if(e?.keyCode == 13) {
      e?.preventDefault()
      const value = e?.target?.value;
      if(!value) return;

      tasks.push(new FormControl({ name: value, isCompleted: false, color: colorPicker?.value }))
      taskInput.setValue('')
    }
  }

  
  completeTask(index: number) {
    const tasks = this.form.get('tasks') as FormArray

    const task = tasks.value[index]
    if(task) {
      task.isCompleted = !task.isCompleted
    }
  }

  removeTask(index: number) {
    const tasks = this.form.get('tasks') as FormArray
    tasks.removeAt(index)
  }

  handleSubmit() {
    this.submitting = true

    let data = this.form.value;
    this.todoService.saveTodo({
      name: data.name,
      tasks: data.tasks,
      tags: data.tagSelector.values,
      createdAt: moment().toISOString()
    })
      .subscribe(() => {
        this.submitting = false
        this.router.navigate(['/'], { queryParams: { "refresh": true } })
      })
  }
}
