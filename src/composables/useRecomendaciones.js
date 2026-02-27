import { ref } from 'vue'

const API_RECOMENDACIONES_URL =
  import.meta.env.VITE_API_RECOMENDACIONES_URL || 'http://localhost:4000/api/recomendaciones'

function construirUsuarioSalud(payload) {
  return {
    nombre: String(payload?.nombre ?? '').trim(),
    edad: Number(payload?.edad),
    actividadFisica: String(payload?.actividadFisica ?? '').trim(),
    horasSueno: Number(payload?.horasSueno),
    vasosAgua: Number(payload?.vasosAgua),
    fuma: String(payload?.fuma ?? '').trim(),
    objetivo: String(payload?.objetivo ?? '').trim(),
  }
}

function validarUsuarioSalud(usuarioSalud) {
  const errores = []

  if (!usuarioSalud.nombre) {
    errores.push('El nombre es obligatorio.')
  }

  if (!Number.isFinite(usuarioSalud.edad) || usuarioSalud.edad < 1 || usuarioSalud.edad > 120) {
    errores.push('La edad debe estar entre 1 y 120.')
  }

  if (
    !Number.isFinite(usuarioSalud.horasSueno) ||
    usuarioSalud.horasSueno < 3 ||
    usuarioSalud.horasSueno > 12
  ) {
    errores.push('Las horas de sueño deben estar entre 3 y 12.')
  }

  if (!Number.isFinite(usuarioSalud.vasosAgua) || usuarioSalud.vasosAgua < 1 || usuarioSalud.vasosAgua > 20) {
    errores.push('Los vasos de agua deben estar entre 1 y 20.')
  }

  if (!usuarioSalud.actividadFisica) {
    errores.push('La actividad física es obligatoria.')
  }

  if (!usuarioSalud.fuma) {
    errores.push('El campo fuma es obligatorio.')
  }

  if (!usuarioSalud.objetivo) {
    errores.push('El objetivo principal es obligatorio.')
  }

  return errores
}

function normalizarRecomendaciones(recomendaciones) {
  if (typeof recomendaciones === 'string') {
    return recomendaciones
  }

  if (Array.isArray(recomendaciones)) {
    return recomendaciones.join(', ')
  }

  return ''
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

export function useRecomendaciones() {
  const cargandoRecomendacion = ref(false)
  const errorBackend = ref('')
  const detallesErrorBackend = ref([])

  async function generarRecomendaciones(payload) {
    const usuarioSalud = construirUsuarioSalud(payload)

    cargandoRecomendacion.value = true
    errorBackend.value = ''
    detallesErrorBackend.value = []

    const erroresValidacion = validarUsuarioSalud(usuarioSalud)
    if (erroresValidacion.length > 0) {
      errorBackend.value = 'Datos inválidos en frontend'
      detallesErrorBackend.value = erroresValidacion
      cargandoRecomendacion.value = false

      return {
        ok: false,
        usuarioSalud,
        recomendaciones: '',
      }
    }

    try {
      const respuesta = await fetch(API_RECOMENDACIONES_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(usuarioSalud),
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
        errorBackend.value = data?.error || `La API respondió con estado ${respuesta.status}`
        detallesErrorBackend.value = normalizarDetallesError(data?.detalles)

        return {
          ok: false,
          usuarioSalud,
          recomendaciones: '',
        }
      }

      return {
        ok: true,
        usuarioSalud,
        recomendaciones: normalizarRecomendaciones(data?.recomendaciones),
      }
    } catch (error) {
      errorBackend.value =
        'No se pudo obtener una recomendación. Por favor, inténtalo de nuevo más tarde.'
      console.error('Error al consultar recomendaciones:', error)

      return {
        ok: false,
        usuarioSalud,
        recomendaciones: '',
      }
    } finally {
      cargandoRecomendacion.value = false
    }
  }

  return {
    cargandoRecomendacion,
    errorBackend,
    detallesErrorBackend,
    generarRecomendaciones,
  }
}
