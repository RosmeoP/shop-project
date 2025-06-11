<template>
    <div class="form-container">
        <h2>{{ editMode ? 'Editar Item' : 'Crear Nuevo Item' }}</h2>
        <form @submit.prevent="handleSubmit" class="item-form">
            <div class="form-group">
                <label for="nombre">Nombre:</label>
                <input
                    type="text"
                    id="nombre"
                    v-model="formData.nombre"
                    required
                    placeholder="Nombre del item"
                >
            </div>
            
            <div class="form-group">
                <label for="descripcion">Descripción:</label>
                <textarea
                    id="descripcion"
                    v-model="formData.descripcion"
                    rows="3"
                    placeholder="Descripción del item"
                ></textarea>
            </div>
            
            <div class="form-group">
                <label for="precio">Precio:</label>
                <input
                    type="number"
                    id="precio"
                    v-model="formData.precio"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                >
            </div>
            
            <div class="form-actions">
                <button type="button" @click="$emit('cancel')" class="cancel-btn">Cancelar</button>
                <button type="submit" class="submit-btn" :disabled="submitting">
                    {{ submitting ? 'Guardando...' : editMode ? 'Actualizar' : 'Crear' }}
                </button>
            </div>
            
            <div v-if="error" class="error-message">
                {{ error }}
            </div>
        </form>
    </div>
</template>

<script setup>
import axios from 'axios';
import { defineProps, defineEmits, ref, reactive, computed, onMounted } from 'vue';

const props = defineProps({
    item: Object
});

const emit = defineEmits(['cancel', 'refresh']);

const formData = reactive({
    nombre: '',
    descripcion: '',
    precio: ''
});

const submitting = ref(false);
const error = ref('');
const editMode = computed(() => !!props.item);

// Si estamos en modo edición, cargamos los datos del item
onMounted(() => {
    if (props.item) {
        formData.nombre = props.item.nombre || '';
        formData.descripcion = props.item.descripcion || '';
        formData.precio = props.item.precio || '';
    }
});

const resetForm = () => {
    formData.nombre = '';
    formData.descripcion = '';
    formData.precio = '';
    error.value = '';
};

const handleSubmit = async () => {
    try {
        submitting.value = true;
        error.value = '';
        
        // Validar datos
        if (!formData.nombre) {
            error.value = 'El nombre es requerido';
            return;
        }
        
        if (editMode.value) {
            // Actualizar item existente
            await axios.put(`http://localhost:3000/items/${props.item.id}`, formData);
        } else {
            // Crear nuevo item
            await axios.post('http://localhost:3000/items', formData);
            resetForm();
        }
        
        emit('refresh');
        emit('cancel');
    } catch (err) {
        console.error('Error al guardar item:', err);
        error.value = 'Error al guardar. Por favor intenta de nuevo.';
    } finally {
        submitting.value = false;
    }
};
</script>

<style scoped>
h2 {
  font-size: 24px;
  color: #333;
  text-align: center;
}

.form-container {
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    max-width: 500px;
    margin: 0 auto;
}

.item-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

label {
    font-weight: 600;
    color: #333;
}

input, textarea {
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 16px;
}

input:focus, textarea:focus {
    outline: none;
    border-color: #2196F3;
    box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.2);
}

.form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 10px;
}

button {
    padding: 10px 16px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.2s ease;
}

button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.cancel-btn {
    background-color: #e0e0e0;
    color: #333;
}

.cancel-btn:hover:not(:disabled) {
    background-color: #d5d5d5;
}

.submit-btn {
    background-color: #4CAF50;
    color: white;
}

.submit-btn:hover:not(:disabled) {
    background-color: #43A047;
}

.error-message {
    background-color: #FFEBEE;
    color: #C62828;
    padding: 10px;
    border-radius: 6px;
    margin-top: 10px;
    text-align: center;
}
</style>