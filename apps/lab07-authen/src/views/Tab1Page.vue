<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Tab 1</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Tab 1</ion-title>
        </ion-toolbar>
      </ion-header>

      <ExploreContainer name="Tab 1 page" />


      <div v-if="user">
  <p><strong>UID:</strong> {{ user.uid }}</p>
  <p><strong>Email:</strong> {{ user.email }}</p>
  <p><strong>Phone:</strong> {{ user.phoneNumber }}</p>
  <p><strong>Name:</strong> {{ user.displayName }}</p>
</div>

      <ion-button expand="block" color="danger" @click="logout">
        Logout
      </ion-button>

    </ion-content>
  </ion-page>
</template>



<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton } from '@ionic/vue';
import ExploreContainer from '@/components/ExploreContainer.vue';
import { useRouter } from 'vue-router';
import { authService } from '@/auth/auth-service';
import { ref, onMounted } from 'vue';   // ✅ ต้องมี

const router = useRouter();

const user = ref<any>(null);   // ✅ ต้องมีตัวแปรนี้

onMounted(async () => {
  user.value = await authService.getCurrentUser();
});

async function logout() {
  await authService.logout();
  router.replace('/login');
}
</script>
