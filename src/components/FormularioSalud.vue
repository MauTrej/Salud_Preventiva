<script setup>
import { reactive } from 'vue'

const emit = defineEmits(['guardar-datos'])

const form = reactive({
  nombre: '',
  edad: '',
  actividadFisica: 'media',
  horasSueno: 7,
  vasosAgua: 6,
  fuma: 'no',
  objetivo: '',
})

function enviarFormulario() {
  emit('guardar-datos', {
    ...form,
    edad: Number(form.edad),
    horasSueno: Number(form.horasSueno),
    vasosAgua: Number(form.vasosAgua),
  })
}
</script>

<template>
  <section class="card">
    <h2>Formulario de Salud</h2>
    <p>Completa tus hábitos para personalizar recomendaciones preventivas.</p>

    <form @submit.prevent="enviarFormulario" class="grid-form">
      <label>
        Nombre
        <input v-model="form.nombre" type="text" required />
      </label>

      <label>
        Edad
        <input v-model="form.edad" type="number" min="1" max="120" required />
      </label>

      <label>
        Actividad física
        <select v-model="form.actividadFisica">
          <option value="baja">Baja</option>
          <option value="media">Media</option>
          <option value="alta">Alta</option>
        </select>
      </label>

      <label>
        Horas de sueño
        <input v-model="form.horasSueno" type="number" min="3" max="12" required />
      </label>

      <label>
        Vasos de agua por día
        <input v-model="form.vasosAgua" type="number" min="1" max="20" required />
      </label>

      <label>
        ¿Fumas?
        <select v-model="form.fuma">
          <option value="no">No</option>
          <option value="si">Sí</option>
        </select>
      </label>

      <label class="full-width">
        Objetivo principal
        <textarea
          v-model="form.objetivo"
          rows="3"
          placeholder="Ej: mejorar energía, dormir mejor, prevenir hipertensión..."
          required
        />
      </label>

      <button type="submit" class="btn-primary">Guardar datos</button>
    </form>
  </section>
</template>

<style scoped src="../styles/FormularioSalud.css"></style>
