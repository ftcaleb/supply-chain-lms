import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  BookOpen,
  Clock,
  TrendingUp,
  ArrowRight,
  Calendar,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
} from "lucide-react"
import { courses, assignments, currentUser } from "@/lib/mock-data"

function getLevelColor(level: string) {
  switch (level) {
    case "Beginner": return "bg-success/10 text-success"
    case "Intermediate": return "bg-warning/10 text-warning-foreground"
    case "Advanced": return "bg-primary/10 text-primary"
    default: return "bg-muted text-muted-foreground"
  }
}

function getStatusBadge(status: string) {
  switch (status) {
    case "graded": return <Badge variant="secondary" className="bg-success/10 text-success border-0">Graded</Badge>
    case "submitted": return <Badge variant="secondary" className="bg-primary/10 text-primary border-0">Submitted</Badge>
    case "pending": return <Badge variant="secondary" className="bg-warning/10 text-warning-foreground border-0">Pending</Badge>
    case "overdue": return <Badge variant="destructive">Overdue</Badge>
    default: return null
  }
}

export default function DashboardPage() {
  const enrolledCourses = courses.filter((c) => c.progress > 0 || c.lastAccessed)
  const recentCourses = [...courses].filter(c => c.lastAccessed).sort((a, b) => {
    if (!a.lastAccessed) return 1
    if (!b.lastAccessed) return -1
    return 0
  }).slice(0, 3)
  const upcomingAssignments = assignments.filter((a) => a.status === "pending" || a.status === "overdue").slice(0, 4)
  const overallProgress = Math.round(courses.reduce((sum, c) => sum + c.progress, 0) / courses.length)
  const completedCourses = courses.filter((c) => c.progress === 100).length

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight font-[family-name:var(--font-display)]">
          Welcome back, {currentUser.name.split(" ")[0]}
        </h1>
        <p className="text-sm text-muted-foreground">
          Track your progress and continue learning supply chain management
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{enrolledCourses.length}</p>
              <p className="text-xs text-muted-foreground">Enrolled Courses</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-success/10">
              <TrendingUp className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">{overallProgress}%</p>
              <p className="text-xs text-muted-foreground">Average Progress</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10">
              <CheckCircle2 className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold">{completedCourses}</p>
              <p className="text-xs text-muted-foreground">Completed</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-destructive/10">
              <AlertCircle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold">{upcomingAssignments.length}</p>
              <p className="text-xs text-muted-foreground">Due Assignments</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main: Course Cards */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold font-[family-name:var(--font-display)]">Continue Learning</h2>
            <Link href="/dashboard/courses">
              <Button variant="ghost" size="sm" className="text-primary">
                View All <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {recentCourses.map((course) => (
              <Link key={course.id} href={`/dashboard/courses/${course.id}`}>
                <Card className="h-full transition-all hover:shadow-md hover:border-primary/20 cursor-pointer group">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1 flex-1 min-w-0">
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${getLevelColor(course.level)}`}>
                          {course.level}
                        </span>
                        <CardTitle className="text-base leading-tight group-hover:text-primary transition-colors">
                          {course.title}
                        </CardTitle>
                      </div>
                      <RefreshCw className="h-3.5 w-3.5 shrink-0 text-success" aria-label="Synced from Moodle" />
                    </div>
                    <p className="text-xs text-muted-foreground">{course.instructor}</p>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">
                          {course.completedModules}/{course.totalModules} modules
                        </span>
                        <span className="font-medium">{course.progress}%</span>
                      </div>
                      <Progress value={course.progress} className="h-1.5" />
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {course.lastAccessed}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* All Enrolled Courses List */}
          <div className="space-y-3 mt-2">
            <h3 className="text-sm font-medium text-muted-foreground">All Enrolled Courses</h3>
            {courses.filter(c => c.progress > 0).map((course) => (
              <Link key={course.id} href={`/dashboard/courses/${course.id}`}>
                <Card className="transition-all hover:shadow-sm hover:border-primary/20 cursor-pointer mb-3">
                  <CardContent className="flex items-center gap-4 p-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary font-semibold text-sm">
                      {course.progress}%
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{course.title}</p>
                      <p className="text-xs text-muted-foreground">{course.category} &middot; {course.duration}</p>
                    </div>
                    <Progress value={course.progress} className="hidden sm:block w-24 h-1.5" />
                    <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Sidebar: Deadlines & Notifications */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold font-[family-name:var(--font-display)]">Upcoming Deadlines</h2>
          <div className="space-y-3">
            {upcomingAssignments.map((assignment) => {
              const course = courses.find((c) => c.id === assignment.courseId)
              return (
                <Card key={assignment.id}>
                  <CardContent className="p-4 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium leading-tight">{assignment.title}</p>
                      {getStatusBadge(assignment.status)}
                    </div>
                    <p className="text-xs text-muted-foreground">{course?.title}</p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      Due: {new Date(assignment.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <Link href="/dashboard/assignments">
            <Button variant="outline" className="w-full mt-2" size="sm">
              View All Assignments <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Button>
          </Link>

          {/* Quick Stats */}
          <Card className="mt-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Your Learning Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Courses in progress</span>
                <span className="font-medium">{courses.filter(c => c.progress > 0 && c.progress < 100).length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Assignments graded</span>
                <span className="font-medium">{assignments.filter(a => a.status === "graded").length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Average grade</span>
                <span className="font-medium">
                  {Math.round(
                    assignments.filter(a => a.grade).reduce((sum, a) => sum + (a.grade || 0), 0) /
                    assignments.filter(a => a.grade).length
                  )}%
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
