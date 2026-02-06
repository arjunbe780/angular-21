import { Component } from '@angular/core';

interface MenuItem {
  label: string;
  route?: string;
  children?: { label: string; route: string }[];
}
@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  

}
