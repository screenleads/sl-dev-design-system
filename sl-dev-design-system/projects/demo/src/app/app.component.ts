import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SlButtonComponent } from '../../../sl-dev-components/src/public-api';
import { SlTextFieldModule } from '../../../sl-dev-components/src/public-api';
import { SlIconComponent } from '../../../sl-dev-components/src/lib/kit/icon';
import { SlModuleTitleComponent } from '../../../sl-dev-components/src/lib/kit/module-title';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [SlButtonComponent, SlTextFieldModule, SlIconComponent, SlModuleTitleComponent, CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'demo';
  descriptionName = "dispositivo de pruebas";

}
