import { theme } from "@chakra-ui/react";
import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export function ChartBarDashboard({ dados }) {
  const options: ApexCharts.ApexOptions = {
    series: [
      {
        data: [400, 430, 448, 470, 540, 580, 690, 1100, 1200, 1380],
      },
    ],
    chart: {
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
      foreColor: theme.colors.gray[500],
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        horizontal: true,
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: dados.map((c) => c["descricao"]),
    },
  };

  const series = [
    {
      name: "quantidadeVendida",
      data: dados.map((c) => c.count),
    },
  ];

  return <Chart options={options} series={series} type="bar" height={160} />;
}
