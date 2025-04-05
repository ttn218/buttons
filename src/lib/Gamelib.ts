import validator from "../classes/Validator";
import type { GridObject, GridRuntimeObject, Action, ValidateCondition } from "../types/types";
import GameEngine from "./GameEngine";
import { RedResource } from "./Resources/RedResource";
import { Decimal } from 'decimal.js';

// 액션 처리기 타입 정의
type ActionHandler = (resource: any, amount: Decimal) => void;

// 액션 처리기 맵 (리소스별 처리기)
const resourceActionHandlers: Record<string, Record<string, ActionHandler>> = {};

// 기본 액션 처리기 맵
const defaultActionHandlers: Record<string, ActionHandler> = {};

// 액션 처리기 등록 함수
export const registerActionHandler = (actionType: string, handler: ActionHandler, resourceName?: string) => {
    if (resourceName) {
        // 특정 리소스에 대한 처리기 등록
        if (!resourceActionHandlers[resourceName]) {
            resourceActionHandlers[resourceName] = {};
        }
        resourceActionHandlers[resourceName][actionType] = handler;
    } else {
        // 기본 처리기 등록
        defaultActionHandlers[actionType] = handler;
    }
};

// 기본 액션 처리기 등록
registerActionHandler('add', (resource, amount) => {
    resource.add(amount);
});

registerActionHandler('consume', (resource, amount) => {
    resource.consume(amount);
});

// 이벤트 실행 전/후 처리할 내용 작성
/**
 * 이벤트 핸들러 생성 함수
 * 이벤트 실행 후 벨리데이터 실행
 */
export const createEventHandler = (fun: () => void) => {
    return () => {
        fun();
        validator.emit()
    }
}

// 액션 처리 함수
export const executeAction = (action: Action | Action[]) => {
    if (!action) return;

    const actions = Array.isArray(action) ? action : [action];
    
    actions.forEach(singleAction => {
        const { type, resource: resourceName, amount } = singleAction;
        
        // 리소스 관련 액션 처리
        if (resourceName) {
            const resource = gameEngine.getResource(resourceName);
            if (!resource) return;
            
            // 리소스별 처리기 확인
            if (resourceActionHandlers[resourceName] && resourceActionHandlers[resourceName][type]) {
                // amount가 없는 경우 기본값 0 사용
                const actionAmount = amount !== undefined ? new Decimal(amount) : new Decimal(0);
                resourceActionHandlers[resourceName][type](resource, actionAmount);
            } 
            // 기본 처리기 확인
            else if (defaultActionHandlers[type]) {
                // amount가 없는 경우 기본값 0 사용
                const actionAmount = amount !== undefined ? new Decimal(amount) : new Decimal(0);
                defaultActionHandlers[type](resource, actionAmount);
            } else {
                console.warn(`액션 타입 '${type}'에 대한 처리기가 등록되지 않았습니다.`);
            }
        }
    });
    
    validator.emit();
}

export const executeValidate = (conditions: ValidateCondition[]): boolean => {
    return conditions.every(condition => {
        if (!condition.resource) return true;
        
        const res = gameEngine.getResource(condition.resource);
        if (!res) return false;
        
        const value = res.getValue();
        
        switch (condition.type) {
            case 'gte':
                return value.gte(condition.value);
            case 'lte':
                return value.lte(condition.value);
            case 'eq':
                return value.eq(condition.value);
            case 'neq':
                return !value.eq(condition.value);
            default:
                return false;
        }
    });
}

// validate > validator로 변환
export const createGridRuntimeObject = (grids: GridObject[]): GridRuntimeObject[] => {
    if (!grids) return []
    
    const gridRuntimeObject: GridRuntimeObject[] = grids.map((grid) => {
        const {component, name, validate, props, requirements, action} = grid
        const v = validator.makeValiDate(() => executeValidate(validate), grid.name);

        if (!v) return null

        return {
            component,
            name,
            props: {
                ...props,
                clickHandler: action ? createEventHandler(() => executeAction(action)) : props?.clickHandler
            },
            requirements,
            validator: v,
            action
        }
    }).filter((g) => g !== null);

    validator.emit()

    return gridRuntimeObject
}

const gameEngine = GameEngine

gameEngine.addResource(new RedResource());

gameEngine.setPerformanceMonitoring(true)

export default gameEngine