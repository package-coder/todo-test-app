import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { TodoService } from 'src/services/todo.service';
import { Router } from '@angular/router';
import { TodoForm } from 'src/interfaces/todo.inteface';
import { TaskFormControl, Task } from 'src/interfaces/task.inteface';
import { TagList } from 'src/interfaces/tag.inteface';
import { DEFAULT_COLOR } from 'src/app/color-picker/color-picker.component';

interface TodoFormType extends TodoForm {
  tagSelector: FormControl<{ values: TagList } >
  taskInput: FormControl<string>
  colorPicker: FormControl<{ value: string }>
}

@Component({
  selector: 'app-add-todo-drawer',
  templateUrl: './add-todo-drawer.component.html',
  styleUrls: ['./add-todo-drawer.component.css']
})
export class AddTodoDrawerComponent implements OnInit {

  submitting: boolean = false;
  dateToday = moment().format('dddd, MMMM DD');

  form = new FormGroup<TodoFormType>({
    tasks: new FormArray<TaskFormControl>([], { 
      validators: [Validators.minLength(1)]
    }),
    tagSelector: new FormControl(),
    taskInput: new FormControl(),
    name: new FormControl(null, [Validators.required]),
    colorPicker: new FormControl()
  }) ;
  
  constructor(private router: Router, private todoService: TodoService) {}
  ngOnInit() {}

  addTask(e: any) {
    const tasks = this.form.get('tasks') as TodoFormType['tasks']
    const taskInput = this.form.get('taskInput')
    const colorPicker = this.form.get('colorPicker')?.value


    if(e?.keyCode == 13) {
      e?.preventDefault()
      const value = e?.target?.value;
      if(!value) return;

      const data: Task = { 
        name: value, 
        isCompleted: false, 
        isArchived: false,
        color: colorPicker?.value || DEFAULT_COLOR
      }
      tasks.push(new FormControl(data) as TaskFormControl)
      taskInput?.setValue('')
    }
  }

  
  completeTask(index: number) {
    const tasks = this.form.get('tasks') as TodoFormType['tasks']

    const task = tasks.value[index]
    if(task) {
      task.isCompleted = !task.isCompleted
    }
  }

  removeTask(index: number) {
    const tasks = this.form.get('tasks') as TodoFormType['tasks']
    tasks.removeAt(index)
  }

  handleSubmit() {
    this.submitting = true

    let data = this.form.value;
    this.todoService.saveTodo({
      name: data.name as string,
      tasks: data.tasks,
      tags: data?.tagSelector?.values || [],
      createdAt: moment().toISOString()
    })
      .subscribe(() => {
        this.submitting = false
        this.router.navigate(['/'], { queryParams: { "refresh": true } })
      })
  }
}
