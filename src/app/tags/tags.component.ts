import { Component, Input, OnDestroy, OnInit, forwardRef } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormArray, FormControl, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator, Validators } from '@angular/forms';
import { snakeCase } from 'lodash';
import { Subject, takeUntil } from 'rxjs';

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
  tagSelectorForm = new FormGroup({
    values: new FormArray<FormControl>([], Validators.minLength(1))
  })
  toggleAddTag: boolean = false

  constructor() {}
  ngOnInit() {
    const tags = this.tagSelectorForm.get('values') as FormArray
    this.defaultValues.forEach((value: any) => tags.push(new FormControl(value)))
  }

  toggleAdd() {
    this.toggleAddTag = !this.toggleAddTag
  }


  addTag(e: any) {
    const tags = this.tagSelectorForm.get('values') as FormArray
    
    if(e?.keyCode == 13) {
      e?.preventDefault()
      const value = e?.target?.value;
      if(!value) return;
      if(!tags?.value.some((data: string) => data === snakeCase(value))) {
        tags.push(new FormControl({ name: snakeCase(value) }))
        e.target.value = ''
      }
      this.toggleAdd()
    }
  }

  removeTag(index: number) {
    const tags = this.tagSelectorForm.get('values') as FormArray
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
