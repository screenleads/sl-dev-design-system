import { createHostFactory, SpectatorHost } from '@ngneat/spectator';
import { SlCheckboxComponent } from './checkbox.component';
import { ReactiveFormsModule, FormControl } from '@angular/forms';

describe('SlCheckboxComponent', () => {
	let spectator: SpectatorHost<SlCheckboxComponent>;
	const createHost = createHostFactory({
		component: SlCheckboxComponent,
		imports: [ReactiveFormsModule],
	});

	it('should create the component', () => {
		// Arrange
		spectator = createHost(`<sl-checkbox>Checkbox</sl-checkbox>`);

		// Act & Assert
		expect(spectator.component).toBeTruthy();
	});

	it('should render the content', () => {
		const content = 'Checkbox Label';

		// Arrange
		spectator = createHost(`<sl-checkbox>${content}</sl-checkbox>`);

		// Act & Assert
		expect(spectator.element.textContent).toContain(content);
	});

	it('should be unchecked by default', () => {
		// Arrange
		spectator = createHost(`<sl-checkbox>Checkbox</sl-checkbox>`);

		// Act
		const inputElement = spectator.query('input') as HTMLInputElement;

		// Assert
		expect(inputElement.checked).toBe(false);
	});

	it('should apply the checked state when set from parent', () => {
		// Arrange
		spectator = createHost(`<sl-checkbox [checked]="true">Checkbox</sl-checkbox>`);

		// Act
		const inputElement = spectator.query('input') as HTMLInputElement;

		// Assert
		expect(inputElement.checked).toBe(true);
	});

	it('should apply the disabled state', () => {
		// Arrange
		spectator = createHost(`<sl-checkbox [disabled]="true">Checkbox</sl-checkbox>`);

		// Act & Assert
		expect(spectator.query('input') as HTMLInputElement).toBeDisabled();
	});

	it('should reflect checked state changes from parent', () => {
		// Arrange
		spectator = createHost(`<sl-checkbox [checked]="false">Checkbox</sl-checkbox>`);
		const inputElement = spectator.query('input') as HTMLInputElement;

		// Act
		spectator.setInput('checked', true);

		// Assert
		expect(inputElement.checked).toBe(true);
	});

	// Tests de integración con Angular Forms (FormControl)
	describe('angular forms integration', () => {
		it('should update form control value on input change', () => {
			// Arrange
			const formControl = new FormControl(false);
			spectator = createHost(`<sl-checkbox [formControl]="formControl">Checkbox</sl-checkbox>`, {
				hostProps: { formControl },
			});

			const inputElement = spectator.query('input') as HTMLInputElement;

			// Act
			inputElement.click(); // Simula el cambio de estado
			spectator.detectChanges();

			// Assert
			expect(formControl.value).toBe(true);
		});
	});
	it('should call onChange when updateValue is triggered', () => {
		// Arrange
		spectator = createHost(`<sl-checkbox>Checkbox</sl-checkbox>`);
		const inputElement = spectator.query('input') as HTMLInputElement;
		const onChangeSpy = spyOn(spectator.component as any, 'onChange').and.callThrough();

		// Act
		inputElement.click();

		// Assert
		expect(onChangeSpy).toHaveBeenCalledWith(true);
	});

	it('should call onTouched when updateValue is triggered', () => {
		// Arrange
		spectator = createHost(`<sl-checkbox>Checkbox</sl-checkbox>`);
		const inputElement = spectator.query('input') as HTMLInputElement;
		const onTouchedSpy = spyOn(spectator.component as any, 'onTouched').and.callThrough();

		// Act
		inputElement.click();

		// Assert
		expect(onTouchedSpy).toHaveBeenCalled();
	});
});
