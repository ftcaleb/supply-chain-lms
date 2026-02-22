import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  BookOpen,
  Clock,
  Users,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Circle,
  Lock,
  Play,
  FileText,
  HelpCircle,
  Activity,
  User,
  RefreshCw,
  Target,
} from "lucide-react"
import { courses, modules, assignments } from "@/lib/mock-data"
import { notFound } from "next/navigation"

function getLessonIcon(type: string) {
  switch (type) {
    case "video": return <Play className="h-3.5 w-3.5" />
    case "document": return <FileText className="h-3.5 w-3.5" />
    case "quiz": return <HelpCircle className="h-3.5 w-3.5" />
    case "activity": return <Activity className="h-3.5 w-3.5" />
    default: return <Circle className="h-3.5 w-3.5" />
  }
}

export default async function CourseDetailPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params
  const course = courses.find((c) => c.id === courseId)

  if (!course) return notFound()

  const courseModules = modules.filter((m) => m.courseId === courseId)
  const courseAssignments = assignments.filter((a) => a.courseId === courseId)

  // Find the first incomplete lesson for "Continue Learning"
  const currentModule = courseModules.find((m) => !m.isCompleted && !m.isLocked)
  const currentLesson = currentModule?.lessons.find((l) => !l.isCompleted)

  return (
    <div className="space-y-6">
      {/* Back nav */}
      <Link href="/dashboard/courses" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Courses
      </Link>

      {/* Course Header */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="secondary" className="bg-primary/10 text-primary border-0">{course.level}</Badge>
            <Badge variant="secondary" className="border-0">{course.category}</Badge>
            <div className="flex items-center gap-1 text-xs text-success">
              <RefreshCw className="h-3 w-3" />
              Synced from Moodle
            </div>
          </div>
          <h1 className="text-2xl font-bold tracking-tight font-[family-name:var(--font-display)] lg:text-3xl">
            {course.title}
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">{course.description}</p>

          <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
            <span className="flex items-center gap-1.5">
              <User className="h-4 w-4" />
              {course.instructor}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {course.duration}
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="h-4 w-4" />
              {course.enrolledStudents} students
            </span>
            <span className="flex items-center gap-1.5">
              <BookOpen className="h-4 w-4" />
              {course.totalModules} modules
            </span>
          </div>
        </div>

        {/* Continue Learning Card */}
        {currentModule && currentLesson && (
          <Card className="lg:w-80 shrink-0 border-primary/20">
            <CardContent className="p-5 space-y-4">
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Continue Learning</p>
                <p className="text-sm font-semibold">{currentModule.title}</p>
                <p className="text-xs text-muted-foreground">{currentLesson.title}</p>
              </div>
              <Link href={`/dashboard/courses/${courseId}/lessons/${currentLesson.id}`}>
                <Button className="w-full">
                  Continue <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Progress Bar */}
      <Card>
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Course Progress</span>
            <span className="text-sm font-bold text-primary">{course.progress}%</span>
          </div>
          <Progress value={course.progress} className="h-2.5" />
          <p className="text-xs text-muted-foreground mt-2">
            {course.completedModules} of {course.totalModules} modules completed
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Module List */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-semibold font-[family-name:var(--font-display)]">Course Modules</h2>
          <div className="space-y-3">
            {courseModules.map((mod) => (
              <Card key={mod.id} className={mod.isLocked ? "opacity-60" : ""}>
                <CardContent className="p-0">
                  <div className="flex items-center gap-4 p-4">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-sm font-bold ${
                      mod.isCompleted
                        ? "bg-success/10 text-success"
                        : mod.isLocked
                        ? "bg-muted text-muted-foreground"
                        : "bg-primary/10 text-primary"
                    }`}>
                      {mod.isCompleted ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : mod.isLocked ? (
                        <Lock className="h-5 w-5" />
                      ) : (
                        <span>W{mod.weekNumber}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold">{mod.title}</p>
                      <p className="text-xs text-muted-foreground">{mod.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {mod.lessons.length} lessons &middot; Week {mod.weekNumber}
                      </p>
                    </div>
                    {mod.isCompleted && (
                      <Badge variant="secondary" className="bg-success/10 text-success border-0 shrink-0">Complete</Badge>
                    )}
                  </div>

                  {/* Lessons */}
                  {!mod.isLocked && (
                    <div className="border-t border-border">
                      {mod.lessons.map((lesson, i) => (
                        <Link
                          key={lesson.id}
                          href={`/dashboard/courses/${courseId}/lessons/${lesson.id}`}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-secondary/50 transition-colors"
                        >
                          <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                            lesson.isCompleted
                              ? "bg-success/10 text-success"
                              : "bg-muted text-muted-foreground"
                          }`}>
                            {lesson.isCompleted ? <CheckCircle2 className="h-3.5 w-3.5" /> : getLessonIcon(lesson.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm truncate">{lesson.title}</p>
                            <p className="text-[10px] text-muted-foreground capitalize">{lesson.type} &middot; {lesson.duration}</p>
                          </div>
                          {!lesson.isCompleted && (
                            <ArrowRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                          )}
                        </Link>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Learning Outcomes */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" />
                Learning Outcomes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {course.outcomes.map((outcome, i) => (
                <div key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                  <span className="text-xs text-muted-foreground leading-relaxed">{outcome}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Instructor */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Instructor</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-sm">
                {course.instructor.split(" ").slice(-1)[0][0]}
              </div>
              <div>
                <p className="text-sm font-medium">{course.instructor}</p>
                <p className="text-xs text-muted-foreground">{course.instructorTitle}</p>
              </div>
            </CardContent>
          </Card>

          {/* Assignments for this course */}
          {courseAssignments.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Course Assignments</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {courseAssignments.map((a) => (
                  <div key={a.id} className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium truncate">{a.title}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {a.status === "graded" ? `Grade: ${a.grade}/${a.maxGrade}` : `Due: ${new Date(a.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`}
                      </p>
                    </div>
                    <Badge
                      variant="secondary"
                      className={`shrink-0 border-0 text-[10px] ${
                        a.status === "graded" ? "bg-success/10 text-success" :
                        a.status === "submitted" ? "bg-primary/10 text-primary" :
                        a.status === "overdue" ? "bg-destructive/10 text-destructive" :
                        "bg-warning/10 text-warning-foreground"
                      }`}
                    >
                      {a.status}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
