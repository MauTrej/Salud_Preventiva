<script setup>
import { ref, watch } from 'vue'
import { useChatPreguntas } from '../composables/useChatPreguntas'

const props = defineProps({
  contextoSalud: {
    type: Object,
    default: () => ({}),
  },
  recomendacionBackend: {
    type: String,
    default: '',
  },
  cargandoBackend: {
    type: Boolean,
    default: false,
  },
  errorBackend: {
    type: String,
    default: '',
  },
  detallesErrorBackend: {
    type: Array,
    default: () => [],
  },
})

const mensajeInicial = {
  rol: 'bot',
  texto:
    'Hola, soy tu asistente de salud preventiva. Puedes preguntarme por alimentación, sueño, actividad física o hábitos diarios.',
}

const mensajes = ref([{ ...mensajeInicial }])
const pregunta = ref('')
const planPersonalizado = ref('')
const cargandoMostrado = ref(false)
const ultimoErrorMostrado = ref('')
const { responderPregunta } = useChatPreguntas()

function limpiarMarcadoresMarkdown(texto) {
  return texto
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/^[\t ]*[*-][\t ]+/gm, '• ')
    .replace(/\r/g, '')
    .trim()
}

function parsearBloquesMensaje(texto) {
  const limpio = limpiarMarcadoresMarkdown(texto)
  if (!limpio) {
    return []
  }

  return limpio
    .split(/\n{2,}/)
    .map((bloque) => bloque.trim())
    .filter(Boolean)
    .map((bloque) => {
      const lineas = bloque
        .split('\n')
        .map((linea) => linea.trim())
        .filter(Boolean)

      const lineasConVinetas = lineas.filter((linea) => linea.startsWith('• '))
      if (lineas.length > 0 && lineasConVinetas.length === lineas.length) {
        return {
          tipo: 'lista',
          items: lineas.map((linea) => linea.replace(/^•\s+/, '').trim()),
        }
      }

      return {
        tipo: 'parrafo',
        texto: lineas.join(' '),
      }
    })
}

async function enviarMensaje() {
  const texto = pregunta.value.trim()
  if (!texto) {
    return
  }

  mensajes.value.push({ rol: 'user', texto })
  pregunta.value = ''

  if (!props.contextoSalud || Object.keys(props.contextoSalud).length === 0) {
    mensajes.value.push({
      rol: 'bot',
      texto:
        'Primero guarda tus datos en el formulario para que pueda responder usando tu contexto de salud personalizado.',
    })
    return
  }

  const indiceCarga =
    mensajes.value.push({
      rol: 'bot',
      texto: 'Pensando tu respuesta personalizada...',
    }) - 1

  const resultado = await responderPregunta(props.contextoSalud, texto)

  if (!resultado.ok) {
    const detallesTexto = resultado.detalles.length ? ` Detalles: ${resultado.detalles.join(' | ')}` : ''
    mensajes.value[indiceCarga] = {
      rol: 'bot',
      texto: `No pude responder desde el backend: ${resultado.error}.${detallesTexto}`,
    }
    return
  }

  mensajes.value[indiceCarga] = {
    rol: 'bot',
    texto: resultado.respuesta || 'No llegó texto de respuesta desde el backend.',
  }
}

function reiniciarChat() {
  mensajes.value = [{ ...mensajeInicial }]
  pregunta.value = ''
  planPersonalizado.value = ''
}

watch(
  () => props.recomendacionBackend,
  (nuevaRecomendacion) => {
    if (!nuevaRecomendacion) {
      return
    }

    planPersonalizado.value = nuevaRecomendacion

    mensajes.value.push({
      rol: 'bot',
      texto: `Ya analicé tus datos. Este será tu plan base para el chat: ${nuevaRecomendacion}`,
    })
  },
)

watch(
  () => props.cargandoBackend,
  (cargando) => {
    if (cargando && !cargandoMostrado.value) {
      mensajes.value.push({
        rol: 'bot',
        texto: 'Estoy analizando tus datos con IA para generar tu recomendación personalizada...',
      })
      cargandoMostrado.value = true
      return
    }

    if (!cargando) {
      cargandoMostrado.value = false
    }
  },
)

watch(
  () => [props.errorBackend, props.detallesErrorBackend],
  ([nuevoError, nuevosDetalles]) => {
    if (!nuevoError || nuevoError === ultimoErrorMostrado.value) {
      return
    }

    const detallesTexto = Array.isArray(nuevosDetalles) && nuevosDetalles.length
      ? ` Detalles: ${nuevosDetalles.join(' | ')}`
      : ''

    mensajes.value.push({
      rol: 'bot',
      texto: `No pude obtener la recomendación desde el backend: ${nuevoError}.${detallesTexto}`,
    })

    ultimoErrorMostrado.value = nuevoError
  },
  { deep: true },
)
</script>

<template>
  <section class="card chatbot-card">
    <h2>Chatbot de Salud</h2>
    <div class="chat-box">
      <article v-for="(mensaje, index) in mensajes" :key="index" :class="['bubble', mensaje.rol]">
        <div class="bubble-content">
          <template v-for="(bloque, blockIndex) in parsearBloquesMensaje(mensaje.texto)" :key="blockIndex">
            <p v-if="bloque.tipo === 'parrafo'">{{ bloque.texto }}</p>
            <ul v-else>
              <li v-for="(item, itemIndex) in bloque.items" :key="itemIndex">{{ item }}</li>
            </ul>
          </template>
        </div>
      </article>
    </div>

    <form @submit.prevent="enviarMensaje" class="chat-form">
      <input v-model="pregunta" type="text" placeholder="Escribe tu pregunta de salud preventiva..." />
      <button type="submit" class="send-btn">Enviar</button>
      <button type="button" class="reset-btn" @click="reiniciarChat">Reiniciar chat</button>
    </form>
  </section>
</template>

<style scoped src="../styles/ChatbotSalud.css"></style>
