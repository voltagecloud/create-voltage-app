export async function toggleFullscreen(isFullScreen: boolean) {
  if (!document) return;
  if (isFullScreen) {
    await document.exitFullscreen();
  } else {
    await document.documentElement.requestFullscreen();
  }
}
