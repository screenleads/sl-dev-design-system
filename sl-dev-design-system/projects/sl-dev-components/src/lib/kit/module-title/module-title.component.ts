import { ChangeDetectionStrategy, Component, Directive, ViewEncapsulation } from '@angular/core';

@Directive({
	selector: '[slModuleTitlePre]',
	standalone: true,
})
export class SlModuleTitlePreDirective { }

@Directive({
	selector: '[slModuleTitlePost]',
	standalone: true,
})
export class SlModuleTitlePostDirective { }

/**
 * Componente de título de módulo. Se utiliza para mostrar un título estilizado que puede incluir subtítulos opcionales antes y después del título principal.
 *
 * ### Customización
 *
 * - **Directivas:**
 *   - `slModuleTitlePre`: Para incluir contenido antes del título principal.
 *   - `slModuleTitlePost`: Para incluir contenido después del título principal.
 * - **Clases CSS:**
 *   - `sl-module-title--centered`: Centra el contenido del título y subtítulos.
 *
 * ### Uso
 *
 * ```html
 * <sl-module-title>
 *   <span slModuleTitlePre>Pre Título</span>
 *   <h1>Título Principal</h1>
 *   <span slModuleTitlePost>Post Título</span>
 * </sl-module-title>
 * ```
 *
 * También puedes combinar las clases CSS para centrar el título:
 *
 * ```html
 * <sl-module-title class="sl-module-title--centered>
 *   <span slModuleTitlePre>Pre Título</span>
 *   <h1>Título Principal</h1>
 *   <span slModuleTitlePost>Post Título</span>
 * </sl-module-title>
 * ```
 */
@Component({
	selector: 'sl-module-title',
	standalone: true,
	templateUrl: './module-title.component.html',
	styleUrls: ['./module-title.component.scss'],
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'sl-module-title',
	},
})
export class SlModuleTitleComponent { }
