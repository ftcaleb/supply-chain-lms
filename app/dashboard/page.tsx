import { cookies } from "next/headers"
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
import { assignments, currentUser } from "@/lib/mock-data"
import type { NormalizedCourse } from "@/lib/moodle"

function getStatusBadge(status: string) {
  switch (status) {
    case "graded":
      return (
        <Badge variant="secondary" className="bg-success/10 text-success border-0">
          Graded
        </Badge>
      )
    case "submitted":
      return (
        <Badge variant="secondary" className="bg-primary/10 text-primary border-0">
          Submitted
        </Badge>
      )
    case "pending":
      return (
        <Badge variant="secondary" className="bg-warning/10 text-warning-foreground border-0">
          Pending
        </Badge>
      )
    case "overdue":
      return <Badge variant="destructive">Overdue</Badge>
    default:
      return null
  }
}

export default async function DashboardPage() {
  // ---------------------------------------------------------------------------
  // Fetch Moodle courses server-side
  // ---------------------------------------------------------------------------
  const cookieStore = await cookies()
  const token =
    cookieStore.get("moodle_token")?.value ?? process.env.MOODLE_TOKEN ?? null

  let courses: NormalizedCourse[] = []

  if (token) {
    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_BASE_URL ??
        `http://localhost:${process.env.PORT ?? 3000}`

      const cookieHeader = cookieStore.get("moodle_token")
        ? `moodle_token=${token}`
        : ""

      const res = await fetch(`${baseUrl}/api/courses`, {
        cache: "no-store",
        headers: cookieHeader ? { Cookie: cookieHeader } : {},
      })

      if (res.ok) {
        const data = await res.json()
        courses = (data.courses ?? []) as NormalizedCourse[]
        courses.sort((a, b) => b.lastAccess - a.lastAccess)
      }
    } catch {
      // Non-fatal: stats degrade to 0
    }
  }

  // ---------------------------------------------------------------------------
  // Derived stats
  // ---------------------------------------------------------------------------
  const enrolledCourses = courses.length
  const overallProgress =
    courses.length > 0
      ? Math.round(courses.reduce((s, c) => s + c.progress, 0) / courses.length)
      : 0
  const completedCourses = courses.filter((c) => c.completed).length
  const inProgressCourses = courses.filter((c) => c.progress > 0 && !c.completed).length
  const recentCourses = courses.filter((c) => c.lastAccess > 0).slice(0, 3)

  // Assignments stay on mock data
  const upcomingAssignments = assignments
    .filter((a) => a.status === "pending" || a.status === "overdue")
    .slice(0, 4)

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight font-[family-name:var(--font-display)]">
          Welcome back, {currentUser.name.split(" ")[0]}
        </h1>
        <p className="text-muted-foreground">
          Track your progress and continue learning supply chain management
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card className="border-border/50 shadow-sm">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-3xl font-bold">{enrolledCourses}</p>
              <p className="text-xs text-muted-foreground mt-0.5">Enrolled Courses</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 shadow-sm">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-success/10">
              <TrendingUp className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-3xl font-bold">{overallProgress}%</p>
              <p className="text-xs text-muted-foreground mt-0.5">Average Progress</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 shadow-sm">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent/10">
              <CheckCircle2 className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-3xl font-bold">{completedCourses}</p>
              <p className="text-xs text-muted-foreground mt-0.5">Completed</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 shadow-sm">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-destructive/10">
              <AlertCircle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="text-3xl font-bold">{upcomingAssignments.length}</p>
              <p className="text-xs text-muted-foreground mt-0.5">Due Assignments</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main: Course Cards */}
        <div className="lg:col-span-2 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold font-[family-name:var(--font-display)]">
              Continue Learning
            </h2>
            <Link href="/dashboard/courses">
              <Button variant="ghost" size="sm" className="text-primary">
                View All <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>

          {recentCourses.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {recentCourses.map((course) => (
                <Link key={course.id} href={`/dashboard/courses/${course.id}`}>
                  <Card className="h-full transition-all hover:shadow-lg hover:border-accent/30 cursor-pointer group border-border/50">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1.5 flex-1 min-w-0">
                          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold tracking-wide bg-primary/10 text-primary">
                            {course.shortname}
                          </span>
                          <CardTitle className="text-base leading-tight group-hover:text-primary transition-colors">
                            {course.name}
                          </CardTitle>
                        </div>
                        <RefreshCw
                          className="h-3.5 w-3.5 shrink-0 text-success"
                          aria-label="Synced from Moodle"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {course.summary}
                      </p>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-2">
                        {course.enableCompletion && (
                          <>
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-muted-foreground">Progress</span>
                              <span className="font-medium">{course.progress}%</span>
                            </div>
                            <Progress value={course.progress} className="h-1.5" />
                          </>
                        )}
                        {course.lastAccessLabel && (
                          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {course.lastAccessLabel}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <Card className="border-border/50">
              <CardContent className="flex flex-col items-center gap-2 py-10 text-center">
                <BookOpen className="h-8 w-8 text-muted-foreground/40" />
                <p className="text-sm font-medium">No active courses</p>
                <p className="text-xs text-muted-foreground">
                  Start a course to see your progress here.
                </p>
                <Link href="/dashboard/courses">
                  <Button size="sm" variant="outline" className="mt-2">
                    Browse Courses
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}

          {/* All Enrolled Courses List */}
          {courses.filter((c) => c.progress > 0).length > 0 && (
            <div className="space-y-3 mt-2">
              <h3 className="text-sm font-medium text-muted-foreground">All Enrolled Courses</h3>
              {courses
                .filter((c) => c.progress > 0)
                .map((course) => (
                  <Link key={course.id} href={`/dashboard/courses/${course.id}`}>
                    <Card className="transition-all hover:shadow-sm hover:border-primary/20 cursor-pointer mb-3">
                      <CardContent className="flex items-center gap-4 p-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary font-semibold text-sm">
                          {course.progress}%
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{course.name}</p>
                          <p className="text-xs text-muted-foreground">{course.shortname}</p>
                        </div>
                        <Progress value={course.progress} className="hidden sm:block w-24 h-1.5" />
                        <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                      </CardContent>
                    </Card>
                  </Link>
                ))}
            </div>
          )}
        </div>

        {/* Sidebar: Deadlines */}
        <div className="space-y-5">
          <h2 className="text-xl font-semibold font-[family-name:var(--font-display)]">
            Upcoming Deadlines
          </h2>
          <div className="space-y-3">
            {upcomingAssignments.map((assignment) => (
              <Card key={assignment.id}>
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium leading-tight">{assignment.title}</p>
                    {getStatusBadge(assignment.status)}
                  </div>
                  <p className="text-xs text-muted-foreground">{assignment.courseId}</p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    Due:{" "}
                    {new Date(assignment.dueDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
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
                <span className="font-medium">{inProgressCourses}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Assignments graded</span>
                <span className="font-medium">
                  {assignments.filter((a) => a.status === "graded").length}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Average grade</span>
                <span className="font-medium">
                  {assignments.filter((a) => a.grade).length > 0
                    ? Math.round(
                      assignments
                        .filter((a) => a.grade)
                        .reduce((s, a) => s + (a.grade ?? 0), 0) /
                      assignments.filter((a) => a.grade).length
                    )
                    : 0}
                  %
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
