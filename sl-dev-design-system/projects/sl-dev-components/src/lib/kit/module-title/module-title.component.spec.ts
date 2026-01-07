import { createHostFactory, SpectatorHost } from '@ngneat/spectator';
import {
	SlModuleTitleComponent,
	SlModuleTitlePreDirective,
	SlModuleTitlePostDirective,
} from './module-title.component';

describe('SlModuleTitleComponent', () => {
	let spectator: SpectatorHost<SlModuleTitleComponent>;
	const createHost = createHostFactory({
		component: SlModuleTitleComponent,
		imports: [SlModuleTitlePreDirective, SlModuleTitlePostDirective],
	});

	it('should have the host class', () => {
		// Arrange
		spectator = createHost(`<sl-module-title></sl-module-title>`);

		// Assert
		expect(spectator.element).toHaveClass('sl-module-title');
	});

	it('should render the projected main title', () => {
		// Arrange
		const title = 'Test Title';
		spectator = createHost(`
      <sl-module-title>
        <h1>${title}</h1>
      </sl-module-title>
    `);

		// Act
		const mainTitleElement = spectator.query('h1');

		// Assert
		expect(mainTitleElement).toBeTruthy();
		expect(mainTitleElement?.textContent).toContain(title);
	});

	it('should render the projected preTitle', () => {
		// Arrange
		const preTitle = 'Pre Title';
		spectator = createHost(`
      <sl-module-title>
        <span slModuleTitlePre>${preTitle}</span>
        <h1>Main Title</h1>
      </sl-module-title>
    `);

		// Act
		const preTitleElement = spectator.query('[slModuleTitlePre]');

		// Assert
		expect(preTitleElement).toBeTruthy(); // Verificar que el elemento exista
		expect(preTitleElement?.textContent).toContain(preTitle);
	});

	it('should render the projected postTitle', () => {
		// Arrange
		const postTitle = 'Post Title';
		spectator = createHost(`
      <sl-module-title>
        <h1>Main Title</h1>
        <span slModuleTitlePost>${postTitle}</span>
      </sl-module-title>
    `);

		// Act
		const postTitleElement = spectator.query('[slModuleTitlePost]');

		// Assert
		expect(postTitleElement).toBeTruthy(); // Verificar que el elemento exista
		expect(postTitleElement?.textContent).toContain(postTitle);
	});

	it('should apply the centered class when class is set', () => {
		// Arrange
		spectator = createHost(`
      <sl-module-title class="sl-module-title--centered">
        <h1>Main Title</h1>
      </sl-module-title>
    `);

		// Act
		// No action needed since class is set in the template

		// Assert
		expect(spectator.element).toHaveClass('sl-module-title--centered');
	});

	it('should not apply the centered class when class is not set', () => {
		// Arrange
		spectator = createHost(`
      <sl-module-title>
        <h1>Main Title</h1>
      </sl-module-title>
    `);

		// Act
		// No action needed

		// Assert
		expect(spectator.element).not.toHaveClass('sl-module-title--centered');
	});

	it('should render the title with centered classes', () => {
		// Arrange
		const title = 'Centered and Full Width';
		spectator = createHost(`
      <sl-module-title class="sl-module-title--centered">
        <h1>${title}</h1>
      </sl-module-title>
    `);

		// Act
		const mainTitleElement = spectator.query('h1');

		// Assert
		expect(spectator.element).toHaveClass('sl-module-title--centered');
		expect(mainTitleElement?.textContent).toContain(title);
	});
});
