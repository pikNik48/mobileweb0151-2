<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>แก้ไขรายการ</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-input label="ชื่อรายการ" v-model="title" />
      <ion-input
        label="จำนวนเงิน"
        type="number"
        :value="amount"
        @ionInput="amount = Number($event.target.value)"
      />

      <ion-select label="ประเภท" v-model="type">
        <ion-select-option value="income">รายรับ</ion-select-option>
        <ion-select-option value="expense">รายจ่าย</ion-select-option>
      </ion-select>

      <ion-input label="หมวดหมู่" v-model="category" />
      <ion-textarea label="หมายเหตุ" v-model="note" />

      <ion-button expand="block" @click="updateExpense">
        บันทึกการแก้ไข
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

import { ref, onMounted } from 'vue'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '@/firebase'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const id = route.params.id as string

const title = ref('')
const amount = ref(0)
const type = ref('expense')
const category = ref('')
const note = ref('')

onMounted(async () => {
  const snap = await getDoc(doc(db, 'expenses', id))
  if (snap.exists()) {
    const data = snap.data()
    title.value = data.title
    amount.value = data.amount
    type.value = data.type
    category.value = data.category
    note.value = data.note
  }
})

const updateExpense = async () => {
  await updateDoc(doc(db, 'expenses', id), {
    title: title.value,
    amount: Number(amount.value),
    type: type.value,
    category: category.value,
    note: note.value
  })

  router.push('/tabs/tab2')
}
</script>


</script>

<style scoped>
ion-content {
  --background: #ffffff;
}

/* Toolbar หรู ลูกคุณหนู */
ion-toolbar {
  --background: linear-gradient(135deg, #ffd6e8, #fff1a8);
  --color: #5a3d2b;
}

/* หัวข้อ */
ion-title {
  font-weight: 600;
  letter-spacing: 0.5px;
}
ion-input,
ion-select,
ion-textarea {
  --background: #fff;
  --border-radius: 14px;
  --padding-start: 14px;
  margin-bottom: 14px;
  box-shadow: 0 6px 16px rgba(255, 192, 203, 0.25);
}

ion-button {
  --background: linear-gradient(135deg, #ff9ecb, #ffd86b);
  --border-radius: 16px;
  --box-shadow: 0 10px 20px rgba(255, 182, 193, 0.45);
  font-weight: 600;
  margin-top: 20px;
}


</style>


