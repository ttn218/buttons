/* eslint-disable @typescript-eslint/no-explicit-any */
// 그리드 객체
// 그리드 객체 구조 ( 벨리데이트 함수, 렌더링 컴포넌트, requirements, 이름 )
// 그리드 런타임 객체 ( 벨리데이터, 렌더링 컴포넌트, requirements, 이름 )

import type { Component } from 'svelte';
import type { Writable } from 'svelte/store';

// 카드 타입 열거형 추가
export enum CardType {
  RESOURCE = 'resource',
  EVENT = 'event',
  UPGRADE = 'upgrade',
  PROGRESSION = 'progression'
}

export type ValidateFun = () => boolean;

export type ValidateType = 'gte' | 'lte' | 'eq' | 'neq';

export type ValidateCondition = {
	type: ValidateType;
	resource?: string;
	value: number;
};

export type Validate = {
	name: string;
	conditions?: ValidateCondition[];
	result: Writable<boolean>;
	fun: ValidateFun;
};

export type Requirement = {
	color: string;
	resources: string;
	value: number;
};

// 기능 정의 타입
export type ActionType = 'add' | 'consume' | 'increaseAutoGenerate' | 'increaseClickMultiplier' | 'updateLevel';

export type Action = {
	type: ActionType;
	resource?: string;
	amount?: number;
	levelStore?: string;
};

// 카드 효과 타입 정의
export type CardEffect = {
  type: string;
  value: number;
  duration?: number; // 이벤트 카드의 경우 지속 시간
};

export type GridObject = {
	name: string;
	validate: ValidateCondition[];
	component: Component<any, any, any>;
	props?: any;
	requirements?: Requirement[];
	action?: Action | Action[];
	// 새로운 속성 추가
	cardType: CardType;
	effects?: CardEffect[];
};

export type GridRuntimeObject = {
	name: string;
	validator: Writable<boolean>;
	component: Component<any, any, any>;
	props?: any;
	requirements?: Requirement[];
	action?: Action | Action[];
	// 새로운 속성 추가
	cardType: CardType;
	effects?: CardEffect[];
};
