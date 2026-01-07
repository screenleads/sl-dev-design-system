import { createHostFactory, SpectatorHost } from '@ngneat/spectator';
import { SlRadioButtonComponent } from './radiobutton.component';
import { ReactiveFormsModule, FormControl } from '@angular/forms';

describe('SlRadioButtonComponent', () => {
	let spectator: SpectatorHost<SlRadioButtonComponent>;
	const createHost = createHostFactory({
		component: SlRadioButtonComponent,
		imports: [ReactiveFormsModule],
	});

	it('should apply the checked state when selected', () => {
		// Arrange
		spectator = createHost(`<sl-radiobutton [checked]="true">Opción</sl-radiobutton>`);
		// Assert
		expect(spectator.component.checked).toBeTrue();
		expect(spectator.element).toHaveClass('sl-radio-button--checked');
	});

	it('should apply the disabled state', () => {
		// Arrange
		spectator = createHost(`<sl-radiobutton [disabled]="true">Opción</sl-radiobutton>`);
		// Assert
		expect(spectator.component.disabled).toBeTrue();
		expect(spectator.element).toHaveClass('sl-radio-button--disabled');
	});

	it('should toggle checked state when input changes', () => {
		// Arrange
		spectator = createHost(`<sl-radiobutton>Opción</sl-radiobutton>`);
		// Act
		spectator.setInput('checked', true);
		spectator.detectChanges();
		// Assert
		expect(spectator.component.checked).toBeTrue();
		expect(spectator.element).toHaveClass('sl-radio-button--checked');
	});

	it('should not change checked state when disabled', () => {
		// Arrange
		spectator = createHost(
			`<sl-radiobutton [disabled]="true" [checked]="false">Opción</sl-radiobutton>`,
		);
		const input = spectator.query<HTMLInputElement>('input');
		// Act
		spectator.click(input!);
		spectator.detectChanges();
		// Assert
		expect(spectator.component.checked).toBeFalse();
		expect(spectator.element).not.toHaveClass('sl-radio-button--checked');
	});

	it('should emit change event when checked', () => {
		// Arrange
		const changeSpy = jasmine.createSpy();
		spectator = createHost(
			`<sl-radiobutton (change)="changeSpy($event)" [checked]="false" [value]="'option1'">Opción</sl-radiobutton>`,
			{
				hostProps: {
					changeSpy,
				},
			},
		);
		const input = spectator.query<HTMLInputElement>('input');
		// Act
		spectator.click(input!);
		spectator.detectChanges();
		// Assert
		expect(changeSpy).toHaveBeenCalledWith('option1');
	});
	it('should update checked state via writeValue', () => {
		// Arrange
		spectator = createHost(`<sl-radiobutton [value]="'option1'">Opción</sl-radiobutton>`);
		// Act
		spectator.component.writeValue('option1');
		spectator.detectChanges();
		// Assert
		expect(spectator.component.checked).toBeTrue();
	});

	it('should not update checked state if value does not match', () => {
		// Arrange
		spectator = createHost(`<sl-radiobutton [value]="'option1'">Opción</sl-radiobutton>`);
		// Act
		spectator.component.writeValue('option2');
		spectator.detectChanges();
		// Assert
		expect(spectator.component.checked).toBeFalse();
	});
	it('should call onChange when value changes', () => {
		// Arrange
		const onChangeSpy = jasmine.createSpy();
		spectator = createHost(`<sl-radiobutton [value]="'option1'">Opción</sl-radiobutton>`);
		spectator.component.registerOnChange(onChangeSpy);
		// Act
		spectator.component.updateValue(new Event('change'));
		// Assert
		expect(onChangeSpy).toHaveBeenCalledWith('option1');
	});
	it('should call onTouched when value changes', () => {
		// Arrange
		const onTouchedSpy = jasmine.createSpy();
		spectator = createHost(`<sl-radiobutton>Opción</sl-radiobutton>`);
		spectator.component.registerOnTouched(onTouchedSpy);
		// Act
		spectator.component.updateValue(new Event('change'));
		// Assert
		expect(onTouchedSpy).toHaveBeenCalled();
	});
	it('should disable the radio button via setDisabledState', () => {
		// Arrange
		spectator = createHost(`<sl-radiobutton>Opción</sl-radiobutton>`);
		// Act
		spectator.component.setDisabledState(true);
		spectator.detectChanges();
		// Assert
		expect(spectator.component.disabled).toBeTrue();
		expect(spectator.element).toHaveClass('sl-radio-button--disabled');
	});

	it('should enable the radio button via setDisabledState', () => {
		// Arrange
		spectator = createHost(`<sl-radiobutton [disabled]="true">Opción</sl-radiobutton>`);
		// Act
		spectator.component.setDisabledState(false);
		spectator.detectChanges();
		// Assert
		expect(spectator.component.disabled).toBeFalse();
		expect(spectator.element).not.toHaveClass('sl-radio-button--disabled');
	});
	it('should reflect form control value in the component', () => {
		// Arrange
		const formControl = new FormControl('option1');
		spectator = createHost(
			`<sl-radiobutton [formControl]="formControl" [value]="'option1'">Opción 1</sl-radiobutton>`,
			{
				hostProps: { formControl },
			},
		);
		const inputElement = spectator.query('input') as HTMLInputElement;
		// Assert
		expect(inputElement.checked).toBeTrue();
	});

	it('should disable the radio button when form control is disabled', () => {
		// Arrange
		const formControl = new FormControl({ value: null, disabled: true });
		spectator = createHost(
			`<sl-radiobutton [formControl]="formControl" [value]="'option1'">Opción 1</sl-radiobutton>`,
			{
				hostProps: { formControl },
			},
		);
		const inputElement = spectator.query('input') as HTMLInputElement;
		// Assert
		expect(inputElement.disabled).toBeTrue();
	});
});
