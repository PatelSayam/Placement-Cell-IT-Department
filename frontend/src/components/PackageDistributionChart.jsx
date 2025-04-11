"use client"

import { useEffect, useRef } from "react"
import * as echarts from "echarts"

const PackageDistributionChart = ({ data }) => {
  const chartRef = useRef(null)

  useEffect(() => {
    // Use provided data or fallback to mock data
    const chartData = data || [
      { range: "3-6 LPA", count: 350 },
      { range: "6-10 LPA", count: 250 },
      { range: "10-15 LPA", count: 120 },
      { range: "15-20 LPA", count: 50 },
      { range: "20+ LPA", count: 30 },
    ]

    // Initialize the chart
    const chart = echarts.init(chartRef.current)

    // Chart options
    const option = {
      tooltip: {
        trigger: "item",
        formatter: "{b}: {c} students ({d}%)",
      },
      legend: {
        bottom: 0,
        left: "center",
        textStyle: {
          color: "#666",
        },
      },
      series: [
        {
          name: "Package Distribution",
          type: "pie",
          radius: ["30%", "70%"],
          center: ["50%", "45%"],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: "#fff",
            borderWidth: 2,
          },
          label: {
            show: true,
            formatter: "{b}: {c}",
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 16,
              fontWeight: "bold",
            },
          },
          data: chartData.map((item, index) => {
            // Generate colors in the indigo-purple spectrum
            const colors = [
              "#6366f1", // indigo-500
              "#8b5cf6", // violet-500
              "#a855f7", // purple-500
              "#d946ef", // fuchsia-500
              "#4f46e5", // indigo-600
            ]

            return {
              value: item.count,
              name: item.range,
              itemStyle: {
                color: colors[index % colors.length],
              },
            }
          }),
        },
      ],
    }

    // Set options and render chart
    chart.setOption(option)

    // Resize chart when window size changes
    const handleResize = () => {
      chart.resize()
    }
    window.addEventListener("resize", handleResize)

    // Clean up
    return () => {
      chart.dispose()
      window.removeEventListener("resize", handleResize)
    }
  }, [data])

  return <div ref={chartRef} className="w-full h-64" />
}

export default PackageDistributionChart
