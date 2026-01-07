import { Directive, ElementRef, Input, signal } from '@angular/core';
import { slInjectId } from '../../../cdk/id.service';

/**
 * Directiva para comunicar los campos nativos de formulario con SlTextFieldComponent.
 */
@Directive({
	standalone: true,
	selector: 'input[slNativeControl],textarea[slNativeControl],select[slNativeControl]',
	host: {
		'[attr.id]': 'id',
		'[attr.disabled]': 'disabled ? true : null',
		'(input)': 'handleInput()',
	},
})
export class SlNativeControlDirective {
	/**
	 * Generamos un id único para el control, independientemente
	 * del tipo que sea.
	 * Lo utilizaremos para accesibilidad.
	 *
	 * Si el desarrollador provee un id, lo utilizamos, si no, este es el fallback
	 * @protected
	 */
	protected readonly uniqueId = slInjectId('form_control');
	protected idSignal = signal(this.uniqueId);
	protected disabledSignal = signal<boolean>(false);
	/**
	 * Atributo id del control, este input mapea
	 * con el atributo id del control nativo.
	 */
	@Input()
	get id(): string {
		return this.idSignal();
	}
	set id(value: string) {
		this.idSignal.set(value || this.uniqueId);
	}

	/**
	 * Atributo disabled del control, este input mapea
	 * con el atributo disabled del control nativo.
	 */
	@Input()
	get disabled(): boolean {
		return this.disabledSignal();
	}
	set disabled(value: boolean) {
		this.disabledSignal.set(value);
	}
	/**
	 * Exponemos el valor nativo del formulario para dar compatibilidad
	 * con controles que no usen FormControl.
	 *
	 * Este valor lo vamos a utilizar principalmente para saber si hay algún valor
	 * y cambiar el estado de SlFormFieldComponent
	 *
	 * Solo para uso interno
	 *
	 * @internal
	 */
	get nativeValue() {
		return (this.elementRef.nativeElement as { value?: unknown }).value;
	}
	constructor(protected readonly elementRef: ElementRef<HTMLElement>) { }
	focus() {
		this.elementRef.nativeElement.click();
	}
	/**
	 * Este método queda vacío, lo añadimos como handler para el evento "input"
	 * del control, de forma que angular ejecute un ciclo de detección de cambios
	 * cuando se lanze este evento
	 *
	 * De esta forma no es necesario usar el ChangeDetector ni implementar
	 * una integración con NgControl
	 *
	 * @protected
	 */
	protected handleInput() { }
}
