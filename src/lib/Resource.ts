/* eslint-disable @typescript-eslint/no-unused-vars */
import { writable, type Writable } from 'svelte/store';
import { Decimal } from 'decimal.js';
import validator from '../classes/Validator';

export interface IResource {
	name: string;
	value: Decimal;
	getValue(): Decimal;
	setValue(value: Decimal): void;
	getName(): string;
	add(amount: Decimal): void;
	consume(amount: Decimal): boolean;
	getValueStore(): Writable<Decimal>;
}

export abstract class Resource implements IResource {
	locks: string[] = [];
	unlocks: string[] = [];
	realValue: Decimal = new Decimal(0);
	value: Decimal;
	protected valueStore: Writable<Decimal>;
	public name: string;

	gnum: Decimal = new Decimal(0);

	constructor(name: string, initialValue: Decimal = new Decimal(0)) {
		this.name = name;
		this.value = initialValue;
		this.valueStore = writable<Decimal>(this.value);
	}

	init(): void {
		this.setValue(new Decimal(0));
	}

	protected updateValue(n: Decimal) {
		this.valueStore.update(current => current.plus(n));
	}

	generate(): void {
		this.updateValue(this.gnum);
	}

	add(amount: Decimal): void {
		this.valueStore.update(current => current.plus(amount));
		this.updateValidators();
	}

	setGnum(n: Decimal) {
		this.gnum = n;
	}

	setValue(value: Decimal): void {
		this.valueStore.set(value);
	}

	getName(): string {
		return this.name;
	}

	getValue(): Decimal {
		let value: Decimal;
		this.valueStore.subscribe(v => value = v)();
		return value!;
	}

	unlock(key: string) {
		this.unlocks.push(key);
	}

	unlockCheck(key: string) {
		return this.unlocks.includes(key);
	}

	consume(amount: Decimal): boolean {
		let canConsume = false;
		this.valueStore.subscribe(current => {
			canConsume = current.greaterThanOrEqualTo(amount);
		})();
		
		if (canConsume) {
			this.valueStore.update(current => current.minus(amount));
			this.updateValidators();
			return true;
		}
		return false;
	}

	getValueStore(): Writable<Decimal> {
		return this.valueStore;
	}

	protected updateValidators(): void {
		validator.emit();
	}

	public abstract getState(): any;
	public abstract loadState(state: any): void;
}

export default Resource;
