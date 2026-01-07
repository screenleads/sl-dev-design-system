import { createHostFactory, SpectatorHost } from '@ngneat/spectator';
import { SlIconComponent, SlIconShape, SlIconVariant } from './icon.component';
describe('SlIconComponent', () => {
	let spectator: SpectatorHost<SlIconComponent>;
	const createHost = createHostFactory(SlIconComponent);
	it('should have outlined as default style', () => {
		// Arrange
		spectator = createHost(`<sl-icon></sl-icon>`);
		// Act
		// Assert
		expect(spectator.component['style']).toBe('outlined');
	});
	it('should apply the proper style', () => {
		// Arrange
		spectator = createHost(`<sl-icon></sl-icon>`);
		// Act
		// Assert
		expect(spectator.element).toHaveStyle({
			'--sl-icon-font-family': 'Material Symbols Outlined',
		});
		// Act
		spectator.setInput('style', 'rounded');
		// Assert
		expect(spectator.element).toHaveStyle({
			'--sl-icon-font-family': 'Material Symbols Rounded',
		});
		// Act
		spectator.setInput('style', 'sharp');
		// Assert
		expect(spectator.element).toHaveStyle({
			'--sl-icon-font-family': 'Material Symbols Sharp',
		});
	});
	it('should render the icon', () => {
		const icon = 'search';
		// Arrange
		spectator = createHost(`<sl-icon icon="${icon}"></sl-icon>`);
		// Act
		// Assert
		expect(spectator.element).toHaveStyle({
			'--sl-icon-prefix': `"${icon}"`,
		});
		expect(spectator.component.icon).toBe(icon);
	});
	it('should apply the size', () => {
		const size = '32px';
		// Arrange
		spectator = createHost(`<sl-icon size="${size}"></sl-icon>`);
		// Act
		// Assert
		expect(spectator.element).toHaveStyle({
			'font-size': size,
		});
	});
	/**
	 * This test is to make sure that the icon has the appropriate size, based on the size input.
	 *
	 * If the size for the icon is 32px, then the icon html element should have a height and width of 32px.
	 */
	it('should have the same width and height than the size', () => {
		const size = 32;
		// Arrange
		spectator = createHost(`<sl-icon size="${size}px"></sl-icon>`);
		// Act
		// Assert
		expect(spectator.element.clientHeight).toBe(size);
		expect(spectator.element.clientWidth).toBe(size);
	});

	it('should have the class for the shape', () => {
		const shape: SlIconShape = 'circle';
		// Arrange
		spectator = createHost(`<sl-icon></sl-icon>`);
		expect(spectator.element).not.toHaveClass('sl-icon--circle');
		// Act
		spectator.setInput('shape', shape);
		// Assert
		expect(spectator.element).toHaveClass('sl-icon--circle');
	});
	it('should not have any variant class by default', () => {
		// Arrange
		spectator = createHost(`<sl-icon></sl-icon>`);
		// Act
		// Assert
		expect(spectator.element.className).not.toMatch(/sl-icon--variant-/);
	});
	it('should have the class for the variant', () => {
		const variant: SlIconVariant = 'link';
		// Arrange
		spectator = createHost(`<sl-icon></sl-icon>`);
		expect(spectator.element).not.toHaveClass('sl-icon--variant-link');
		// Act
		spectator.setInput('variant', variant);
		// Assert
		expect(spectator.element).toHaveClass('sl-icon--variant-link');
	});
});
