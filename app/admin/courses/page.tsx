import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  BookOpen,
  Users,
  ExternalLink,
  RefreshCw,
  Eye,
  Clock,
  TrendingUp,
  Settings,
} from "lucide-react"
import { courses } from "@/lib/mock-data"

export default function AdminCoursesPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight font-[family-name:var(--font-display)]">
            Manage Courses
          </h1>
          <p className="text-sm text-muted-foreground">
            View and monitor all courses synced from Moodle
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-full bg-success/10 px-3 py-1.5">
            <RefreshCw className="h-3 w-3 text-success" />
            <span className="text-xs font-medium text-success">{courses.length} courses synced</span>
          </div>
          <Button variant="outline" size="sm">
            <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
            Moodle Admin
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xl font-bold">{courses.length}</p>
              <p className="text-[10px] text-muted-foreground">Total Courses</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-success/10">
              <Users className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-xl font-bold">
                {courses.reduce((sum, c) => sum + c.enrolledStudents, 0)}
              </p>
              <p className="text-[10px] text-muted-foreground">Total Students</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10">
              <TrendingUp className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-xl font-bold">
                {Math.round(courses.reduce((sum, c) => sum + c.progress, 0) / courses.length)}%
              </p>
              <p className="text-[10px] text-muted-foreground">Avg. Progress</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-warning/10">
              <Clock className="h-5 w-5 text-warning-foreground" />
            </div>
            <div>
              <p className="text-xl font-bold">{courses.reduce((sum, c) => sum + c.totalModules, 0)}</p>
              <p className="text-[10px] text-muted-foreground">Total Modules</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Course Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <Card key={course.id} className="hover:shadow-md transition-all">
            <CardContent className="p-5 space-y-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Badge
                      variant="secondary"
                      className={`border-0 text-[10px] ${
                        course.level === "Beginner" ? "bg-success/10 text-success" :
                        course.level === "Intermediate" ? "bg-warning/10 text-warning-foreground" :
                        "bg-primary/10 text-primary"
                      }`}
                    >
                      {course.level}
                    </Badge>
                    <Badge variant="secondary" className="border-0 text-[10px]">{course.category}</Badge>
                  </div>
                  <p className="text-sm font-semibold leading-tight">{course.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{course.instructor}</p>
                </div>
                <RefreshCw className="h-3.5 w-3.5 text-success shrink-0" />
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="rounded-lg bg-secondary/50 p-2">
                  <p className="text-sm font-bold">{course.enrolledStudents}</p>
                  <p className="text-[10px] text-muted-foreground">Students</p>
                </div>
                <div className="rounded-lg bg-secondary/50 p-2">
                  <p className="text-sm font-bold">{course.totalModules}</p>
                  <p className="text-[10px] text-muted-foreground">Modules</p>
                </div>
                <div className="rounded-lg bg-secondary/50 p-2">
                  <p className="text-sm font-bold">{course.duration}</p>
                  <p className="text-[10px] text-muted-foreground">Duration</p>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Average progress</span>
                  <span className="font-medium">{course.progress}%</span>
                </div>
                <Progress value={course.progress} className="h-1.5" />
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="flex-1 text-xs">
                  <Eye className="mr-1 h-3 w-3" />
                  Preview
                </Button>
                <Button variant="outline" size="sm" className="flex-1 text-xs">
                  <Settings className="mr-1 h-3 w-3" />
                  Moodle
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Info Banner */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium">Course Management</p>
            <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">
              To create, edit, or delete courses, use the Moodle admin interface. Changes will sync automatically to this dashboard.
            </p>
          </div>
          <Button className="shrink-0">
            <ExternalLink className="mr-1.5 h-4 w-4" />
            Manage in Moodle
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
