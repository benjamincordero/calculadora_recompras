<script setup lang="ts">
import { ref, computed, inject, onMounted } from "vue";

const axios: any = inject("axios");

const form = ref({
  operation: "",
  distance: "",
  extraCoins: "",
  stopLoss: "",
  inPrice: "",
  coins: "",
  localStorage: false,
});
const footer = ref({});
const result = ref({});

const submitColor = computed(() => {
  if (form.value.operation == "1") {
    return "bg-green-600 hover:bg-green-700 focus:bg-green-700 active:bg-green-800";
  }
  if (form.value.operation == "2") {
    return "bg-red-500 hover:bg-red-700 focus:bg-red-700 active:bg-red-800";
  }
  return "bg-blue-600";
});
const calcular = () => {
  let data = form.value;
  console.log(data);
  if (data) {
    if (data.localStorage) {
      localStorage.setItem("form", JSON.stringify(data));
    } else {
      localStorage.removeItem("form", JSON.stringify(data));
    }
  }

  if (data.operation == "2") {
    short();
  } else {
    long();
  }
};

const long = () => {
  const recompra = [];
  let i = 1;
  let data = form.value;
  let elevatePrice = parseFloat(data.inPrice);
  let currentCoins = parseFloat(data.coins);
  let totalCoins = parseFloat(data.coins);
  let totalUsd = elevatePrice * currentCoins;

  let usd = elevatePrice * currentCoins;
  const decimals =
    totalCoins % 1 != 0 ? data.coins.toString().split(".")[1].length : 2;
  const decimalsPrice =
    elevatePrice % 1 != 0 ? data.inPrice.toString().split(".")[1].length : 2;

  let notional = 0;
  let position = 0;
  let stopLoss = 0;
  while (true) {
    //calcular stoploss
    position = totalUsd / totalCoins;
    notional = totalCoins * position;
    stopLoss = (notional - parseFloat(data.stopLoss)) / totalCoins;
    //end calcular stoploss

    //elvevamos el precio al porcentaje que sigue
    elevatePrice -= (elevatePrice * parseFloat(data.distance)) / 100;
    console.log(stopLoss);
    //elevamos la cantidad de monedas al porcentaje que le sigue y añadimos las monedas a la cantidad total
    currentCoins =
      currentCoins + (currentCoins * parseFloat(data.extraCoins)) / 100;
    currentCoins = parseFloat(currentCoins.toFixed(decimals));

    usd = elevatePrice * currentCoins;
    if (elevatePrice < stopLoss || i > 8) {
      break;
    } else {
      totalCoins += currentCoins;
      totalUsd += usd;
    }
    /*console.log(i, "totalcoins =" + totalCoins, "coins=" + currentCoins);*/
    let newPosition = totalUsd / totalCoins;
    recompra.push({
      number: i,
      price: elevatePrice.toFixed(decimalsPrice),
      coins: currentCoins.toFixed(decimals),
      usd: usd.toFixed(2),
      position: newPosition.toFixed(2),
    });
    i++;
  }
  let initialPrice = parseFloat(data.inPrice);
  let percentaje = ((stopLoss - initialPrice) / initialPrice) * 100;

  result.value = recompra;
  footer.value = {
    percentaje: percentaje.toFixed(2),
    stopLoss: stopLoss.toFixed(decimalsPrice),
    totalCoins: totalCoins.toFixed(decimals),
    totalUsd: totalUsd.toFixed(decimals),
  };
};

const short = () => {
  const recompra = [];
  let i = 1;
  let data = form.value;
  let elevatePrice = parseFloat(data.inPrice);
  let currentCoins = parseFloat(data.coins);
  let totalCoins = parseFloat(data.coins);
  let totalUsd = elevatePrice * currentCoins;

  let usd = elevatePrice * currentCoins;
  const decimals =
    totalCoins % 1 != 0 ? data.coins.toString().split(".")[1].length : 2;
  const decimalsPrice =
    elevatePrice % 1 != 0 ? data.inPrice.toString().split(".")[1].length : 2;

  let notional = 0;
  let position = 0;
  let stopLoss = 0;
  while (true) {
    //calcular stoploss
    position = totalUsd / totalCoins;
    notional = totalCoins * position;
    stopLoss = (notional + parseFloat(data.stopLoss)) / totalCoins;
    //end calcular stoploss

    //elvevamos el precio al porcentaje que sigue
    elevatePrice += (elevatePrice * parseFloat(data.distance)) / 100;
    //elevamos la cantidad de monedas al porcentaje que le sigue y añadimos las monedas a la cantidad total
    currentCoins =
      currentCoins + (currentCoins * parseFloat(data.extraCoins)) / 100;
    currentCoins = parseFloat(currentCoins.toFixed(decimals));

    usd = elevatePrice * currentCoins;
    if (elevatePrice > stopLoss || i > 8) {
      break;
    } else {
      totalCoins += currentCoins;
      totalUsd += usd;
    }
    /*console.log(i, "totalcoins =" + totalCoins, "coins=" + currentCoins);*/
    let newPosition = totalUsd / totalCoins;
    recompra.push({
      number: i,
      price: elevatePrice.toFixed(decimalsPrice),
      coins: currentCoins.toFixed(decimals),
      usd: usd.toFixed(2),
      position: newPosition.toFixed(2),
    });
    i++;
  }
  let initialPrice = parseFloat(data.inPrice);
  let percentaje = ((stopLoss - initialPrice) / initialPrice) * 100;

  result.value = recompra;
  footer.value = {
    percentaje: percentaje.toFixed(2),
    stopLoss: stopLoss.toFixed(decimalsPrice),
    totalCoins: totalCoins.toFixed(decimals),
    totalUsd: totalUsd.toFixed(decimals),
  };
};
onMounted(() => {
  let dataString = localStorage.getItem("form");
  const data = JSON.parse(localStorage.getItem("form"));

  if (data) {
    form.value = data;
    calcular();
  }
});
</script>

<template>
  <div
    class="flex justify-center flex-col lg:flex-row lg:justify-center gap-5 pt-4"
  ></div>
  <div class="flex justify-center flex-col lg:flex-row lg:justify-center gap-5">
    <div class="lg:w-1/3">
      <div class="block bg-white dark:bg-slate-800 p-5 rounded-lg shadow-lg">
        <form @submit.prevent="calcular">
          <div class="flex flex-col">
            <label
              for="operacion"
              class="inline-block text-gray-700 dark:text-gray-200"
              >Operación</label
            >
            <select
              id="operacion"
              class="form-select appearance-none block w-full px-3 py-1.5 dark:bg-gray-800 dark:text-gray-200 font-normal bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:border-blue-600 focus:outline-none"
              required
              v-model="form.operation"
            >
              <option value="">Seleccione</option>
              <option value="1">LONG</option>
              <option value="2">SHORT</option>
            </select>
          </div>

          <!-- form group -->
          <div class="flex flex-col">
            <label
              for="distancia"
              class="inline-block pt-3 dark:text-gray-200 text-gray-700"
              >% Distancia recompras</label
            >
            <input
              type="number"
              step="any"
              required
              id="distancia"
              placeholder="% Distancia recompras"
              class="block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:border-blue-600 focus:outline-none dark:bg-slate-900 dark:text-gray-200"
              v-model="form.distance"
            />
          </div>
          <!-- form group -->
          <div class="flex flex-col">
            <label
              for="monedas_adicionales"
              class="inline-block pt-3 text-gray-700 dark:text-gray-200"
              >% Monedas adicionales</label
            >
            <input
              type="number"
              step="any"
              required
              id="monedas_adicionales"
              placeholder="% Monedas"
              class="block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:border-blue-600 focus:outline-none dark:bg-slate-900 dark:text-gray-200"
              v-model="form.extraCoins"
            />
          </div>
          <!-- form group -->
          <div class="flex flex-col">
            <label
              for="sl"
              class="inline-block pt-3 text-gray-700 dark:text-gray-200"
              >Stop Loss</label
            >
            <input
              type="number"
              step="any"
              required
              id="sl"
              placeholder="Stop Loss $"
              class="block w-full px-3 py-1.5 text-base font-normal text-gray-700 border-slate-500 dark:text-gray-200 dark:bg-slate-900 bg-clip-padding border border-solid rounded transition ease-in-out m-0 focus:text-gray-700 focus:border-blue-600 focus:outline-none"
              v-model="form.stopLoss"
            />
          </div>
          <!-- form group -->
          <div class="flex flex-col">
            <label
              for="entrada"
              class="inline-block dark:text-gray-200 pt-3 text-gray-700"
              >Precio de Entrada</label
            >
            <input
              type="number"
              step="any"
              required
              id="entrada"
              placeholder="Precio de entrada"
              class="block w-full px-3 py-1.5 text-base font-normal text-gray-700 dark:text-gray-200 bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:border-blue-600 focus:outline-none dark:bg-slate-900 dark:text-gray-200"
              v-model="form.inPrice"
            />
          </div>
          <!-- form group -->
          <div class="flex flex-col">
            <label
              for="monedas"
              class="dark:text-gray-200 inline-block pt-3 text-gray-700"
              >Monedas</label
            >
            <input
              type="number"
              step="any"
              required
              id="monedas"
              placeholder="Monedas"
              class="block w-full px-3 py-1.5 text-base font-normal text-gray-700 dark:text-gray-200 bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:border-blue-600 focus:outline-none dark:bg-slate-900 dark:text-gray-200"
              v-model="form.coins"
            />
          </div>

          <div class="flex align-bottom flex-row mt-4">
            <input
              type="checkbox"
              id="localstorage"
              v-model="form.localStorage"
              class="border-green-500"
            />&nbsp;
            <label
              for="localstorage"
              class="dark:text-gray-300 inline-block align-bottom text-gray-700 cursor-pointer"
              >Conservar datos formulario</label
            >
          </div>
          <button
            type="submit"
            class="px-6 py-2.5 dark:text-gray-200 hover:shadow-lg font-large text-sm leading-tight uppercase rounded shadow-md focus:shadow-lg w-full mt-5 focus:outline-none focus:ring-0 active:shadow-lg transition duration-150 ease-in-out text-white"
            :class="submitColor"
          >
            Calcular
          </button>
        </form>
      </div>
    </div>
    <div class="mb-3 lg:w-1/2">
      <table class="min-w-full text-sm text-gray-800 drop-shadow-lg">
        <thead
          class="bg-gray-200 dark:bg-slate-800 dark:text-gray-200 text-xs uppercase font-medium"
        >
          <tr>
            <th scope="col" class="px-4 py-3 text-left tracking-wider">#</th>
            <th scope="col" class="px-6 py-3 text-center tracking-wider">
              Precio
            </th>

            <th scope="col" class="px-6 py-3 text-center tracking-wider">
              Monedas
            </th>
            <th scope="col" class="px-6 py-3 text-center tracking-wider">
              Valor en Usd
            </th>
            <th scope="col" class="px-6 py-3 text-center tracking-wider">
              Nueva Posición Aproximada
            </th>
          </tr>
        </thead>
        <tbody class="bg-gray-100 dark:text-white">
          <tr
            class="bg-opacity-20"
            v-for="(row, index) in result"
            :key="index + 1"
            :class="[
              index % 2
                ? 'bg-gray-500 dark:bg-gray-700 '
                : 'bg-gray-100 dark:bg-gray-600',
            ]"
          >
            <td class="pl-4 py-3">{{ row.number }}</td>
            <td class="pl-4 text-center">{{ row.price }}</td>
            <td class="pl-4 text-center">{{ row.coins }}</td>
            <td class="pl-4 text-center">${{ row.usd }}</td>
            <td class="pl-4 text-center text-gray-500 dark:text-white">
              {{ row.position }}
            </td>
          </tr>
        </tbody>
        <tfoot
          class="bg-gray-400 dark:bg-slate-800 dark:text-white"
          v-if="footer.percentaje"
        >
          <tr class="bg-opacity-20">
            <td class="pl-4 py-3">SL({{ footer.percentaje }}%)</td>
            <td class="pl-4 py-3 text-center">
              {{ footer.stopLoss }}
            </td>
            <td class="pl-4 py-3 text-center">{{ footer.totalCoins }}</td>
            <td class="pl-4 py-3 text-center">${{ footer.totalUsd }}</td>
            <td class="pl-4 py-3 text-center">-</td>
          </tr>
        </tfoot>
      </table>
    </div>
  </div>

  <div class="flex justify-center my-5">
    <p class="dark:text-gray-200">
      Code by
      <a
        target="_blank"
        href="https://twitter.com/webonada"
        class="text-indigo-500 hover:text-indigo-700"
        >@webonada </a
      >/ Powered by
      <a
        href="https://vuejs.org/"
        target="_blank"
        class="text-indigo-500 hover:text-indigo-700"
        >Vuejs</a
      >
    </p>
  </div>
</template>
