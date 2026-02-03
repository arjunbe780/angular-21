import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-app-input',
  templateUrl: './app-input.html',
  styleUrl: './app-input.css',
  standalone: true,
  imports: [ReactiveFormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AppInput),
      multi: true,
    },
  ],
})
export class AppInput implements ControlValueAccessor {
  @Input() label = '';
  @Input() placeholder = '';
  @Input() type = 'text';

  value: any = '';
  onChange: any = () => {};
  onTouched: any = () => {};

  // 1. Writes value from the form model to the view
  writeValue(value: any): void {
    this.value = value;
  }

  // 2. Registers a callback function that is called when the value changes in the UI
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  // 3. Registers a callback function that is called when the control is touched
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  onInputChange(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    this.value = val;
    this.onChange(val); // Send the value back to the Angular Form
  }
}
