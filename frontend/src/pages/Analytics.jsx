"use client"

import { useState } from "react"
import * as XLSX from "xlsx"
import PlacementTrendsChart from "../components/PlacementTrendsChart"
import CompanyWisePlacementChart from "../components/CompanyWisePlacementChart"
import BranchWisePlacementChart from "../components/BranchWisePlacementChart"
import PackageDistributionChart from "../components/PackageDistributionChart"
import AnalyticsSummaryCard from "../components/AnalyticsSummaryCard"

// Mock data for analytics
const placementTrendsData = [
  { year: "2019", placed: 650, total: 800 },
  { year: "2020", placed: 680, total: 850 },
  { year: "2021", placed: 720, total: 900 },
  { year: "2022", placed: 750, total: 950 },
  { year: "2023", placed: 800, total: 1000 },
]

const companyWisePlacementData = [
  { company: "Google", count: 15 },
  { company: "Microsoft", count: 18 },
  { company: "Amazon", count: 22 },
  { company: "Infosys", count: 85 },
  { company: "TCS", count: 120 },
  { company: "Wipro", count: 75 },
  { company: "Accenture", count: 65 },
  { company: "Others", count: 400 },
]

const branchWisePlacementData = [
  { branch: "Computer Science", placed: 250, total: 280 },
  { branch: "Information Technology", placed: 180, total: 200 },
  { branch: "Electronics", placed: 150, total: 180 },
  { branch: "Electrical", placed: 90, total: 120 },
  { branch: "Mechanical", placed: 70, total: 100 },
  { branch: "Civil", placed: 40, total: 70 },
  { branch: "Chemical", placed: 20, total: 50 },
]

const packageDistributionData = [
  { range: "3-6 LPA", count: 350 },
  { range: "6-10 LPA", count: 250 },
  { range: "10-15 LPA", count: 120 },
  { range: "15-20 LPA", count: 50 },
  { range: "20+ LPA", count: 30 },
]

const analyticsSummary = [
  {
    title: "Placement Rate",
    value: "80%",
    change: "+5%",
    isPositive: true,
    description: "Overall placement rate for the current year",
  },
  {
    title: "Average Package",
    value: "8.5 LPA",
    change: "+1.2 LPA",
    isPositive: true,
    description: "Average package offered to students",
  },
  {
    title: "Highest Package",
    value: "45 LPA",
    change: "+7 LPA",
    isPositive: true,
    description: "Highest package offered this year",
  },
  {
    title: "Companies Visited",
    value: "42",
    change: "+8",
    isPositive: true,
    description: "Total companies that visited for recruitment",
  },
]

// Additional detailed data for reports
const topPerformingStudentsData = [
  { name: "Rahul Sharma", branch: "Computer Science", package: "45 LPA", company: "Google", cgpa: "9.8" },
  { name: "Priya Patel", branch: "Computer Science", package: "42 LPA", company: "Microsoft", cgpa: "9.7" },
  { name: "Amit Kumar", branch: "Information Technology", package: "40 LPA", company: "Amazon", cgpa: "9.6" },
  { name: "Sneha Gupta", branch: "Computer Science", package: "38 LPA", company: "Facebook", cgpa: "9.5" },
  { name: "Vikram Singh", branch: "Electronics", package: "35 LPA", company: "Apple", cgpa: "9.4" },
]

const companyDetailsData = [
  {
    company: "Google",
    industry: "Technology",
    roles: ["Software Engineer", "Product Manager", "Data Scientist"],
    avgPackage: "40 LPA",
    eligibility: "CGPA > 8.5, No active backlogs",
    process: "Online test, Technical interviews (2 rounds), HR interview",
  },
  {
    company: "Microsoft",
    industry: "Technology",
    roles: ["Software Engineer", "Program Manager", "UX Designer"],
    avgPackage: "38 LPA",
    eligibility: "CGPA > 8.0, No active backlogs",
    process: "Online coding test, Technical interviews (3 rounds), HR interview",
  },
  {
    company: "Amazon",
    industry: "Technology",
    roles: ["SDE", "Business Analyst", "Operations Manager"],
    avgPackage: "36 LPA",
    eligibility: "CGPA > 7.5, No active backlogs",
    process: "Online assessment, Technical interviews (4 rounds), Bar raiser interview",
  },
  {
    company: "TCS",
    industry: "IT Services",
    roles: ["System Engineer", "Assistant System Engineer"],
    avgPackage: "7 LPA",
    eligibility: "CGPA > 6.0, No more than 1 active backlog",
    process: "TCS NQT, Technical interview, HR interview",
  },
  {
    company: "Infosys",
    industry: "IT Services",
    roles: ["Systems Engineer", "Digital Specialist Engineer"],
    avgPackage: "8 LPA",
    eligibility: "CGPA > 6.0, No active backlogs",
    process: "InfyTQ assessment, Technical interview, HR interview",
  },
]

const yearWiseComparisonData = [
  {
    metric: "Placement Rate",
    2019: "81.25%",
    2020: "80.00%",
    2021: "80.00%",
    2022: "78.95%",
    2023: "80.00%",
    trend: "Stable with slight fluctuations",
  },
  {
    metric: "Average Package",
    2019: "6.2 LPA",
    2020: "6.8 LPA",
    2021: "7.3 LPA",
    2022: "7.8 LPA",
    2023: "8.5 LPA",
    trend: "Consistently increasing",
  },
  {
    metric: "Highest Package",
    2019: "32 LPA",
    2020: "35 LPA",
    2021: "38 LPA",
    2022: "40 LPA",
    2023: "45 LPA",
    trend: "Consistently increasing",
  },
  {
    metric: "Companies Visited",
    2019: "28",
    2020: "32",
    2021: "35",
    2022: "38",
    2023: "42",
    trend: "Consistently increasing",
  },
  {
    metric: "Students Eligible",
    2019: "780",
    2020: "820",
    2021: "870",
    2022: "920",
    2023: "980",
    trend: "Consistently increasing",
  },
]

const Analytics = () => {
  const [year, setYear] = useState("2023")
  const [exportLoading, setExportLoading] = useState(false)

  // Helper function to create styled headers in Excel
  const createStyledWorksheet = (data, headers) => {
    // Create the worksheet from data
    const worksheet = XLSX.utils.json_to_sheet(data)

    // Set column widths
    const colWidths = headers.map((h) => ({ wch: Math.max(h.length * 1.5, 12) }))
    worksheet["!cols"] = colWidths

    return worksheet
  }

  // Function to export all analytics data to Excel with enhanced formatting
  const exportToExcel = async () => {
    setExportLoading(true)
    try {
      // Create a new workbook
      const workbook = XLSX.utils.book_new()

      // 1. Executive Summary Worksheet
      const executiveSummaryData = [
        {
          "Report Type": "Placement Analytics Executive Summary",
          "Academic Year": year,
          "Generated On": new Date().toLocaleString(),
          "Generated By": "Placement Management System",
        },
        {},
        { "Key Metrics": "Value", "Change from Previous Year": "", Notes: "" },
        ...analyticsSummary.map((item) => ({
          "Key Metrics": item.title,
          Value: item.value,
          "Change from Previous Year": item.change,
          Notes: item.description,
        })),
      ]

      const executiveSummaryWorksheet = XLSX.utils.json_to_sheet(executiveSummaryData, { skipHeader: true })
      XLSX.utils.book_append_sheet(workbook, executiveSummaryWorksheet, "Executive Summary")

      // 2. Placement Trends Worksheet with calculated metrics
      const enhancedPlacementTrends = placementTrendsData.map((item) => ({
        Year: item.year,
        "Placed Students": item.placed,
        "Total Students": item.total,
        "Placement Rate": `${((item.placed / item.total) * 100).toFixed(2)}%`,
        "Unplaced Students": item.total - item.placed,
        "Unplaced Rate": `${(((item.total - item.placed) / item.total) * 100).toFixed(2)}%`,
        "Year-over-Year Growth in Placements":
          placementTrendsData.indexOf(item) > 0
            ? `${(((item.placed - placementTrendsData[placementTrendsData.indexOf(item) - 1].placed) / placementTrendsData[placementTrendsData.indexOf(item) - 1].placed) * 100).toFixed(2)}%`
            : "N/A",
      }))

      const placementTrendsWorksheet = createStyledWorksheet(enhancedPlacementTrends, [
        "Year",
        "Placed Students",
        "Total Students",
        "Placement Rate",
        "Unplaced Students",
        "Unplaced Rate",
        "Year-over-Year Growth in Placements",
      ])
      XLSX.utils.book_append_sheet(workbook, placementTrendsWorksheet, "Placement Trends")

      // 3. Company-wise Placement Worksheet with calculated metrics
      const totalPlaced = companyWisePlacementData.reduce((sum, item) => sum + item.count, 0)
      const enhancedCompanyData = companyWisePlacementData.map((item) => ({
        Company: item.company,
        "Students Placed": item.count,
        "Percentage of Total Placements": `${((item.count / totalPlaced) * 100).toFixed(2)}%`,
        Rank:
          companyWisePlacementData.sort((a, b) => b.count - a.count).findIndex((c) => c.company === item.company) + 1,
      }))

      const companyWorksheet = createStyledWorksheet(enhancedCompanyData, [
        "Company",
        "Students Placed",
        "Percentage of Total Placements",
        "Rank",
      ])
      XLSX.utils.book_append_sheet(workbook, companyWorksheet, "Company Placements")

      // 4. Branch-wise Placement Worksheet with calculated metrics
      const enhancedBranchData = branchWisePlacementData.map((item) => ({
        Branch: item.branch,
        "Students Placed": item.placed,
        "Total Students": item.total,
        "Placement Rate": `${((item.placed / item.total) * 100).toFixed(2)}%`,
        "Unplaced Students": item.total - item.placed,
        "Unplaced Rate": `${(((item.total - item.placed) / item.total) * 100).toFixed(2)}%`,
        "Branch Rank (by placement rate)":
          branchWisePlacementData
            .sort((a, b) => b.placed / b.total - a.placed / a.total)
            .findIndex((b) => b.branch === item.branch) + 1,
      }))

      const branchWorksheet = createStyledWorksheet(enhancedBranchData, [
        "Branch",
        "Students Placed",
        "Total Students",
        "Placement Rate",
        "Unplaced Students",
        "Unplaced Rate",
        "Branch Rank (by placement rate)",
      ])
      XLSX.utils.book_append_sheet(workbook, branchWorksheet, "Branch Placements")

      // 5. Package Distribution Worksheet with calculated metrics
      const totalStudents = packageDistributionData.reduce((sum, item) => sum + item.count, 0)
      const enhancedPackageData = packageDistributionData.map((item) => ({
        "Package Range": item.range,
        "Number of Students": item.count,
        Percentage: `${((item.count / totalStudents) * 100).toFixed(2)}%`,
        "Cumulative Count": packageDistributionData
          .slice(0, packageDistributionData.indexOf(item) + 1)
          .reduce((sum, i) => sum + i.count, 0),
        "Cumulative Percentage": `${(
          (packageDistributionData
            .slice(0, packageDistributionData.indexOf(item) + 1)
            .reduce((sum, i) => sum + i.count, 0) /
            totalStudents) *
            100
        ).toFixed(2)}%`,
      }))

      const packageWorksheet = createStyledWorksheet(enhancedPackageData, [
        "Package Range",
        "Number of Students",
        "Percentage",
        "Cumulative Count",
        "Cumulative Percentage",
      ])
      XLSX.utils.book_append_sheet(workbook, packageWorksheet, "Package Distribution")

      // 6. Year-wise Comparison Worksheet
      const yearComparisonWorksheet = createStyledWorksheet(yearWiseComparisonData, [
        "Metric",
        "2019",
        "2020",
        "2021",
        "2022",
        "2023",
        "Trend",
      ])
      XLSX.utils.book_append_sheet(workbook, yearComparisonWorksheet, "Year Comparison")

      // 7. Top Performing Students Worksheet
      const topStudentsWorksheet = createStyledWorksheet(topPerformingStudentsData, [
        "Name",
        "Branch",
        "Package",
        "Company",
        "CGPA",
      ])
      XLSX.utils.book_append_sheet(workbook, topStudentsWorksheet, "Top Students")

      // 8. Company Details Worksheet
      const companyDetailsFormatted = companyDetailsData.map((item) => ({
        Company: item.company,
        Industry: item.industry,
        "Roles Offered": item.roles.join(", "),
        "Average Package": item.avgPackage,
        "Eligibility Criteria": item.eligibility,
        "Selection Process": item.process,
      }))

      const companyDetailsWorksheet = createStyledWorksheet(companyDetailsFormatted, [
        "Company",
        "Industry",
        "Roles Offered",
        "Average Package",
        "Eligibility Criteria",
        "Selection Process",
      ])
      XLSX.utils.book_append_sheet(workbook, companyDetailsWorksheet, "Company Details")

      // 9. Comprehensive Analysis Worksheet
      // This combines insights from all the data
      const comprehensiveAnalysis = [
        {
          "Analysis Category": "Overall Placement Performance",
          "Key Findings": `The institution achieved a placement rate of 80% in ${year}, with 800 out of 1000 students securing placements.`,
          Insights:
            "This represents a 5% improvement over the previous year, indicating successful placement initiatives.",
          Recommendations:
            "Continue strengthening industry partnerships and focus on improving placement rates in lower-performing branches.",
        },
        {
          "Analysis Category": "Branch Performance",
          "Key Findings": "Computer Science (89.3%) and Information Technology (90%) have the highest placement rates.",
          Insights: "Technical branches consistently outperform non-technical branches in placement statistics.",
          Recommendations:
            "Implement specialized training programs for branches with lower placement rates like Chemical and Civil Engineering.",
        },
        {
          "Analysis Category": "Package Trends",
          "Key Findings": "The average package has increased from 7.8 LPA to 8.5 LPA, a 9% improvement.",
          Insights:
            "Higher packages are primarily driven by increased hiring from tech giants and competitive job market.",
          Recommendations:
            "Focus on upskilling students in high-demand technologies to further improve package offerings.",
        },
        {
          "Analysis Category": "Company Participation",
          "Key Findings":
            "42 companies participated in campus recruitment, an increase of 8 companies from the previous year.",
          Insights: "Diversification of recruiting companies has improved, with more companies from non-IT sectors.",
          Recommendations:
            "Target more companies from emerging sectors like fintech, healthtech, and renewable energy.",
        },
        {
          "Analysis Category": "Student Preparation",
          "Key Findings":
            "Students with industry-relevant projects and internships secured higher packages on average.",
          Insights: "Practical experience significantly impacts placement outcomes and package offers.",
          Recommendations: "Enhance internship opportunities and industry-aligned project work in the curriculum.",
        },
      ]

      const analysisWorksheet = createStyledWorksheet(comprehensiveAnalysis, [
        "Analysis Category",
        "Key Findings",
        "Insights",
        "Recommendations",
      ])
      XLSX.utils.book_append_sheet(workbook, analysisWorksheet, "Comprehensive Analysis")

      // Generate Excel file name with year and current date
      const fileName = `Placement_Analytics_Detailed_Report_${year}_${new Date().toISOString().split("T")[0]}.xlsx`

      // Write the workbook and trigger download
      XLSX.writeFile(workbook, fileName)
    } catch (error) {
      console.error("Error exporting to Excel:", error)
      alert("Failed to export analytics to Excel. Please try again.")
    } finally {
      setExportLoading(false)
    }
  }

  // Function to export specific report with enhanced detail
  const exportReport = (reportType) => {
    setExportLoading(true)
    try {
      // Create a new workbook
      const workbook = XLSX.utils.book_new()
      const fileName = `Placement_${reportType}_Detailed_Report_${year}_${new Date().toISOString().split("T")[0]}.xlsx`

      if (reportType === "Summary") {
        // 1. Executive Summary
        const executiveSummaryData = [
          {
            "Report Type": "Placement Summary Report",
            "Academic Year": year,
            "Generated On": new Date().toLocaleString(),
            "Generated By": "Placement Management System",
          },
          {},
          { "Key Metrics": "Value", "Change from Previous Year": "", Notes: "" },
          ...analyticsSummary.map((item) => ({
            "Key Metrics": item.title,
            Value: item.value,
            "Change from Previous Year": item.change,
            Notes: item.description,
          })),
        ]

        const executiveSummaryWorksheet = XLSX.utils.json_to_sheet(executiveSummaryData, { skipHeader: true })
        XLSX.utils.book_append_sheet(workbook, executiveSummaryWorksheet, "Executive Summary")

        // 2. Placement Trends with calculated metrics
        const enhancedPlacementTrends = placementTrendsData.map((item) => ({
          Year: item.year,
          "Placed Students": item.placed,
          "Total Students": item.total,
          "Placement Rate": `${((item.placed / item.total) * 100).toFixed(2)}%`,
          "Unplaced Students": item.total - item.placed,
          "Unplaced Rate": `${(((item.total - item.placed) / item.total) * 100).toFixed(2)}%`,
          "Year-over-Year Growth in Placements":
            placementTrendsData.indexOf(item) > 0
              ? `${(((item.placed - placementTrendsData[placementTrendsData.indexOf(item) - 1].placed) / placementTrendsData[placementTrendsData.indexOf(item) - 1].placed) * 100).toFixed(2)}%`
              : "N/A",
        }))

        const placementTrendsWorksheet = createStyledWorksheet(enhancedPlacementTrends, [
          "Year",
          "Placed Students",
          "Total Students",
          "Placement Rate",
          "Unplaced Students",
          "Unplaced Rate",
          "Year-over-Year Growth in Placements",
        ])
        XLSX.utils.book_append_sheet(workbook, placementTrendsWorksheet, "Placement Trends")

        // 3. Year-wise Comparison
        const yearComparisonWorksheet = createStyledWorksheet(yearWiseComparisonData, [
          "Metric",
          "2019",
          "2020",
          "2021",
          "2022",
          "2023",
          "Trend",
        ])
        XLSX.utils.book_append_sheet(workbook, yearComparisonWorksheet, "Year Comparison")

        // 4. Comprehensive Analysis
        const summaryAnalysis = [
          {
            "Analysis Category": "Overall Placement Performance",
            "Key Findings": `The institution achieved a placement rate of 80% in ${year}, with 800 out of 1000 students securing placements.`,
            Insights:
              "This represents a 5% improvement over the previous year, indicating successful placement initiatives.",
            Recommendations:
              "Continue strengthening industry partnerships and focus on improving placement rates in lower-performing branches.",
          },
          {
            "Analysis Category": "Year-over-Year Trends",
            "Key Findings": "Consistent improvement in placement rates and average packages over the last 5 years.",
            Insights: "Strategic industry partnerships and curriculum improvements have yielded positive results.",
            Recommendations:
              "Set more ambitious targets for the upcoming placement season based on the positive trend.",
          },
          {
            "Analysis Category": "Placement Efficiency",
            "Key Findings":
              "The time taken from first company visit to achieving 80% placement has reduced by 15 days.",
            Insights:
              "Improved placement cell processes and student preparation have accelerated the placement timeline.",
            Recommendations: "Further streamline the placement process to reduce administrative overhead.",
          },
        ]

        const summaryAnalysisWorksheet = createStyledWorksheet(summaryAnalysis, [
          "Analysis Category",
          "Key Findings",
          "Insights",
          "Recommendations",
        ])
        XLSX.utils.book_append_sheet(workbook, summaryAnalysisWorksheet, "Summary Analysis")
      } else if (reportType === "Company") {
        // 1. Company Overview
        const companyOverviewData = [
          {
            "Report Type": "Company-wise Placement Analysis",
            "Academic Year": year,
            "Generated On": new Date().toLocaleString(),
            "Generated By": "Placement Management System",
          },
          {},
        ]

        const companyOverviewWorksheet = XLSX.utils.json_to_sheet(companyOverviewData, { skipHeader: true })
        XLSX.utils.book_append_sheet(workbook, companyOverviewWorksheet, "Report Overview")

        // 2. Company-wise Placement Data
        const totalPlaced = companyWisePlacementData.reduce((sum, item) => sum + item.count, 0)
        const enhancedCompanyData = companyWisePlacementData.map((item) => ({
          Company: item.company,
          "Students Placed": item.count,
          "Percentage of Total Placements": `${((item.count / totalPlaced) * 100).toFixed(2)}%`,
          Rank:
            companyWisePlacementData.sort((a, b) => b.count - a.count).findIndex((c) => c.company === item.company) + 1,
        }))

        const companyWorksheet = createStyledWorksheet(enhancedCompanyData, [
          "Company",
          "Students Placed",
          "Percentage of Total Placements",
          "Rank",
        ])
        XLSX.utils.book_append_sheet(workbook, companyWorksheet, "Company Placements")

        // 3. Company Details
        const companyDetailsWorksheet = createStyledWorksheet(
          companyDetailsData.map((item) => ({
            Company: item.company,
            Industry: item.industry,
            "Roles Offered": item.roles.join(", "),
            "Average Package": item.avgPackage,
            "Eligibility Criteria": item.eligibility,
            "Selection Process": item.process,
          })),
          ["Company", "Industry", "Roles Offered", "Average Package", "Eligibility Criteria", "Selection Process"],
        )
        XLSX.utils.book_append_sheet(workbook, companyDetailsWorksheet, "Company Details")

        // 4. Industry-wise Analysis
        const industryData = [
          { Industry: "Technology", Companies: 15, "Students Placed": 180, "Average Package": "18.5 LPA" },
          { Industry: "IT Services", Companies: 8, "Students Placed": 320, "Average Package": "7.2 LPA" },
          { Industry: "Finance", Companies: 6, "Students Placed": 85, "Average Package": "12.5 LPA" },
          { Industry: "Manufacturing", Companies: 5, "Students Placed": 65, "Average Package": "8.0 LPA" },
          { Industry: "E-commerce", Companies: 4, "Students Placed": 70, "Average Package": "11.0 LPA" },
          { Industry: "Others", Companies: 4, "Students Placed": 80, "Average Package": "6.5 LPA" },
        ]

        const industryWorksheet = createStyledWorksheet(industryData, [
          "Industry",
          "Companies",
          "Students Placed",
          "Average Package",
        ])
        XLSX.utils.book_append_sheet(workbook, industryWorksheet, "Industry Analysis")

        // 5. Company Analysis
        const companyAnalysis = [
          {
            "Analysis Category": "Top Recruiting Companies",
            "Key Findings": "TCS, Infosys, and Wipro account for 35% of total placements.",
            Insights: "Service-based IT companies continue to be the largest recruiters by volume.",
            Recommendations:
              "Maintain strong relationships with these key recruiters while diversifying the company pool.",
          },
          {
            "Analysis Category": "High-Package Companies",
            "Key Findings": "Google, Microsoft, and Amazon offered the highest packages, ranging from 35-45 LPA.",
            Insights: "These companies have stringent selection criteria and hire a small number of students.",
            Recommendations: "Provide specialized training programs for students targeting these companies.",
          },
          {
            "Analysis Category": "New Companies",
            "Key Findings": "8 new companies participated in campus recruitment this year.",
            Insights: "Outreach efforts to new sectors have been successful in attracting diverse recruiters.",
            Recommendations:
              "Create dedicated engagement strategies for new companies to ensure they return next year.",
          },
          {
            "Analysis Category": "Industry Trends",
            "Key Findings": "Technology and fintech companies increased their hiring by 15% compared to last year.",
            Insights:
              "Growing demand for technical skills in emerging technologies like AI, blockchain, and cloud computing.",
            Recommendations: "Align curriculum and training programs with these high-demand skill areas.",
          },
        ]

        const companyAnalysisWorksheet = createStyledWorksheet(companyAnalysis, [
          "Analysis Category",
          "Key Findings",
          "Insights",
          "Recommendations",
        ])
        XLSX.utils.book_append_sheet(workbook, companyAnalysisWorksheet, "Company Analysis")
      } else if (reportType === "Student") {
        // 1. Student Performance Overview
        const studentOverviewData = [
          {
            "Report Type": "Student Performance Analysis",
            "Academic Year": year,
            "Generated On": new Date().toLocaleString(),
            "Generated By": "Placement Management System",
          },
          {},
        ]

        const studentOverviewWorksheet = XLSX.utils.json_to_sheet(studentOverviewData, { skipHeader: true })
        XLSX.utils.book_append_sheet(workbook, studentOverviewWorksheet, "Report Overview")

        // 2. Branch-wise Placement Data
        const enhancedBranchData = branchWisePlacementData.map((item) => ({
          Branch: item.branch,
          "Students Placed": item.placed,
          "Total Students": item.total,
          "Placement Rate": `${((item.placed / item.total) * 100).toFixed(2)}%`,
          "Unplaced Students": item.total - item.placed,
          "Unplaced Rate": `${(((item.total - item.placed) / item.total) * 100).toFixed(2)}%`,
          "Branch Rank (by placement rate)":
            branchWisePlacementData
              .sort((a, b) => b.placed / b.total - a.placed / a.total)
              .findIndex((b) => b.branch === item.branch) + 1,
        }))

        const branchWorksheet = createStyledWorksheet(enhancedBranchData, [
          "Branch",
          "Students Placed",
          "Total Students",
          "Placement Rate",
          "Unplaced Students",
          "Unplaced Rate",
          "Branch Rank (by placement rate)",
        ])
        XLSX.utils.book_append_sheet(workbook, branchWorksheet, "Branch Placements")

        // 3. Package Distribution Data
        const totalStudents = packageDistributionData.reduce((sum, item) => sum + item.count, 0)
        const enhancedPackageData = packageDistributionData.map((item) => ({
          "Package Range": item.range,
          "Number of Students": item.count,
          Percentage: `${((item.count / totalStudents) * 100).toFixed(2)}%`,
          "Cumulative Count": packageDistributionData
            .slice(0, packageDistributionData.indexOf(item) + 1)
            .reduce((sum, i) => sum + i.count, 0),
          "Cumulative Percentage": `${(
            (packageDistributionData
              .slice(0, packageDistributionData.indexOf(item) + 1)
              .reduce((sum, i) => sum + i.count, 0) /
              totalStudents) *
              100
          ).toFixed(2)}%`,
        }))

        const packageWorksheet = createStyledWorksheet(enhancedPackageData, [
          "Package Range",
          "Number of Students",
          "Percentage",
          "Cumulative Count",
          "Cumulative Percentage",
        ])
        XLSX.utils.book_append_sheet(workbook, packageWorksheet, "Package Distribution")

        // 4. Top Performing Students
        const topStudentsWorksheet = createStyledWorksheet(topPerformingStudentsData, [
          "Name",
          "Branch",
          "Package",
          "Company",
          "CGPA",
        ])
        XLSX.utils.book_append_sheet(workbook, topStudentsWorksheet, "Top Students")

        // 5. CGPA vs Package Analysis
        const cgpaPackageData = [
          {
            "CGPA Range": "9.5 - 10.0",
            "Average Package": "25.8 LPA",
            "Highest Package": "45 LPA",
            "Lowest Package": "12 LPA",
            "Students Count": 42,
          },
          {
            "CGPA Range": "9.0 - 9.49",
            "Average Package": "18.5 LPA",
            "Highest Package": "38 LPA",
            "Lowest Package": "10 LPA",
            "Students Count": 78,
          },
          {
            "CGPA Range": "8.5 - 8.99",
            "Average Package": "12.3 LPA",
            "Highest Package": "28 LPA",
            "Lowest Package": "7 LPA",
            "Students Count": 125,
          },
          {
            "CGPA Range": "8.0 - 8.49",
            "Average Package": "9.5 LPA",
            "Highest Package": "18 LPA",
            "Lowest Package": "6 LPA",
            "Students Count": 180,
          },
          {
            "CGPA Range": "7.5 - 7.99",
            "Average Package": "7.8 LPA",
            "Highest Package": "12 LPA",
            "Lowest Package": "5 LPA",
            "Students Count": 210,
          },
          {
            "CGPA Range": "7.0 - 7.49",
            "Average Package": "6.5 LPA",
            "Highest Package": "9 LPA",
            "Lowest Package": "4 LPA",
            "Students Count": 165,
          },
          {
            "CGPA Range": "Below 7.0",
            "Average Package": "5.2 LPA",
            "Highest Package": "7 LPA",
            "Lowest Package": "3.5 LPA",
            "Students Count": 200,
          },
        ]

        const cgpaWorksheet = createStyledWorksheet(cgpaPackageData, [
          "CGPA Range",
          "Average Package",
          "Highest Package",
          "Lowest Package",
          "Students Count",
        ])
        XLSX.utils.book_append_sheet(workbook, cgpaWorksheet, "CGPA vs Package")

        // 6. Student Performance Analysis
        const studentAnalysis = [
          {
            "Analysis Category": "Branch Performance",
            "Key Findings":
              "Computer Science (89.3%) and Information Technology (90%) have the highest placement rates.",
            Insights: "Technical branches consistently outperform non-technical branches in placement statistics.",
            Recommendations: "Implement specialized training programs for branches with lower placement rates.",
          },
          {
            "Analysis Category": "CGPA Correlation",
            "Key Findings": "Students with CGPA above 9.0 received packages 3x higher than those below 7.0 on average.",
            Insights: "Strong positive correlation between academic performance and placement outcomes.",
            Recommendations:
              "Emphasize the importance of academic performance while providing additional support for students with lower CGPA.",
          },
          {
            "Analysis Category": "Skill Impact",
            "Key Findings":
              "Students with certifications in emerging technologies received 30% higher packages on average.",
            Insights: "Industry-relevant skills significantly impact placement outcomes beyond academic performance.",
            Recommendations: "Encourage students to pursue relevant certifications and skill development programs.",
          },
          {
            "Analysis Category": "Internship Effect",
            "Key Findings":
              "Students with prior internship experience had a 95% placement rate compared to 72% for those without.",
            Insights: "Practical experience significantly enhances employability and interview performance.",
            Recommendations: "Expand internship opportunities and make them an integral part of the curriculum.",
          },
        ]

        const studentAnalysisWorksheet = createStyledWorksheet(studentAnalysis, [
          "Analysis Category",
          "Key Findings",
          "Insights",
          "Recommendations",
        ])
        XLSX.utils.book_append_sheet(workbook, studentAnalysisWorksheet, "Student Analysis")
      }

      // Write the workbook and trigger download
      XLSX.writeFile(workbook, fileName)
    } catch (error) {
      console.error("Error exporting to Excel:", error)
      alert(`Failed to export ${reportType} report to Excel. Please try again.`)
    } finally {
      setExportLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-6 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Placement Analytics</h1>
            <p className="text-gray-500">Insights and statistics about placement activities</p>
          </div>

          <div className="mt-4 md:mt-0 flex items-center gap-4">
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="bg-white border border-gray-200 text-gray-700 py-2 px-4 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="2023">2023</option>
              <option value="2022">2022</option>
              <option value="2021">2021</option>
              <option value="2020">2020</option>
              <option value="2019">2019</option>
            </select>

            <button
              onClick={exportToExcel}
              disabled={exportLoading}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center disabled:opacity-50"
            >
              {exportLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Exporting...
                </>
              ) : (
                <>
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    ></path>
                  </svg>
                  Export Detailed Report
                </>
              )}
            </button>
          </div>
        </div>

        {exportLoading && (
          <div className="mb-6 p-3 bg-blue-50 text-blue-700 rounded-md flex items-center">
            <svg
              className="animate-spin mr-2 h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Preparing comprehensive Excel report with detailed analytics... This may take a moment.
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {analyticsSummary.map((item, index) => (
            <AnalyticsSummaryCard key={index} {...item} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md border border-indigo-100 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Placement Trends (Last 5 Years)</h2>
            <PlacementTrendsChart data={placementTrendsData} />
          </div>

          <div className="bg-white rounded-xl shadow-md border border-indigo-100 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Company-wise Placements</h2>
            <CompanyWisePlacementChart data={companyWisePlacementData} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-md border border-indigo-100 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Branch-wise Placement Rate</h2>
            <BranchWisePlacementChart data={branchWisePlacementData} />
          </div>

          <div className="bg-white rounded-xl shadow-md border border-indigo-100 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Package Distribution</h2>
            <PackageDistributionChart data={packageDistributionData} />
          </div>
        </div>

        <div className="mt-8 bg-white rounded-xl shadow-md border border-indigo-100 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Detailed Reports</h2>
            <button
              onClick={exportToExcel}
              disabled={exportLoading}
              className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg font-medium hover:bg-indigo-100 transition-colors border border-indigo-100 flex items-center disabled:opacity-50"
            >
              {exportLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-indigo-700"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Exporting...
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  Export All Reports
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ReportCard
              title="Placement Summary Report"
              description="Complete overview of placement statistics"
              icon="chart-bar"
              onExport={() => exportReport("Summary")}
              exportLoading={exportLoading}
            />
            <ReportCard
              title="Company-wise Analysis"
              description="Detailed breakdown by company"
              icon="office-building"
              onExport={() => exportReport("Company")}
              exportLoading={exportLoading}
            />
            <ReportCard
              title="Student Performance Report"
              description="Analysis of student performance in placements"
              icon="academic-cap"
              onExport={() => exportReport("Student")}
              exportLoading={exportLoading}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

const ReportCard = ({ title, description, icon, onExport, exportLoading }) => {
  const icons = {
    "chart-bar": (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    ),
    "office-building": (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
        />
      </svg>
    ),
    "academic-cap": (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path d="M12 14l9-5-9-5-9 5 9 5z" />
        <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
      </svg>
    ),
  }

  return (
    <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100 hover:shadow-md transition-all">
      <div className="flex items-start justify-between">
        <div className="flex items-start">
          <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
            {icons[icon]}
          </div>
          <div>
            <h3 className="font-medium text-gray-800">{title}</h3>
            <p className="text-sm text-gray-500">{description}</p>
          </div>
        </div>
        <button
          onClick={onExport}
          disabled={exportLoading}
          className="text-indigo-600 hover:text-indigo-800 focus:outline-none disabled:opacity-50"
        >
          {exportLoading ? (
            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
          )}
        </button>
      </div>
    </div>
  )
}

export default Analytics
