<script setup lang="ts">
import { onMounted } from "vue";
import Calculadora from "./components/Calculadora.vue";
import DarkMode from "./components/DarkMode.vue";

onMounted(() => {
  let ls = localStorage.getItem("dark");
  if (ls == "true") {
    document.documentElement.classList.add("dark");
    document.body.classList.add("bg-slate-900");
  } else {
    document.documentElement.classList.remove("dark");
    document.body.classList.remove("bg-slate-900");
  }
});
</script>

<template>
  <div class="dark:bg-slate-900 mt-2">
    <div class="flex flex-row justify-between">
      <div class="invisible">sdfs</div>
      <h1
        class="text-xl text-gray-800 dark:text-gray-400 font-extrabold drop-shadow-lg"
      >
        Réplica de la calculadora de
        <a
          href="https://elgafas.com/"
          target="_blank"
          class="text-blue-500 hover:text-blue-800"
        >
          elgafas.com
        </a>
      </h1>
      <DarkMode class="flex" />
    </div>
    <Calculadora />
  </div>
</template>
