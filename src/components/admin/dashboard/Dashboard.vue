<template>
  <div class="content">
    <div class="top-section">
      <div class="bread-crumb">
        <h5 class="font-semibold">Dashboard</h5>
        <span class="text-sm">
          <span class="text-gray-400">Home ></span> Dashboard
        </span>
      </div>
    </div>
    <div class="mt-5">
      <div class="overflow-auto">
        <div class="grid lg:grid-cols-3 grid-cols-1 lg:gap-6">
          <div class="col-span-1 space-y-6 p-6 mt-6 bg-white">
            <div class="flex justify-between">
              <h4 class="font-semibold">Products Summary</h4>
            </div>
            <div id="chart">
              <apexchart
                type="donut"
                class="w-full"
                :options="options"
                :series="series"
              ></apexchart>
            </div>
          </div>
          <div class="col-span-2 space-y-6 p-6 mt-6 bg-white">
            <h4>Orders Report</h4>
            <span class="text-gray-400 text-sm">
              Total 2,356 Items in the sold
            </span>
            <div class="w-full overflow-x-auto">
              <table class="w-full">
                <thead>
                  <tr>
                    <th
                      class="p-3 font-semibold whitespace-nowrap tracking-wide text-left"
                    >
                      Item
                    </th>
                    <th
                      class="p-3 font-semibold whitespace-nowrap tracking-wide text-left"
                    >
                      Product ID
                    </th>
                    <th
                      class="p-3 font-semibold whitespace-nowrap tracking-wide text-left"
                    >
                      Date Sold
                    </th>
                    <th
                      class="p-3 font-semibold whitespace-nowrap tracking-wide text-left"
                    >
                      Price
                    </th>
                    <th
                      class="p-3 font-semibold whitespace-nowrap tracking-wide text-left"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                  <tr
                    v-for="(item, index) in items"
                    :key="index"
                    :class="index % 2 != 0 ? 'bg-gray-50' : ''"
                  >
                    <td
                      class="px-3 py-2 whitespace-nowrap text-[13px] text-gray-500"
                    >
                      {{ item.item }}
                    </td>
                    <td
                      class="px-3 py-2 whitespace-nowrap text-[13px] text-gray-500"
                    >
                      {{ item.product }}
                    </td>
                    <td
                      class="px-3 py-2 whitespace-nowrap text-[13px] text-gray-500"
                    >
                      {{ item.date }}
                    </td>
                    <td
                      class="px-3 py-2 whitespace-nowrap text-[13px] text-gray-500"
                    >
                      {{ item.price }}
                    </td>
                    <td
                      class="px-3 py-2 whitespace-nowrap text-[13px] text-gray-500"
                    >
                      Actions
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/store/auth.store";

const store = useAuthStore();

const series = [store.user.vendor.stores_count, store.user.vendor.products_count, store.user.vendor.brands_count]


var options = {
  chart: {
    type: "donut",
  },
  labels: ['Stores ' + store.user.vendor.stores_count, 'Products ' + store.user.vendor.products_count, 'Brands ' + store.user.vendor.brands_count],
  dataLabels: {
    enabled: true,
    formatter: function (_val: any, opts: any) {
      // opts.series[opts.seriesIndex] gives the count for the respective category
      return series[opts.seriesIndex]
    },
    dropShadow: {
      enabled: false
    }
  },
};



const items = [
  {
    item: "Macbook Air",
    product: "#XGY-356",
    date: "02 Apr, 2023",
    price: "$1,230",
  },
  {
    item: "Macbook Air",
    product: "#XGY-356",
    date: "02 Apr, 2023",
    price: "$1,230",
  },
  {
    item: "Macbook Air",
    product: "#XGY-356",
    date: "02 Apr, 2023",
    price: "$1,230",
  },
  {
    item: "Macbook Air",
    product: "#XGY-356",
    date: "02 Apr, 2023",
    price: "$1,230",
  },
  {
    item: "Macbook Air",
    product: "#XGY-356",
    date: "02 Apr, 2023",
    price: "$1,230",
  },
  {
    item: "Macbook Air",
    product: "#XGY-356",
    date: "02 Apr, 2023",
    price: "$1,230",
  },

  {
    item: "Macbook Air",
    product: "#XGY-356",
    date: "02 Apr, 2023",
    price: "$1,230",
  },
];
</script>

<style></style>
