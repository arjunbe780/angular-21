import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
interface MenuItem {
  label: string;
  route?: string;
  children?: { label: string; route: string }[];
}
@Component({
  selector: 'app-home',
  imports: [MatTabsModule, CommonModule, FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  previewUrl: string | ArrayBuffer | null = null;
  http = inject(HttpClient);
  tabList: any[] = [
    { label: 'First', content: 'Content 1' },
    { label: 'Second', content: 'Content 2' },
    { label: 'Third', content: 'Content 3' },
  ];
  getTabindex(event: any) {
    console.log(event);
  }

  selectedIndex = signal(0);

  selectTab(i: number) {
    this.selectedIndex.set(i);
  }

  aadharBack(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      // this.selectedFile = file;

      // Optional: Create a local preview
      const reader = new FileReader();
      reader.onload = () => (this.previewUrl = reader.result);
      reader.readAsDataURL(file);
      const formData = new FormData();
      formData.append('aadhaar_back', file, file.name);
      console.log(formData.get('aadhaar_back'));
      this.http.post('upload-aadhaar-back', formData,).subscribe({
        next: (res) => {
          console.log('Upload successful', res);
        },
        error: (err) => {
          console.error('Upload failed', err);
        },
      });
    }
  }
  aadharFront(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      // this.selectedFile = file;

      // Optional: Create a local preview
      const reader = new FileReader();
      reader.onload = () => (this.previewUrl = reader.result);
      reader.readAsDataURL(file);
      const formData = new FormData();
      formData.append('aadhaar_front', file, file.name);
      console.log(formData.get('aadhaar_front'));
      this.http.post('upload-aadhaar-front', formData,).subscribe({
        next: (res) => {
          console.log('Upload successful', res);
        },
        error: (err) => {
          console.error('Upload failed', err);
        },
      });
    }
  }
}
