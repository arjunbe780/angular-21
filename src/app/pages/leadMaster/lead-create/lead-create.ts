import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-lead-create',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lead-create.html',
  styleUrl: './lead-create.css',
})
export class LeadCreate {
  data = signal<any[]>([]);
  columns = signal<string[]>([]);
  isLoading = signal(false);

  onFileChange(event: any) {
    this.isLoading.set(true);

    const file = event.target.files[0];
    if (!file) return;

    const reader: FileReader = new FileReader();

    reader.onload = (e: any) => {
      const bstr: string = e.target.result;

      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      const jsonData: any = XLSX.utils.sheet_to_json(ws);

      this.data.set(jsonData);

      if (jsonData.length > 0) {
        this.columns.set(Object.keys(jsonData[0]));
      }
      this.isLoading.set(false);
    };

    reader.readAsBinaryString(file);
  }
  formatHeader(header: string): string {
    return header.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
  }
}
