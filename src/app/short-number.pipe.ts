import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shortNumber'
})
export class ShortNumberPipe implements PipeTransform {
  transform(value: number): string {
    const suffixes = ['', 'K', 'M', 'B', 'T'];
    const order = Math.floor(Math.log10(value) / 3);
    const suffix = suffixes[order];

    return suffix ? (value / Math.pow(10, order * 3)).toFixed(1) + suffix : '' + value;
  }
}