<script setup>
import LoginForm from "../components/LoginForm.vue"
</script>

<template>
    <h1 class="text-3xl text-white font-bold mb-6">Login</h1>
    <LoginForm />
<!-- Login Page -->
<template>
  <div class="relative min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black flex items-center justify-center overflow-hidden">
    <!-- Background blobs -->
    <div class="absolute inset-0 -z-10 overflow-hidden">
      <div class="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-r from-indigo-600 to-pink-600 rounded-full blur-3xl opacity-30 animate-pulse"></div>
      <div class="absolute -bottom-28 -right-20 w-[520px] h-[520px] bg-gradient-to-r from-purple-700 to-indigo-500 rounded-full blur-3xl opacity-25 animate-bounce"></div>
      <div class="absolute top-1/3 left-1/2 -translate-x-1/2 w-[420px] h-[420px] bg-gradient-to-r from-pink-500 to-purple-500 rounded-full blur-2xl opacity-12 animate-[float_8s_ease-in-out_infinite]"></div>
    </div>

    <!-- Login card -->
    <div class="relative max-w-md w-full p-8 bg-slate-800/70 backdrop-blur-sm border border-white/10 rounded-3xl shadow-2xl text-center space-y-6 float hover:scale-[1.02] transition-transform">
      <h1 class="text-4xl font-extrabold gradient-text mb-4">Login</h1>
      <p class="text-gray-300 mb-6">Access your EdgeBump dashboard and start tracking your trading edge.</p>

      <LoginForm />

      <div class="mt-4 text-gray-400 text-sm">
        <a href="#" class="hover:text-white transition">Forgot password?</a>
      </div>
    </div>
  </div>
</template>

</template>
