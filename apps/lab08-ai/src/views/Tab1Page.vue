<template>
  <ion-page>
    <ion-header>
      <ion-toolbar class="toolbar-custom">
        <ion-title>Gemini Vision</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding bg-light">

      <div class="card-container">

        <!-- Hidden file input -->
        <input ref="fileEl" type="file" accept="image/*" hidden @change="onFileChange" />

        <!-- Buttons -->
        <ion-button expand="block" class="primary-btn" @click="fileEl?.click()">
          📁 เลือกไฟล์ภาพ
        </ion-button>

        <ion-button expand="block" fill="outline" class="outline-btn" @click="onTakePhoto">
          📷 ถ่ายภาพ
        </ion-button>

        <!-- Preview -->
        <div v-if="previewUrl" class="preview-wrapper">
          <ion-img :src="previewUrl" />
        </div>

        <!-- Analyze -->
        <ion-button
          expand="block"
          class="analyze-btn"
          :disabled="!img || loading"
          @click="onAnalyze"
        >
          🔍 วิเคราะห์ภาพ
        </ion-button>

        <ion-spinner v-if="loading" class="spinner-center" />

        <!-- Result -->
        <div v-if="result" class="result-card">
          <h2>📝 คำบรรยาย</h2>
          <p>{{ result.caption }}</p>

          <h3>🏷 Tags</h3>
          <div class="tag-group">
            <ion-chip v-for="tag in result.tags" :key="tag">
              {{ tag }}
            </ion-chip>
          </div>

          <div v-if="result.objects">
            <h3>📦 Objects</h3>
            <ul>
              <li v-for="o in result.objects" :key="o.name">
                {{ o.name }}
                <span v-if="o.confidence">
                  ({{ (o.confidence * 100).toFixed(0) }}%)
                </span>
              </li>
            </ul>
          </div>

          <div v-if="result.safety">
            <h3>🛡 Safety</h3>
            <p>
              สถานะ:
              <strong>
                {{ result.safety.isSensitive ? "อ่อนไหว" : "ปกติ" }}
              </strong>
            </p>
            <p v-if="result.safety.notes">
              {{ result.safety.notes }}
            </p>
          </div>
        </div>

      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from "vue";
import {
  IonButton, IonContent, IonHeader, IonImg, IonPage,
  IonSpinner, IonTitle, IonToolbar, IonChip
} from "@ionic/vue";

import { PhotoService } from "../core/photo.service";
import { GeminiVisionService } from "../core/gemini.service";
import type { Base64Image } from "../core/ai.interface";
import type { ImageAnalysisResult } from "../core/ai.interface";

const fileEl = ref<HTMLInputElement | null>(null);
const img = ref<Base64Image | null>(null);
const previewUrl = ref("");
const result = ref<ImageAnalysisResult | null>(null);
const loading = ref(false);

async function onFileChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;
  img.value = await PhotoService.fromFile(file);
  previewUrl.value = URL.createObjectURL(file);
  result.value = null;
}

async function onTakePhoto() {
  loading.value = true;
  try {
    const b64 = await PhotoService.fromCamera();
    img.value = b64;
    previewUrl.value = `data:${b64.mimeType};base64,${b64.base64}`;
    result.value = null;
  } finally {
    loading.value = false;
  }
}

async function onAnalyze() {
  if (!img.value) return;
  loading.value = true;
  try {
    result.value = await GeminiVisionService.analyze(img.value);
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.bg-light {
  background: #f4f8fc;
}

.toolbar-custom {
  --background: #1e3a8a;
  --color: white;
}

.card-container {
  background: white;
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
}

.primary-btn {
  --background: #2563eb;
  --border-radius: 12px;
  margin-bottom: 10px;
}

.outline-btn {
  --color: #2563eb;
  --border-color: #2563eb;
  --border-radius: 12px;
  margin-bottom: 20px;
}

.analyze-btn {
  --background: #1e40af;
  --border-radius: 12px;
  margin-top: 10px;
}

.preview-wrapper {
  margin: 20px 0;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e5e7eb;
}

.result-card {
  margin-top: 20px;
  padding: 15px;
  background: #f9fbff;
  border-radius: 12px;
  border: 1px solid #e0e7ff;
}

.tag-group {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 10px;
}

.spinner-center {
  display: block;
  margin: 20px auto;
}
</style>