import { theme} from "@chakra-ui/react";
import dynamic from "next/dynamic";

const Chart = dynamic(() => import('react-apexcharts'), {
    ssr: false,
});

const options: ApexCharts.ApexOptions = {
    chart: {
        toolbar: {
            show: false
        },
        zoom: {
            enabled: false
        },
        foreColor: theme.colors.gray[500]
    },
    grid: {
        show: false
    },
    dataLabels: {
        enabled: false
    },
    tooltip: {
        enabled: false
    },
    xaxis: {
        type: 'datetime',
        axisBorder: {
            color: theme.colors.gray[600]
        },
        axisTicks: {
            color: theme.colors.gray[600]
        },
        categories: [
            '2021-07-2T000:00:00.000Z',
            '2021-07-11T000:00:00.000Z',
            '2021-07-17T000:00:00.000Z',
            '2021-07-20T000:00:00.000Z',
            '2021-07-27T000:00:00.000Z',
            '2021-07-30T000:00:00.000Z',
            '2021-08-2T000:00:00.000Z',
        ]
    },
    fill: {
        opacity: 0.3,
        type: 'gradient', 
        gradient: {
            shade: 'dart', 
            opacityFrom: 0.7,
            opacityTo: 0.3
        }
    }
};

const series = [
    {
        name: 'series1', data: [31, 120, 10, 28, 51, 18, 109]
    }
];

export function ChartLineDashboard() {
    return (
        <Chart options={options} series={series} type="area" height={160}/>
    )
}