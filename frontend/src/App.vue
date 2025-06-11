<template>
  <div class="app-container">
    <header>
      <h1>Sistema de Gestión de Items</h1>
      <button @click="showForm = true" v-if="!showForm" class="add-btn">
        Agregar Nuevo Item
      </button>
    </header>

    <div v-if="showForm" class="form-section">
      <AccionesItems 
        :item="itemToEdit" 
        @cancel="cancelForm" 
        @refresh="fetchItems" 
      />
    </div>
    
    <div v-else class="list-section">
      <ListaItems 
        :items="items" 
        @refresh="fetchItems" 
        @edit="editItem" 
      />
    </div>
    
    <div v-if="loading" class="loading-overlay">
      <div class="loading-spinner"></div>
      <p>Cargando datos...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import ListaItems from './components/itemList.vue';
import AccionesItems from './components/itemActions.vue';

const items = ref([]);
const loading = ref(false);
const error = ref(null);
const showForm = ref(false);
const itemToEdit = ref(null);

// Obtener todos los items de la API
const fetchItems = async () => {
  try {
    loading.value = true;
    error.value = null;
    const response = await axios.get('http://localhost:3000/items');
    items.value = response.data;
  } catch (err) {
    console.error('Error al cargar items:', err);
    error.value = 'No se pudieron cargar los items. Por favor, intenta de nuevo más tarde.';
  } finally {
    loading.value = false;
  }
};

// Editar un item existente
const editItem = (item) => {
  itemToEdit.value = item;
  showForm.value = true;
};

// Cancelar el formulario
const cancelForm = () => {
  showForm.value = false;
  itemToEdit.value = null;
};

// Cargar items al montar el componente
onMounted(() => {
  fetchItems();
});
</script>

<style>
/* Estilos globales */
:root {
  --primary-color: #2196F3;
  --primary-dark: #1976D2;
  --accent-color: #4CAF50;
  --accent-dark: #388E3C;
  --danger-color: #f44336;
  --danger-dark: #d32f2f;
  --text-color: #333;
  --light-bg: #f5f5f5;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

body {
  background-color: var(--light-bg);
  color: var(--text-color);
}

.app-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  position: relative;
  min-height: 100vh;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 15px;
  border-bottom: 1px solid #e0e0e0;
}

h1 {
  color: var(--primary-dark);
  font-size: 1.8rem;
}

.add-btn {
  background-color: var(--accent-color);
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s;
}

.add-btn:hover {
  background-color: var(--accent-dark);
}

.form-section, .list-section {
  margin-top: 20px;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.loading-spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid var(--primary-color);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: 10px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>