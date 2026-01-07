import { ChangeDetectionStrategy, Component, computed, inject, ViewEncapsulation } from '@angular/core';
import { SlToastService } from './toast.service';
import { SlToast } from './toast.model';
import { NgClass, NgFor, NgIf } from '@angular/common';

/**
 * Contenedor de toasts. Debe ser incluido una vez en el layout principal de la aplicación.
 * 
 * ### Uso:
 * ```typescript
 * // app.component.ts
 * @Component({
 *   selector: 'app-root',
 *   standalone: true,
 *   imports: [SlToastContainerComponent],
 *   template: `
 *     <router-outlet></router-outlet>
 *     <sl-toast-container></sl-toast-container>
 *   `
 * })
 * export class AppComponent {}
 * ```
 */
@Component({
	selector: 'sl-toast-container',
	standalone: true,
	imports: [NgFor, NgIf, NgClass],
	template: `
		<div 
			*ngFor="let position of positions()" 
			class="sl-toast-container"
			[ngClass]="'sl-toast-container--' + position">
			<div
				*ngFor="let toast of getToastsByPosition(position)"
				class="sl-toast"
				[ngClass]="'sl-toast--' + toast.variant">
				<div class="sl-toast__content">
					<span class="sl-toast__icon">{{ getIcon(toast.variant) }}</span>
					<span class="sl-toast__message">{{ toast.message }}</span>
				</div>
				<button
					*ngIf="toast.dismissible"
					class="sl-toast__close"
					(click)="dismiss(toast.id)"
					aria-label="Close">
					×
				</button>
			</div>
		</div>
	`,
	styleUrls: ['./toast.component.scss'],
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SlToastContainerComponent {
	private readonly toastService = inject(SlToastService);

	protected readonly toasts = this.toastService.toasts$;
	protected readonly positions = computed(() => {
		const positions = new Set(this.toasts().map(t => t.position));
		return Array.from(positions);
	});

	protected getToastsByPosition(position: string): SlToast[] {
		return this.toasts().filter(t => t.position === position);
	}

	protected dismiss(id: string): void {
		this.toastService.dismiss(id);
	}

	protected getIcon(variant: string): string {
		const icons: Record<string, string> = {
			success: '✓',
			error: '✕',
			warning: '⚠',
			info: 'ℹ',
		};
		return icons[variant] || 'ℹ';
	}
}
