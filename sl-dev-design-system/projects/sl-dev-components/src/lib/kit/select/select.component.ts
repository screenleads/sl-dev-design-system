import {
	ChangeDetectionStrategy,
	Component,
	ElementRef,
	HostListener,
	Input,
	OnInit,
	Output,
	signal,
	ViewEncapsulation,
	forwardRef,
	EventEmitter,
	ViewChild,
	effect,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { SlSelectOption } from './select.model';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

/**
 * Componente select con búsqueda y navegación por teclado.
 * 
 * ### Uso:
 * ```typescript
 * // Standalone
 * <sl-select
 *   [options]="countries"
 *   [(value)]="selectedCountry"
 *   placeholder="Select a country"
 *   [searchable]="true">
 * </sl-select>
 * 
 * // Reactive Forms
 * <sl-select
 *   [options]="countries"
 *   formControlName="country"
 *   [searchable]="true">
 * </sl-select>
 * ```
 */
@Component({
	selector: 'sl-select',
	standalone: true,
	imports: [NgClass, NgFor, NgIf, FormsModule],
	template: `
		<div class="sl-select" [ngClass]="{ 'sl-select--open': isOpen(), 'sl-select--disabled': disabled() }">
			<button
				#trigger
				type="button"
				class="sl-select__trigger"
				[attr.aria-expanded]="isOpen()"
				[attr.aria-haspopup]="'listbox'"
				[disabled]="disabled()"
				(click)="toggle()"
				(keydown.arrowDown)="openAndFocusFirst($event)"
				(keydown.arrowUp)="openAndFocusLast($event)"
				(keydown.space)="toggle($event)"
				(keydown.enter)="toggle($event)">
				<span class="sl-select__value">{{ getDisplayValue() }}</span>
				<span class="sl-select__arrow" [ngClass]="{ 'sl-select__arrow--open': isOpen() }">▼</span>
			</button>

			<div *ngIf="isOpen()" class="sl-select__dropdown">
				<div *ngIf="searchable" class="sl-select__search">
					<input
						#searchInput
						type="text"
						class="sl-select__search-input"
						[placeholder]="searchPlaceholder"
						[(ngModel)]="searchQuery"
						(input)="onSearch()"
						(keydown.arrowDown)="focusFirstOption($event)"
						(keydown.arrowUp)="focusLastOption($event)"
						(keydown.escape)="close()"
						autocomplete="off">
				</div>

				<ul
					class="sl-select__options"
					role="listbox"
					[attr.aria-label]="label || 'Select options'">
					<li
						*ngFor="let option of filteredOptions(); let i = index"
						class="sl-select__option"
						[ngClass]="{
							'sl-select__option--selected': isSelected(option),
							'sl-select__option--disabled': option.disabled,
							'sl-select__option--focused': focusedIndex() === i
						}"
						role="option"
						[attr.aria-selected]="isSelected(option)"
						[attr.aria-disabled]="option.disabled"
						(click)="selectOption(option, $event)"
						(keydown.enter)="selectOption(option, $event)"
						(keydown.space)="selectOption(option, $event)"
						(keydown.arrowDown)="focusNext($event)"
						(keydown.arrowUp)="focusPrevious($event)"
						(keydown.escape)="close()"
						tabindex="-1">
						{{ option.label }}
					</li>

					<li *ngIf="filteredOptions().length === 0" class="sl-select__no-results">
						{{ noResultsText }}
					</li>
				</ul>
			</div>
		</div>
	`,
	styleUrls: ['./select.component.scss'],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => SlSelectComponent),
			multi: true,
		},
	],
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		'[class.sl-select-host]': 'true',
	},
})
export class SlSelectComponent<T = any> implements ControlValueAccessor, OnInit {
	@Input() options: SlSelectOption<T>[] = [];
	@Input() placeholder = 'Select an option';
	@Input() searchPlaceholder = 'Search...';
	@Input() label?: string;
	@Input() searchable = false;
	@Input() noResultsText = 'No results found';

	@Output() valueChange = new EventEmitter<T | null>();
	@Output() selectionChange = new EventEmitter<SlSelectOption<T> | null>();

	@ViewChild('trigger') triggerRef?: ElementRef<HTMLButtonElement>;
	@ViewChild('searchInput') searchInputRef?: ElementRef<HTMLInputElement>;

	protected readonly isOpen = signal(false);
	protected readonly disabled = signal(false);
	protected readonly filteredOptions = signal<SlSelectOption<T>[]>([]);
	protected readonly focusedIndex = signal(-1);
	protected searchQuery = '';

	private _value: T | null = null;
	private onChange: (value: T | null) => void = () => {};
	private onTouched: () => void = () => {};

	constructor(private elementRef: ElementRef) {
		effect(() => {
			if (this.isOpen()) {
				this.focusedIndex.set(-1);
				setTimeout(() => {
					if (this.searchable && this.searchInputRef) {
						this.searchInputRef.nativeElement.focus();
					}
				});
			}
		});
	}

	ngOnInit(): void {
		this.filteredOptions.set(this.options);
	}

	@HostListener('document:click', ['$event'])
	onDocumentClick(event: MouseEvent): void {
		if (!this.elementRef.nativeElement.contains(event.target)) {
			this.close();
		}
	}

	// ControlValueAccessor implementation
	writeValue(value: T | null): void {
		this._value = value;
	}

	registerOnChange(fn: (value: T | null) => void): void {
		this.onChange = fn;
	}

	registerOnTouched(fn: () => void): void {
		this.onTouched = fn;
	}

	setDisabledState(isDisabled: boolean): void {
		this.disabled.set(isDisabled);
	}

	// Public methods
	protected toggle(event?: Event): void {
		event?.preventDefault();
		if (this.disabled()) return;

		if (this.isOpen()) {
			this.close();
		} else {
			this.open();
		}
	}

	protected open(): void {
		if (this.disabled()) return;
		this.isOpen.set(true);
		this.searchQuery = '';
		this.filteredOptions.set(this.options);
	}

	protected close(): void {
		this.isOpen.set(false);
		this.onTouched();
		setTimeout(() => this.triggerRef?.nativeElement.focus());
	}

	protected selectOption(option: SlSelectOption<T>, event?: Event): void {
		event?.preventDefault();
		if (option.disabled) return;

		this._value = option.value;
		this.onChange(option.value);
		this.valueChange.emit(option.value);
		this.selectionChange.emit(option);
		this.close();
	}

	protected onSearch(): void {
		const query = this.searchQuery.toLowerCase().trim();
		if (!query) {
			this.filteredOptions.set(this.options);
		} else {
			const filtered = this.options.filter(opt =>
				opt.label.toLowerCase().includes(query)
			);
			this.filteredOptions.set(filtered);
		}
		this.focusedIndex.set(-1);
	}

	protected getDisplayValue(): string {
		if (this._value === null || this._value === undefined) {
			return this.placeholder;
		}
		const selected = this.options.find(opt => opt.value === this._value);
		return selected?.label ?? this.placeholder;
	}

	protected isSelected(option: SlSelectOption<T>): boolean {
		return option.value === this._value;
	}

	// Keyboard navigation
	protected openAndFocusFirst(event: Event): void {
		event.preventDefault();
		if (!this.isOpen()) {
			this.open();
		}
		this.focusedIndex.set(0);
	}

	protected openAndFocusLast(event: Event): void {
		event.preventDefault();
		if (!this.isOpen()) {
			this.open();
		}
		this.focusedIndex.set(this.filteredOptions().length - 1);
	}

	protected focusFirstOption(event: Event): void {
		event.preventDefault();
		this.focusedIndex.set(0);
	}

	protected focusLastOption(event: Event): void {
		event.preventDefault();
		this.focusedIndex.set(this.filteredOptions().length - 1);
	}

	protected focusNext(event: Event): void {
		event.preventDefault();
		const current = this.focusedIndex();
		const max = this.filteredOptions().length - 1;
		this.focusedIndex.set(current < max ? current + 1 : 0);
	}

	protected focusPrevious(event: Event): void {
		event.preventDefault();
		const current = this.focusedIndex();
		const max = this.filteredOptions().length - 1;
		this.focusedIndex.set(current > 0 ? current - 1 : max);
	}
}
