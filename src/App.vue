<script setup>
const logoUrl ='../src/assets/Salud-preventiva.png'
</script>

<template>
  <div class="app-shell">
    <header class="topbar">
      <div class="brand">
        <img :src="logoUrl" alt="Logo RevoTechIA Salud Preventiva" class="brand-logo" />
        <div>
          <h1>Salud Preventiva</h1>
          <p>Formulario de salud & chatbot</p>
        </div>
      </div>

      <nav class="main-nav">
        <RouterLink to="/">Inicio</RouterLink>
        <RouterLink to="/chatbot">Chatbot</RouterLink>
      </nav>
    </header>

    <main>
      <RouterView />
    </main>
  </div>
</template>

<style src="./styles/App.css"></style>
