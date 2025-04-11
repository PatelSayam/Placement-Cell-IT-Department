"use client"

import { useEffect, useRef } from "react"
import * as echarts from "echarts"

const PlacementChart = () => {
  const chartRef = useRef(null)

  useEffect(() => {
    // Mock data for the chart
    const data = [
      { month: "Jan", placements: 15 },
      { month: "Feb", placements: 20 },
      { month: "Mar", placements: 25 },
      { month: "Apr", placements: 18 },
      { month: "May", placements: 30 },
      { month: "Jun", placements: 22 },
    ]

    // Initialize the chart
    const chart = echarts.init(chartRef.current)

    // Chart options
    const option = {
      tooltip: {
        trigger: "axis",
        formatter: "{b}: {c} placements",
        axisPointer: {
          type: "shadow",
        },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: data.map((item) => item.month),
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
          name: "Placements",
          type: "bar",
          data: data.map((item) => item.placements),
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
  }, [])

  return <div ref={chartRef} className="w-full h-64" />
}

export default PlacementChart
