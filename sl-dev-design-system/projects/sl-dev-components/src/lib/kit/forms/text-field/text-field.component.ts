import {
	ChangeDetectionStrategy,
	Component,
	computed,
	ContentChild,
	ElementRef,
	Input,
	Output,
	EventEmitter,
	signal,
	ViewEncapsulation,
	AfterViewInit,
	DestroyRef,
	inject,
} from '@angular/core';

import { SlNativeControlDirective } from '../native-form-control/native-control.directive';
import { NgControl } from '@angular/forms';
import { fromEvent } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

/*
 * Este componente debe ser compatible tanto con ReactiveFroms (formControl) como con TemplateDrivenForms (ngModel)
 *
 * Idealmente, también debe ser capaz de integrarse con el input sin los forms de angular.
 *
 * La forma más simple de asegurar una reactividad adecuada en esta versión es utilizar
 * los host metadata que se comprueban en cada ciclo de detección de cambios.
 *
 * Desgraciadamente, no es tan óptimo como usar signals u observables
 * para subscribirse a los cambios, pero en esta versión de angular
 * los NgControl no proveen de ninguna forma reactiva para subscribirse
 * a los cambios de touched (el control solo debe considerarse inválido si el
 * usuario ya ha interactuado con él).
 *
 * Lo mismo con los valores, es más sencillo comprobar si el campo tiene valor (element.value)
 * que tratar de computar el valor del `FormControl` o del ngModel.
 *
 * También es posible pasarle directamente el value al input `<input [value]="value">`
 * y usar eventos o ngModel no nos daría reactividad.
 *
 * Por eso, la opción más compatible es comprobar en cada ciclo de detección de cambios
 * si el input tiene valor nativo y en caso de haber ngControl, comprobar si es touched e inválido.
 *
 * En futuras versiones de angular, podremos simplificar esto con signals y queries.
 */
/*
 * Adicionalmente, a la hora de plantear este componente tenemos varias opciones.
 * Estilo material:
 * ```html
 * <sl-form-field>
 *  <label>Label</label>
 *  <input>
 *  <sl-icon/>
 *  <sl-field-errors></sl-field-errors>
 * </sl-form-field>
 *
 * <sl-form-field>
 *  <label>Label</label>
 *  <sl-select>
 *    <sl-option></sl-option>
 *  <sl-icon/>
 *  <sl-field-errors></sl-field-errors>
 * </sl-form-field>
 * ```
 *
 * Creando un componente SlFormField que encapsularía otros campos de formulario (input, textarea pero también
 * el futuro sl-select).
 *
 * El componente se encargaría también de conectar todos los tipos de controles con el label
 * los errores, etc; y de resolver los estados.
 *
 * Tiene como ventaja que sería más fácil de mantener y de extender, pero también tiene la desventaja
 * que requeriría un nivel mayor de abstracción y hacer SlFormField más complejo para integrarse
 * con otros campos.
 *
 * También resultaría más complejo hacer el campo de phone number:
 * ```html
 * <sl-phone-number>
 *  <sl-form-field>
 *    <label>Prefíjo</label>
 *    <sl-select></sl-select>
 *  </sl-form-field>
 *  <sl-form-field>
 *    <label>Teléfono</label>
 *   <input>
 *  </sl-form-field>
 * </sl-phone-number>
 * ```
 *
 * He intentado esta variante al principio y me ha parecido más compleja,
 * por lo que he decidido simplificarlo por ahora y hacer un sl-text-field
 * solo para el input y el textarea.
 *
 * Cuando toque implementar el sl-select evaluaré qué comportamiento está compartido
 * y lo abstraeré en un componente/directiva/service común.
 *
 * La intención por tanto es:
 * ```html
 * <sl-text-field label="Label">
 *  <input>
 *  <sl-icon/>
 *  <sl-field-errors></sl-field-errors>
 * </sl-form-field>
 *
 * <sl-select label="Label">
 *  <sl-option></sl-option>
 *  <sl-field-errors></sl-field-errors>
 * </sl-form-field>
 *
 * <sl-phone-field>
 *  <sl-select-field label="Prefíjo">
 *    <sl-option></sl-option>
 *  </sl-select-field>
 *  <sl-text-field label="Teléfono">
 *    <input>
 *  </sl-text-field>
 * </sl-phone-field>
 * ```
 *
 * Creo que es más sencillo y más fácil de mantener, aunque puede que en el futuro
 * necesitemos un componente más complejo que encapsule todos los campos de formulario.
 *
 * El input debe seguir pasándose a sl-text-field para facilitar que los desarrolladores
 * puedan usar textarea, input, etc. y puedan también pasarle atributos adicionales.
 */
/**
 * Componente de formulario para campo de texto.
 *
 * El componente genera automáticamente un id único para el control y lo asigna al input.
 * Si se ha indicado `label`, se establecerá el atributo `for` del label con el id del control.
 *
 * En caso de que se indique manualmente un id, este se utilizará en lugar del generado automáticamente.
 *
 * ### Slots
 * - `input[slNativeControl],textarea[slNativeControl]`: Campo de texto o textarea que maneja el form field. Deben usar la directiva `slNativeControl`.
 * - `[slTextFieldEnd]`: Icono o botón que se muestra al final del campo de texto.
 *
 * ### Estados:
 *
 * - Deshabilitado: si el control está deshabilitado, el campo de texto se mostrará en gris y no se podrá interactuar con él.
 * - Inválido: si el control es inválido, el campo de texto se mostrará en rojo. Si se utiliza con `FormControl`, el estado inválido se resolverá del `FormControl` y se ignorará este input, adicionalmente,
 * solo se aplicará una vez el usuario haya interactuado con el campo (touched).
 *
 * ### Uso:
 * ```ts
 * @Component({
 *   standalone: true,
 *   imports: [SlTextFieldModule],
 *   template: `
 *     <sl-text-field label="Nombre">
 *       <!-- se puede utilizar input o textarea. Debe tener la directiva slNativeControl> -->
 *      <input id="name_field" slNativeControl type="text" />
 *     </sl-text-field>
 *   `,
 * })
 * export class Component {}
 * ```
 *
 * ### Angular reactive forms
 *
 * El componente se integra automáticamente con `FormGroup` y `FormControl` de `@angular/forms`, esto incluye la validación y el estado del control.
 *
 * - Si el `FormControl` se deshabilita, el campo de texto también se deshabilitará.
 * - Si el `FormControl` es inválido, el campo de texto se mostrará en rojo. Únicamente cuando el usuario haya interactuado con el campo (touched).
 *
 * **Nota**: Al usar el `FormControl`, el estado inválido se resolverá del `FormControl` y se ignorará el input.
 *
 * ```ts
 * @Component({
 *   standalone: true,
 *   imports: [SlTextFieldModule],
 *   template: `
 *     <sl-text-field label="Nombre">
 *       <!-- se puede utilizar input o textarea. Debe tener la directiva slNativeControl> -->
 *      <input slNativeControl type="text" formControlName="someControl" />
 *     </sl-text-field>
 *   `,
 * })
 * export class Component {
 *    protected readonly form = new FormGroup({
 *       someControl: new `FormControl`(null, [Validators.required]),
 *    });
 * }
 * ```
 *
 * ### Angular template forms
 *
 * ```ts
 * @Component({
 *   standalone: true,
 *   imports: [SlTextFieldModule],
 *   template: `
 *     <sl-text-field label="Nombre">
 *       <!-- se puede utilizar input o textarea. Debe tener la directiva slNativeControl> -->
 *      <input slNativeControl type="text" [(ngModel)]="value" />
 *     </sl-text-field>
 *   `,
 * })
 * export class Component {
 *    protected value = "";
 * }
 * ```
 *
 */
@Component({
	selector: 'sl-text-field',
	templateUrl: './text-field.component.html',
	styleUrls: ['./text-field.component.scss'],
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		'[class.sl-text-field]': 'true',
		// esta clase se usa para mostrar el label flotando
		'[class.sl-text-field--with-value]':
			// ojo!: no mover a computed, puesto que native value no es un signal, esto lo podremos simplificar al subir la versión de angular
			'formFieldControlSignal() ? (formFieldControlSignal().nativeValue != null && formFieldControlSignal().nativeValue !== "") : false',
		// lo mismo, ngControl no provee en esta versión ningún mecanismo reactivo para touched
		'[class.sl-text-field--invalid]':
			'ngControlSignal() ? (ngControlSignal().touched && ngControlSignal().invalid) : invalid',
		'[class.sl-text-field--disabled]':
			'(ngControlSignal() && ngControlSignal().disabled) || (formFieldControlSignal() && formFieldControlSignal().disabled)',
		'[class.sl-text-field--icon-clickable]': 'iconClickable',
		'(click)': 'focus()',
	},
})
export class SlTextFieldComponent implements AfterViewInit {
	private readonly destroyRef = inject(DestroyRef);

	protected readonly ngControlSignal = signal<NgControl | undefined>(undefined);

	/**
	 * Creamos el signal para cuando subamos la versión de angular podamos cambiar el decorador
	 * por la query @ContentChild -> contentChild()
	 * @protected
	 */
	protected readonly formFieldControlSignal = signal<SlNativeControlDirective | undefined>(
		undefined,
	);

	protected readonly formFieldDisabled = computed(
		() => this.formFieldControlSignal()?.disabled ?? false,
	);
	/**
	 * Id asignado al control que maneja este form field.
	 */
	protected readonly idControl = computed(() => this.formFieldControlSignal()?.id);
	
	/**
	 * Signal para el slot del icono al final del campo
	 */
	protected readonly iconEndSignal = signal<ElementRef | undefined>(undefined);

	/**
	 * Signal para el slot del icono al inicio del campo
	 */
	protected readonly iconStartSignal = signal<ElementRef | undefined>(undefined);

	/**
	 * Control que va a manejar el form field.
	 * Utilizamos la directiva `SlFormControlDirective` para poder acceder a la instancia del control
	 * sin importar si es un input, textarea, select, etc.
	 *
	 * Los campos que se implementen deben utilizar la directiva `SlFormControlDirective`.
	 * @internal
	 * @protected
	 */
	@ContentChild(SlNativeControlDirective)
	protected get formFieldControl() {
		return this.formFieldControlSignal();
	}
	protected set formFieldControl(value: SlNativeControlDirective | undefined) {
		this.formFieldControlSignal.set(value);
	}

	/**
	 * Slot para icono o elemento al final del campo de texto
	 * @internal
	 */
	@ContentChild('[slTextFieldEnd]', { read: ElementRef })
	protected get iconEnd() {
		return this.iconEndSignal();
	}
	protected set iconEnd(value: ElementRef | undefined) {
		this.iconEndSignal.set(value);
	}

	/**
	 * Slot para icono o elemento al inicio del campo de texto
	 * @internal
	 */
	@ContentChild('[slTextFieldStart]', { read: ElementRef })
	protected get iconStart() {
		return this.iconStartSignal();
	}
	protected set iconStart(value: ElementRef | undefined) {
		this.iconStartSignal.set(value);
	}

	/**
	 * Obtenemos el control del formulario para poder integrarnos.
	 *
	 * Es posible que el desarrollador no use formControl y en su lugar
	 * use ngModel, por lo que NgControl puede ser undefined
	 *
	 * @internal
	 */
	@ContentChild(NgControl)
	protected get ngControl() {
		return this.ngControlSignal();
	}
	protected set ngControl(value: NgControl | undefined) {
		this.ngControlSignal.set(value);
	}
	/**
	 * Texto para el label del input
	 */
	@Input() label?: string;

	/**
	 * Indica si el campo tiene un error
	 *
	 * Si el control tiene un `FormControl`, el estado inválido
	 * se resuelve del `FormControl` y se ignora este input.
	 * @default false
	 */
	@Input()
	invalid = false;

	/**
	 * Habilita la interacción con los iconos proyectados en los slots
	 * slTextFieldEnd y slTextFieldStart. Cuando está activo, los iconos
	 * se vuelven clickables y emiten eventos.
	 * 
	 * @default false
	 */
	@Input()
	iconClickable = false;

	/**
	 * Evento emitido cuando se hace click en el icono del slot slTextFieldEnd
	 * Solo se emite si iconClickable está en true
	 */
	@Output()
	readonly iconClick = new EventEmitter<MouseEvent>();

	/**
	 * Evento emitido cuando se hace click en el icono del slot slTextFieldStart
	 * Solo se emite si iconClickable está en true
	 */
	@Output()
	readonly iconStartClick = new EventEmitter<MouseEvent>();

	ngAfterViewInit(): void {
		// Setup event listeners para iconos clickables
		if (this.iconClickable) {
			// Listener para icono al final
			const iconEndEl = this.iconEndSignal();
			if (iconEndEl) {
				fromEvent<MouseEvent>(iconEndEl.nativeElement, 'click')
					.pipe(takeUntilDestroyed(this.destroyRef))
					.subscribe(event => {
						event.stopPropagation();  // Evita que el click active el focus del input
						this.iconClick.emit(event);
					});
			}

			// Listener para icono al inicio
			const iconStartEl = this.iconStartSignal();
			if (iconStartEl) {
				fromEvent<MouseEvent>(iconStartEl.nativeElement, 'click')
					.pipe(takeUntilDestroyed(this.destroyRef))
					.subscribe(event => {
						event.stopPropagation();  // Evita que el click active el focus del input
						this.iconStartClick.emit(event);
					});
			}
		}
	}

	protected focus() {
		this.formFieldControlSignal()?.focus();
	}
}
