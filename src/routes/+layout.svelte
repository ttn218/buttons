<script lang="ts">
	import { createGridRuntimeObject } from '$lib/Gamelib';
	import { buttons } from '../data/buttons';
	import gameEngine from '$lib/GameEngine';
	import '../app.css';
	import { onMount } from 'svelte';
	import { runtimeObjectsStore } from '../store/runtimeObjects';
	let { children } = $props();

	let redResource: any;
	let redValue: any;
	let autoGenRate: any;
	let clickMult: any;
	let redValueText = $state('0');
	let autoGenRateText = $state('0');
	let clickMultText = $state('1');

	onMount(() => {
		// 게임 엔진 초기화
		gameEngine.init();
		
		// 리소스 가져오기
		redResource = gameEngine.getResource('red');
		redValue = redResource?.getValueStore();
		autoGenRate = redResource?.getAutoGenerateRateStore();
		clickMult = redResource?.getClickMultiplierStore();
		
		// 스토어 구독 설정
		if (redValue) {
			redValue.subscribe((value: any) => {
				redValueText = value?.toString() || '0';
			});
		}
		
		if (autoGenRate) {
			autoGenRate.subscribe((value: any) => {
				autoGenRateText = value?.toString() || '0';
			});
		}
		
		if (clickMult) {
			clickMult.subscribe((value: any) => {
				clickMultText = value?.toString() || '1';
			});
		}
		
		// 런타임 오브젝트 생성
		const runtimeObjects = createGridRuntimeObject(buttons);
		runtimeObjectsStore.set(runtimeObjects);
		
		// 모든 버튼의 validator 업데이트
		runtimeObjects.forEach(obj => {
			if (obj.validator) {
				obj.validator.update(v => v);
			}
		});
	});
</script>

<div class="flex h-full justify-between gap-4">
	<div class="w-full">
		<div class="mb-2 h-14 border border-solid border-light-gray"></div>
		{@render children()}
	</div>
	<div class="h-full w-40 border border-solid border-light-gray p-2">
		<div class="flex flex-col gap-2">
			<p class="flex justify-between text-red-400">
				<span>Red:</span>
				<span>{redValueText}</span>
			</p>
			<p class="flex justify-between text-red-400">
				<span>자동 생성:</span>
				<span>{autoGenRateText}/초</span>
			</p>
			<p class="flex justify-between text-red-400">
				<span>클릭 배수:</span>
				<span>x{clickMultText}</span>
			</p>
		</div>
	</div>
</div>
