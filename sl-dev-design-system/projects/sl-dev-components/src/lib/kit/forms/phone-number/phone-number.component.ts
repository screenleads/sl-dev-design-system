import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

/**
 *
 * Componente para la gestión de un campo de número de teléfono que combina un selector de prefijo internacional
 * y un campo de entrada para el número. Permite personalización y validación.
 *
 * ### Características principales:
 * - Admite integración con ReactiveForms.
 * - Soporta personalización mediante ng-content para incluir `sl-select` y `sl-text-field`.
 * - Gestión automática de estados visuales como deshabilitado, inválido y enfoque activo.
 *
 * ### Implementación:
 * El componente se diseña para admitir tanto formularios reactivos como plantillas regulares. También puede utilizarse
 * sin formularios de Angular mediante atributos estándar como `value` y eventos.
 *
 * ### Slots disponibles:
 * - `sl-select`: Selector de prefijo internacional.
 * - `sl-text-field`: Campo de texto para ingresar el número de teléfono.
 *
 *
 * ### Estados de validación y deshabilitación:
 * - Prefijo deshabilitado: Agregar el atributo `disabled` al componente `sl-select`.
 * - Número inválido: La clase `.sl-text-field--invalid` se aplicará automáticamente cuando el campo sea inválido y haya sido tocado.
 *
 */

@Component({
	selector: 'sl-phone-number',
	standalone: true,
	templateUrl: './phone-number.component.html',
	styleUrls: ['./phone-number.component.scss'],
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		'[class.sl-phone-number]': 'true',
	},
})
export class SlPhoneNumberComponent { }
