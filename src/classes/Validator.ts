// 벨리데이터 클래스
// 벨리데이트 함수 저장
// 벨리데이트 함수 실행 및 결과 store update
// 벨리데이트 결과 subscript 객체 get
// 벨리데이트 타입 ( 이름 , 함수, store 객체 )

import { writable, type Writable } from "svelte/store";
import type { Validate, ValidateFun } from "../types/types";


class Validator {
	validates: Validate[] = [];

	constructor() {}

    setValidate(fun: ValidateFun, name: string) {
        this.validates.push({
            name,
            fun,
            result: writable(false)
        })
    }

    getResult(name: string) {
        const target = this.validates.find((v) => v.name === name);

        return target?.result
    }

    makeValiDate(fun: ValidateFun, name: string): Writable<boolean> | undefined {
        this.setValidate(fun, name);

        return this.getResult(name);
    } 
    
    emit() {
        this.validates.forEach((v) => {
            v.result.update(() => v.fun())
        })
    }
}

const validator = new Validator()

export default validator