<script lang="ts">
  import { Tooltip } from "flowbite-svelte";
  import { QuestionCircleOutline } from "flowbite-svelte-icons";
  import FullscreenToggle from "./FullscreenToggle.svelte";
  import { isAudioMuted, showInfoModal, isPortrait } from "../stores";
  import Portal from "svelte-portal";

  function handleOpenInfo() {
    $showInfoModal = true;
  }

  function toggleIsAudioMuted() {
    $isAudioMuted = !$isAudioMuted;
  }
</script>

<Portal target="main">
  <div class="fixed top-0 left-0 right-0 flex justify-center z-20">
    <div class="w-full">
      <div class="flex justify-end p-6 gap-4 sm:gap-6 items-center">
        <Tooltip type="dark" class="text-gray-200 z-50"
          >Viewers watching</Tooltip
        >
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <span
          class="text-red-500 hover:cursor-pointer"
          on:click={handleOpenInfo}
          role="presentation"
        >
          <QuestionCircleOutline
            color="rgb(156 163 175 / var(--tw-text-opacity))"
            slot="icon"
            class="w-5 h-5 sm:w-6 sm:h-6"
          />
        </span>
        <FullscreenToggle />
        <!-- svelte-ignore a11y-no-static-element-interactions a11y-click-events-have-key-events -->
        <span
          class="hover:cursor-pointer"
          on:click={() => toggleIsAudioMuted()}
        >
          {#if $isAudioMuted}
            <img src="/speaker-x-mark.svg" class="w-5 sm:w-6" alt="mute" />
          {:else}
            <img src="/speaker.svg" class="w-5 sm:w-6" alt="exit fullscreen" />
          {/if}
        </span>
        {#if $isPortrait}
          <img
            src="/exclamation-triangle.svg"
            class="w-5 sm:w-6"
            alt="portrait warning"
          />
          <Tooltip type="dark" class="text-gray-200 z-50">
            Rotate to landscape or increase screen width for best viewing
            experience
          </Tooltip>
        {/if}
      </div>
    </div>
  </div>
</Portal>
