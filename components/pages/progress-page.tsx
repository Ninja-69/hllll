"use client"

import { BottomNav } from "@/components/bottom-nav"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ProgressPageProps {
  chartData: Array<{
    date: string
    calories: number
    protein: number
    carbs: number
    fat: number
  }>
  goals: any
}

export function ProgressPage({ chartData, goals }: ProgressPageProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + "T00:00:00")
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  const formattedData = chartData.map((item) => ({
    ...item,
    date: formatDate(item.date),
  }))

  const avgCalories =
    chartData.length > 0 ? Math.round(chartData.reduce((sum, d) => sum + d.calories, 0) / chartData.length) : 0
  const avgProtein =
    chartData.length > 0 ? Math.round(chartData.reduce((sum, d) => sum + d.protein, 0) / chartData.length) : 0
  const avgCarbs =
    chartData.length > 0 ? Math.round(chartData.reduce((sum, d) => sum + d.carbs, 0) / chartData.length) : 0
  const avgFat = chartData.length > 0 ? Math.round(chartData.reduce((sum, d) => sum + d.fat, 0) / chartData.length) : 0

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-8">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-card border-b border-border px-4 py-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-text">Progress</h1>
          <p className="text-sm text-text-muted mt-1">Last 30 days analytics</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-6 md:px-6 space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border-border">
            <CardContent className="pt-6">
              <p className="text-xs text-text-muted mb-1">Avg Calories</p>
              <p className="text-2xl font-bold text-primary">{avgCalories}</p>
              <p className="text-xs text-text-muted mt-2">Goal: {goals?.daily_calories || 2000}</p>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="pt-6">
              <p className="text-xs text-text-muted mb-1">Avg Protein</p>
              <p className="text-2xl font-bold text-text">{avgProtein}g</p>
              <p className="text-xs text-text-muted mt-2">Goal: {Math.round(goals?.daily_protein_g || 150)}g</p>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="pt-6">
              <p className="text-xs text-text-muted mb-1">Avg Carbs</p>
              <p className="text-2xl font-bold text-accent">{avgCarbs}g</p>
              <p className="text-xs text-text-muted mt-2">Goal: {Math.round(goals?.daily_carbs_g || 200)}g</p>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="pt-6">
              <p className="text-xs text-text-muted mb-1">Avg Fat</p>
              <p className="text-2xl font-bold text-secondary">{avgFat}g</p>
              <p className="text-xs text-text-muted mt-2">Goal: {Math.round(goals?.daily_fat_g || 65)}g</p>
            </CardContent>
          </Card>
        </div>

        {/* Calorie Trend Chart */}
        {formattedData.length > 0 && (
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Calorie Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={formattedData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="date" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#FFFFFF",
                      border: "1px solid #E5E7EB",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="calories"
                    stroke="#50C878"
                    strokeWidth={2}
                    dot={{ fill: "#50C878", r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Macros Distribution Chart */}
        {formattedData.length > 0 && (
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Macronutrients Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={formattedData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="date" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#FFFFFF",
                      border: "1px solid #E5E7EB",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="protein" fill="#50C878" name="Protein (g)" />
                  <Bar dataKey="carbs" fill="#FFB347" name="Carbs (g)" />
                  <Bar dataKey="fat" fill="#4152E4" name="Fat (g)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {formattedData.length === 0 && (
          <Card className="border-border">
            <CardContent className="pt-12 pb-12 text-center">
              <p className="text-text-muted mb-4">No data available yet</p>
              <p className="text-sm text-text-muted">Start logging meals to see your progress</p>
            </CardContent>
          </Card>
        )}
      </main>

      <BottomNav />
    </div>
  )
}
