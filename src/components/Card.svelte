<script lang="ts">
	import { type Snippet } from 'svelte';
	import type { Requirement } from '../types/types';
	import type { Writable } from 'svelte/store';

	interface IProps {
		requirements?: Requirement[];
		vaildator: Writable<boolean>;
		children?: Snippet<[]>;
		[key: string]: unknown;
	}

	let { children, requirements, vaildator }: IProps = $props();
</script>

<article class="bg-neon-purple flex h-40 w-40 shadow-lg">
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
