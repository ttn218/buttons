/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import type Resource from "./Resource"
import validator from "../classes/Validator";
import Decimal from "decimal.js";

class GameEngine {
    private static instance: GameEngine | null = null;
    private resources: Resource[] = []
    private performanceMonitoringEnabled: boolean = false; // 성능 체크 활성화 여부
    private autoSaveInterval: number | null = null;
    private autoSaveTimer: number | null = null;
    private resourceGenerationTimer: number | null = null;
    private isInitialized: boolean = false;
    
    private constructor() {
        // private 생성자로 외부에서 직접 인스턴스화 방지
    }

    public static getInstance(): GameEngine {
        if (!GameEngine.instance) {
            GameEngine.instance = new GameEngine();
        }
        return GameEngine.instance;
    }

    public addResource(resource: Resource) {
        this.resources.push(resource)
    }

    public getResource(name: string): Resource | undefined {
        return this.resources.find((r) => r.getName() === name);
    }

    setPerformanceMonitoring(enabled: boolean) {
        this.performanceMonitoringEnabled = enabled; // 성능 체크 활성화/비활성화
    }

    private measurePerformance(fn: Function, ...args: any[]) {
        if (!this.performanceMonitoringEnabled) {
            fn(...args); 
            return; // 성능 체크 없이 반환
        }

        const start = performance.now(); // 시작 시간 기록
        fn(...args); // 함수 실행
        const end = performance.now(); // 종료 시간 기록

        const duration = end - start;

        // 16ms 이상일 경우 경고 메시지 출력
        if (duration > 16) {
            console.warn(`⚠️ Warning: Execution time exceeded 16ms: ${duration.toFixed(2)} ms`);
        }
    }

    private generateResources() {
        this.measurePerformance(() => {
            this.resources.forEach(resource => {
                resource.generate(); // 각 자원의 generate 호출
            });
            // 리소스 생성 후 validator 업데이트
            validator.emit();
        });
    }

    // 게임 상태 저장
    public save() {
        const gameData = {
            resources: this.resources.map(resource => resource.getState())
        };
        localStorage.setItem('gameData', JSON.stringify(gameData));
    }

    // 게임 상태 로드
    public load() {
        const data = localStorage.getItem('gameData');
        if (data) {
            try {
                const parsedData = JSON.parse(data);
                
                if (parsedData.resources && Array.isArray(parsedData.resources)) {
                    parsedData.resources.forEach((savedResource: any) => {
                        const resource = this.resources.find(r => r.getName() === savedResource.name);
                        if (resource) {
                            resource.loadState(savedResource);
                        }
                    });
                }
                
                validator.emit();
            } catch (error) {
                console.error('게임 데이터 로드 중 오류 발생:', error);
            }
        }
    }

    // 자동 저장 시작
    private startAutoSave() {
        if (this.autoSaveInterval) {
            clearInterval(this.autoSaveInterval);
        }
        this.autoSaveInterval = setInterval(() => {
            this.save();
        }, 1000);
    }

    // 자동 저장 중지
    private stopAutoSave(): void {
        if (this.autoSaveTimer) {
            clearInterval(this.autoSaveTimer);
            this.autoSaveTimer = null;
        }
    }

    // 자원 생성 타이머 시작
    private startResourceGeneration(): void {
        if (this.resourceGenerationTimer) {
            clearInterval(this.resourceGenerationTimer);
        }
        
        this.resourceGenerationTimer = window.setInterval(() => {
            this.generateResources();
        }, 1000);
    }

    // 자원 생성 타이머 중지
    private stopResourceGeneration(): void {
        if (this.resourceGenerationTimer) {
            clearInterval(this.resourceGenerationTimer);
            this.resourceGenerationTimer = null;
        }
    }

    public init() {
        if (this.isInitialized) return;
        
        // 게임 시작 시 저장된 상태 로드
        this.load();
        
        // 자원 생성 시작
        this.startResourceGeneration();
        
        // 자동 저장 시작
        this.startAutoSave();
        
        this.isInitialized = true;
    }
}

// 싱글톤 인스턴스 생성 및 내보내기
export default GameEngine.getInstance();