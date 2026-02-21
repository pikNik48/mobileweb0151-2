<template>
  <ion-page>
    <ion-content fullscreen class="login-bg">

      <div class="login-container">

        <div class="login-card">
          <h1 class="title">Login</h1>
          <p class="subtitle">
            Welcome back! Login to access your account
          </p>

          <!-- Email -->
          <ion-input
            v-model="email"
            placeholder="Email"
            class="custom-input"
          ></ion-input>

          <ion-input
            v-model="password"
            type="password"
            placeholder="Password"
            class="custom-input"
          ></ion-input>

          <ion-button expand="block" class="main-btn" @click="loginEmail">
            Continue
          </ion-button>

          <div class="divider">OR</div>

          <ion-button expand="block" class="google-btn" @click="loginGoogle">
            Login with Google
          </ion-button>

          <ion-input
            v-model="phone"
            placeholder="+66xxxxxxxxx"
            class="custom-input"
          ></ion-input>

          <div id="recaptcha-container"></div>

          <ion-button expand="block" class="phone-btn" @click="loginPhone">
            Login by Phone
          </ion-button>

          <ion-input
  v-model="otp"
  placeholder="Enter OTP"
  class="custom-input"
></ion-input>

<ion-button expand="block" @click="confirmOtp">
  Confirm OTP
</ion-button>

        </div>

      </div>

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { IonPage, IonContent, IonInput, IonButton } from '@ionic/vue';
import { authService } from '@/auth/auth-service';

const router = useRouter();

const email = ref('');
const password = ref('');
const phone = ref('');
const otp = ref('');
const verificationId = ref('');

async function loginEmail() {
  await authService.loginWithEmailPassword({
    email: email.value,
    password: password.value
  });

  router.replace('/tabs/tab1');
}

async function loginGoogle() {
  await authService.loginWithGoogle();
  router.replace('/tabs/tab1');
}

async function loginPhone() {
  const result = await authService.startPhoneLogin({
    phoneNumberE164: phone.value
  });

  verificationId.value = result.verificationId;
}

async function confirmOtp() {
  await authService.confirmPhoneCode({
    verificationId: verificationId.value,
    verificationCode: otp.value
  });

  router.replace('/tabs/tab1');
}
</script>

<style scoped>

.login-bg {
  --background: linear-gradient(135deg, #f857a6, #ff5858);
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-container {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-card {
  width: 100%;
  max-width: 400px;
  background: white;
  padding: 40px 30px;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  text-align: center;
}

.title {
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #4b2c5e;
}

.subtitle {
  font-size: 14px;
  margin-bottom: 30px;
  color: #777;
}

.custom-input {
  margin-bottom: 18px;
  --background: #f5f5f5;
  --padding-start: 15px;
  border-radius: 10px;
}

.main-btn {
  margin-top: 10px;
  margin-bottom: 15px;
  --border-radius: 12px;
  --background: linear-gradient(90deg, #f857a6, #ff5858);
  font-weight: bold;
}

.google-btn {
  margin-bottom: 15px;
  --border-radius: 12px;
  --background: #4285F4;
}

.phone-btn {
  margin-top: 10px;
  --border-radius: 12px;
  --background: #6a11cb;
}

.divider {
  margin: 15px 0;
  font-size: 12px;
  color: #aaa;
}

</style>