import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { SlIconCustomComponent } from './icon-custom.component';

describe('SlIconCustomComponent', () => {
	let spectator: Spectator<SlIconCustomComponent>;
	const createComponent = createComponentFactory(SlIconCustomComponent);

	beforeEach(() => {
		spectator = createComponent();
	});

	it('should create the component', () => {
		// Arrange: No es necesario preparar nada, ya que solo estamos comprobando que el componente se cree correctamente.

		// Act: El componente se crea automáticamente en el `beforeEach` usando `createComponent()`.

		// Assert: Verificamos que el componente haya sido creado correctamente y que no sea nulo o indefinido.
		expect(spectator.component).toBeTruthy();
	});
	it('should have the default dot position of "top-right"', () => {
		// Arrange: No es necesario modificar nada aquí, ya que estamos comprobando el valor por defecto.

		// Act: El componente ya está creado con el valor por defecto 'top-right' para `dotPosition`.

		// Assert: Verificamos que el valor por defecto de `dotPosition` es 'top-right'.
		expect(spectator.component.dotPosition).toBe('top-right');
	});

	it('should update the dot position when dotPosition input changes', () => {
		// Arrange: Establecemos un nuevo valor para la propiedad `dotPosition`, en este caso 'bottom-left'.
		spectator.setInput('dotPosition', 'bottom-left');

		// Act: Se ejecuta la acción de actualizar el valor de `dotPosition`.

		// Assert: Comprobamos que el valor de `dotPosition` ha cambiado correctamente a 'bottom-left'.
		expect(spectator.component.dotPosition).toBe('bottom-left');
	});

	it('should apply correct styles based on inputs', () => {
		// Arrange: Configuramos los valores de los inputs: tamaño del icono, tamaño y color del punto.
		spectator.setInput('size', '32px');
		spectator.setInput('dotSize', '12px');
		spectator.setInput('dotColor', '#00ff00');

		// Act: Se aplican los cambios en los valores de los inputs, lo que debería afectar los estilos del componente.

		// Assert: Verificamos que los estilos se apliquen correctamente al elemento host del componente.
		const hostElement = spectator.element;
		expect(hostElement.style.getPropertyValue('--sl-icon-custom-icon-size')).toBe('32px');
		expect(hostElement.style.getPropertyValue('--sl-icon-custom-dot-size')).toBe('12px');
		expect(hostElement.style.getPropertyValue('--sl-icon-custom-dot-color')).toBe('#00ff00');
	});
});
