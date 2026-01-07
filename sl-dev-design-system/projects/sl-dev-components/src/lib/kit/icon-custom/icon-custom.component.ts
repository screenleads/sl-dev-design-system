import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';

export type DotPosition =
	| 'top-left'
	| 'top-right'
	| 'center'
	| 'bottom-left'
	| 'bottom-right'
	| 'custom';

/**
 * Componente que permite mostrar un ícono personalizado con la capacidad de definir colores, tamaños y posiciones de un punto de notificación.
 *
 * El componente acepta personalizaciones para el tamaño del ícono, el tamaño y el color del punto de notificación, así como su posición sobre el ícono.
 * El punto de notificación solo será visible si se proporciona un valor para `dotColor`.
 *
 * ### Personalización:
 * - `size`: Permite personalizar el tamaño del ícono. Valor por defecto: `'24px'`.
 *   - Se puede especificar en cualquier unidad válida, como `'rem'`, `'em'`, etc.
 *   - Se puede especificar también mediante la variable css `--sl-icon-custom-icon-size`.
 * - `dotColor`: Permite personalizar el color del punto de notificación.
 *   - Puede aceptar cualquier color válido en CSS (ej. `'red'`, `'#ff5733'`, `'rgb(255, 0, 0)'`, etc.).
 *   - Se puede especificar también mediante la variable css `--sl-icon-custom-dot-color`.
 * - `dotSize`: Permite personalizar el tamaño del punto de notificación.
 *   - Valor por defecto: `'8px'`.
 *   - Se puede especificar también mediante la variable css `--sl-icon-custom-dot-size`.
 *   - Se puede especificar en unidades relativas como `'rem'`, `'em'`, etc.
 * - `dotPosition`: Permite personalizar la posición del punto de notificación respecto al ícono.
 *   - Valor por defecto: `'top-right'`.
 *   - Otras opciones disponibles:
 *     - `'top-left'`
 *     - `'top-right'`
 *     - `'bottom-left'`
 *     - `'bottom-right'`
 *     - `'center'`
 *     - Se puede customizar la posición mediante las variables css `--sl-icon-custom-position-top`, `--sl-icon-custom-position-right`, `--sl-icon-custom-position-bottom`, `--sl-icon-custom-position-left`.
 *
 *
 * ### Propiedades:
 * - **`size`**: Tamaño del ícono. Por defecto es `'24px'`.
 * - **`dotSize`**: Tamaño del punto de notificación. Por defecto es `'8px'`.
 * - **`dotColor`**: Color del punto de notificación. Por defecto es `'#bde6f6'`.
 * - **`dotPosition`**: Posición del punto de notificación. Por defecto es `'top-right'`.
 *
 * ### Ejemplo de uso:
 *
 * ```html
 * <sl-icon-custom
 *   size="32px"
 *   dotSize="12px"
 *   dotColor="#ff0000"
 *   dotPosition="bottom-left"
 * >
 *   <svg></svg>
 * </sl-icon-custom>
 * ```
 *
 * En este ejemplo, el componente mostrará un ícono con un tamaño de `32px`, un punto de notificación rojo de tamaño `12px` y ubicado en la esquina inferior izquierda del ícono.
 */

@Component({
	selector: 'sl-icon-custom',
	standalone: true,
	templateUrl: './icon-custom.component.html',
	styleUrls: ['./icon-custom.component.scss'],
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		'[class.sl-icon-custom]': 'true',
		'[class.sl-icon-custom--top-left]': 'dotPosition === "top-left"',
		'[class.sl-icon-custom--top-right]': 'dotPosition === "top-right"',
		'[class.sl-icon-custom--bottom-left]': 'dotPosition === "bottom-left"',
		'[class.sl-icon-custom--bottom-right]': 'dotPosition === "bottom-right"',
		'[class.sl-icon-custom--center]': 'dotPosition === "center"',
		'[style.--sl-icon-custom-dot-size]': 'dotSize',
		'[style.--sl-icon-custom-icon-size]': 'size',
		'[style.--sl-icon-custom-dot-color]': 'dotColor',
	},
})
export class SlIconCustomComponent {
	/**
	 * Tamaño del icono.
	 * @default '24px'
	 */
	@Input() size?: string;

	/**
	 * Tamaño del punto decorativo.
	 * @default '8px'
	 */
	@Input() dotSize?: string;

	/**
	 * Color del punto decorativo.
	 * @default '#bde6f6'
	 */
	@Input() dotColor?: string;

	/**
	 * Posición del punto respecto al icono.
	 * @default 'top-right'
	 */
	@Input()
	dotPosition: DotPosition = 'top-right';
}
