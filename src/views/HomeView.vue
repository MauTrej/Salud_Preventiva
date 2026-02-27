<script setup>
import { ref } from 'vue'
import FormularioSalud from '../components/FormularioSalud.vue'
import ChatbotSalud from '../components/ChatbotSalud.vue'
import { useRecomendaciones } from '../composables/useRecomendaciones'

const datosSalud = ref(null)
const recomendacionBackend = ref('')
const { cargandoRecomendacion, errorBackend, detallesErrorBackend, generarRecomendaciones } =
  useRecomendaciones()

async function guardarDatos(payload) {
  recomendacionBackend.value = ''

  const resultado = await generarRecomendaciones(payload)
  datosSalud.value = resultado.usuarioSalud
  recomendacionBackend.value = resultado.recomendaciones
}
</script>

<template>
  <section class="home-layout">
    <FormularioSalud @guardar-datos="guardarDatos" />

    <section class="chat-column">
      <article v-if="datosSalud" class="resumen card">
        <h3>Resumen rápido</h3>
        <ul>
          <li><strong>Paciente:</strong> {{ datosSalud.nombre }}</li>
          <li><strong>Edad:</strong> {{ datosSalud.edad }} años</li>
          <li><strong>Actividad:</strong> {{ datosSalud.actividadFisica }}</li>
          <li><strong>Sueño:</strong> {{ datosSalud.horasSueno }} horas</li>
          <li><strong>Agua:</strong> {{ datosSalud.vasosAgua }} vasos</li>
        </ul>
      </article>

      <ChatbotSalud
        :contexto-salud="datosSalud || {}"
        :recomendacion-backend="recomendacionBackend"
        :cargando-backend="cargandoRecomendacion"
        :error-backend="errorBackend"
        :detalles-error-backend="detallesErrorBackend"
      />
    </section>
  </section>
</template>

<style scoped src="../styles/HomeView.css"></style>
