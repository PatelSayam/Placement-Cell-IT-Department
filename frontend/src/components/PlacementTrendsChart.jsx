"use client"

import { useEffect, useRef } from "react"
import * as echarts from "echarts"

const PlacementTrendsChart = ({ data }) => {
  const chartRef = useRef(null)

  useEffect(() => {
    // Use provided data or fallback to mock data
    const chartData = data || [
      { year: "2019", placed: 650, total: 800 },
      { year: "2020", placed: 680, total: 850 },
      { year: "2021", placed: 720, total: 900 },
      { year: "2022", placed: 750, total: 950 },
      { year: "2023", placed: 800, total: 1000 },
    ]

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
          const placed = params[0].value
          const total = params[1].value
          const placementRate = ((placed / total) * 100).toFixed(1)
          return `${params[0].name}<br/>
                  Placed: ${placed} students<br/>
                  Total: ${total} students<br/>
                  Placement Rate: ${placementRate}%`
        },
      },
      legend: {
        data: ["Placed", "Total"],
        bottom: 0,
        textStyle: {
          color: "#666",
        },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "15%",
        top: "3%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: chartData.map((item) => item.year),
        axisLine: {
          lineStyle: {
            color: "#ddd",
          },
        },
        axisLabel: {
          color: "#666",
        },
      },
      yAxis: {
        type: "value",
        axisLine: {
          show: false,
        },
        axisLabel: {
          color: "#666",
        },
        splitLine: {
          lineStyle: {
            color: "#f0f0f0",
          },
        },
      },
      series: [
        {
          name: "Placed",
          type: "bar",
          data: chartData.map((item) => item.placed),
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "#6366f1" }, // indigo-500
              { offset: 1, color: "#a855f7" }, // purple-500
            ]),
            borderRadius: [5, 5, 0, 0],
          },
          emphasis: {
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: "#4f46e5" }, // indigo-600
                { offset: 1, color: "#9333ea" }, // purple-600
              ]),
            },
          },
          z: 10,
        },
        {
          name: "Total",
          type: "bar",
          data: chartData.map((item) => item.total),
          itemStyle: {
            color: "#f3f4f6", // gray-100
            borderRadius: [5, 5, 0, 0],
          },
          z: 5,
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

export default PlacementTrendsChart
