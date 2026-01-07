import {
	ChangeDetectionStrategy,
	Component,
	EventEmitter,
	forwardRef,
	Input,
	Output,
	ViewEncapsulation,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

/**
 * Componente checkbox que puede ser utilizado opcionalmente con `formControl`.
 *
 * ### Uso:
 *
 * ```ts
 * @Component({
 *   standalone: true,
 *   imports: [SlCheckboxComponent, ReactiveFormsModule],
 *   template: `
 *     <!-- Sin formControl -->
 *     <sl-checkbox
 *       [checked]="isChecked"
 *       (change)="onCheckboxChange($event)">
 *       Checkbox sin formControl
 *     </sl-checkbox>
 *
 *     <!-- Con formControl -->
 *     <form [formGroup]="form">
 *       <sl-checkbox formControlName="myCheckbox">
 *         Checkbox con formControl
 *       </sl-checkbox>
 *     </form>
 *   `,
 * })
 * export class Component {}
 * ```
 *
 * ### Eventos
 * - `change`: Se activa cuando cambia el estado `checked` del checkbox, emitiendo el evento con el estado actual.
 *
 * **Nota:** El evento `change` se emite en ambos modos de uso, con o sin `formControl`.
 *
 */
@Component({
	selector: 'sl-checkbox',
	standalone: true,
	templateUrl: './checkbox.component.html',
	styleUrls: ['./checkbox.component.scss'],
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		'[attr.disabled]': 'disabled ? true : null',
		'[attr.checked]': 'checked ? true : null',
		'[class.sl-checkbox--disabled]': 'disabled',
		'[class.sl-checkbox--checked]': 'checked',
		'[class.sl-checkbox]': 'true',
	},
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => SlCheckboxComponent),
			multi: true,
		},
	],
	imports: [],
})
export class SlCheckboxComponent implements ControlValueAccessor {
	/**
	 * Desactiva el checkbox.
	 */
	@Input() disabled = false;

	/**
	 * Marca el checkbox como seleccionado.
	 */
	@Input() checked = false;

	/**
	 * Emite el cambio de selección del checkbox.
	 */
	@Output() readonly change: EventEmitter<boolean> = new EventEmitter<boolean>();

	/**
	 * Método requerido por ControlValueAccessor.
	 * Actualiza el estado checked del componente cuando cambia el valor en el formulario.
	 * @ignore
	 */
	writeValue(checked: boolean): void {
		this.checked = checked;
	}

	/**
	 * Método requerido por ControlValueAccessor.
	 * Registra la función de cambio del estado.
	 * @ignore
	 */
	registerOnChange(fn: (checked: boolean) => void): void {
		this.onChange = fn;
	}

	/**
	 * Método requerido por ControlValueAccessor.
	 * Registra la función que maneja el evento touch.
	 * @ignore
	 */
	registerOnTouched(fn: () => void): void {
		this.onTouched = fn;
	}

	/**
	 * Método requerido por ControlValueAccessor.
	 * Desactiva el checkbox cuando cambia el estado de disabled.
	 * @ignore
	 */
	setDisabledState(disabled: boolean): void {
		this.disabled = disabled;
	}

	/**
	 * Método que maneja el clic en el input del checkbox y actualiza su valor.
	 * @ignore
	 */
	updateValue(event: Event): void {
		event.stopPropagation();
		if (!this.disabled) {
			const value = (event.target as HTMLInputElement).checked;
			this.checked = value;
			this.onChange(value);
			this.change.emit(value);
			this.onTouched();
		}
	}

	private onChange = (checked: boolean) => { };
	private onTouched = () => { };
}
