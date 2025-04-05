# 게임 정보 문서

## 게임 엔진 구조

### 핵심 컴포넌트

#### GameEngine
게임의 핵심 엔진으로, 리소스 관리, 상태 저장/로드, 성능 모니터링 등의 기능을 제공합니다.

```typescript
// 리소스 추가
gameEngine.addResource(new RedResource());

// 성능 모니터링 활성화
gameEngine.setPerformanceMonitoring(true);
```

#### Resource 시스템
모든 게임 리소스의 기본 클래스로, 값 관리, 상태 저장/로드 등의 공통 기능을 제공합니다.

```typescript
export abstract class Resource implements IResource {
    // 공통 속성
    locks: string[] = [];
    unlocks: string[] = [];
    realValue: Decimal = new Decimal(0);
    value: Decimal;
    protected valueStore: Writable<Decimal>;
    public name: string;
    gnum: Decimal = new Decimal(0);
    
    // 공통 메서드
    init(): void;
    updateValue(n: Decimal): void;
    generate(): void;
    add(amount: Decimal): void;
    consume(amount: Decimal): boolean;
    // ...
}
```

#### RedResource
게임의 주요 리소스로, 레벨, 자동 생성 속도, 클릭 배수 등의 특수 기능을 제공합니다.

```typescript
export class RedResource extends Resource {
    // 특수 속성
    private autoGenerateRateStore: Writable<Decimal>;
    private clickMultiplierStore: Writable<Decimal>;
    private levelStore: Writable<number>;
    
    // 특수 메서드
    increaseAutoGenerate(amount: Decimal): void;
    increaseClickMultiplier(amount: Decimal): void;
    increaseLevel(): void;
    // ...
}
```

### 액션 시스템

게임의 모든 액션은 `Gamelib.ts`에서 관리되며, 리소스별로 특별한 처리를 할 수 있습니다.

#### 액션 처리기 등록

```typescript
// 기본 액션 처리기 등록
registerActionHandler('add', (resource, amount) => {
    resource.add(amount);
});

// 리소스별 특별한 액션 처리기 등록
registerActionHandler('add', (resource, amount) => {
    // 레벨에 따라 amount 조정
    const levelAdjustedAmount = amount.eq(1) ? new Decimal(this.getLevel() + 1) : amount;
    this.add(levelAdjustedAmount);
}, 'red');
```

#### 액션 실행

```typescript
// 단일 액션 실행
executeAction({
    type: 'add',
    resource: 'red',
    amount: 1
});

// 여러 액션 실행
executeAction([
    {
        type: 'updateLevel',
        resource: 'red'
    },
    {
        type: 'consume',
        resource: 'red',
        amount: 10
    }
]);
```

## 게임 리소스

### RedResource

게임의 주요 리소스로, 다음과 같은 특성을 가집니다:

- **기본 생성량**: 레벨에 따라 동적으로 계산됩니다 (레벨 + 1)
- **자동 생성**: 초기에는 0이며, 업그레이드로 증가할 수 있습니다
- **클릭 배수**: 초기에는 1이며, 업그레이드로 증가할 수 있습니다
- **레벨**: 초기에는 0이며, 특정 조건을 만족하면 증가합니다

#### 업그레이드

RedResource에는 다음과 같은 업그레이드가 있습니다:

1. **자동 생성 +0.1**: Red 5개 소모
2. **클릭 배수 +0.5**: Red 20개 소모
3. **레벨 업그레이드**: Red 10개 소모

#### 특수 효과

레벨이 증가하면 다음과 같은 효과가 있습니다:

- **레벨 1**: 자동 생성량 +1
- **레벨 2**: 자동 생성량 ×2
- **레벨 3**: 자동 생성량 ×3

## 게임 버튼

### 기본 버튼

1. **Red 버튼**
   - 기능: Red 리소스 추가 (레벨에 따라 양 증가)
   - 조건: 없음

2. **Red + 1 버튼**
   - 기능: 레벨 증가 및 Red 10개 소모
   - 조건: Red 10개 이상

3. **자동 생성 +0.1 버튼**
   - 기능: 자동 생성 속도 0.1 증가
   - 조건: Red 5개 이상

4. **클릭 배수 +0.5 버튼**
   - 기능: 클릭 배수 0.5 증가
   - 조건: Red 20개 이상

## 게임 저장/로드

게임 상태는 자동으로 저장되며, 다음과 같은 정보가 포함됩니다:

- 리소스 값
- 자동 생성 속도
- 클릭 배수
- 레벨

## 성능 모니터링

게임 엔진은 성능 모니터링 기능을 제공하며, 다음과 같은 정보를 수집합니다:

- 프레임 레이트
- 메모리 사용량
- 리소스 생성/소비 속도

## 확장 방법

### 새 리소스 추가

새로운 리소스를 추가하려면 `Resource` 클래스를 상속받는 새 클래스를 만들고, 필요한 특수 기능을 구현하면 됩니다:

```typescript
export class BlueResource extends Resource {
    // 특수 속성 및 메서드 구현
    
    // 액션 등록
    private registerActions(): void {
        registerActionHandler('specialAction', (resource, amount) => {
            // 특수 처리 로직
        }, 'blue');
    }
    
    // 상태 저장/로드
    public getState(): any {
        // 상태 반환
    }
    
    public loadState(state: any): void {
        // 상태 로드
    }
}
```

### 새 액션 추가

새로운 액션을 추가하려면 `registerActionHandler` 함수를 사용하여 액션 처리기를 등록하면 됩니다:

```typescript
registerActionHandler('newAction', (resource, amount) => {
    // 액션 처리 로직
}, 'resourceName');
```

## 게임 밸런스

현재 게임의 밸런스는 다음과 같습니다:

- Red 버튼: 레벨에 따라 1~N개 생성
- 자동 생성 +0.1: Red 5개 소모
- 클릭 배수 +0.5: Red 20개 소모
- 레벨 업그레이드: Red 10개 소모

이 밸런스는 게임 진행 속도와 난이도에 영향을 미칩니다. 