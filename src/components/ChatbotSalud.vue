<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  contextoSalud: {
    type: Object,
    default: () => ({}),
  },
})

const mensajeInicial = {
  rol: 'bot',
  texto:
    'Hola, soy tu asistente de salud preventiva. Puedes preguntarme por alimentación, sueño, actividad física o hábitos diarios.',
}

const mensajes = ref([{ ...mensajeInicial }])
const pregunta = ref('')

function generarRespuestaPorContexto(contexto) {
  const recomendaciones = []

  if (contexto.horasSueno < 7) {
    recomendaciones.push('intenta subir tu descanso a 7-9 horas por noche')
  }

  if (contexto.vasosAgua < 6) {
    recomendaciones.push('aumenta tu hidratación diaria a 6-8 vasos de agua')
  }

  if (contexto.actividadFisica === 'baja') {
    recomendaciones.push('empieza con 20-30 minutos de caminata, 5 días por semana')
  }

  if (contexto.fuma === 'si') {
    recomendaciones.push('reducir el tabaco será una prioridad para tu salud cardiovascular')
  }

  if (!recomendaciones.length) {
    recomendaciones.push('vas muy bien con tus hábitos actuales, mantén constancia y seguimiento semanal')
  }

  const objetivoTexto = contexto.objetivo
    ? ` Objetivo registrado: ${contexto.objetivo}.`
    : ''

  return `Gracias por guardar tus datos${contexto.nombre ? `, ${contexto.nombre}` : ''}. Con tu perfil, te recomiendo: ${recomendaciones.join(', ')}.${objetivoTexto}`
}

function generarRespuesta(texto) {
  const consulta = texto.toLowerCase()

  if (consulta.includes('sueño') || consulta.includes('dorm')) {
    return 'Intenta mantener 7 a 9 horas de sueño y una rutina fija para acostarte. Evita pantallas 1 hora antes de dormir.'
  }

  if (consulta.includes('agua') || consulta.includes('hidrata')) {
    return 'Una meta práctica es tomar entre 6 y 8 vasos de agua al día, ajustando según tu actividad física y clima.'
  }

  if (consulta.includes('ejercicio') || consulta.includes('actividad')) {
    return 'Para prevención, apunta a 150 minutos semanales de actividad moderada (caminar rápido, bicicleta, baile).'
  }

  if (consulta.includes('fumo') || consulta.includes('tabaco') || consulta.includes('cigarro')) {
    return 'Reducir y dejar el tabaco tiene impacto inmediato en salud cardiovascular y respiratoria. Si quieres, te doy un plan de inicio en 3 pasos.'
  }

  return 'Puedo ayudarte con hábitos preventivos diarios. Prueba preguntar: ¿cómo mejorar mi sueño?, ¿qué comer mejor?, ¿cómo iniciar ejercicio?'
}

function enviarMensaje() {
  const texto = pregunta.value.trim()
  if (!texto) {
    return
  }

  mensajes.value.push({ rol: 'user', texto })

  const respuesta = generarRespuesta(texto)
  mensajes.value.push({
    rol: 'bot',
    texto:
      Object.keys(props.contextoSalud).length > 0
        ? `${respuesta} Con tus datos, prioriza: ${props.contextoSalud.objetivo || 'mantener hábitos sostenibles'}.`
        : respuesta,
  })

  pregunta.value = ''
}

function reiniciarChat() {
  mensajes.value = [{ ...mensajeInicial }]
  pregunta.value = ''
}

watch(
  () => props.contextoSalud,
  (nuevoContexto) => {
    if (!nuevoContexto || Object.keys(nuevoContexto).length === 0) {
      return
    }

    mensajes.value.push({
      rol: 'bot',
      texto: generarRespuestaPorContexto(nuevoContexto),
    })
  },
)
</script>

<template>
  <section class="card chatbot-card">
    <h2>Chatbot de Salud</h2>
    <div class="chat-box">
      <article v-for="(mensaje, index) in mensajes" :key="index" :class="['bubble', mensaje.rol]">
        {{ mensaje.texto }}
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
