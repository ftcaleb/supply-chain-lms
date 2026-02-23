import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  BookOpen,
  Clock,
  Users,
  ArrowRight,
  Search,
  RefreshCw,
} from "lucide-react"
import { courses } from "@/lib/mock-data"

function getLevelColor(level: string) {
  switch (level) {
    case "Beginner": return "bg-success/10 text-success border-0"
    case "Intermediate": return "bg-warning/10 text-warning-foreground border-0"
    case "Advanced": return "bg-primary/10 text-primary border-0"
    default: return ""
  }
}

function getCategoryIcon(category: string) {
  return <BookOpen className="h-5 w-5" />
}

export default function CoursesPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-[family-name:var(--font-display)]">My Courses</h1>
          <p className="text-muted-foreground mt-1">Browse and manage your enrolled courses</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search courses..." className="pl-9" />
        </div>
      </div>

      {/* Course Categories */}
      <div className="flex flex-wrap gap-2">
        {["All", "Operations", "Procurement", "Warehousing", "Logistics", "ERP", "Forecasting"].map((cat) => (
          <Button
            key={cat}
            variant={cat === "All" ? "default" : "outline"}
            size="sm"
            className="rounded-full"
          >
            {cat}
          </Button>
        ))}
      </div>

      {/* Course Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <Link key={course.id} href={`/dashboard/courses/${course.id}`}>
            <Card className="h-full transition-all hover:shadow-lg hover:border-accent/30 cursor-pointer group border-border/50">
              {/* Header accent bar */}
              <div className="h-1 rounded-t-lg bg-accent" style={{ opacity: Math.max(0.25, course.progress / 100) }} />
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <Badge variant="secondary" className={getLevelColor(course.level)}>
                    {course.level}
                  </Badge>
                  <RefreshCw className="h-3.5 w-3.5 text-success shrink-0" aria-label="Synced from Moodle" />
                </div>
                <CardTitle className="text-base leading-tight group-hover:text-primary transition-colors mt-2">
                  {course.title}
                </CardTitle>
                <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{course.description}</p>
              </CardHeader>
              <CardContent className="pt-0 space-y-4">
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {course.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {course.enrolledStudents}
                  </span>
                  <span className="flex items-center gap-1">
                    <BookOpen className="h-3 w-3" />
                    {course.totalModules} modules
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-semibold">{course.progress}%</span>
                  </div>
                  <Progress value={course.progress} className="h-1.5" />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <p className="text-xs text-muted-foreground">{course.instructor}</p>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
