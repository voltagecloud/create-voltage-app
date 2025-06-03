import { writable } from "svelte/store";

export const hasInteracted = writable(false);
export const isFullScreen = writable(false);
export const showInfoModal = writable(false);
export const isAudioMuted = writable(false);
export const isPortrait = writable(false);
export const blockHeight = writable(0);
