import { theme} from "@chakra-ui/react";
import dynamic from "next/dynamic";

const Chart = dynamic(() => import('react-apexcharts'), {
    ssr: false,
});

const options: ApexCharts.ApexOptions = {
    series: [{
    data: [400, 430, 448, 470, 540, 580, 690, 1100, 1200, 1380]
  }],
  chart: {
    toolbar: {
        show: false
    },
    zoom: {
        enabled: false
    },
    foreColor: theme.colors.gray[500]
  },      
  plotOptions: {
    bar: {
      borderRadius: 4,
      horizontal: true,
    }
  },
  dataLabels: {
    enabled: false
  },
  xaxis: {
    categories: ["Item 1", "Item 2", "Item 3", "Item 4", "Item 5", "Item 6", "Item 7", "Item 8"
    ],
  }
};

const series = [
    {
        name: 'series1', data: [31, 120, 10, 28, 51, 18, 109]
    }
];

export function ChartBarDashboard() {
    return (
        <Chart options={options} series={series} type="bar" height={160}/>
    )
}