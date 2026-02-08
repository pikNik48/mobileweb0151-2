<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>เพิ่มรายการรายรับ–รายจ่าย</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-input label="ชื่อรายการ" v-model="title" />
      <ion-input
  label="จำนวนเงิน"
  type="number"
  :value="amount"
  @ionInput="amount = Number($event.target.value)" />


      <ion-select label="ประเภท" v-model="type">
        <ion-select-option value="income">รายรับ</ion-select-option>
        <ion-select-option value="expense">รายจ่าย</ion-select-option>
      </ion-select>

      <ion-input label="หมวดหมู่" v-model="category" />
      <ion-textarea label="หมายเหตุ" v-model="note" />

      <ion-button expand="block" @click="saveExpense">
        บันทึกข้อมูล
      </ion-button>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage, IonHeader, IonToolbar, IonTitle,
  IonContent, IonInput, IonSelect,
  IonSelectOption, IonTextarea, IonButton
} from '@ionic/vue'

import { ref } from 'vue'
import { collection, addDoc } from 'firebase/firestore'
import { db } from '@/firebase'
import { useRouter } from 'vue-router'

const router = useRouter()

const title = ref('')
const amount = ref(0)
const type = ref('expense')
const category = ref('')
const note = ref('')

const saveExpense = async () => {
  await addDoc(collection(db, 'expenses'), {
    title: title.value,
    amount: Number(amount.value),
    type: type.value,
    category: category.value,
    note: note.value,
    createdAt: new Date()
  })

  router.push('/tabs/tab2')
}
</script>

<style scoped>
/* ===== ฟอร์มทั้งหมด ===== */
ion-content {
  --background: #ffffff;
}

/* กล่อง input / select / textarea */
ion-input,
ion-select,
ion-textarea {
  --background: #fff;
  margin-bottom: 14px;
  border-radius: 16px;
  padding: 8px 14px;
  box-shadow: 0 10px 24px rgba(255, 200, 220, 0.35);
  border: 1px solid #ffe3ec;
}

/* label */
ion-input::part(label),
ion-select::part(label),
ion-textarea::part(label) {
  color: #b76e79;
  font-size: 13px;
  font-weight: 500;
}

/* ตัวอักษรที่พิมพ์ */
ion-input::part(native),
ion-textarea::part(native) {
  font-size: 15px;
  color: #333;
}

/* select */
ion-select::part(container) {
  padding: 10px 6px;
}

/* ===== ปุ่มบันทึก ===== */
ion-button {
  margin-top: 20px;
  height: 48px;
  border-radius: 20px;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 0.5px;
  --background: linear-gradient(135deg, #ffd1dc, #fff1a8);
  --color: #5a3d2b;
  box-shadow: 0 12px 26px rgba(255, 200, 150, 0.5);
}

/* hover / active */
ion-button:active {
  transform: scale(0.97);
}


</style>


