# Salud Preventiva (Frontend)

Proyecto frontend en Vue 3 + Vite para:

- Formulario de salud preventiva.
- Chatbot de recomendaciones (interfaz frontend, sin backend en este repo).

## Estructura principal

```text
src/
  components/
    FormularioSalud.vue
    ChatbotSalud.vue
  views/
    HomeView.vue
    ChatbotView.vue
  router/
    index.js
  App.vue
  main.js
```

## Instalación

```bash
npm install
```

## Desarrollo

```bash
npm run dev
```

## Variables de entorno

Configura en `.env` la URL del backend para recomendaciones:

```dotenv
VITE_API_RECOMENDACIONES_URL=http://localhost:4000/api/recomendaciones
VITE_API_CHAT_URL=http://localhost:4000/api/recomendaciones/chat
```

## Build de producción

```bash
npm run build
```

## Nota

Este repositorio contiene solo el frontend.
El backend (API con recomendaciones/IA) se implementará en un proyecto aparte.
