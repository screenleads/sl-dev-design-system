import { NgModule } from '@angular/core';
import { SlNativeControlDirective } from '../native-form-control/native-control.directive';
import { SlTextFieldComponent } from './text-field.component';
import { NgIf } from '@angular/common';

/**
 * Módulo para el componente de formulario de texto
 */
@NgModule({
	imports: [SlNativeControlDirective, NgIf],
	declarations: [SlTextFieldComponent],
	exports: [SlNativeControlDirective, SlTextFieldComponent],
})
export class SlTextFieldModule { }
