"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  Users,
  BookOpen,
  TrendingUp,
  BarChart3,
  Search,
  ExternalLink,
  RefreshCw,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Settings,
  GraduationCap,
} from "lucide-react"
import { courses, lecturerCourses, studentOverview, assignments } from "@/lib/mock-data"
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"

// Enrollment trend data
const enrollmentTrend = [
  { week: "W1", students: 120 },
  { week: "W2", students: 135 },
  { week: "W3", students: 142 },
  { week: "W4", students: 148 },
  { week: "W5", students: 155 },
  { week: "W6", students: 162 },
  { week: "W7", students: 170 },
  { week: "W8", students: 178 },
]

// Grade distribution
const gradeDistribution = [
  { range: "90-100", count: 18, color: "hsl(var(--success))" },
  { range: "80-89", count: 32, color: "hsl(var(--primary))" },
  { range: "70-79", count: 25, color: "hsl(var(--accent))" },
  { range: "60-69", count: 12, color: "hsl(var(--warning))" },
  { range: "Below 60", count: 8, color: "hsl(var(--destructive))" },
]

// Progress distribution for pie chart
const progressDistribution = [
  { name: "Complete (80-100%)", value: 38, color: "hsl(var(--success))" },
  { name: "On Track (50-79%)", value: 45, color: "hsl(var(--primary))" },
  { name: "Behind (20-49%)", value: 22, color: "hsl(var(--warning))" },
  { name: "At Risk (0-19%)", value: 12, color: "hsl(var(--destructive))" },
]

function getProgressColor(progress: number) {
  if (progress >= 80) return "text-success"
  if (progress >= 50) return "text-primary"
  if (progress >= 30) return "text-warning-foreground"
  return "text-destructive"
}

function getGradeColor(grade: number) {
  if (grade >= 85) return "text-success"
  if (grade >= 70) return "text-primary"
  if (grade >= 60) return "text-warning-foreground"
  return "text-destructive"
}

export default function AdminPage() {
  const totalStudents = courses.reduce((sum, c) => sum + c.enrolledStudents, 0)
  const avgProgress = Math.round(lecturerCourses.reduce((sum, c) => sum + c.averageProgress, 0) / lecturerCourses.length)
  const avgGrade = Math.round(lecturerCourses.reduce((sum, c) => sum + c.averageGrade, 0) / lecturerCourses.length)
  const atRiskStudents = studentOverview.filter((s) => s.progress < 40).length
  const pendingSubmissions = assignments.filter((a) => a.status === "submitted").length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight font-[family-name:var(--font-display)]">
            Lecturer Dashboard
          </h1>
          <p className="text-sm text-muted-foreground">
            Monitor student progress and course performance across your courses
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-full bg-success/10 px-3 py-1.5">
            <RefreshCw className="h-3 w-3 text-success" />
            <span className="text-xs font-medium text-success">Moodle Synced</span>
          </div>
          <Button variant="outline" size="sm">
            <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
            Open Moodle
          </Button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xl font-bold">{totalStudents}</p>
              <p className="text-[10px] text-muted-foreground">Total Enrolled</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-success/10">
              <TrendingUp className="h-5 w-5 text-success" />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <p className="text-xl font-bold">{avgProgress}%</p>
                <ArrowUpRight className="h-3.5 w-3.5 text-success" />
              </div>
              <p className="text-[10px] text-muted-foreground">Avg. Progress</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10">
              <GraduationCap className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-xl font-bold">{avgGrade}%</p>
              <p className="text-[10px] text-muted-foreground">Avg. Grade</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-destructive/10">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="text-xl font-bold">{atRiskStudents}</p>
              <p className="text-[10px] text-muted-foreground">At Risk</p>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-2 lg:col-span-1">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-warning/10">
              <Clock className="h-5 w-5 text-warning-foreground" />
            </div>
            <div>
              <p className="text-xl font-bold">{pendingSubmissions}</p>
              <p className="text-[10px] text-muted-foreground">To Review</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Enrollment Trend */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-primary" />
              Enrollment Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={enrollmentTrend} margin={{ top: 8, right: 16, bottom: 8, left: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="week" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                    formatter={(value: number) => [`${value} students`, "Enrolled"]}
                  />
                  <Line type="monotone" dataKey="students" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ fill: "hsl(var(--primary))", r: 3 }} activeDot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Student Progress Distribution */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              Progress Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={progressDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    dataKey="value"
                    stroke="hsl(var(--card))"
                    strokeWidth={2}
                  >
                    {progressDistribution.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                    formatter={(value: number) => [`${value} students`, ""]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-1.5 mt-2">
              {progressDistribution.map((item) => (
                <div key={item.name} className="flex items-center gap-2 text-xs">
                  <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ background: item.color }} />
                  <span className="flex-1 text-muted-foreground">{item.name}</span>
                  <span className="font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Course Overview + Grade Distribution */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Course Cards */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-semibold font-[family-name:var(--font-display)]">Your Courses</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {lecturerCourses.map((course) => (
              <Card key={course.id} className="hover:shadow-md transition-all">
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold">{course.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {course.enrolledStudents} enrolled &middot; {course.activeStudents} active
                      </p>
                    </div>
                    <RefreshCw className="h-3.5 w-3.5 text-success shrink-0" />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg bg-secondary/50 p-3 text-center">
                      <p className="text-lg font-bold text-primary">{course.averageProgress}%</p>
                      <p className="text-[10px] text-muted-foreground">Avg. Progress</p>
                    </div>
                    <div className="rounded-lg bg-secondary/50 p-3 text-center">
                      <p className="text-lg font-bold text-accent">{course.averageGrade}%</p>
                      <p className="text-[10px] text-muted-foreground">Avg. Grade</p>
                    </div>
                  </div>

                  <Progress value={course.averageProgress} className="h-1.5" />

                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="mr-1.5 h-3.5 w-3.5" />
                      View Details
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                      Moodle
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Grade Distribution */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-primary" />
              Grade Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={gradeDistribution} margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="range" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                    formatter={(value: number) => [`${value} students`, ""]}
                  />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={28}>
                    {gradeDistribution.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Student Progress Overview */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold font-[family-name:var(--font-display)]">Student Progress Overview</h2>
          <div className="relative w-64 hidden sm:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search students..." className="pl-9" />
          </div>
        </div>

        <Card>
          <CardContent className="p-0">
            {/* Table Header */}
            <div className="hidden sm:grid sm:grid-cols-5 gap-4 px-5 py-3 bg-secondary/30 text-xs font-medium text-muted-foreground border-b border-border">
              <span>Student</span>
              <span>Progress</span>
              <span>Grade</span>
              <span>Last Active</span>
              <span className="text-right">Status</span>
            </div>

            {/* Table Rows */}
            {studentOverview.map((student, i) => (
              <div
                key={student.name}
                className={`flex flex-col gap-2 px-5 py-4 sm:grid sm:grid-cols-5 sm:items-center sm:gap-4 transition-colors hover:bg-secondary/20 ${
                  i < studentOverview.length - 1 ? "border-b border-border" : ""
                }`}
              >
                {/* Name */}
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-semibold">
                    {student.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <span className="text-sm font-medium">{student.name}</span>
                </div>

                {/* Progress */}
                <div className="flex items-center gap-2">
                  <Progress value={student.progress} className="h-1.5 flex-1" />
                  <span className={`text-xs font-bold shrink-0 ${getProgressColor(student.progress)}`}>
                    {student.progress}%
                  </span>
                </div>

                {/* Grade */}
                <span className={`text-sm font-bold ${getGradeColor(student.grade)}`}>
                  {student.grade}%
                </span>

                {/* Last Active */}
                <span className="text-xs text-muted-foreground">{student.lastActive}</span>

                {/* Status */}
                <div className="sm:text-right">
                  {student.progress >= 80 ? (
                    <Badge variant="secondary" className="bg-success/10 text-success border-0">On Track</Badge>
                  ) : student.progress >= 50 ? (
                    <Badge variant="secondary" className="bg-primary/10 text-primary border-0">In Progress</Badge>
                  ) : student.progress >= 30 ? (
                    <Badge variant="secondary" className="bg-warning/10 text-warning-foreground border-0">Behind</Badge>
                  ) : (
                    <Badge variant="secondary" className="bg-destructive/10 text-destructive border-0">At Risk</Badge>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Moodle CTA */}
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <Settings className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Need advanced course management?</p>
                <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">
                  For grading, content editing, enrollment management, and other administrative tasks, use the full Moodle admin panel.
                </p>
              </div>
            </div>
            <Button className="shrink-0">
              <ExternalLink className="mr-1.5 h-4 w-4" />
              Open Moodle Admin
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
