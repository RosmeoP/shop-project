<template>
  <div>
      <h2>Lista de Items</h2>
      <div v-if="loading" class="loading">Cargando...</div>
      <div v-else-if="error" class="error">{{ error }}</div>
      <ul v-else>
          <li v-for="item in items" :key="item.id">
              <div class="item-details">
                  <strong>{{ item.nombre }}</strong>
                  <p v-if="item.descripcion" class="description">{{ item.descripcion }}</p>
                  <span class="price">{{ formatPrice(item.precio) }}</span>
              </div>
              <div class="item-actions">
                  <button @click="$emit('edit', item)" class="edit-btn">Editar</button>
                  <button @click="handleDelete(item.id)" class="delete-btn" :disabled="deleting === item.id">
                      {{ deleting === item.id ? 'Eliminando...' : 'Eliminar' }}
                  </button>
              </div>
          </li>
      </ul>
      <div v-if="items && items.length === 0" class="empty-state">
          No hay items disponibles. ¡Agrega algunos!
      </div>
  </div>
</template>

<script setup>
import axios from 'axios';
import { defineProps, defineEmits, ref } from 'vue';

const props = defineProps({
  items: Array
});

const emit = defineEmits(['refresh', 'edit']);
const deleting = ref(null);
const error = ref(null);
const loading = ref(false);

const formatPrice = (price) => {
  return price ? `$${parseFloat(price).toFixed(2)}` : '';
};

const handleDelete = async (id) => {
  try {
      deleting.value = id;
      error.value = null;
      
      await axios.delete(`http://localhost:3000/items/${id}`);
      emit('refresh');
  } catch (err) {
      console.error('Error al eliminar item:', err);
      error.value = 'No se pudo eliminar el item. Intenta de nuevo.';
  } finally {
      deleting.value = null;
  }
};
</script>

<style scoped>

h2 {
  font-size: 24px;
  margin-bottom: 16px;
  color: #333;
  text-align: center;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  background: white;
  padding: 16px;
  margin-bottom: 12px;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.item-details {
  flex: 1;
}

.item-actions {
  display: flex;
  gap: 8px;
}

.description {
  color: #666;
  margin: 5px 0;
  font-size: 0.9em;
}

.price {
  font-weight: bold;
  color: #2E7D32;
}

button {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.2s ease;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.edit-btn {
  background-color: #2196F3;
  color: white;
}

.edit-btn:hover:not(:disabled) {
  background-color: #1976D2;
}

.delete-btn {
  background-color: #f44336;
  color: white;
}

.delete-btn:hover:not(:disabled) {
  background-color: #d32f2f;
}

.loading, .error, .empty-state {
  padding: 16px;
  border-radius: 8px;
  margin: 12px 0;
  text-align: center;
}

.loading {
  background-color: #E3F2FD;
  color: #1976D2;
}

.error {
  background-color: #FFEBEE;
  color: #C62828;
}

.empty-state {
  background-color: #F5F5F5;
  color: #616161;
  padding: 24px;
}
</style>