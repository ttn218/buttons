<script lang="ts">
	import { onMount } from 'svelte';
	import Card from '../components/Card.svelte';
	import { runtimeObjectsStore } from '../store/runtimeObjects';

	onMount(() => {
		// 모든 버튼의 validator 업데이트

		$runtimeObjectsStore.forEach(obj => {
			if (obj.validator) {
				obj.validator.update(v => v);
			}
		});
	});
</script>

<main class="flex gap-2 text-sm">
	{#each $runtimeObjectsStore as { component, validator, props, requirements }}
		<Card vaildator={validator} {requirements}>
			<svelte:component this={component} {...props} />
		</Card>
	{/each}
</main>
