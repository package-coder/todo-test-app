import { Component, Input, OnDestroy, OnInit, forwardRef } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormArray, FormControl, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { snakeCase } from 'lodash';
import { Subject, takeUntil } from 'rxjs';
import { TagService } from 'src/services/tag.service';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TagsComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => TagsComponent),
      multi: true,
    },
  ]
})
export class TagsComponent implements OnInit, ControlValueAccessor, Validator, OnDestroy {
  destroySubject = new Subject<void>();

  @Input() defaultValues: any = [];
  @Input() readOnly: boolean = false;
  
  tagSelectorForm = new FormGroup({
    values: new FormArray<FormControl>([], Validators.minLength(1))
  })
  toggleAddTag: boolean = false

  constructor(private route: ActivatedRoute, private tagService: TagService) {}
  ngOnInit() {
    const tags = this.tagSelectorForm.get('values') as FormArray
    this.defaultValues.forEach((value: any) => tags.push(new FormControl(value)))
  }

  toggleAdd() {
    this.toggleAddTag = !this.toggleAddTag
  }


  addTag(e: any) {
    const tags = this.tagSelectorForm.get('values') as FormArray
    const todoId = Number(this.route.snapshot.params['id'])
    
    if(e?.keyCode == 13) {
      e?.preventDefault()
      let value = e?.target?.value;
      if(!value) return;
      if(!tags?.value.some((data: string) => data === snakeCase(value))) {

        const data = { name: snakeCase(value) }
        if(todoId) {
          this.tagService
          .addTodoTag(todoId, data)
          .subscribe(data => tags.push(new FormControl(data)))
        } else {
          tags.push(new FormControl(data))
        }
        e.target.value = ''
      }
      this.toggleAdd()
    }
  }

  removeTag(index: number) {
    if(this.readOnly) return;
    const tags = this.tagSelectorForm.get('values') as FormArray
    const todoId = Number(this.route.snapshot.params['id'])

    const tag = tags.at(index).value

    if(todoId && tag?.id) {
      this.tagService.untagTodo(todoId, tag.id).subscribe()
    }

    tags.removeAt(index)
  }

  registerOnChange(fn: any): void {
    this.tagSelectorForm.valueChanges.pipe(takeUntil(this.destroySubject)).subscribe(fn);
  }
  
  registerOnTouched(fn: any): void {
    this.tagSelectorForm.valueChanges.pipe(takeUntil(this.destroySubject)).subscribe(fn);
  }

  setDisabledState(isDisabled: boolean): void {
    isDisabled ? this.tagSelectorForm.disable() : this.tagSelectorForm.enable();
  }

  writeValue(tags: any): void {
    this.tagSelectorForm.patchValue(tags, { emitEvent: false});
  }

  validate(control: AbstractControl): ValidationErrors | null {
    return this.tagSelectorForm.valid ? null : { address: true };
  }
    
  ngOnDestroy(): void {
    this.destroySubject.next();
    this.destroySubject.complete();
  }
}
