import { inject, Injectable } from '@angular/core';

/**
 * Servicio para auto generar identificadores únicos.
 *
 * Créditos a TaigaUI: https://github.com/taiga-family/taiga-ui/blob/d02e34c503a9dbfef73acd605c29133aeadf3f55/projects/cdk/services/id.service.ts
 */
@Injectable({
	providedIn: 'root',
})
export class SlIdService {
	private static autoId = 0;

	public generate(prefix?: string): string {
		return `sl_${prefix ? prefix.replaceAll('-', '_') + '_' : ''}${SlIdService.autoId++}`;
	}
}

/**
 * Inyecta un identificador único haciendo uso de `SlIdService`.
 *
 * Permite indicar un prefijo adicional, se reemplazan los guiones por guiones bajos
 * para mantener la consistencia con los identificadores generados.
 *
 * ## Uso
 * ```ts
 * @Component({})
 * export class MyComponent {
 *    public readonly id = slInjectId();
 * }
 * ```
 *
 * ```ts
 * @Component({})
 * export class MyComponent {
 *    public readonly id = slInjectId('some_prefix');
 * }
 * ```
 */
export function slInjectId(prefix?: string): string {
	return inject(SlIdService).generate(prefix);
}
