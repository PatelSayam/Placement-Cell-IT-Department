"use client"

import { useEffect, useRef } from "react"
import * as echarts from "echarts"

const CompanyWisePlacementChart = ({ data }) => {
  const chartRef = useRef(null)

  useEffect(() => {
    // Use provided data or fallback to mock data
    const chartData = data || [
      { company: "Google", count: 15 },
      { company: "Microsoft", count: 18 },
      { company: "Amazon", count: 22 },
      { company: "Infosys", count: 85 },
      { company: "TCS", count: 120 },
      { company: "Wipro", count: 75 },
      { company: "Accenture", count: 65 },
      { company: "Others", count: 400 },
    ]

    // Sort data by count in descending order
    const sortedData = [...chartData].sort((a, b) => b.count - a.count)

    // Take top 7 companies and group the rest as "Others"
    const processedData = sortedData.slice(0, 7)
    if (sortedData.length > 7) {
      const othersCount = sortedData.slice(7).reduce((sum, item) => sum + item.count, 0)
      if (othersCount > 0) {
        processedData.push({ company: "Others", count: othersCount })
      }
    }

    // Initialize the chart
    const chart = echarts.init(chartRef.current)

    // Chart options
    const option = {
      tooltip: {
        trigger: "item",
        formatter: "{b}: {c} students ({d}%)",
      },
      legend: {
        orient: "vertical",
        right: 10,
        top: "center",
        type: "scroll",
        textStyle: {
          color: "#666",
        },
      },
      series: [
        {
          name: "Company Placements",
          type: "pie",
          radius: ["40%", "70%"],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: "#fff",
            borderWidth: 2,
          },
          label: {
            show: false,
            position: "center",
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 16,
              fontWeight: "bold",
            },
          },
          labelLine: {
            show: false,
          },
          data: processedData.map((item, index) => {
            // Generate colors in the indigo-purple spectrum
            const colors = [
              "#6366f1", // indigo-500
              "#8b5cf6", // violet-500
              "#a855f7", // purple-500
              "#d946ef", // fuchsia-500
              "#4f46e5", // indigo-600
              "#7c3aed", // violet-600
              "#9333ea", // purple-600
              "#c026d3", // fuchsia-600
            ]

            return {
              value: item.count,
              name: item.company,
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

export default CompanyWisePlacementChart
