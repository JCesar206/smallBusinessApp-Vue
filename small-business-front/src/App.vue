<template>
  <Layout>
    <!-- Formulario -->
    <form
      @submit.prevent="handleSubmit"
      class="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6 w-full max-w-md space-y-4"
    >
      <h2 class="text-xl font-semibold text-center">Agregar Contacto y Compra</h2>

      <input
        ref="nameInput"
        v-model="form.name"
        type="text"
        placeholder="Nombre"
        class="w-full p-2 rounded-lg border dark:border-gray-600 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        v-model="form.email"
        type="email"
        placeholder="Email"
        class="w-full p-2 rounded-lg border dark:border-gray-600 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        v-model="form.phone"
        type="text"
        placeholder="Teléfono"
        class="w-full p-2 rounded-lg border dark:border-gray-600 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        v-model="form.producto"
        type="text"
        placeholder="Producto"
        class="w-full p-2 rounded-lg border dark:border-gray-600 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        v-model.number="form.costo"
        type="number"
        placeholder="Costo Unitario"
        class="w-full p-2 rounded-lg border dark:border-gray-600 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        v-model.number="form.cantidad"
        type="number"
        placeholder="Cantidad"
        class="w-full p-2 rounded-lg border dark:border-gray-600 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <div class="flex gap-2 justify-center">
        <button
          type="submit"
          class="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
        >
          Guardar
        </button>
        <button
          type="button"
          @click="clearForm"
          class="px-4 py-2 rounded-lg bg-gray-400 text-white hover:bg-gray-500"
        >
          Limpiar
        </button>
      </div>
    </form>

    <!-- Ingresos -->
    <div class="mt-6 p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-lg text-center">
      <h2 class="text-lg font-semibold">Ingresos Totales</h2>
      <p class="text-2xl font-bold text-green-600 dark:text-green-400">
        ${{ income }}
      </p>
    </div>
  </Layout>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Layout from "./components/Layout.vue";

const API_URL = "http://localhost:3000"; // backend

// Form
const nameInput = ref(null);
const form = ref({
  name: "",
  email: "",
  phone: "",
  producto: "",
  costo: null,
  cantidad: null,
});

const income = ref(0);

// Cargar ingresos
async function fetchIncome() {
  try {
    const res = await fetch(`${API_URL}/income`);
    const data = await res.json();
    income.value = data.total_income;
  } catch (e) {
    console.error("Error fetching income:", e);
  }
}

async function handleSubmit() {
  try {
    // importe = costo * cantidad
    const importe = (form.value.costo || 0) * (form.value.cantidad || 0);

    // Crear contacto
    const resContact = await fetch(`${API_URL}/contacts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.value.name,
        email: form.value.email,
        phone: form.value.phone,
      }),
    });
    const contact = await resContact.json();

    // Crear venta
    await fetch(`${API_URL}/sales`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contact_id: contact.id,
        producto: form.value.producto,
        cantidad: form.value.cantidad,
        importe,
      }),
    });

    // Refrescar ingresos
    await fetchIncome();

    // Limpiar form
    clearForm();

    // Foco en nombre
    nameInput.value.focus();
  } catch (e) {
    console.error("Error al guardar:", e);
  }
}

function clearForm() {
  form.value = {
    name: "",
    email: "",
    phone: "",
    producto: "",
    costo: null,
    cantidad: null,
  };
  nameInput.value.focus();
}

onMounted(() => {
  fetchIncome();
  nameInput.value.focus();
});
</script>

<!-- FontAwesome -->
<!--<script src="https://kit.fontawesome.com/a2e0c6ad65.js" crossorigin="anonymous"></script>-->
