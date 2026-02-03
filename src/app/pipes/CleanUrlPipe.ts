import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cleanUrl',
  standalone: true,
})
export class CleanUrlPipe implements PipeTransform {
  transform(value: string | null): string {
    if (!value) return '';
    let newValue = value.replace(/\\/g, '');
    console.log('new------', newValue);
    // This replaces the escaped slashes with regular slashes
    return newValue;
  }
}
