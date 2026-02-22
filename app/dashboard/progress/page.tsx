"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  BarChart3,
  BookOpen,
  CheckCircle2,
  Clock,
  TrendingUp,
  Award,
  Target,
  Calendar,
  ArrowRight,
} from "lucide-react"
import { courses, assignments, modules } from "@/lib/mock-data"
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"

export default function ProgressPage() {
  const overallProgress = Math.round(
    courses.reduce((sum, c) => sum + c.progress, 0) / courses.length
  )
  const totalLessonsCompleted = modules.reduce(
    (sum, m) => sum + m.lessons.filter((l) => l.isCompleted).length,
    0
  )
  const totalLessons = modules.reduce((sum, m) => sum + m.lessons.length, 0)
  const gradedAssignments = assignments.filter((a) => a.grade)
  const averageGrade = Math.round(
    gradedAssignments.reduce((sum, a) => sum + (a.grade || 0), 0) /
    Math.max(gradedAssignments.length, 1)
  )
  const totalTimeEstimate = modules.reduce(
    (sum, m) =>
      sum +
      m.lessons.reduce((lSum, l) => {
        const mins = parseInt(l.duration) || 0
        return lSum + mins
      }, 0),
    0
  )
  const completedTimeEstimate = modules.reduce(
    (sum, m) =>
      sum +
      m.lessons
        .filter((l) => l.isCompleted)
        .reduce((lSum, l) => {
          const mins = parseInt(l.duration) || 0
          return lSum + mins
        }, 0),
    0
  )

  // Chart: course progress data
  const courseProgressData = courses
    .filter((c) => c.progress > 0)
    .map((c) => ({
      name: c.title.length > 18 ? c.title.substring(0, 18) + "..." : c.title,
      progress: c.progress,
      fullName: c.title,
    }))

  // Chart: skill radar data
  const skillRadarData = [
    { subject: "Procurement", value: 75 },
    { subject: "Logistics", value: 60 },
    { subject: "Inventory", value: 40 },
    { subject: "Operations", value: 72 },
    { subject: "Forecasting", value: 65 },
    { subject: "ERP", value: 88 },
  ]

  // Weekly activity data
  const weeklyActivityData = [
    { day: "Mon", hours: 2.5 },
    { day: "Tue", hours: 1.8 },
    { day: "Wed", hours: 3.2 },
    { day: "Thu", hours: 0.5 },
    { day: "Fri", hours: 2.0 },
    { day: "Sat", hours: 4.1 },
    { day: "Sun", hours: 1.2 },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight font-[family-name:var(--font-display)]">
          Progress & Analytics
        </h1>
        <p className="text-sm text-muted-foreground">
          Track your learning journey across all supply chain courses
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{overallProgress}%</p>
              <p className="text-xs text-muted-foreground">Overall Progress</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-success/10">
              <CheckCircle2 className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalLessonsCompleted}</p>
              <p className="text-xs text-muted-foreground">Lessons Done</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10">
              <Award className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold">{averageGrade}%</p>
              <p className="text-xs text-muted-foreground">Avg. Grade</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-warning/10">
              <Clock className="h-5 w-5 text-warning-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold">{Math.round(completedTimeEstimate / 60)}h</p>
              <p className="text-xs text-muted-foreground">Time Spent</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Course Progress Chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-primary" />
              Course Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={courseProgressData} layout="vertical" margin={{ left: 8, right: 16, top: 8, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" />
                  <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis dataKey="name" type="category" width={130} tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                    formatter={(value: number) => [`${value}%`, "Progress"]}
                    labelFormatter={(label: string) => {
                      const item = courseProgressData.find(d => d.name === label)
                      return item?.fullName || label
                    }}
                  />
                  <Bar dataKey="progress" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Skill Radar */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" />
              Skill Coverage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={skillRadarData} cx="50%" cy="50%" outerRadius="70%">
                  <PolarGrid stroke="hsl(var(--border))" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9 }} stroke="hsl(var(--border))" />
                  <Radar name="Skills" dataKey="value" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.15} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Activity + Course Details */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Weekly Activity */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              Weekly Learning Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyActivityData} margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" unit="h" />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                    formatter={(value: number) => [`${value} hours`, "Study Time"]}
                  />
                  <Bar dataKey="hours" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} barSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground mt-3 pt-3 border-t border-border">
              <span>Total this week: {weeklyActivityData.reduce((s, d) => s + d.hours, 0).toFixed(1)} hours</span>
              <span className="text-success font-medium">+12% vs. last week</span>
            </div>
          </CardContent>
        </Card>

        {/* Certificates Placeholder */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Award className="h-4 w-4 text-primary" />
              Certificates
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted mb-3">
                <Award className="h-7 w-7 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium">No certificates yet</p>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                Complete a course to earn your first supply chain certificate
              </p>
            </div>
            <Separator />
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">Closest to completion:</p>
              {courses
                .filter((c) => c.progress > 0)
                .sort((a, b) => b.progress - a.progress)
                .slice(0, 2)
                .map((c) => (
                  <div key={c.id} className="flex items-center gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">{c.title}</p>
                      <Progress value={c.progress} className="h-1 mt-1" />
                    </div>
                    <span className="text-xs font-bold text-primary shrink-0">{c.progress}%</span>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Course Progress */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold font-[family-name:var(--font-display)]">Detailed Course Progress</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {courses
            .filter((c) => c.progress > 0)
            .sort((a, b) => b.progress - a.progress)
            .map((course) => {
              const courseModules = modules.filter((m) => m.courseId === course.id)
              const courseAssignments = assignments.filter((a) => a.courseId === course.id)
              const completedLessons = courseModules.reduce(
                (sum, m) => sum + m.lessons.filter((l) => l.isCompleted).length,
                0
              )
              const totalCourseLessons = courseModules.reduce(
                (sum, m) => sum + m.lessons.length,
                0
              )

              return (
                <Card key={course.id}>
                  <CardContent className="p-5 space-y-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold">{course.title}</p>
                        <p className="text-xs text-muted-foreground">{course.instructor}</p>
                      </div>
                      <Badge
                        variant="secondary"
                        className={`border-0 shrink-0 ${
                          course.progress >= 80 ? "bg-success/10 text-success" :
                          course.progress >= 40 ? "bg-warning/10 text-warning-foreground" :
                          "bg-primary/10 text-primary"
                        }`}
                      >
                        {course.progress}%
                      </Badge>
                    </div>

                    <Progress value={course.progress} className="h-2" />

                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div className="rounded-lg bg-secondary/50 p-2">
                        <p className="text-lg font-bold">{course.completedModules}</p>
                        <p className="text-[10px] text-muted-foreground">Modules</p>
                      </div>
                      <div className="rounded-lg bg-secondary/50 p-2">
                        <p className="text-lg font-bold">{completedLessons}</p>
                        <p className="text-[10px] text-muted-foreground">Lessons</p>
                      </div>
                      <div className="rounded-lg bg-secondary/50 p-2">
                        <p className="text-lg font-bold">
                          {courseAssignments.filter((a) => a.status === "graded").length}
                        </p>
                        <p className="text-[10px] text-muted-foreground">Graded</p>
                      </div>
                    </div>

                    {/* Module breakdown */}
                    <div className="space-y-1.5">
                      {courseModules.map((mod) => (
                        <div key={mod.id} className="flex items-center gap-2">
                          {mod.isCompleted ? (
                            <CheckCircle2 className="h-3.5 w-3.5 text-success shrink-0" />
                          ) : mod.isLocked ? (
                            <div className="h-3.5 w-3.5 rounded-full border border-muted-foreground/30 shrink-0" />
                          ) : (
                            <div className="h-3.5 w-3.5 rounded-full border-2 border-primary shrink-0" />
                          )}
                          <span className={`text-xs truncate ${mod.isCompleted ? "text-muted-foreground" : "text-foreground"}`}>
                            W{mod.weekNumber}: {mod.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
        </div>
      </div>
    </div>
  )
}
