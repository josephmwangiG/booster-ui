
import { ref } from 'vue';

export function useWaterManagementChart(waterManagementData: any) {
  const chartOptions = ref({
    chart: {
      type: 'donut',
      height: 350,
    },
    labels: ['Bills', 'Collections', 'Deliveries'],
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 200
        },
        legend: {
          position: 'bottom'
        }
      }
    }]
  });

  const chartSeries = ref([
    waterManagementData.clientBills?.total_amount || 0,
    waterManagementData.collections?.total_amount || 0,
    waterManagementData.deliveries?.total_amount || 0
  ]);

  return {
    chartOptions,
    chartSeries,
  };
}
