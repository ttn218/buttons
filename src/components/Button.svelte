<script lang="ts">
	let { text, clickHandler } = $props();
</script>

<button class="rounded-md bg-neon-pink px-4 py-1.5 text-black" onclick={clickHandler}>
	{text}
</button>
