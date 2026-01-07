import { createHostFactory, SpectatorHost } from '@ngneat/spectator';
import { SlTextFieldComponent } from './text-field.component';
import { SlNativeControlDirective } from '../native-form-control/native-control.directive';
import { ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
describe(`SlTextFieldComponent`, () => {
	let spectator: SpectatorHost<SlTextFieldComponent>;
	const createHost = createHostFactory({
		component: SlTextFieldComponent,
		// en lugar de mockear la directiva, la importamos para usarla
		// es más sencillo probar las dos cosas en lugar de hacer un test puramente unitario
		imports: [ReactiveFormsModule, SlNativeControlDirective],
	});
	describe(`component`, () => {
		it(`should have host class`, () => {
			// Arrange
			spectator = createHost(`<sl-text-field><input slNativeControl/></sl-text-field>`);
			// Act
			// Assert
			expect(spectator.element).toHaveClass('sl-text-field');
		});
		it(`should have host class when there is a value`, () => {
			// Arrange
			spectator = createHost(
				`<sl-text-field><input slNativeControl [value]="'test'"/></sl-text-field>`,
			);
			// Act
			// Assert
			expect(spectator.element).toHaveClass('sl-text-field--with-value');
		});
		it(`should have host class when input 'invalid' is specified`, () => {
			// Arrange
			spectator = createHost(`<sl-text-field [invalid]="true"></sl-text-field>`);
			// Act
			// Assert
			expect(spectator.element).toHaveClass('sl-text-field--invalid');
		});
		it(`should not have host class when input 'invalid' is specified and the field is disabled`, () => {
			// Arrange
			spectator = createHost(
				`<sl-text-field [invalid]="true"><input slNativeControl [disabled]="true"/></sl-text-field>`,
			);
			// Act
			// Assert
			expect(spectator.element).toHaveClass('sl-text-field--invalid');
		});
		it(`should have host class when input 'disabled' is specified`, () => {
			// Arrange
			spectator = createHost(
				`<sl-text-field><input slNativeControl [disabled]="true"/></sl-text-field>`,
			);
			// Act
			// Assert
			expect(spectator.element).toHaveClass('sl-text-field--disabled');
		});
		it(`should not have a 'label' element when 'label' input is not specified`, () => {
			// Arrange
			spectator = createHost(`<sl-text-field><input slNativeControl/></sl-text-field>`);
			// Act
			// Assert
			expect(spectator.query('label')).not.toExist();
		});
		it(`should have a 'label' element when 'label' input is specified`, () => {
			// Arrange
			spectator = createHost(
				`<sl-text-field label="Test"><input slNativeControl/></sl-text-field>`,
			);
			// Act
			// Assert
			expect(spectator.query('label')).toExist();
		});
		it(`should set the value of 'label' input to the 'label' element`, () => {
			const label = 'Test label value';
			// Arrange
			spectator = createHost(
				`<sl-text-field label="${label}"><input slNativeControl/></sl-text-field>`,
			);
			// Act
			// Assert
			expect(spectator.query('label')!.textContent?.trim()).toEqual(label);
		});
		it(`should set 'label[for]' attribute with the id of the control`, () => {
			// Arrange
			spectator = createHost(
				`<sl-text-field label="Test"><input slNativeControl id="test"/></sl-text-field>`,
			);
			// Act
			// Assert
			expect(spectator.query('label')!.getAttribute('for')).toEqual('test');
		});
		it('should focus the control when the host is clicked', () => {
			// Arrange
			spectator = createHost(
				`<sl-text-field label="Test"><input slNativeControl id="test"/></sl-text-field>`,
			);
			const focusSpy = spyOn(
				spectator.query(SlNativeControlDirective) as SlNativeControlDirective,
				'focus',
			);
			// Act
			spectator.click();
			// Assert
			expect(focusSpy).toHaveBeenCalled();
		});
	});
	/*
	 * Aqui no probamos ahora mismo la integración con ngControl.disabled ni ngControl.value
	 * porque de eso se encarga SlNativeControlDirective
	 */
	describe(`angular forms integration`, () => {
		it(`should have host class when form control has value`, () => {
			// Arrange
			const formControl = new FormControl<string | null>(null, {
				validators: [Validators.required],
			});
			const spectator = createHost(
				`<sl-text-field><input slNativeControl [formControl]="formControl"/></sl-text-field>`,
				{
					hostProps: {
						formControl,
					},
				},
			);
			// Act
			formControl.patchValue('test value');
			formControl.markAsTouched();
			spectator.detectChanges();
			// Assert
			expect(spectator.element).toHaveClass('sl-text-field--with-value');
		});
		it(`should have host class when form control is touched and invalid`, () => {
			// Arrange
			const formControl = new FormControl<string | null>(null, {
				validators: [Validators.required],
			});
			const spectator = createHost(
				`<sl-text-field><input slNativeControl [formControl]="formControl"/></sl-text-field>`,
				{
					hostProps: {
						formControl,
					},
				},
			);
			// Act
			formControl.markAsTouched();
			spectator.detectChanges();
			// Assert
			expect(spectator.element).toHaveClass('sl-text-field--invalid');
		});
		it(`should not have host when form control is not touched`, () => {
			// Arrange
			const formControl = new FormControl<string | null>(null, {
				validators: [Validators.required],
			});
			const spectator = createHost(
				`<sl-text-field><input slNativeControl [formControl]="formControl"/></sl-text-field>`,
				{
					hostProps: {
						formControl,
					},
				},
			);
			// Act
			formControl.patchValue(null);
			formControl.markAsUntouched();
			spectator.detectChanges();
			// Assert
			expect(spectator.element).not.toHaveClass('sl-text-field--invalid');
		});
		it(`should not have host class when input 'invalid' is specified if there is form control`, () => {
			// Arrange
			const formControl = new FormControl<string | null>(null, {
				validators: [Validators.required],
			});
			const spectator = createHost(
				`<sl-text-field [invalid]="true"><input slNativeControl [formControl]="formControl"/></sl-text-field>`,
				{
					hostProps: {
						formControl,
					},
				},
			);
			// Act
			spectator.detectChanges();
			// Assert
			expect(spectator.element).not.toHaveClass('sl-text-field--invalid');
		});

		it(`should have host class when form control is disabled`, () => {
			// Arrange
			const formControl = new FormControl<string | null>(null, {
				validators: [Validators.required],
			});
			const spectator = createHost(
				`<sl-text-field><input slNativeControl [formControl]="formControl"/></sl-text-field>`,
				{
					hostProps: {
						formControl,
					},
				},
			);
			// Act
			formControl.disable();
			spectator.detectChanges();
			// Assert
			expect(spectator.element).toHaveClass('sl-text-field--disabled');
		});
	});
	it(`should render the 'end' slot`, () => {
		// Arrange
		const idSlot = 'testEndSlot';
		spectator = createHost(
			`<sl-text-field><input slNativeControl/><span id="${idSlot}" slTextFieldEnd></span></sl-text-field>`,
		);
		// Act
		// Assert
		expect(spectator.query(`#${idSlot}`)).toExist();
	});
	it(`should set 'formFieldDisabled' to false when the control is enabled`, () => {
		// Arrange
		const formControl = new FormControl<string | null>('test value');
		spectator = createHost(
			`<sl-text-field><input slNativeControl [formControl]="formControl" /></sl-text-field>`,
			{
				hostProps: {
					formControl,
				},
			},
		);

		// Act
		formControl.enable();
		spectator.detectChanges();

		// Assert
		expect((spectator.component as any).formFieldDisabled()).toBeFalse();
	});
});
