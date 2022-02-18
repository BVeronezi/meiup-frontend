import { theme } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import moment from "moment";
import { useEffect, useState } from "react";

const Chart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export function ChartLineDashboard({ vendas }) {
  const [categories, setCategories] = useState([]);
  const [data, setData] = useState([]);

  useEffect(() => {
    setCategories(
      vendas.map((d) => moment(d["dataVenda"]).format("YYYY-MM-DD"))
    );
    setData(vendas.map((c) => c["count"]));
  }, []);

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
      categories: categories,
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
      data: data,
    },
  ];

  return <Chart options={options} series={series} type="area" height={160} />;
}
