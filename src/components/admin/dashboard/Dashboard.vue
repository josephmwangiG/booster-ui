<template>
    <AdminDashboard v-if="authStore.user.type === 'admin'" />
    <div v-else class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <!-- Premium Navigation -->
      <nav class="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center h-16">
            <div class="flex items-center space-x-4">
              <div class="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <BarChart3 class="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 class="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Dashboard
                </h1>
              </div>
            </div>
            <div class="flex items-center space-x-4">
              <div class="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </nav>
  
      <!-- Main Content -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Enhanced Breadcrumb -->
        <div class="mb-8 animate-fade-in">
          <div class="flex items-center space-x-2 text-sm text-gray-500 mb-2">
            <span class="text-gray-400">Home</span>
            <span class="text-gray-300">></span>
            <span class="text-gray-900 font-medium">Dashboard</span>
          </div>
          <h2 class="text-3xl font-bold text-gray-900">Welcome back!</h2>
          <p class="text-gray-600 mt-1">Here's what's happening with your business today.</p>
        </div>
  
        <!-- Premium Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div class="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 animate-slide-in-up">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">Total Orders</p>
                <p class="text-3xl font-bold text-gray-900 mt-2">{{ chartStats.totalOrders }}</p>
                <div class="flex items-center mt-2 text-green-600">
                  <TrendingUp class="w-4 h-4 mr-1" />
                  <span class="text-sm font-medium">+12.5%</span>
                </div>
              </div>
              <div class="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Package class="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
  
          <div class="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 animate-slide-in-up delay-100">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">Unique Products</p>
                <p class="text-3xl font-bold text-gray-900 mt-2">{{ chartStats.uniqueProducts }}</p>
                <div class="flex items-center mt-2 text-green-600">
                  <TrendingUp class="w-4 h-4 mr-1" />
                  <span class="text-sm font-medium">+8.2%</span>
                </div>
              </div>
              <div class="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <BarChart3 class="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
  
          <div class="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 animate-slide-in-up delay-200">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">Total Revenue</p>
                <p class="text-3xl font-bold text-gray-900 mt-2">{{ formatAmount(chartStats.totalRevenue) }}</p>
                <div class="flex items-center mt-2 text-green-600">
                  <TrendingUp class="w-4 h-4 mr-1" />
                  <span class="text-sm font-medium">+23.1%</span>
                </div>
              </div>
              <div class="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
                <DollarSign class="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>
  
        <!-- Main Dashboard Grid -->
        <div class="grid lg:grid-cols-3 grid-cols-1 gap-8">
          <!-- Product Summary -->
          <div class="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50 shadow-lg animate-slide-in-left">
            <div class="flex justify-between items-center mb-8">
              <h3 class="text-xl font-bold text-gray-900">Products Summary</h3>
              <button class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <MoreVertical class="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div v-if="series.length > 0 && series.some(v => v > 0)" class="space-y-6">
              <!-- Enhanced ApexChart -->
              <div class="chart-container animate-scale-in">
                <apexchart
                  type="donut"
                  class="w-full"
                  :options="enhancedChartOptions"
                  :series="series"
                  height="250"
                />
              </div>
              
              <!-- Chart Legend -->
              <div class="space-y-3">
                <div 
                  v-for="(item, index) in chartLegend" 
                  :key="index"
                  class="flex items-center justify-between animate-fade-in-up"
                  :style="{ animationDelay: `${index * 100}ms` }"
                >
                  <div class="flex items-center space-x-3">
                    <div :class="`w-3 h-3 rounded-full ${item.color}`"></div>
                    <span class="text-sm font-medium text-gray-700">{{ item.label }}</span>
                  </div>
                  <span class="text-sm font-bold text-gray-900">{{ item.value }}</span>
                </div>
              </div>
            </div>
            
            <div v-else class="text-center py-12 text-gray-400">
              <BarChart3 class="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p class="text-sm">No data available</p>
            </div>
          </div>
  
          <!-- Enhanced Orders Report -->
          <div class="lg:col-span-2 bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50 shadow-lg animate-slide-in-right">
            <div class="flex justify-between items-center mb-6">
              <div>
                <h3 class="text-xl font-bold text-gray-900">Orders Report</h3>
                <p class="text-gray-500 text-sm mt-1">
                  Total {{ (reportsStore.dashboardReports?.orders || []).length }} recent orders
                </p>
              </div>
              <button class="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 hover:scale-105 text-sm font-medium">
                View All
              </button>
            </div>
            
            <div class="overflow-hidden rounded-xl border border-gray-200/50">
              <div class="overflow-x-auto">
                <table class="w-full">
                  <thead class="bg-gray-50/50">
                    <tr>
                      <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Item</th>
                      <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Order ID</th>
                      <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date Sold</th>
                      <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Price</th>
                      <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-200/50">
                    <tr
                      v-for="(item, index) in (toRaw(reportsStore.dashboardReports.orders) || [])"
                      :key="index"
                      class="hover:bg-gray-50/50 transition-colors duration-150 animate-fade-in-up"
                      :style="{ animationDelay: `${index * 50}ms` }"
                    >
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="flex items-center space-x-3">
                          <div class="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                            <Package class="w-4 h-4 text-white" />
                          </div>
                          <span class="text-sm font-medium text-gray-900">{{ item.category || '-' }}</span>
                        </div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span class="text-sm text-gray-600 font-mono">{{ item.order_number || '-' }}</span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="flex items-center space-x-2">
                          <Calendar class="w-4 h-4 text-gray-400" />
                          <span class="text-sm text-gray-600">{{ formatDate(item.created_at) }}</span>
                        </div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span class="text-sm font-semibold text-gray-900">{{ formatAmount(item.total) }}</span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="flex items-center space-x-2">
                          <button class="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 hover:scale-110">
                            <Eye class="w-4 h-4" />
                          </button>
                          <button class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-all duration-200 hover:scale-110">
                            <MoreVertical class="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Loading Overlay -->
      <Transition name="fade">
        <div v-if="isLoading" class="fixed inset-0 bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center z-50">
          <div class="text-center">
            <div class="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p class="text-gray-600 font-medium">Loading your dashboard...</p>
          </div>
        </div>
      </Transition>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, computed } from "vue";
  import { useAuthStore } from "@/store/auth.store";
  import { useReportsStore } from "@/store/report.store";
  import { formatAmount } from "@/composables/helper_functions";
  import { formatDate } from "@/composables/dataTables";
  import AdminDashboard from "./AdminDashboard.vue";
  import { toRaw } from "vue";
  import VueApexCharts from "vue3-apexcharts";
  import { 
    BarChart3, 
    TrendingUp, 
    Package, 
    DollarSign, 
    Calendar, 
    Eye, 
    MoreVertical 
  } from "lucide-vue-next";
  
  const authStore = useAuthStore();
  const reportsStore = useReportsStore();
  const isLoading = ref(true);
  
  // Enhanced chart state
  const series = ref<number[]>([]);
  const enhancedChartOptions = ref<any>({
    chart: { 
      type: "donut",
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 1200,
        animateGradually: {
          enabled: true,
          delay: 200
        },
        dynamicAnimation: {
          enabled: true,
          speed: 800
        }
      },
      dropShadow: {
        enabled: true,
        color: '#000',
        top: 18,
        left: 7,
        blur: 10,
        opacity: 0.1
      }
    },
    labels: ["Orders", "Unique Products", "Revenue (K)"],
    colors: ['#3b82f6', '#10b981', '#f59e0b'],
    dataLabels: {
      enabled: true,
      formatter: function (val: any, opts: any) {
        return series.value[opts.seriesIndex];
      },
      dropShadow: { enabled: false },
      style: {
        fontSize: '14px',
        fontFamily: 'Inter, sans-serif',
        fontWeight: 'bold'
      }
    },
    plotOptions: {
      pie: {
        donut: {
          size: '70%',
          labels: {
            show: true,
            total: {
              show: true,
              showAlways: true,
              label: 'Total',
              fontSize: '16px',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 600,
              color: '#1f2937',
              formatter: function (w: any) {
                return w.globals.seriesTotals.reduce((a: number, b: number) => a + b, 0);
              }
            }
          }
        }
      }
    },
    legend: {
      show: false
    },
    stroke: {
      width: 0
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 200
        }
      }
    }]
  });
  
  // Computed properties for enhanced stats
  const chartStats = computed(() => {
    const rawOrders = toRaw(reportsStore.dashboardReports?.orders) || [];
    return {
      totalOrders: rawOrders.length,
      totalRevenue: rawOrders.reduce((acc: number, order: any) => acc + (parseFloat(order.total) || 0), 0),
      uniqueProducts: new Set(rawOrders.map((o: any) => o.product_id || o.category)).size
    };
  });
  
  const chartLegend = computed(() => [
    { label: 'Orders', value: chartStats.value.totalOrders, color: 'bg-blue-500' },
    { label: 'Products', value: chartStats.value.uniqueProducts, color: 'bg-green-500' },
    { label: 'Revenue (K)', value: Math.floor(chartStats.value.totalRevenue / 1000), color: 'bg-amber-500' }
  ]);
  
  onMounted(async () => {
    if (authStore.user.type !== "admin") {
      try {
        await reportsStore.getVendorDashboardReports();
        
        // Update chart series with enhanced data
        series.value = [
          chartStats.value.totalOrders,
          chartStats.value.uniqueProducts,
          Math.floor(chartStats.value.totalRevenue / 1000) // Convert to thousands
        ];
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        // Add a slight delay for smooth loading animation
        setTimeout(() => {
          isLoading.value = false;
        }, 800);
      }
    } else {
      isLoading.value = false;
    }
  });
  </script>
  
  <script lang="ts">
  export default {
    components: {
      apexchart: VueApexCharts,
      BarChart3,
      TrendingUp,
      Package,
      DollarSign,
      Calendar,
      Eye,
      MoreVertical
    },
  };
  </script>
  
  <style scoped>
  /* Enhanced Animations */
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  @keyframes slideInUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  @keyframes slideInLeft {
    from { opacity: 0; transform: translateX(-30px); }
    to { opacity: 1; transform: translateX(0); }
  }
  
  @keyframes slideInRight {
    from { opacity: 0; transform: translateX(30px); }
    to { opacity: 1; transform: translateX(0); }
  }
  
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  @keyframes scaleIn {
    from { opacity: 0; transform: scale(0.9); }
    to { opacity: 1; transform: scale(1); }
  }
  
  .animate-fade-in {
    animation: fadeIn 0.6s ease-out;
  }
  
  .animate-slide-in-up {
    animation: slideInUp 0.6s ease-out;
  }
  
  .animate-slide-in-left {
    animation: slideInLeft 0.8s ease-out;
  }
  
  .animate-slide-in-right {
    animation: slideInRight 0.8s ease-out;
  }
  
  .animate-fade-in-up {
    animation: fadeInUp 0.4s ease-out;
    animation-fill-mode: both;
  }
  
  .animate-scale-in {
    animation: scaleIn 0.8s ease-out;
  }
  
  /* Animation Delays */
  .delay-100 { animation-delay: 100ms; }
  .delay-200 { animation-delay: 200ms; }
  .delay-300 { animation-delay: 300ms; }
  
  /* Transition for loading overlay */
  .fade-enter-active, .fade-leave-active {
    transition: opacity 0.5s ease;
  }
  .fade-enter-from, .fade-leave-to {
    opacity: 0;
  }
  
  /* Enhanced hover effects */
  .hover\:scale-105:hover {
    transform: scale(1.05);
  }
  
  .hover\:scale-110:hover {
    transform: scale(1.1);
  }
  
  /* Backdrop blur support for older browsers */
  .backdrop-blur-sm {
    backdrop-filter: blur(4px);
  }
  
  .backdrop-blur-lg {
    backdrop-filter: blur(16px);
  }
  
  /* Glass morphism effect */
  .bg-white\/70 {
    background-color: rgba(255, 255, 255, 0.7);
  }
  
  .bg-white\/80 {
    background-color: rgba(255, 255, 255, 0.8);
  }
  
  /* Custom gradient text */
  .bg-clip-text {
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  
  /* Chart container styling */
  .chart-container {
    position: relative;
    overflow: hidden;
    border-radius: 1rem;
  }
  </style>