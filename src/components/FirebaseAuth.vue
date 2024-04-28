<script setup lang="ts">
import { ref } from 'vue'
import StyledButton from './StyledButton.vue'
import { auth } from '../firebase'

import { IconUser, IconAsterisk } from '@tabler/icons-vue'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'

const emit = defineEmits(['focusin', 'focusout', 'logged-in'])

const isLogin = ref(true)
const email = ref('')
const password = ref('')
const errorMessage = ref<string | null>(null)

function toLogin() {
  isLogin.value = true
}

function toSignup() {
  isLogin.value = false
}

function login() {
  signInWithEmailAndPassword(auth, email.value, password.value)
    .then((userCredential) => {
      emit('logged-in')
    })
    .catch((error) => {
      console.log(error)
      switch (error.code) {
        case 'auth/invalid-email':
          errorMessage.value = 'Email is invalid'
          break
        case 'auth/invalid-credential':
          errorMessage.value = 'Invalid credentials'
          break
        default:
          errorMessage.value = 'Firebase error: ' + error.code
      }
    })
}

function signup() {
  createUserWithEmailAndPassword(auth, email.value, password.value)
    .then(() => {
      emit('logged-in')
    })
    .catch((error) => {
      switch (error.code) {
        case 'auth/invalid-email':
          errorMessage.value = 'Email is invalid'
          break
        case 'auth/weak-password':
          errorMessage.value = 'Password is too weak'
          break
        case 'auth/email-already-in-use':
          errorMessage.value = 'Email is already in use'
          break
        default:
          errorMessage.value = 'Firebase error: ' + error.code
      }
    })
}
</script>

<template>
  <div class="auth">
    <div class="input">
      <IconUser size="24" />
      <input
        placeholder="Email"
        v-model="email"
        type="email"
        @focusin="$emit('focusin')"
        @focusout="$emit('focusout')"
      />
    </div>
    <div class="input">
      <IconAsterisk size="24" />
      <input
        placeholder="Password"
        v-model="password"
        type="password"
        @focusin="$emit('focusin')"
        @focusout="$emit('focusout')"
      />
    </div>
    <div class="error" v-if="errorMessage">{{ errorMessage }}</div>
    <StyledButton v-if="isLogin" @click="login">Login</StyledButton>
    <button class="unstyled-button" v-if="isLogin" @click="toSignup">Create an account</button>
    <StyledButton v-if="!isLogin" @click="signup">Register</StyledButton>
    <button class="unstyled-button" v-if="!isLogin" @click="toLogin">
      Login to an existing account
    </button>
  </div>
</template>

<style scoped>
.auth {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-grow: 1;
  height: 100%;
  justify-content: center;
  color: var(--light);
}

.input {
  display: flex;
  border-radius: 0.75rem;
  border: var(--light) solid 1px;
  padding: 0.25rem;
  margin: 0.5rem;
  color: var(--light);
}

.input > input {
  background-color: var(--dark);
  border: none;
  color: var(--light);
  outline: none;
}

.unstyled-button {
  outline: none;
  border: none;
  color: inherit;
  background-color: transparent;
  cursor: pointer;
}

.error {
  color: red;
}
</style>
