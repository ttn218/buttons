/* eslint-disable @typescript-eslint/no-explicit-any */
// 그리드 객체
// 그리드 객체 구조 ( 벨리데이트 함수, 렌더링 컴포넌트, requirements, 이름 )
// 그리드 런타임 객체 ( 벨리데이터, 렌더링 컴포넌트, requirements, 이름 )

import type { Component } from 'svelte';
import type { Writable } from 'svelte/store';

export type ValidateFun = () => boolean;

export type ValidateType = 'gte' | 'lte' | 'eq' | 'neq';

export type ValidateCondition = {
	type: ValidateType;
	resource?: string;
	value: number;
};

export type Validate = {
	name: string;
	conditions: ValidateCondition[];
	result: Writable<boolean>;
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

export type GridObject = {
	name: string;
	validate: ValidateCondition[];
	component: Component<any, any, any>;
	props?: any;
	requirements?: Requirement[];
	action?: Action | Action[];
};

export type GridRuntimeObject = {
	name: string;
	validator: Writable<boolean>;
	component: Component<any, any, any>;
	props?: any;
	requirements?: Requirement[];
	action?: Action | Action[];
};
