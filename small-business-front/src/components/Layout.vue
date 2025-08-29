<template>
  <div class="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
    <!-- Navbar -->
    <header class="p-4 flex justify-between items-center shadow-md">
      <h1 class="text-2xl font-bold">CRM Pequeño Negocio</h1>
      <button
        @click="toggleDark"
        class="px-3 py-1 rounded-lg bg-gray-200 dark:bg-gray-700"
      >
        {{ isDark ? '☀️' : '🌙' }}
      </button>
    </header>

    <!-- Main slot -->
    <main class="flex-1 flex flex-col items-center justify-center p-6">
      <slot />
    </main>

    <!-- Footer -->
    <Footer />
  </div>
</template>

<script setup>
import { ref } from "vue";
import Footer from "./Footer.vue";

const isDark = ref(false);
function toggleDark() {
  isDark.value = !isDark.value;
  document.documentElement.classList.toggle("dark", isDark.value);
}
</script>