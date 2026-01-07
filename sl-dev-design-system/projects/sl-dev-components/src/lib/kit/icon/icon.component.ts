import {
	ChangeDetectionStrategy,
	Component,
	computed,
	HostBinding,
	Input,
	signal,
	ViewEncapsulation,
} from '@angular/core';

/**
 * Estilo del icono para Material Symbols.
 */
export type SlIconStyle = 'outlined' | 'rounded' | 'sharp';

/**
 * Nombre del icono
 */
export type SlIconName = string; // note, in the future we will try to add strong typing for the icon names

/**
 * Variantes predefinidas para el icono.
 *
 * Aplica diferentes estilos pre definidos.
 *
 * Es posible establecer variantes personalizadas.
 */
export type SlIconVariant =
	| 'dark'
	| 'weak'
	| 'dark-green'
	| 'light-green'
	| 'link'
	| 'blue'
	| 'gray'
	| 'error'
	| string;

/**
 * Formas disponibles para el icono.
 */
export type SlIconShape = 'default' | 'circle';

/**
 * Un componente para renderizar íconos utilizando Material Symbols como fuente.
 *
 * Puedes encontrar [aquí](https://fonts.google.com/icons) los diferentes iconos disponibles.
 *
 * **Importante** es necesario incluir en tu proyecto las fuentes, puedes consultar la [guía de the Material Symbols](https://developers.google.com/fonts/docs/material_symbols#using_material_symbols)
 *
 * **NOTA**: las fuentes pesan muchísimo, cada variante puede pesar más de 3mb y mientras se descarga los iconos no se renderizan provocando layout
 * shifting. **Por favor** optimizar la fuente para utilizar solo los iconos necesarios. Material Symbols permite
 * configurar qué iconos y configuraciones cargar, revisar [la guía de optimización](https://developers.google.com/fonts/docs/material_symbols#optimize_the_icon_font)
 *
 * ### Customización
 *
 * - size: Permite customizar el tamaño del icono. Se puede utilizar:
 *  - el input `size` del component. Recomendado para iconos standalone
 *  - la propiedad css `font-size`. Recomendado para iconos dentro de otros componentes.
 * - color: Permite cambiar el color del icono. Lo recomendable es generar una variante nueva mediante css.
 * - shape: Permite customizar la forma del icono.
 * - variant: Aplica un tema al icono. Es posible crear variantes personalizadas.
 *
 * ### Setup
 * index.html
 *
 * @example
 * <head>
 *    <!-- please, optimize the icons https://developers.google.com/fonts/docs/material_symbols#optimize_the_icon_font -->
 *    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
 *    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
 *    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Sharp:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
 * </head>
 *
 * **Por favor** [optimiza los iconos](https://developers.google.com/fonts/docs/material_symbols#optimize_the_icon_font)
 *
 * ### Uso:
 *
 * ```html
 * @Component({
 *   standalone: true,
 *   imports: [SlIconModule],
 *   template: `
 *     <sl-icon icon="home"></sl-icon>
 *     <sl-icon icon="home" style="rounded"></sl-icon>
 *     <!-- A bigger icon using css -->
 *     <sl-icon icon="home" style="font-size:32px"></sl-icon>
 *     <!-- Or with the size input -->
 *     <sl-icon icon="home" size="32px"></sl-icon>
 *   `,
 * })
 * export class Component {}
 * ```
 * @see [Material Symbols guide](https://developers.google.com/fonts/docs/material_symbols) para más información
 */
@Component({
	selector: 'sl-icon',
	standalone: true,
	imports: [],
	template: ``,
	styleUrls: ['./icon.component.scss'],
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SlIconComponent {
	/**
	 * @ignore
	 * @protected
	 */
	protected readonly styleSignal = signal<SlIconStyle>('outlined');
	/**
	 * @ignore
	 * @protected
	 */
	protected readonly iconSignal = signal<SlIconName>('select');
	/**
	 * @ignore
	 * @protected
	 */
	protected readonly shapeSignal = signal<SlIconShape>('default');
	/**
	 * @ignore
	 * @protected
	 */
	protected readonly variantSignal = signal<SlIconVariant | null>(null);
	/**
	 * @ignore
	 * @protected
	 */
	protected readonly filledSignal = signal<boolean>(false);
	/**
	 * La familia de fuentes del icono. De forma predeterminada, utiliza la fuente Material Symbols y la variante (delineada, redondeada, nítida).
	 *
	 * La familia de fuentes específica se calcula en función del estiloSignal (outlined, rounded, sharp).
	 * @protected
	 * @ignore
	 */
	protected readonly fontFamily = computed(() => {
		let result: string;
		let materialStyle = 'Outlined';
		const style = this.styleSignal();
		switch (style) {
			case 'rounded':
				materialStyle = 'Rounded';
				break;
			case 'sharp':
				materialStyle = 'Sharp';
				break;
		}
		result = `Material Symbols ${materialStyle}`;
		return result;
	});
	/**
	 * La clase CSS específica que se aplicará al icono de la forma.
	 * @protected
	 */
	protected readonly shapeCssClass = computed(() => {
		const shape = this.shapeSignal();
		const result = `sl-icon--${shape}`;
		return result;
	});
	/**
	 * La clase CSS según la variante
	 * @protected
	 */
	protected readonly variantCssClass = computed(() => {
		const variant = this.variantSignal()?.trim();

		const result = variant && variant.length > 0 ? `sl-icon--variant-${variant}` : null;
		return result;
	});

	@HostBinding('style.font-size')
	protected get sizeStyle() {
		return this.size;
	}
	@HostBinding('class')
	protected get hostClass() {
		return [this.shapeCssClass(), this.variantCssClass()].filter((c) => c != null);
	}
	/**
	 * La familia de fuentes del icono. De forma predeterminada, utiliza la fuente Material Symbols y la variante (delineada, redondeada, nítida).
	 * @protected
	 */
	@HostBinding('style.--sl-icon-font-family')
	protected get fontFamilyStyle() {
		return this.fontFamily();
	}

	/**
	 * Con esta función controlamos si el icono está relleno o no
	 * @protected
	 */
	@HostBinding('style.font-variation-settings')
	get fontVariationSettings(): string {
		const fillValue = this.filledSignal() ? 1 : 0; // 1 = relleno, 0 = sin relleno
		return `'FILL' ${fillValue}`;
	}

	/**
	 * El icono real se representa en un pseudoelemento ::before o ::after en el CSS.
	 * Esta propiedad personalizada se utiliza para establecer el contenido del pseudoelemento.
	 * @protected
	 */
	@HostBinding('style.--sl-icon-prefix')
	protected get prefixStyle() {
		// notice the quotes ("), they are required to properly work
		return `"${this.iconSignal()}"`;
	}
	/**
	 * El estilo del icono.
	 *
	 * Cuando se utiliza la fuente Material Symbols, el estilo se utiliza para cambiar la variante de la fuente.
	 *
	 * @default 'outlined'
	 */
	@Input()
	get style() {
		return this.styleSignal();
	}

	set style(value: SlIconStyle) {
		this.styleSignal.set(value);
	}

	/**
	 * El icono a renderizar.
	 *
	 * Puedes encontrar [aquí](https://fonts.google.com/icons) los diferentes iconos disponibles.
	 */
	@Input({ required: true })
	get icon() {
		return this.iconSignal();
	}
	set icon(value: SlIconName) {
		this.iconSignal.set(value);
	}

	/**
	 * El tamaño del icono.
	 *
	 * Este input está diseñado para usarse cuando el ícono es independiente.
	 *
	 * Cuando utilice el ícono dentro de otros elementos, como botones, ícono debería tener un tamaño relativo al tamaño de fuente del elemento principal.
	 * en lugar de usar este input, se recomienda utilizar `font-size`.
	 *
	 */
	@Input()
	size: string | null = null;

	/**
	 * La forma del icono.
	 *
	 * Se utiliza para mostrar el icono en diferentes formas.
	 */
	@Input()
	get shape() {
		return this.shapeSignal();
	}
	set shape(value: SlIconShape) {
		this.shapeSignal.set(value);
	}

	/**
	 * El relleno del icono
	 *
	 * Se utiliza para mostrar si el icono debe de estar relleno o no
	 */
	@Input()
	get filled() {
		return this.filledSignal();
	}
	set filled(value: boolean) {
		this.filledSignal.set(value);
	}

	/**
	 * Tema a aplicar al icono.
	 *
	 * No se aplica ninguna clase si el valor es `null`.
	 *
	 * El icono hereda por defecto el color del texto del contenedor, útil para iconos
	 * contenidos en botones o enlaces.
	 *
	 * En caso de indicarse una variante, se añadirá la clase `sl-icon--variant-${variant}`.
	 *
	 * @default null
	 */
	@Input()
	get variant() {
		return this.variantSignal();
	}
	set variant(value: SlIconVariant | null) {
		this.variantSignal.set(value);
	}
}
