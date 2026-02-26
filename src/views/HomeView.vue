<script setup>
import { ref } from 'vue'
import FormularioSalud from '../components/FormularioSalud.vue'
import ChatbotSalud from '../components/ChatbotSalud.vue'

const datosSalud = ref(null)

function guardarDatos(payload) {
  datosSalud.value = payload
}
</script>

<template>
  <section class="home-layout">
    <FormularioSalud @guardar-datos="guardarDatos" />
    <ChatbotSalud :contexto-salud="datosSalud || {}" />

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
  </section>
</template>

<style scoped src="../styles/HomeView.css"></style>
