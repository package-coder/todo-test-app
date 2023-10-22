import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { TaskService } from 'src/services/task.service';
import { TodoService } from 'src/services/todo.service';

@Component({
  selector: 'app-todo-detail-drawer',
  templateUrl: './todo-detail-drawer.component.html',
  styleUrls: ['./todo-detail-drawer.component.css']
})
export class TodoDetailDrawerComponent implements OnInit {

  loading: boolean = false;
  submitting: boolean = false;

  todo: any
  form = new FormGroup({
    tasks: new FormArray<FormControl>([], {
      validators: [Validators.minLength(1)]
    }),
    tagSelector: new FormControl(),
    archivedTasks: new FormArray<FormControl>([], {
      validators: [Validators.minLength(1)]
    }),
    taskInput: new FormControl(),
    name: new FormControl('', [Validators.required])
  });

  toggleTodoArchive: boolean = false;
  showArchivedTasks: boolean = false;

  constructor(private route: ActivatedRoute, private router: Router, private todoService: TodoService, private taskService: TaskService) { }

  ngOnInit() {
    this.route.params.subscribe(params => this.fetchTodo(Number(params['id'])));
  }

  updateForm(data: any) {
    const tasksForm = this.form.get('tasks') as FormArray
    const archivedTasksForm = this.form.get('archivedTasks') as FormArray

    const tasks = data.tasks.filter((task: any) => !task.isArchived)
    const archivedTasks = data.tasks.filter((task: any) => task.isArchived)

    tasks.forEach((task: any) => tasksForm?.push(new FormControl(task)))
    archivedTasks.forEach((task: any) => archivedTasksForm?.push(new FormControl(task)))

    this.form.get('name')?.setValue(data.name)
    this.form.get('tagSelector')?.setValue({ values: data.tags })
    this.todo = {
      ...data,
      createdAt: moment(data?.createdAt).format('dddd, MMMM DD')
    }
  }

  fetchTodo(todoId: number) {
    this.loading = true
    this.todoService?.getTodo(todoId)
      .subscribe(
        data => this.updateForm(data),
        null,
        () => this.loading = false
      )
  }

  addTask(e: any) {
    const tasks = this.form.get('tasks') as FormArray
    const taskInput = this.form.get('taskInput') as FormControl
    const todoId = Number(this.route.snapshot.params['id'])

    if (e?.keyCode == 13) {
      e?.preventDefault()

      const value = e?.target?.value;
      if (!value) return;

      tasks.push(new FormControl({ name: value, isCompleted: false }))
      taskInput.setValue('')

      this.todoService
        .addTaskToTodo(todoId, { name: value, isCompleted: false })
        .subscribe(() => this.fetchTodo(todoId))
    }
  }

  completeTask(index: number) {
    const tasks = this.form.get('tasks') as FormArray
    const task = tasks.at(index).value

    task.isCompleted = !task.isCompleted
    this.taskService
      .updateTask(task.id, { ...task })
      .subscribe()
  }

  archiveTask(index: number) {
    const tasks = this.form.get('tasks') as FormArray
    const taskControl = tasks.at(index)
    const task = taskControl.value

    task.isArchived = true
    this.taskService
      .updateTask(task.id, { ...task })
      .subscribe(() => {
        const archivedTasks = this.form.get('archivedTasks') as FormArray
        archivedTasks.push(taskControl)
        tasks.removeAt(index)
      })
  }

  restoreTask(index: number) {
    const archivedTasks = this.form.get('archivedTasks') as FormArray
    const taskControl = archivedTasks.at(index)
    const task = taskControl.value

    task.isArchived = false
    this.taskService
      .updateTask(task.id, { ...task })
      .subscribe(() => {
        const tasks = this.form.get('tasks') as FormArray
        tasks.push(taskControl)
        archivedTasks.removeAt(index)
      })
  }

  handleToggleArchive() {
    this.toggleTodoArchive = !this.toggleTodoArchive
  }

  handleArchiveTodo() {
    const todoId = Number(this.route.snapshot.params['id'])

    this.todoService.updateTodo(todoId, { ...this.todo, isArchived: true })
      .subscribe(
        () => {
          this.handleToggleArchive()
          this.router.navigate(['/'], { queryParams: { "refresh": true } })
        }
      )
  }

  toggleArchivedTasks() {
    this.showArchivedTasks = !this.showArchivedTasks
  }

  handleSubmit() {
    console.log(this.form)
    // this.submitting = true

    // const value = {
    //   ...omit(this.form.value, ['task', 'tasks']),
    //   createdAt: moment().toISOString()
    // }
    // this.todoService.saveTodo(value)
    //   .subscribe(() => {
    //     this.submitting = false
    //     this.router.navigate(['/'], { queryParams: { "refresh": true } })
    //   })
  }
}
