import { theme } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import moment from "moment";

const Chart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export function ChartLineDashboard({ vendas }) {
  const options: ApexCharts.ApexOptions = {
    chart: {
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
      foreColor: theme.colors.gray[500],
    },
    grid: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      enabled: false,
    },
    xaxis: {
      type: "datetime",
      axisBorder: {
        color: theme.colors.gray[600],
      },
      axisTicks: {
        color: theme.colors.gray[600],
      },
      categories: vendas.map((d) =>
        moment(d["dataVenda"]).format("YYYY-MM-DD")
      ),
    },
    fill: {
      opacity: 0.3,
      type: "gradient",
      gradient: {
        shade: "dart",
        opacityFrom: 0.7,
        opacityTo: 0.3,
      },
    },
  };

  const series = [
    {
      name: "vendas",
      data: vendas.map((c) => c["count"]),
    },
  ];

  return <Chart options={options} series={series} type="area" height={160} />;
}
