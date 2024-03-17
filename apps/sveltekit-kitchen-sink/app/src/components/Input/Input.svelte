<script lang="ts">
	export let id = '';
	export let value: string | number | undefined = '';
	export let label = '';
	export let placeholder = '';
</script>

<label for={id}>{label}</label>
<input
	class="rounded-lg border-none p-3 text-gray-700 outline-gray-300"
	type="text"
	{id}
	{placeholder}
	bind:value
/>
