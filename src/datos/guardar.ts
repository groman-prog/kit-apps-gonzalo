export function esperar(ms: number) {
  return new Promise((resolver) => {
    window.setTimeout(resolver, ms)
  })
}

export async function guardarSimulado() {
  await esperar(300)
  if (new URLSearchParams(window.location.search).get("fallo") === "1") {
    throw new Error("fallo")
  }
}
