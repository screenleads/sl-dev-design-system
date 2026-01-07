import {
	ChangeDetectionStrategy,
	Component,
	ElementRef,
	EventEmitter,
	forwardRef,
	Input,
	Output,
	ViewEncapsulation,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

/**
 * Componente radio button personalizado.
 *
 * ### Comportamiento Esperado
 * - Este radio button permite la selección exclusiva dentro de un grupo.
 * - No puede desmarcarse con un segundo clic como un checkbox.
 * - Emite el evento change solo si cambia de estado (si se selecciona y no estaba seleccionado previamente).
 * - Usa un atributo name o FormControl para gestionar el estado dentro de un grupo.
 *
 * ### Uso:
 *
 * ```ts
 * @Component({
 *   standalone: true,
 *   imports: [ReactiveFormsModule, SlRadioButtonComponent],
 *   template: `
 *     <form [formGroup]="form">
 *       <sl-radiobutton name="group1" formControlName="selectedValue" value="option1"></sl-radiobutton>
 *       <sl-radiobutton name="group1" formControlName="selectedValue" value="option2"></sl-radiobutton>
 *     </form>
 *   `,
 * })
 * export class ExampleComponent {
 *   form = this.fb.group({
 *     selectedValue: ['option1']
 *   });
 *
 *   constructor(private fb: FormBuilder) {}
 * }
 * ```
 *
 * ### Eventos
 * - change: Evento de cambio del estado del radio button.
 */

@Component({
	selector: 'sl-radiobutton',
	standalone: true,
	templateUrl: './radiobutton.component.html',
	styleUrls: ['./radiobutton.component.scss'],
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => SlRadioButtonComponent),
			multi: true,
		},
	],
	host: {
		'[class.sl-radio-button]': 'true',
		'[class.sl-radio-button--disabled]': 'disabled',
		'[class.sl-radio-button--checked]': 'checked',
		'[attr.disabled]': 'disabled ? true : null',
		'[attr.checked]': 'checked ? true : null',
	},
})
export class SlRadioButtonComponent implements ControlValueAccessor {
	/**
	 * Desactiva el radio button.
	 */
	@Input() disabled = false;

	/**
	 * Marca el radio button como seleccionado.
	 */
	@Input() checked = false;

	/**
	 * Nombre del grupo al que pertenece el radio button.
	 */
	@Input() name: string | null = null;

	/**
	 * Valor asociado al radio button.
	 */
	@Input() value: any;

	/**
	 * Emite el cambio de selección.
	 */
	@Output() readonly change: EventEmitter<any> = new EventEmitter<any>();

	private onChange = (checked: boolean) => { };
	private onTouched = () => { };

	/**
	 * Método que maneja el clic en el input del radio button.
	 */
	updateValue(event: Event): void {
		event.stopPropagation();
		if (!this.disabled && !this.checked) {
			this.checked = true;
			this.onChange(this.value);
			this.change.emit(this.value);
			this.onTouched();
		}
	}

	/**
	 * Método requerido por ControlValueAccessor.
	 * Actualiza el estado checked del componente cuando cambia el valor en el formulario.
	 */
	writeValue(value: any): void {
		this.checked = this.value === value;
	}

	/**
	 * Método requerido por ControlValueAccessor.
	 * Registra la función de cambio del estado.
	 */
	registerOnChange(fn: (value: any) => void): void {
		this.onChange = fn;
	}

	/**
	 * Método requerido por ControlValueAccessor.
	 * Registra la función que maneja el evento touch.
	 */
	registerOnTouched(fn: () => void): void {
		this.onTouched = fn;
	}

	/**
	 * Método requerido por ControlValueAccessor.
	 * Desactiva el radio button cuando cambia el estado de disabled.
	 */
	setDisabledState(disabled: boolean): void {
		this.disabled = disabled;
	}
}
