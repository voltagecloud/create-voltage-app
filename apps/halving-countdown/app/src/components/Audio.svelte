<script lang="ts">
  import { onDestroy } from "svelte";
  import { isAudioMuted } from "../stores";

  export let src: string;

  let audio: HTMLAudioElement | undefined;

  $: handleMute($isAudioMuted);
  $: initAudio(src);

  function handleMute(isMuted: boolean) {
    if (audio) {
      audio.muted = isMuted;
    }
  }

  function initAudio(s: string) {
    cleanup();
    audio = new Audio(s);
    audio.loop = true;
    audio.muted = $isAudioMuted;
    audio.play();
  }

  function cleanup() {
    audio?.pause();
    audio = undefined;
  }

  onDestroy(cleanup);
</script>

{#if audio && !audio.paused}
  <slot />
{/if}
