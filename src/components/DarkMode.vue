<script setup lang="ts">
import { ref, onMounted } from "vue";

const isDark = ref(false);
const darkToggle = () => {
  isDark.value = !isDark.value;
  localStorage.setItem("isDark", isDark.value);
  if (isDark.value) {
    document.documentElement.classList.add("dark");
    document.body.classList.add("bg-slate-900");
  } else {
    document.documentElement.classList.remove("dark");
    document.body.classList.remove("bg-slate-900");
  }
  localStorage.setItem("dark", isDark.value.toString());
};
onMounted(() => {
  let ls = localStorage.getItem("dark");
  if (ls == "true") {
    isDark.value = true;
  } else {
    isDark.value = false;
  }
});
</script>

<template>
  <div>
    <button
      class="px-2 rounded-sm m-2 bg-slate-900 text-yellow-400"
      @click="darkToggle"
    >
      <i class="fa" :class="[isDark ? 'fa-sun' : 'fa-moon']"></i>
    </button>
  </div>
</template>
