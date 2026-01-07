import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import {
	SlModuleTitleComponent,
	SlModuleTitlePreDirective,
	SlModuleTitlePostDirective,
} from './module-title.component';

const meta: Meta<SlModuleTitleComponent> = {
	title: 'Example/ModuleTitle',
	component: SlModuleTitleComponent,
	decorators: [
		moduleMetadata({
			imports: [SlModuleTitlePreDirective, SlModuleTitlePostDirective],
		}),
	],
	tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<SlModuleTitleComponent>;

/**
 * Uso básico del componente, mostrando un título principal y un subtítulo opcional antes de este.
 */
export const Basic: Story = {
	render: () => ({
		template: `
      <sl-module-title>
        <span slModuleTitlePre>Otros seguros</span>
        <h1>Toda la protección a tu alcance</h1>
      </sl-module-title>
    `,
	}),
	parameters: {
		docs: {
			description: {
				story:
					'Esta historia muestra el uso básico del componente con un título principal y un subtítulo opcional antes del título.',
			},
		},
	},
};

/**
 * Solo título principal.
 *
 * Útil en casos donde no se necesitan subtítulos adicionales.
 */
export const TitleOnly: Story = {
	render: () => ({
		template: `
      <sl-module-title>
        <h1>Toda la protección a tu alcance</h1>
      </sl-module-title>
    `,
	}),
	parameters: {
		docs: {
			description: {
				story:
					'En esta historia se muestra solo el título principal, sin incluir subtítulos antes ni después.',
			},
		},
	},
};

/**
 * Título principal con un subtítulo antes.
 *
 * Puede utilizarse para dar contexto al título principal.
 */
export const WithPreTitle: Story = {
	render: () => ({
		template: `
      <sl-module-title>
        <span slModuleTitlePre>Otros seguros</span>
        <h1>Toda la protección a tu alcance</h1>
      </sl-module-title>
    `,
	}),
	parameters: {
		docs: {
			description: {
				story:
					'Esta historia muestra un título principal acompañado de un subtítulo antes del título.',
			},
		},
	},
};

/**
 * Título principal con un subtítulo después.
 *
 * Útil para expandir información relacionada con el título principal.
 */
export const WithPostTitle: Story = {
	render: () => ({
		template: `
      <sl-module-title>
        <h1>Toda la protección a tu alcance</h1>
        <span slModuleTitlePost>Conoce todas las ventajas</span>
      </sl-module-title>
    `,
	}),
	parameters: {
		docs: {
			description: {
				story:
					'En esta historia se muestra un título principal con un subtítulo después del título.',
			},
		},
	},
};

/**
 * Título principal con subtítulos antes y después.
 *
 * Ideal para títulos que necesitan un contexto antes y detalles después.
 */
export const WithPrePostTitle: Story = {
	render: () => ({
		template: `
      <sl-module-title>
        <span slModuleTitlePre>Otros seguros</span>
        <h1>Toda la protección a tu alcance</h1>
        <span slModuleTitlePost>Conoce todas las ventajas</span>
      </sl-module-title>
    `,
	}),
	parameters: {
		docs: {
			description: {
				story:
					'Esta historia combina un título principal con subtítulos antes y después del título.',
			},
		},
	},
};

/**
 * Variación con contenido centrado.
 *
 * Se utiliza cuando se quiere destacar el título en el centro del espacio disponible.
 */
export const Centered: Story = {
	render: () => ({
		template: `
      <sl-module-title class="sl-module-title--centered">
        <span slModuleTitlePre>Pre Título Centrado</span>
        <h1>Centrado</h1>
        <span slModuleTitlePost>Post Título Centrado</span>
      </sl-module-title>
    `,
	}),
	parameters: {
		docs: {
			description: {
				story:
					'Esta historia muestra el componente con el contenido centrado, incluyendo el título y subtítulos.',
			},
		},
	},
};
