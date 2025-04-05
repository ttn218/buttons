import { Resource } from '../Resource';
import { Decimal } from 'decimal.js';
import { writable, type Writable } from 'svelte/store';
import validator from '../../classes/Validator';
import { registerActionHandler } from '../Gamelib';

export class RedResource extends Resource {
	private autoGenerateRateStore: Writable<Decimal>;
	private clickMultiplierStore: Writable<Decimal>;
	private levelStore: Writable<number>;

	constructor() {
		super('red', new Decimal(0));
		this.autoGenerateRateStore = writable<Decimal>(new Decimal(0));
		this.clickMultiplierStore = writable<Decimal>(new Decimal(1));
		this.levelStore = writable<number>(0);
		this.init();
		this.registerActions();
	}

	// 액션 등록
	private registerActions(): void {
		// RedResource 특화 액션 등록
		registerActionHandler('increaseAutoGenerate', (resource, amount) => {
			this.increaseAutoGenerate(amount);
		}, 'red');

		registerActionHandler('increaseClickMultiplier', (resource, amount) => {
			this.increaseClickMultiplier(amount);
		}, 'red');

		// 레벨 업데이트 액션 등록
		registerActionHandler('updateLevel', (resource, amount) => {
			this.increaseLevel();
		}, 'red');

		// add 액션에 대한 특별한 처리기 등록
		registerActionHandler('add', (resource, amount) => {
			// 레벨에 따라 amount 조정
			const levelAdjustedAmount = amount.eq(1) ? new Decimal(this.getLevel() + 1) : amount;
			this.add(levelAdjustedAmount);
		}, 'red');
	}

	init(): void {
		super.init();
		this.locks = ['a1', 'a2', 'a3'];
		this.autoGenerateRateStore.set(new Decimal(0));
		this.clickMultiplierStore.set(new Decimal(1));
		this.levelStore.set(0);
	}

	generate(): void {
		let n = this.getAutoGenerateRate();
		if (this.unlockCheck('a1')) n = n.plus(1);
		if (this.unlockCheck('a2')) n = n.mul(2);
		if (this.unlockCheck('a3')) n = n.mul(3);

		this.updateValue(n);
		this.updateValidators();
	}

	add(n: Decimal): void {
		let amount = n.mul(this.getClickMultiplier());
		if (this.unlockCheck('a1')) amount = amount.plus(1);
		if (this.unlockCheck('a2')) amount = amount.mul(2);
		if (this.unlockCheck('a3')) amount = amount.mul(3);
		
		super.add(amount);
	}

	// 자원 소비
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

	// 자동 생성 속도 증가
	increaseAutoGenerate(amount: Decimal): void {
		this.autoGenerateRateStore.update(rate => rate.plus(amount));
		this.updateValidators();
	}

	// 클릭 배수 증가
	increaseClickMultiplier(amount: Decimal): void {
		this.clickMultiplierStore.update(mult => mult.plus(amount));
		this.updateValidators();
	}

	// 레벨 증가
	increaseLevel(): void {
		this.levelStore.update(level => level + 1);
		this.updateValidators();
	}

	// 현재 자동 생성 속도 반환
	public getAutoGenerateRate(): Decimal {
		let rate: Decimal;
		this.autoGenerateRateStore.subscribe(r => rate = r)();
		return rate!;
	}

	// 현재 클릭 배수 반환
	public getClickMultiplier(): Decimal {
		let multiplier: Decimal;
		this.clickMultiplierStore.subscribe(m => multiplier = m)();
		return multiplier!;
	}

	// 현재 레벨 반환
	public getLevel(): number {
		let level: number;
		this.levelStore.subscribe(l => level = l)();
		return level!;
	}

	// 자동 생성량 스토어 반환
	public getAutoGenerateRateStore(): Writable<Decimal> {
		return this.autoGenerateRateStore;
	}

	// 클릭 배수 스토어 반환
	public getClickMultiplierStore(): Writable<Decimal> {
		return this.clickMultiplierStore;
	}

	// 레벨 스토어 반환
	public getLevelStore(): Writable<number> {
		return this.levelStore;
	}

	// 저장을 위한 상태 반환
	public getState(): any {
		return {
			name: this.getName(),
			value: this.getValue().toString(),
			autoGenerate: this.getAutoGenerateRate().toString(),
			clickMultiplier: this.getClickMultiplier().toString(),
			level: this.getLevel()
		};
	}

	// 저장된 상태 로드
	public loadState(state: any): void {
		this.setValue(new Decimal(state.value));
		this.setAutoGenerateRate(new Decimal(state.autoGenerate));
		this.setClickMultiplier(new Decimal(state.clickMultiplier));
		if (state.level !== undefined) {
			this.levelStore.set(state.level);
		}
	}

	protected updateValidators(): void {
		super.updateValidators();
	}

	public setAutoGenerateRate(rate: Decimal): void {
		this.autoGenerateRateStore.set(rate);
	}

	public setClickMultiplier(multiplier: Decimal): void {
		this.clickMultiplierStore.set(multiplier);
	}
}

export default RedResource;
