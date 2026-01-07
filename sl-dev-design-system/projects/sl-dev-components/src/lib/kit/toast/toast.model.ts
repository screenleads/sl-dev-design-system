export type SlToastVariant = 'success' | 'error' | 'warning' | 'info';
export type SlToastPosition = 'top-right' | 'top-left' | 'top-center' | 'bottom-right' | 'bottom-left' | 'bottom-center';

export interface SlToastConfig {
	message: string;
	variant?: SlToastVariant;
	duration?: number;
	position?: SlToastPosition;
	dismissible?: boolean;
}

export interface SlToast extends Required<SlToastConfig> {
	id: string;
}
