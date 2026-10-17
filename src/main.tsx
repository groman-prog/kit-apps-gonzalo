import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { RouterProvider } from "@tanstack/react-router"
import { router } from "@/app/router"
import "./index.css"

const tema = localStorage.getItem("kit-tema")
if (tema === "oliva" || tema === "petroleo") {
  document.documentElement.dataset.tema = tema
}

const raiz = document.getElementById("root")
if (!raiz) throw new Error("No se ha encontrado el nodo raíz.")

createRoot(raiz).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
