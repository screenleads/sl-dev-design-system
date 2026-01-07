import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';

export type SlBadgeVariant = 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
export type SlBadgePosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

/**
 * Componente badge para mostrar indicadores numéricos o de estado.
 * 
 * ### Uso:
 * ```html
 * <!-- Badge standalone -->
 * <sl-badge variant="primary">5</sl-badge>
 * <sl-badge variant="success">New</sl-badge>
 * 
 * <!-- Badge posicionado sobre otro elemento -->
 * <div style="position: relative">
 *   <button sl-button>Notifications</button>
 *   <sl-badge variant="error" position="top-right">3</sl-badge>
 * </div>
 * 
 * <!-- Badge sin contenido (dot) -->
 * <div style="position: relative">
 *   <sl-icon icon="notifications"></sl-icon>
 *   <sl-badge variant="error" position="top-right" [dot]="true"></sl-badge>
 * </div>
 * ```
 */
@Component({
	selector: 'sl-badge',
	standalone: true,
	template: `<ng-content></ng-content>`,
	styleUrls: ['./badge.component.scss'],
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		'[class.sl-badge]': 'true',
		'[class.sl-badge--primary]': 'variant === "primary"',
		'[class.sl-badge--secondary]': 'variant === "secondary"',
		'[class.sl-badge--success]': 'variant === "success"',
		'[class.sl-badge--error]': 'variant === "error"',
		'[class.sl-badge--warning]': 'variant === "warning"',
		'[class.sl-badge--info]': 'variant === "info"',
		'[class.sl-badge--positioned]': 'position',
		'[class.sl-badge--top-right]': 'position === "top-right"',
		'[class.sl-badge--top-left]': 'position === "top-left"',
		'[class.sl-badge--bottom-right]': 'position === "bottom-right"',
		'[class.sl-badge--bottom-left]': 'position === "bottom-left"',
		'[class.sl-badge--dot]': 'dot',
	},
})
export class SlBadgeComponent {
	/**
	 * Variante visual del badge
	 * @default 'primary'
	 */
	@Input() variant: SlBadgeVariant = 'primary';

	/**
	 * Posición del badge cuando está sobre otro elemento.
	 * Requiere que el contenedor tenga position: relative
	 */
	@Input() position?: SlBadgePosition;

	/**
	 * Muestra el badge como un punto sin contenido
	 * @default false
	 */
	@Input() dot = false;
}
