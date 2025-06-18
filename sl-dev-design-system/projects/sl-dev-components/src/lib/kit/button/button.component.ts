import {
	ChangeDetectionStrategy,
	Component,
	ElementRef,
	EventEmitter,
	Input,
	Output,
	ViewEncapsulation,
} from '@angular/core';
import { filter, fromEvent, map, startWith, withLatestFrom } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

/**
 * Tamaños disponibles para el botón.
 */
export type ScaButtonSize = 'small' | 'medium';

/**
 * Variantes disponibles para el botón
 */
export type ScaButtonVariant = 'primary' | 'border';

/**
 * Componente botón. Es posible utilizarlo con la etiqueta <a> para crear un enlace con apariencia de botón.
 *
 * ### Customización
 *
 * - `size`: Para personalizar el tamaño del botón
 * - `variant`: Temas predefinidos para el botón.
 *
 * ### Uso:
 *
 * ```ts
 * @Component({
 *   standalone: true,
 *   imports: [ScaButtonComponent],
 *   template: `
 *     <button sca-button>A button</button>
 *     <button sca-button variant="primary" size="small">A small primary button</button>
 *     <!-- Also can be used with &lt;a> -->
 *     <a sca-button>A link with the appearance of a button</a>
 *   `,
 * })
 * export class Component {}
 * ```
 *
 * ### Eventos
 * - `click`: Evento de clic nativo
 * - `dbclick`: Evento nativo de doble clic
 * - `longClick`: Evento personalizado que se activa cuando se hace clic en el botón durante una pulsación larga. El tiempo está definido por la constante LONG_PRESS_MIN
 *
 * Orden de los eventos:
 * 1. touchstart
 * 2. touchmove
 * 3. touch
 * 4. mouseover
 * 5. mousemove
 * 6. mousedown
 * 7. mouseup
 * 8. longClick <-- nuestro evento personalizado
 * 9. click
 *
 * **Nota:** los eventos táctiles solo están disponibles en pantallas táctiles, pero los eventos del mouse se activan tanto en la pantalla táctil como en el escritorio.
 *
 *
 */
@Component({
	// eslint-disable-next-line @angular-eslint/component-selector
	selector: 'button[sca-button],a[sca-button]',
	standalone: true,
	imports: [],
	templateUrl: './button.component.html',
	styleUrls: ['./button.component.scss'],
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	/* Han eliminado de la guía de buenas prácticas de angular el comentario en el que recomiendan (v18)
	 * el uso de HostBinding sobre host, y, de hecho, todas las librerías los utilizan.
	 * hemos detectado una reducción en el tamaño del bundle por lo que procedemos a migrar
	 * incluso se añaden tantas clases como variantes haya para optimizar la detección de cambios
	 * por ejemplo, en form field https://github.com/angular/components/blob/fe4271f3bef7109f82c1c6b8626e314b3cb5b72b/src/material/form-field/form-field.ts#L147
	 * tampoco hay problema con el tipado, está fuertemente tipado */
	host: {
		'[attr.disabled]': 'disabled ? true : null',
		'[attr.aria-disabled]': 'disabled ? true : null',
		'[class.sca-button--disabled]': 'disabled',
		'[class.sca-button--small]': 'size === "small"',
		'[class.sca-button--medium]': 'size === "medium"',
		'[class.sca-button--primary]': 'variant === "primary"',
		'[class.sca-button--border]': 'variant === "border"',
		'[class.sca-button]': 'true',
	},
})
export class ScaButtonComponent {
	/**
	 * El tiempo mínimo en milisegundos para considerar una pulsación larga.
	 *
	 * Constante estática (readonly)
	 * @readonly
	 * @ignore
	 */
	static readonly LONG_PRESS_MIN = 250;

	/**
	 * Deshabilita el botón.
	 * @default false
	 */
	@Input() // todo: add transform when upgrading to angular 17
	disabled = false;

	/**
	 * La variante del botón.
	 * @default 'primary'
	 */
	@Input()
	variant: ScaButtonVariant = 'primary';

	/**
	 * El tamaño del botón.
	 * @default 'medium'
	 */
	@Input()
	size: ScaButtonSize = 'medium';

	/**
	 * Se activa cuando se hace clic en el botón durante una pulsación larga.
	 *
	 * No se activa si el botón está desactivado.
	 *
	 * **Nota** el evento 'click' se emite igualmente, es un evento nativo y no se puede cancelar.
	 */
	@Output()
	readonly longClick = new EventEmitter<void>();

	constructor(protected readonly elementRef: ElementRef) {
		/*
		 * Manejar adecuadamente eventos táctiles y de ratón (desktop and mobile) es un poco complicado
		 * para más referencias: https://web.dev/articles/mobile-touchandmouse?hl=es-419
		 * Nuestro componente debe funcionar correctamente en móvil y en desktop, y además, debe implementar un evento avanzado,
		 * `longClick`, que se activa cuando el usuario mantiene presionado el botón durante un tiempo.
		 *
		 */

		// Para ser compatible tanto con computadoras de escritorio como con dispositivos móviles, debemos escuchar los eventos táctiles y del mouse.
		const mouseDownEvent$ = fromEvent(this.elementRef.nativeElement, 'mousedown');
		const touchStartEvent$ = fromEvent(this.elementRef.nativeElement, 'touchstart');
		const clickEvent$ = fromEvent(this.elementRef.nativeElement, 'click');

		/*
		 * Los eventos táctiles solo se activan en la pantalla táctil,
		 * pero como los eventos del mouse se activan tanto en táctil como en desktop
		 * debemos tener cuidado de no duplicarlos.
		 *
		 * Además, debemos considerar que el usuario puede querer cancelar la acción,
		 * normalmente, por ejemplo, si se empieza el long click y el usuario cambia de idea,
		 * generalmente el evento se cancela cuando el usuario mueve el dedo o el ratón fuera del botón
		 * antes de liberar.
		 *
		 * Para implementar el longClick vamos a aprovechar unos comportamientos nativos,
		 * que el evento "click" se emite tanto en desktop como en móvil al final de todo el ciclo de interacción,
		 * y que el navegador nativamente maneja la cancelación del evento "click".
		 *
		 * Para crear el evento de clic largo, escucharemos dos cosas:
		 * - cuando el usuario inicia la interacción
		 * - cuando el usuario finaliza la interacción
		 *
		 * El inicio de la interacción será el mousedown o el touchstart.
		 * El final de la interacción será el evento de click, si el usuario cancela el evento,
		 * el navegador no emitirá el click y por tanto se cancelará nuestro longClick.
		 */

		const touchStartTime$ = touchStartEvent$.pipe(map(() => Date.now())).pipe(startWith(null));
		const longClickBeginTime$ = mouseDownEvent$.pipe(
			/* en el 99% de los casos este planteamiento será suficiente, pero hay ciertos escenarios, como cambiar el modo en las herramientas de desarrollo
			 * o en ciertos navegadores móviles cuando se alterna entre el modo desktop y el móvil, puede ocurrir que el evento touchStart
			 * no se emita, el problema con withLatestFrom es que cachea el valor anterior, y todos los eventos click
			 * se considerará longClick.
			 * Pero, como se menciona, es un escenario fuera de lo normal y corregirlo conllevaría complicar el código y más tiempo
			 */
			withLatestFrom(touchStartTime$),
			/*
			 * El comportamiento en pantallas táctiles para los eventos del mouse es diferente, el orden de emisión es:
			 * 1. touchstart
			 * 2. touchmove
			 * 3. touch
			 * 4. mouseover
			 * 5. mousemove
			 * 6. mousedown
			 * 7. mouseup
			 * 8. click
			 *
			 * nótese que los eventos touch se emiten (todos) antes de los eventos mouse, en móvil
			 * los eventos mouse se mantienen por compatibilidad, los que realmente ocurren son los touch,
			 * el problema es que todos los mouse se emiten inmediatamente uno tras otro, incluyendo el click,
			 * por lo que si escuchamos el "mousedown" y el "click", como ambos se emiten inmediatamente,
			 * no pasa tiempo entre ellos, por lo que no podemos comparar el tiempo entre el evento "click" y el "mouseup" o "mousedown".
			 * Es decir, en móvil no podemos utilizar mousedown aunque se emita porque el evento se emite inmediatamente con el click,
			 * y en desktop no podemos utilizar touchstart porque no se emite.
			 *
			 *
			 * Para saber cuándo comienza el "longClick", debemos escuchar el "touchstart" en pantallas táctiles y el "mousedown"
			 * en desktop.
			 *
			 * Pero comprobar si el dispositivo tiene pantalla táctil no es fiable, y puede causar algunos problemas,
			 * asique vamos a escuchar ambos, si touchstart está disponible, lo usaremos; de lo contrario, usaremos mousedown.
			 */
			map(([_, touchStartTime]) => touchStartTime ?? Date.now()),
		);
		const clickTime$ = clickEvent$.pipe(map(() => Date.now()));

		clickTime$
			.pipe(
				// no se emite si el botón está desactivado
				filter(() => !this.disabled),
				// cuando el usuario ha comenzado a interactuar
				withLatestFrom(longClickBeginTime$),
				map(([endTime, startTime]) => {
					const diff = endTime - startTime;
					// ahora vamos a comprobar si el tiempo entre el mouse hacia abajo y hacia arriba es mayor a 1 segundo
					// si la diferencia es demasiado pequeña, el evento es un clic normal
					return diff >= ScaButtonComponent.LONG_PRESS_MIN;
				}),
				//filtrar los eventos que no son largos click
				filter(Boolean),
				takeUntilDestroyed(),
			)
			.subscribe((_) => {
				this.longClick.emit();
			});
	}
}
