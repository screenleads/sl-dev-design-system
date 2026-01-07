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
 * Componente toggle/switch que puede ser utilizado con formControl o standalone.
 * 
 * ### Uso:
 * ```html
 * <!-- Sin formControl -->
 * <sl-toggle
 *   [(checked)]="isEnabled"
 *   (change)="onToggleChange($event)">
 *   Enable notifications
 * </sl-toggle>
 * 
 * <!-- Con formControl -->
 * <form [formGroup]="form">
 *   <sl-toggle formControlName="notifications">
 *     Enable notifications
 *   </sl-toggle>
 * </form>
 * 
 * <!-- Disabled -->
 * <sl-toggle [disabled]="true" [checked]="true">
 *   Cannot change
 * </sl-toggle>
 * ```
 */
@Component({
	selector: 'sl-toggle',
	standalone: true,
	templateUrl: './toggle.component.html',
	styleUrls: ['./toggle.component.scss'],
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		'[class.sl-toggle]': 'true',
		'[class.sl-toggle--checked]': 'checked',
		'[class.sl-toggle--disabled]': 'disabled',
		'(click)': 'toggle()',
	},
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => SlToggleComponent),
			multi: true,
		},
	],
})
export class SlToggleComponent implements ControlValueAccessor {
	/**
	 * Estado del toggle
	 * @default false
	 */
	@Input() checked = false;

	/**
	 * Deshabilita el toggle
	 * @default false
	 */
	@Input() disabled = false;

	/**
	 * Evento emitido cuando cambia el estado
	 */
	@Output() readonly change = new EventEmitter<boolean>();

	private onChange: (value: boolean) => void = () => {};
	private onTouched: () => void = () => {};

	toggle(): void {
		if (this.disabled) return;

		this.checked = !this.checked;
		this.onChange(this.checked);
		this.onTouched();
		this.change.emit(this.checked);
	}

	// ControlValueAccessor implementation
	writeValue(value: boolean): void {
		this.checked = value;
	}

	registerOnChange(fn: (value: boolean) => void): void {
		this.onChange = fn;
	}

	registerOnTouched(fn: () => void): void {
		this.onTouched = fn;
	}

	setDisabledState(isDisabled: boolean): void {
		this.disabled = isDisabled;
	}
}
