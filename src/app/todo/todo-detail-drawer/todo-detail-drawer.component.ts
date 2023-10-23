import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { DEFAULT_COLOR } from 'src/app/color-picker/color-picker.component';
import { ColorPickerValueType } from 'src/app/color-picker/color-picker.interface';
import { TagSelectorValueType } from 'src/app/tags/tags.interface';
import { Task, TaskFormControl } from 'src/interfaces/task.inteface';
import { Todo, TodoForm } from 'src/interfaces/todo.inteface';
import { TaskService } from 'src/services/task.service';
import { TodoService } from 'src/services/todo.service';

interface TodoFormType extends TodoForm {
  tagSelector: FormControl<TagSelectorValueType>
  colorPicker: FormControl<ColorPickerValueType>
  archivedTasks: FormArray<TaskFormControl>
  taskInput: FormControl<string | null>
}

@Component({
  selector: 'app-todo-detail-drawer',
  templateUrl: './todo-detail-drawer.component.html',
  styleUrls: ['./todo-detail-drawer.component.css']
})
export class TodoDetailDrawerComponent implements OnInit {

  loading: boolean = false;
  submitting: boolean = false;

  todo: any
  form = new FormGroup<TodoFormType>({
    tasks: new FormArray<TaskFormControl>([], {
      validators: [Validators.minLength(1)]
    }),
    tagSelector: new FormControl(),
    archivedTasks: new FormArray<TaskFormControl>([], {
      validators: [Validators.minLength(1)]
    }),
    taskInput: new FormControl(),
    name: new FormControl(null, [Validators.required]),
    colorPicker: new FormControl()
  });

  toggleTodoArchive: boolean = false;
  showArchivedTasks: boolean = false;

  constructor(private route: ActivatedRoute, private router: Router, private todoService: TodoService, private taskService: TaskService) { }

  ngOnInit() {
    this.route.params.subscribe(params => this.fetchTodo(Number(params['id'])));
  }

  updateForm(data: Todo) {
    const tasksForm = this.form.get('tasks') as TodoFormType['tasks']
    const archivedTasksForm = this.form.get('archivedTasks') as TodoFormType['tasks']

    const tasks = data.tasks?.filter((task: any) => !task.isArchived)
    const archivedTasks = data.tasks?.filter((task: any) => task.isArchived)

    tasks?.forEach((task: any) => tasksForm?.push(new FormControl(task)))
    archivedTasks?.forEach((task: any) => archivedTasksForm?.push(new FormControl(task)))

    this.form.get('name')?.setValue(data.name)
    this.form.get('tagSelector')?.setValue({ values: data.tags || null })
    this.todo = {
      ...data,
      createdAtFormatted: moment(data?.createdAt).format('dddd, MMMM DD')
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
    const tasks = this.form.get('tasks') as TodoFormType['tasks']
    const taskInput = this.form.get('taskInput')
    const todoId = Number(this.route.snapshot.params['id'])
    const colorPicker = this.form.get('colorPicker')?.value

    if (e?.keyCode == 13) {
      e?.preventDefault()

      const value = e?.target?.value;
      if (!value) return;

      taskInput?.setValue('')

      const data: Task = { 
        name: value, 
        isCompleted: false, 
        isArchived: false,
        color: colorPicker?.value || DEFAULT_COLOR
      }
      this.taskService
        .addTodoTask(todoId, data)
        .subscribe(data => tasks.push(new FormControl(data) as TaskFormControl))
    }
  }

  completeTask(index: number) {
    const tasks = this.form.get('tasks') as TodoFormType['tasks']
    const task = tasks.at(index).value

    if (!(task && task.id)) return;

    task.isCompleted = !task.isCompleted
      this.taskService
        .updateTask(task.id, { ...task })
        .subscribe()
  }

  archiveTask(index: number) {
    const tasks = this.form.get('tasks') as TodoFormType['tasks']
    const taskControl = tasks.at(index)
    const task = taskControl.value

    if (!(task && task.id)) return;

    task.isArchived = true
    this.taskService
      .updateTask(task.id, { ...task })
      .subscribe(() => {
        const archivedTasks = this.form.get('archivedTasks') as TodoFormType['tasks']
        archivedTasks.push(taskControl)
        tasks.removeAt(index)
      })
  }

  restoreTask(index: number) {
    const archivedTasks = this.form.get('archivedTasks') as TodoFormType['tasks']
    const taskControl = archivedTasks.at(index)
    const task = taskControl.value

    if (!(task && task.id)) return;

    task.isArchived = false
    this.taskService
      .updateTask(task.id, { ...task })
      .subscribe(() => {
        const tasks = this.form.get('tasks') as TodoFormType['tasks']
        tasks.push(taskControl)
        archivedTasks.removeAt(index)
      })
  }

  handleToggleArchive() {
    this.toggleTodoArchive = !this.toggleTodoArchive
  }

  handleArchiveTodo() {
    const todoId = Number(this.route.snapshot.params['id'])

    this.todoService.archiveTodo(todoId, !this.todo.isArchived)
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
    this.submitting = true
    const todoId = Number(this.route.snapshot.params['id'])

    let data = this.form.value;
    this.todoService.updateTodo(todoId, { name: data.name as string, createdAt: this.todo.createdAt })
      .subscribe(() => {
        this.submitting = false
        this.router.navigate(['/'], { queryParams: { "refresh": true } })
      })
  }
}
