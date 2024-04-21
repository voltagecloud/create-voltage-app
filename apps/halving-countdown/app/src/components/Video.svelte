<script lang="ts">
  import { onDestroy } from "svelte";
  import { hasInteracted, isAudioMuted } from "../stores";

  export let src: string;
  export let muted: boolean = false;
  export let loop: boolean = false;
  export let dark: boolean = false;
  export let darker: boolean = false;
  export let darkest: boolean = false;
  export let playbackRate: number = 1;
  export let onEnd = () => {};
  export let onPlay = () => {};

  export let unmutable = false;

  let ref: HTMLVideoElement;
  const urlParams = new URLSearchParams(window.location.search);
  const isDebug = urlParams.has("debug");

  $: isMuted = unmutable ? false : muted || $isAudioMuted;

  onDestroy(() => {
    if (ref) {
      ref.pause();
      ref.remove();
    }
  });

  function play() {
    if (ref) {
      ref.play();
    }
  }

  function handleKeydown(event: KeyboardEvent) {
    if (isDebug) {
      if (event.key === "h") {
        const ct = ref.currentTime;
        ref.currentTime = ct + 10;
      }
      if (event.key === "g") {
        const ct = ref.currentTime;
        ref.currentTime = ct - 10;
      }
    }
  }
</script>

<svelte:window on:keydown={handleKeydown} />

{#if $hasInteracted}
  <!-- svelte-ignore a11y-media-has-caption-->
  <video
    bind:this={ref}
    muted={isMuted}
    on:ended={onEnd}
    on:play={onPlay}
    on:pause={play}
    class="absolute inset-0 w-full h-full object-cover"
    autoplay
    bind:playbackRate
    {src}
    {loop}
    playsinline
  />
  {#if dark || darker || darkest}
    <div class="overlay" class:darker class:darkest />
  {/if}
{/if}

<style lang="postcss">
  .overlay {
    @apply absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7); /* Semi-transparent black */
  }

  .overlay.darker {
    background-color: rgba(
      0,
      0,
      0,
      0.8
    ) !important; /* Semi-transparent black */
  }

  .overlay.darkest {
    background-color: rgba(
      0,
      0,
      0,
      0.9
    ) !important; /* Semi-transparent black */
  }
</style>
