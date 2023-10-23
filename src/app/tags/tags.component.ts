import { Component, Input, OnDestroy, OnInit, forwardRef } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormArray, FormControl, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { snakeCase } from 'lodash';
import { Subject, takeUntil } from 'rxjs';
import { Tag, TagFormControl, TagList } from 'src/interfaces/tag.inteface';
import { TagService } from 'src/services/tag.service';
import { TagSelectorFormType } from './tags.interface';


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
  toggleAddTag: boolean = false

  @Input() defaultValues?: TagList = [];
  @Input() readOnly: boolean = false;
  
  tagSelectorForm = new FormGroup<TagSelectorFormType>({
    values: new FormArray<TagFormControl>([], Validators.minLength(1))
  })

  constructor(private route: ActivatedRoute, private tagService: TagService) {}
  
  ngOnInit() {
    const tags = this.tagSelectorForm.get('values') as TagSelectorFormType['values']
    this.defaultValues?.forEach((tag: Tag) => tags.push(new FormControl(tag)))
  }

  toggleAdd() {
    this.toggleAddTag = !this.toggleAddTag
  }


  addTag(e: any) {
    const tags = this.tagSelectorForm.get('values') as TagSelectorFormType['values']
    const todoId = Number(this.route.snapshot.params['id'])

    if(e?.keyCode == 13) {
      e?.preventDefault()
      let value = e?.target?.value;
      if(!value) return;

      value = snakeCase(value)

      if(!tags.value.some((tag: Tag | null) => tag?.name === value)) {
        const data: Tag = { name: value, isArchived: false }

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
    const tags = this.tagSelectorForm.get('values') as TagSelectorFormType['values']
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
