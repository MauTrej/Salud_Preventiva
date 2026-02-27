import { ref } from 'vue'

const API_CHAT_URL =
  import.meta.env.VITE_API_CHAT_URL || 'http://localhost:4000/api/recomendaciones/chat'

function construirPayloadPregunta(contextoSalud, pregunta) {
  return {
    nombre: String(contextoSalud?.nombre ?? '').trim(),
    edad: Number(contextoSalud?.edad),
    actividadFisica: String(contextoSalud?.actividadFisica ?? '').trim(),
    horasSueno: Number(contextoSalud?.horasSueno),
    vasosAgua: Number(contextoSalud?.vasosAgua),
    fuma: String(contextoSalud?.fuma ?? '').trim(),
    objetivo: String(contextoSalud?.objetivo ?? '').trim(),
    pregunta: String(pregunta ?? '').trim(),
  }
}

function normalizarDetallesError(detalles) {
  if (!Array.isArray(detalles)) {
    return []
  }

  return detalles
    .flatMap((item) => {
      if (Array.isArray(item)) {
        return item
      }

      if (typeof item === 'string') {
        return [item]
      }

      return []
    })
    .map((mensaje) => String(mensaje).trim())
    .filter(Boolean)
}

export function useChatPreguntas() {
  const cargandoPregunta = ref(false)
  const errorPregunta = ref('')
  const detallesErrorPregunta = ref([])

  async function responderPregunta(contextoSalud, pregunta) {
    const payload = construirPayloadPregunta(contextoSalud, pregunta)

    cargandoPregunta.value = true
    errorPregunta.value = ''
    detallesErrorPregunta.value = []

    try {
      const respuesta = await fetch(API_CHAT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const textoRespuesta = await respuesta.text()
      const data = (() => {
        if (!textoRespuesta) {
          return {}
        }

        try {
          return JSON.parse(textoRespuesta)
        } catch {
          return { error: textoRespuesta }
        }
      })()

      if (!respuesta.ok) {
        errorPregunta.value = data?.error || `La API respondió con estado ${respuesta.status}`
        detallesErrorPregunta.value = normalizarDetallesError(data?.detalles)

        return {
          ok: false,
          respuesta: '',
          error: errorPregunta.value,
          detalles: detallesErrorPregunta.value,
        }
      }

      return {
        ok: true,
        respuesta: typeof data?.respuesta === 'string' ? data.respuesta : '',
        error: '',
        detalles: [],
      }
    } catch (error) {
      errorPregunta.value = 'No se pudo responder tu pregunta desde el backend.'
      console.error('Error al responder pregunta de chat:', error)

      return {
        ok: false,
        respuesta: '',
        error: errorPregunta.value,
        detalles: [],
      }
    } finally {
      cargandoPregunta.value = false
    }
  }

  return {
    cargandoPregunta,
    errorPregunta,
    detallesErrorPregunta,
    responderPregunta,
  }
}
