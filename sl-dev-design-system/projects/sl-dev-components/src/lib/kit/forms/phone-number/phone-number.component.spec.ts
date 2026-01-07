import { createHostFactory, SpectatorHost } from '@ngneat/spectator';
import { SlPhoneNumberComponent } from './phone-number.component';

describe('SlPhoneNumberComponent', () => {
	let spectator: SpectatorHost<SlPhoneNumberComponent>;
	const createHost = createHostFactory({
		component: SlPhoneNumberComponent,
	});

	it('should have the host class', () => {
		spectator = createHost(`<sl-phone-number></sl-phone-number>`);
		expect(spectator.element).toHaveClass('sl-phone-number');
	});

	it('should render select and text field components', () => {
		spectator = createHost(`
      <sl-phone-number>
        <sl-select></sl-select>
        <sl-text-field></sl-text-field>
      </sl-phone-number>
    `);
		expect(spectator.query('sl-select')).toExist();
		expect(spectator.query('sl-text-field')).toExist();
	});
});
