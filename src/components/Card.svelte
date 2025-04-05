<script lang="ts">
	import { type Snippet } from 'svelte';
	import type { Requirement } from '../types/types';
	import { CardType } from '../types/types';
	import type { Writable } from 'svelte/store';

	interface IProps {
		requirements?: Requirement[];
		vaildator: Writable<boolean>;
		children?: Snippet<[]>;
		cardType?: CardType;
		[key: string]: unknown;
	}

	let { children, requirements, vaildator, cardType = CardType.RESOURCE }: IProps = $props();
	
	// 카드 타입에 따른 스타일 클래스
	let cardClass = $derived(getCardClass(cardType));
	
	function getCardClass(type: CardType): string {
		switch (type) {
			case CardType.RESOURCE:
				return 'bg-neon-purple';
			case CardType.EVENT:
				return 'bg-neon-blue';
			case CardType.UPGRADE:
				return 'bg-neon-green';
			case CardType.PROGRESSION:
				return 'bg-neon-yellow';
			default:
				return 'bg-neon-purple';
		}
	}
</script>

<article class="{cardClass} flex h-40 w-40 shadow-lg">
	<article class="flex items-center justify-center px-3 text-black w-full" class:hidden={$vaildator}>
		{#if requirements}
			<ul>
				{#each requirements as requirement}
					<li class="text-white">{requirement.resources} : {requirement.value}</li>
				{/each}
			</ul>
		{/if}
	</article>
	<article class="flex items-center justify-center w-full" class:hidden={!$vaildator}>
		{#if children}
			{@render children()}
		{/if}
	</article>
</article>
