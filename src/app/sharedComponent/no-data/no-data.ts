import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-no-data',
  imports: [],
  templateUrl: './no-data.html',
  styleUrl: './no-data.css',
})
export class NoData {

  // Inputs for customization
  title = input<string>('No Records Found');
  message = input<string>();
  showAction = input<boolean>(false);
  actionLabel = input<string>('Refresh Data');

  // Output for the button
  actionClicked = output<void>();
}
