

<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>รายการรายรับ–รายจ่าย</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">

      <!-- สรุปยอด -->
      <ion-card>
        <ion-card-content>
          <p>รายรับรวม: {{ totalIncome }} บาท</p>
          <p>รายจ่ายรวม: {{ totalExpense }} บาท</p>
          <p><strong>ยอดคงเหลือ: {{ totalIncome - totalExpense }} บาท</strong></p>

        </ion-card-content>
      </ion-card>

      <!-- รายการ -->
      <ion-list>
  <ion-item v-for="item in expenses" :key="item.id">

    <!-- คลิกข้อความ = แก้ไข -->
    <ion-label @click="goEdit(item.id)">
      <h2>{{ item.title }}</h2>
      <p>{{ item.category }} • {{ item.amount }} บาท</p>
    </ion-label>

    <ion-badge :color="item.type === 'income' ? 'success' : 'danger'">
      {{ item.type }}
    </ion-badge>

    <!-- ปุ่มลบ -->
    <ion-button
      fill="clear"
      color="danger"
      @click.stop="deleteExpense(item.id)"
    >
      ลบ
    </ion-button>

  </ion-item>
</ion-list>


    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage, IonHeader, IonToolbar, IonTitle,
  IonContent, IonList, IonItem, IonLabel,
  IonBadge, IonCard, IonCardContent
} from '@ionic/vue'

import { ref, onMounted } from 'vue'
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  deleteDoc,
  doc
} from 'firebase/firestore'
import { db } from '@/firebase'
import { useRouter } from 'vue-router'


const router = useRouter()

const expenses = ref<any[]>([])
const totalIncome = ref(0)
const totalExpense = ref(0)

onMounted(() => {
  const q = query(
    collection(db, 'expenses'),
    orderBy('createdAt', 'desc')
  )

  onSnapshot(q, (snapshot) => {
    expenses.value = []
    totalIncome.value = 0
    totalExpense.value = 0

    snapshot.forEach(doc => {
      const data = doc.data()

      expenses.value.push({
        id: doc.id,
        ...data
      })

      if (data.type === 'income') {
        totalIncome.value += Number(data.amount)
      } else if (data.type === 'expense') {
        totalExpense.value += Number(data.amount)
      }
    })
  })
})


const goEdit = (id: string) => {
  router.push(`/tabs/tab2/${id}`)
}

const deleteExpense = async (id: string) => {
  if (confirm('ต้องการลบรายการนี้ใช่หรือไม่?')) {
    await deleteDoc(doc(db, 'expenses', id))
  }
}

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


ion-card {
  border-radius: 18px;
  box-shadow: 0 10px 24px rgba(255, 204, 221, 0.4);
  background: linear-gradient(135deg, #fff7fb, #fffef3);
}

ion-card p {
  margin: 6px 0;
  font-size: 15px;
}

/* รายการทั้งหมด */
ion-item {
  --background: #ffffff;
  margin-bottom: 10px;
  border-radius: 14px;
  box-shadow: 0 6px 16px rgba(0,0,0,0.06);
}

/* รายรับ */
ion-badge[color="success"] {
  background: linear-gradient(135deg, #9dffce, #52e5a6);
  color: #034d2c;
  border-radius: 12px;
}

/* รายจ่าย */
ion-badge[color="danger"] {
  background: linear-gradient(135deg, #ffb6c1, #ff7a9c);
  color: #6b1026;
  border-radius: 12px;
}


ion-button[color="danger"][fill="clear"] {
  --color: #ff5c8a;
  font-size: 13px;
}


ion-card-content {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  text-align: center;
  gap: 12px;
}

ion-card-content p {
  background: #ffffff;
  border-radius: 16px;
  padding: 14px 10px;
  font-size: 14px;
  box-shadow: 0 8px 18px rgba(255, 200, 220, 0.35);
}

/* รายรับ */
ion-card-content p:nth-child(1) {
  color: #1f7a4d;
  background: linear-gradient(135deg, #e8fff4, #ffffff);
}

/* รายจ่าย */
ion-card-content p:nth-child(2) {
  color: #a63a50;
  background: linear-gradient(135deg, #ffe8ee, #ffffff);
}

/* ยอดคงเหลือ */
ion-card-content p:nth-child(3) {
  font-weight: 600;
  color: #5a3d2b;
  background: linear-gradient(135deg, #fff6cc, #ffffff);
}

ion-card {
  border-radius: 22px;
  padding: 6px;
  background: linear-gradient(135deg, #fff1f7, #fffde8);
}

</style>

