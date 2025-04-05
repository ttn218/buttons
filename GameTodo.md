# Buttons 게임 개발 계획

## 현재 구현된 기능
- 기본 게임 구조 (그리드 형식 UI)
- 빨간 버튼과 자원 표시
- 버튼 클릭 시 자원 증가 메커니즘
- 자원 값에 따른 조건부 활성화 시스템
- 리소스 관리 시스템
- 벨리데이터 시스템
- 런타임 오브젝트 생성 및 관리
- 자동 저장 및 로드 기능

## 추가할 카드 종류

### 1. 이벤트 카드
- **개념**: 특정 조건을 만족하면 일회성 이벤트를 발생시키는 카드
- **기능**:
  - 자원 숫자가 특정 값에 도달했을 때 활성화
  - 활성화 시 특별한 효과 발생 (보너스 자원, 애니메이션 등)
  - 이벤트 발생 후 비활성화 또는 새로운 이벤트로 변경
- **예시**:
  - "빨간 자원 50개 달성 축하!" - 50개 달성 시 보너스 자원 제공
  - "특별 할인" - 일시적으로 업그레이드 비용 감소
  - "행운의 시간" - 일시적으로 자원 생성 속도 증가

### 2. 업그레이드 카드
- **개념**: 자원을 소모하여 게임 진행 속도를 향상시키는 카드
- **기능**:
  - 자원을 소모하여 영구적인 효과 획득
  - 클릭 배수 증가, 자동 생성 속도 증가 등
  - 단계별 업그레이드 시스템 (레벨 1, 2, 3...)
- **예시**:
  - "클릭 배수 증가" - 클릭당 획득 자원 증가
  - "자동 생성기" - 초당 자동으로 자원 생성
  - "효율 향상" - 자원 생성 속도 증가

### 3. 발전 카드
- **개념**: 게임 진행에 따라 새로운 기능을 해금하는 카드
- **기능**:
  - 특정 조건 달성 시 새로운 게임 요소 해금
  - 새로운 자원, 새로운 버튼, 새로운 메커니즘 등
  - 게임 진행에 따른 자연스러운 발전 경로 제공
- **예시**:
  - "새로운 색상 해금" - 새로운 색상의 자원 해금
  - "특별 버튼 해금" - 특수 효과를 가진 버튼 해금
  - "새로운 메커니즘 해금" - 게임플레이를 변화시키는 새로운 메커니즘 해금

## 구현 계획

### 1단계: 카드 타입 시스템 구현
- 카드 타입을 구분하는 열거형(enum) 추가
- 각 카드 타입별 기본 클래스 구현
- 카드 타입에 따른 렌더링 로직 구현

### 2단계: 이벤트 카드 구현
- 이벤트 트리거 조건 설정 시스템 구현
- 이벤트 발생 시 효과 구현
- 이벤트 카드 UI 구현

### 3단계: 업그레이드 카드 구현
- 업그레이드 효과 시스템 구현
- 자원 소모 및 효과 적용 로직 구현
- 업그레이드 카드 UI 구현

### 4단계: 발전 카드 구현
- 게임 요소 해금 시스템 구현
- 발전 카드 UI 구현
- 새로운 게임 요소 추가 로직 구현

### 5단계: 카드 간 상호작용 구현
- 카드 간 연계 효과 구현
- 카드 조합 시스템 구현
- 카드 시너지 효과 구현

## 기술적 구현 방향

### 1. 카드 타입 시스템
```typescript
// types.ts에 추가
export enum CardType {
  RESOURCE = 'resource',
  EVENT = 'event',
  UPGRADE = 'upgrade',
  PROGRESSION = 'progression'
}

// GridObject 타입 확장
export interface GridObject {
  // 기존 속성
  component: any;
  name: string;
  props?: any;
  validate?: ValidateCondition[];
  requirements?: Requirement[];
  action?: Action | Action[];
  
  // 새로운 속성
  cardType: CardType;
  effects?: any; // 카드 타입별 효과
}
```

### 2. 이벤트 시스템
```typescript
// EventManager.ts 생성
export class EventManager {
  private events: Map<string, Event> = new Map();
  
  registerEvent(name: string, trigger: () => boolean, effect: () => void) {
    this.events.set(name, { trigger, effect, triggered: false });
  }
  
  checkEvents() {
    this.events.forEach((event, name) => {
      if (!event.triggered && event.trigger()) {
        event.effect();
        event.triggered = true;
      }
    });
  }
  
  resetEvent(name: string) {
    const event = this.events.get(name);
    if (event) {
      event.triggered = false;
    }
  }
}
```

### 3. 업그레이드 시스템
```typescript
// UpgradeManager.ts 생성
export class UpgradeManager {
  private upgrades: Map<string, Upgrade> = new Map();
  
  registerUpgrade(name: string, cost: number, effect: () => void) {
    this.upgrades.set(name, { cost, effect, level: 0 });
  }
  
  applyUpgrade(name: string, resource: Resource): boolean {
    const upgrade = this.upgrades.get(name);
    if (!upgrade) return false;
    
    if (resource.consume(upgrade.cost)) {
      upgrade.effect();
      upgrade.level++;
      upgrade.cost = Math.floor(upgrade.cost * 1.5); // 비용 증가
      return true;
    }
    
    return false;
  }
  
  getUpgradeLevel(name: string): number {
    return this.upgrades.get(name)?.level || 0;
  }
}
```

### 4. 발전 시스템
```typescript
// ProgressionManager.ts 생성
export class ProgressionManager {
  private progressionItems: Map<string, ProgressionItem> = new Map();
  
  registerProgressionItem(name: string, condition: () => boolean, unlock: () => void) {
    this.progressionItems.set(name, { condition, unlock, unlocked: false });
  }
  
  checkProgression() {
    this.progressionItems.forEach((item, name) => {
      if (!item.unlocked && item.condition()) {
        item.unlock();
        item.unlocked = true;
      }
    });
  }
}
```

## 다음 단계 작업

1. 카드 타입 시스템 구현
   - `types.ts`에 카드 타입 열거형 추가
   - `GridObject` 인터페이스 확장

2. 이벤트 카드 구현
   - `EventManager` 클래스 생성
   - 이벤트 카드 데이터 추가
   - 이벤트 카드 UI 구현

3. 업그레이드 카드 구현
   - `UpgradeManager` 클래스 생성
   - 업그레이드 카드 데이터 추가
   - 업그레이드 카드 UI 구현

4. 발전 카드 구현
   - `ProgressionManager` 클래스 생성
   - 발전 카드 데이터 추가
   - 발전 카드 UI 구현

5. 카드 간 상호작용 구현
   - 카드 시너지 시스템 구현
   - 카드 조합 효과 구현 

## 앞으로 구현할 기능 목록

### 1. 게임 메커니즘 확장
- **프레스티지 시스템**: 게임 재시작 시 보너스 획득
- **업적 시스템**: 특정 목표 달성 시 업적 획득
- **통계 시스템**: 게임 진행 상황 통계 표시
- **오프라인 진행**: 게임을 하지 않을 때도 자원 생성

### 2. 리소스 다양화
- **새로운 색상 리소스**: 파란색, 녹색 등 다양한 색상의 리소스 추가
- **특수 리소스**: 특별한 효과를 가진 리소스 추가
- **리소스 변환**: 한 리소스를 다른 리소스로 변환하는 메커니즘

### 3. UI/UX 개선
- **반응형 디자인**: 모바일 친화적인 UI 구현
- **애니메이션 효과**: 버튼 클릭, 자원 획득 등의 애니메이션 추가
- **다크/라이트 모드**: 테마 변경 기능 추가
- **사운드 효과**: 버튼 클릭, 이벤트 발생 등의 사운드 추가

### 4. 게임 콘텐츠 확장
- **스토리 모드**: 게임 진행에 따른 스토리 추가
- **도전 과제**: 특정 조건에서 게임을 진행하는 도전 과제 추가
- **이벤트 시스템**: 특정 기간 동안 특별한 이벤트 발생
- **보스 시스템**: 특정 조건에서 보스와 대결하는 시스템 추가

### 5. 기술적 개선
- **성능 최적화**: 렌더링 성능 개선, 메모리 사용량 최적화
- **코드 리팩토링**: 코드 구조 개선, 모듈화 강화
- **테스트 코드 작성**: 단위 테스트, 통합 테스트 추가
- **문서화**: 코드 문서화, 사용자 가이드 작성

## 다음 단계 우선순위

### 단기 목표 (1-2주)
1. 카드 타입 시스템 구현
   - `types.ts`에 카드 타입 열거형 추가
   - `GridObject` 인터페이스 확장
   - 카드 타입에 따른 기본 렌더링 로직 구현

2. 업그레이드 카드 구현
   - `UpgradeManager` 클래스 생성
   - 클릭 배수 증가 업그레이드 구현
   - 자동 생성 속도 증가 업그레이드 구현

3. UI 개선
   - 카드 디자인 개선
   - 자원 표시 UI 개선
   - 기본 애니메이션 효과 추가

### 중기 목표 (2-4주)
1. 이벤트 카드 구현
   - `EventManager` 클래스 생성
   - 이벤트 트리거 조건 설정 시스템 구현
   - 기본 이벤트 카드 데이터 추가

2. 새로운 리소스 추가
   - 파란색 리소스 구현
   - 리소스 간 상호작용 메커니즘 구현

3. 발전 카드 구현
   - `ProgressionManager` 클래스 생성
   - 게임 요소 해금 시스템 구현
   - 기본 발전 카드 데이터 추가

### 장기 목표 (1-2개월)
1. 프레스티지 시스템 구현
   - 게임 재시작 메커니즘 구현
   - 프레스티지 보너스 시스템 구현

2. 업적 시스템 구현
   - 업적 트리거 조건 설정
   - 업적 UI 구현
   - 기본 업적 데이터 추가

3. 게임 밸런싱
   - 자원 생성 속도 조정
   - 업그레이드 비용 조정
   - 게임 진행 속도 최적화 