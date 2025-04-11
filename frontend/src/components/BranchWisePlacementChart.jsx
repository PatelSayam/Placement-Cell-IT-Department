"use client"

import { useEffect, useRef } from "react"
import * as echarts from "echarts"

const BranchWisePlacementChart = ({ data }) => {
  const chartRef = useRef(null)

  useEffect(() => {
    // Use provided data or fallback to mock data
    const chartData = data || [
      { branch: "Computer Science", placed: 250, total: 280 },
      { branch: "Information Technology", placed: 180, total: 200 },
      { branch: "Electronics", placed: 150, total: 180 },
      { branch: "Electrical", placed: 90, total: 120 },
      { branch: "Mechanical", placed: 70, total: 100 },
      { branch: "Civil", placed: 40, total: 70 },
      { branch: "Chemical", placed: 20, total: 50 },
    ]

    // Calculate placement rates
    const placementRates = chartData.map((item) => ({
      branch: item.branch,
      rate: Math.round((item.placed / item.total) * 100),
      placed: item.placed,
      total: item.total,
    }))

    // Sort by placement rate in descending order
    placementRates.sort((a, b) => b.rate - a.rate)

    // Initialize the chart
    const chart = echarts.init(chartRef.current)

    // Chart options
    const option = {
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
        formatter: (params) => {
          const data = placementRates.find((item) => item.branch === params[0].name)
          return `${params[0].name}<br/>
                  Placement Rate: ${params[0].value}%<br/>
                  Placed: ${data.placed} / ${data.total} students`
        },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: {
        type: "value",
        max: 100,
        axisLabel: {
          formatter: "{value}%",
          color: "#666",
        },
        axisLine: {
          lineStyle: {
            color: "#ddd",
          },
        },
        splitLine: {
          lineStyle: {
            color: "#f0f0f0",
          },
        },
      },
      yAxis: {
        type: "category",
        data: placementRates.map((item) => item.branch),
        axisLabel: {
          color: "#666",
        },
        axisLine: {
          lineStyle: {
            color: "#ddd",
          },
        },
      },
      series: [
        {
          name: "Placement Rate",
          type: "bar",
          data: placementRates.map((item) => item.rate),
          itemStyle: {
            color: (params) => {
              // Create a gradient based on the value
              const value = params.value
              if (value >= 90) {
                return "#4f46e5" // indigo-600
              } else if (value >= 80) {
                return "#6366f1" // indigo-500
              } else if (value >= 70) {
                return "#8b5cf6" // violet-500
              } else if (value >= 60) {
                return "#a855f7" // purple-500
              } else {
                return "#d946ef" // fuchsia-500
              }
            },
            borderRadius: [0, 4, 4, 0],
          },
          label: {
            show: true,
            position: "right",
            formatter: "{c}%",
            color: "#666",
          },
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

export default BranchWisePlacementChart
