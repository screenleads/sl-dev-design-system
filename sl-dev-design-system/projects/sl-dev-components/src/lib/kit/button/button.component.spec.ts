import { createHostFactory, SpectatorHost } from '@ngneat/spectator';
import { ScaButtonComponent } from './button.component';
describe('ScaButtonComponent', () => {
	let spectator: SpectatorHost<ScaButtonComponent>;
	const createHost = createHostFactory(ScaButtonComponent);
	it('should have primary as default variant', () => {
		// Arrange
		spectator = createHost(`<button sca-button>Button</button>`);
		// Act
		// Assert
		expect(spectator.component['variant']).toBe('primary');
	});
	it('should apply the proper style', () => {
		// Arrange
		spectator = createHost(`<button sca-button>Button</button>`);
		// Act
		// Assert
		expect(spectator.element).toHaveClass('sca-button--primary');
		// Act
		spectator.setInput('variant', 'border');
		// Assert
		expect(spectator.element).toHaveClass('sca-button--border');
	});
	it('should render the content', () => {
		const content = 'Some nice button';
		// Arrange
		spectator = createHost(`<button sca-button>${content}</button>`);
		// Act
		// Assert
		expect(spectator.element.querySelector('.sca-button__content')?.innerHTML).toBe(content);
	});
	it('should apply the size', () => {
		// Arrange
		spectator = createHost(`<button sca-button>Button</button>`);
		// Act
		spectator.setInput('size', 'small');
		// Assert
		expect(spectator.element).toHaveClass('sca-button--small');
	});
	it('should be disabled', () => {
		// Arrange
		spectator = createHost(`<button sca-button>Button</button>`);
		expect(spectator.element).not.toBeDisabled();
		// Act
		spectator.setInput('disabled', true);
		// Assert
		expect(spectator.element).toBeDisabled();
	});
	it('should work with <a>', () => {
		// Arrange
		spectator = createHost(`<a sca-button>Link</a>`);
		expect(spectator.element).not.toBeDisabled();
		// Act
		// Assert
		expect(spectator).toExist();
	});
	describe('longClick', () => {
		it('should not emit with regular click', () => {
			// Arrange
			spectator = createHost(`<button sca-button>Button</button>`);
			const spy = spyOn(spectator.component.longClick, 'emit');
			// Act
			spectator.click();
			// Assert
			expect(spy).not.toHaveBeenCalled();
		});
		it('should not emit before the delay', async () => {
			// Arrange
			spectator = createHost(`<button sca-button>Button</button>`);
			const spy = spyOn(spectator.component.longClick, 'emit');
			// Act
			spectator.dispatchMouseEvent(spectator.element, 'mousedown');
			await new Promise((resolve) => setTimeout(resolve, ScaButtonComponent.LONG_PRESS_MIN / 2));
			spectator.click();
			// Assert
			expect(spy).not.toHaveBeenCalled();
		});
		it('should emit after the delay', async () => {
			// Arrange
			spectator = createHost(`<button sca-button>Button</button>`);
			const spy = spyOn(spectator.component.longClick, 'emit');
			// Act
			spectator.dispatchMouseEvent(spectator.element, 'mousedown');
			await new Promise((resolve) => setTimeout(resolve, ScaButtonComponent.LONG_PRESS_MIN));
			spectator.click();
			// Assert
			expect(spy).toHaveBeenCalled();
		});
		it('should emit after the delay and a more time', async () => {
			// Arrange
			spectator = createHost(`<button sca-button>Button</button>`);
			const spy = spyOn(spectator.component.longClick, 'emit');
			// Act
			spectator.dispatchMouseEvent(spectator.element, 'mousedown');
			await new Promise((resolve) => setTimeout(resolve, ScaButtonComponent.LONG_PRESS_MIN * 2));
			spectator.click();
			// Assert
			expect(spy).toHaveBeenCalled();
		});
		it('should emit with touch events', async () => {
			// Arrange
			spectator = createHost(`<button sca-button>Button</button>`);
			const spy = spyOn(spectator.component.longClick, 'emit');
			// Act
			spectator.dispatchTouchEvent(spectator.element, 'touchstart');
			await new Promise((resolve) => setTimeout(resolve, ScaButtonComponent.LONG_PRESS_MIN));
			// emulate native behaviour, mousedown is dispatched after the touch events and just before the click
			spectator.dispatchMouseEvent(spectator.element, 'mousedown');
			spectator.dispatchMouseEvent(spectator.element, 'click');
			// Assert
			expect(spy).toHaveBeenCalled();
		});
		it('should not emit when disabled', async () => {
			// Arrange
			spectator = createHost(`<button sca-button [disabled]="true">Button</button>`);
			const spy = spyOn(spectator.component.longClick, 'emit');
			// Act
			spectator.dispatchMouseEvent(spectator.element, 'mousedown');
			await new Promise((resolve) => setTimeout(resolve, ScaButtonComponent.LONG_PRESS_MIN));
			spectator.click();
			// Assert
			expect(spy).not.toHaveBeenCalled();
		});
	});
});
