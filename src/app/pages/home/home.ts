import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { SideMenu } from '../../sharedComponent/side-menu/side-menu';

interface MenuItem {
  label: string;
  route?: string;
  children?: { label: string; route: string }[];
}
@Component({
  selector: 'app-home',
  imports: [RouterLink, RouterLinkActive,RouterOutlet,SideMenu],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  

}
