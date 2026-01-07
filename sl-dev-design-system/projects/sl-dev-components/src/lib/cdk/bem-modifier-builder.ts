import type { Trim } from 'type-fest';
/**
 * Construye una clase modificador en BEM comprobando si el valor existe.
 *
 * Si el valor es `null` no se generará la clase.
 *
 * @example bemModifierBuilder('sl-info-text', 'primary') // 'sl-info-text--primary'
 * @example bemModifierBuilder('sl-info-text', null) // null
 * @example bemModifierBuilder('sl-info-text', ' ') // null
 * @param base
 * @param value
 */
export function bemModifierBuilder<TValue extends string | null>(
	base: string,
	value: TValue,
): TValue extends string ? (Trim<TValue> extends '' ? null : string) : null {
	const normalized = value?.trim().toLowerCase();
	return (normalized && normalized.length > 0 ? `${base}--${normalized}` : null) as any;
}
