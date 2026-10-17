export const esMac = () =>
  /mac|iphone|ipad/i.test((navigator as any).userAgentData?.platform ?? navigator.platform ?? "");

// Etiquetas para mostrar: teclaMod() → "Ctrl" en Windows, "⌘" en Mac
export const teclaMod = () => (esMac() ? "⌘" : "Ctrl");
export const teclaAlt = () => (esMac() ? "⌥" : "Alt");
export const teclaMayus = () => (esMac() ? "⇧" : "Mayús");
export const teclaIntro = () => (esMac() ? "↵" : "Intro");

// Para escuchar: Ctrl en Windows, ⌘ en Mac
export const conMod = (e: KeyboardEvent) => (esMac() ? e.metaKey : e.ctrlKey);

// Las teclas sueltas no actúan mientras se escribe
export const escribiendo = (e: KeyboardEvent) =>
  e.target instanceof HTMLElement && !!e.target.closest("input, textarea, select, [contenteditable='true']");
