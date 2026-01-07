import { Injectable, signal } from '@angular/core';
import { SlToast, SlToastConfig } from './toast.model';

/**
 * Servicio para mostrar notificaciones toast.
 * 
 * ### Uso:
 * ```typescript
 * constructor(private toastService: SlToastService) {}
 * 
 * showSuccess() {
 *   this.toastService.success('Operation completed successfully!');
 * }
 * 
 * showError() {
 *   this.toastService.error('An error occurred', { duration: 5000 });
 * }
 * 
 * showCustom() {
 *   this.toastService.show({
 *     message: 'Custom message',
 *     variant: 'info',
 *     position: 'top-center',
 *     duration: 3000
 *   });
 * }
 * ```
 */
@Injectable({ providedIn: 'root' })
export class SlToastService {
	private readonly toasts = signal<SlToast[]>([]);
	
	readonly toasts$ = this.toasts.asReadonly();

	/**
	 * Muestra un toast con configuración personalizada
	 */
	show(config: SlToastConfig): string {
		const toast: SlToast = {
			id: this.generateId(),
			message: config.message,
			variant: config.variant ?? 'info',
			duration: config.duration ?? 3000,
			position: config.position ?? 'top-right',
			dismissible: config.dismissible ?? true,
		};

		this.toasts.update(toasts => [...toasts, toast]);

		if (toast.duration > 0) {
			setTimeout(() => this.dismiss(toast.id), toast.duration);
		}

		return toast.id;
	}

	/**
	 * Muestra un toast de éxito
	 */
	success(message: string, config?: Partial<SlToastConfig>): string {
		return this.show({ ...config, message, variant: 'success' });
	}

	/**
	 * Muestra un toast de error
	 */
	error(message: string, config?: Partial<SlToastConfig>): string {
		return this.show({ ...config, message, variant: 'error' });
	}

	/**
	 * Muestra un toast de advertencia
	 */
	warning(message: string, config?: Partial<SlToastConfig>): string {
		return this.show({ ...config, message, variant: 'warning' });
	}

	/**
	 * Muestra un toast informativo
	 */
	info(message: string, config?: Partial<SlToastConfig>): string {
		return this.show({ ...config, message, variant: 'info' });
	}

	/**
	 * Cierra un toast por su ID
	 */
	dismiss(id: string): void {
		this.toasts.update(toasts => toasts.filter(t => t.id !== id));
	}

	/**
	 * Cierra todos los toasts
	 */
	dismissAll(): void {
		this.toasts.set([]);
	}

	private generateId(): string {
		return `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
	}
}
