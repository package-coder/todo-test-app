import { Component, OnDestroy, OnInit, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS, FormControl, FormGroup, Validators, AbstractControl, ValidationErrors, Validator, ControlValueAccessor } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';

@Component({
  selector: 'app-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: [],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ColorPickerComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => ColorPickerComponent),
      multi: true,
    },
  ]
})
export class ColorPickerComponent implements OnInit, ControlValueAccessor, Validator, OnDestroy {
  destroySubject = new Subject<void>();

  colors: string[] = [
    'lightgray',
    'rgba(249, 180, 171, 0.18)',
    'rgba(38, 78, 112, 0.18)',
    'rgba(103, 145, 134, 0.18)',
    'rgba(187, 212, 206, 0.18)',
    'rgba(255, 255, 0, 0.18)'
  ]
  selectedIndex: number = 0

  colorPicker = new FormGroup({
    value: new FormControl(this.colors[this.selectedIndex])
  })

  constructor() { }
  ngOnInit() {
    this.colorPicker.get('value')?.setValue(this.colors[this.selectedIndex])

  }

  handleSelect(index: number) {
    this.selectedIndex = index
    this.colorPicker.get('value')?.setValue(this.colors[index])
  }

  registerOnChange(fn: any): void {
    this.colorPicker.valueChanges.pipe(takeUntil(this.destroySubject)).subscribe(fn);
  }
  
  registerOnTouched(fn: any): void {
    this.colorPicker.valueChanges.pipe(takeUntil(this.destroySubject)).subscribe(fn);
  }

  setDisabledState(isDisabled: boolean): void {
    isDisabled ? this.colorPicker.disable() : this.colorPicker.enable();
  }

  writeValue(tags: any): void {
    this.colorPicker.patchValue(tags, { emitEvent: false});
  }

  validate(control: AbstractControl): ValidationErrors | null {
    return this.colorPicker.valid ? null : { address: true };
  }
    
  ngOnDestroy(): void {
    this.destroySubject.next();
    this.destroySubject.complete();
  }
}
