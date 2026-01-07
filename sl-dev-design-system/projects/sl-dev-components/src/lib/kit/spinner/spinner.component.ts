import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';

export type SlSpinnerSize = 'small' | 'medium' | 'large';
export type SlSpinnerVariant = 'primary' | 'secondary' | 'white';

/**
 * Componente spinner para indicar carga o procesamiento.
 * 
 * ### Customización
 * - `size`: Controla el tamaño del spinner (small: 20px, medium: 32px, large: 48px)
 * - `variant`: Define el color del spinner (primary, secondary, white)
 * 
 * ### Uso:
 * ```html
 * <!-- Spinner básico -->
 * <sl-spinner></sl-spinner>
 * 
 * <!-- Spinner pequeño primario -->
 * <sl-spinner size="small" variant="primary"></sl-spinner>
 * 
 * <!-- Spinner grande para fondos oscuros -->
 * <sl-spinner size="large" variant="white"></sl-spinner>
 * 
 * <!-- En botones -->
 * <button sl-button [disabled]="loading">
 *   <sl-spinner *ngIf="loading" size="small"></sl-spinner>
 *   <span *ngIf="!loading">Submit</span>
 * </button>
 * ```
 */
@Component({
	selector: 'sl-spinner',
	standalone: true,
	template: `
		<svg class="sl-spinner__svg" viewBox="0 0 50 50">
			<circle
				class="sl-spinner__circle"
				cx="25"
				cy="25"
				r="20"
				fill="none"
				stroke-width="5"
			></circle>
		</svg>
	`,
	styleUrls: ['./spinner.component.scss'],
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		'[class.sl-spinner]': 'true',
		'[class.sl-spinner--small]': 'size === "small"',
		'[class.sl-spinner--medium]': 'size === "medium"',
		'[class.sl-spinner--large]': 'size === "large"',
		'[class.sl-spinner--primary]': 'variant === "primary"',
		'[class.sl-spinner--secondary]': 'variant === "secondary"',
		'[class.sl-spinner--white]': 'variant === "white"',
		'role': 'progressbar',
		'[attr.aria-label]': 'ariaLabel',
	},
})
export class SlSpinnerComponent {
	/**
	 * Tamaño del spinner
	 * @default 'medium'
	 */
	@Input() size: SlSpinnerSize = 'medium';

	/**
	 * Variante de color del spinner
	 * @default 'primary'
	 */
	@Input() variant: SlSpinnerVariant = 'primary';

	/**
	 * Etiqueta aria para accesibilidad
	 * @default 'Loading...'
	 */
	@Input() ariaLabel = 'Loading...';
}
