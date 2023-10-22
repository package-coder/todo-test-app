import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from 'src/services/task.service';
import { TodoService } from 'src/services/todo.service';

@Component({
  selector: 'app-todo-detail-drawer',
  templateUrl: './todo-detail-drawer.component.html',
  styleUrls: ['./todo-detail-drawer.component.css']
})
export class TodoDetailDrawerComponent implements OnInit {

  todo!: any;
  loading: boolean = false;
  submitting: boolean = false;
  form!: FormGroup;

  constructor(private route: ActivatedRoute, private todoService: TodoService, private taskService: TaskService) { }

  ngOnInit() {
    this.route.params.subscribe(params => this.fetchTodo(Number(params['id'])));
  }

  initForm() {
    const tasks = this.todo?.tasks?.map((task: any) => new FormControl(task))
    this.form = new FormGroup({
      tasks: new FormArray(tasks, {
        validators: [Validators.minLength(1)]
      }),
      task: new FormControl(),
      name: new FormControl(this.todo?.name, [Validators.required])
    })
    
  }

  fetchTodo(todoId: number) {
    this.loading = true
    this.todoService.getTodo(todoId)
      .subscribe(
        data => this.todo = data,
        null,
        () => {
          this.loading = false
          this.initForm()
        }
      )
  }

  addTask(e: any) {
    if (e?.keyCode == 13) {
      e?.preventDefault()
      const value = e?.target?.value;
      if(!value) return;

      this.form.get('tasks')?.value?.push({ name: value, isCompleted: false })
      this.form.get('task')?.setValue('')

      this.todoService.addTaskToTodo(this.todo.id, { name: value, isCompleted: false }).subscribe()
    }
  }

  completeTask(index: number) {
    const task = this.todo?.tasks[index]
    if(task) {
      task.isCompleted = !task.isCompleted
      this.initForm()

      this.taskService.updateTask(task?.id, { ...task }).subscribe()
    }
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
