import { cookies } from "next/headers"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  BookOpen,
  Clock,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Circle,
  Lock,
  Play,
  FileText,
  HelpCircle,
  Activity,
  RefreshCw,
  AlertCircle,
  Target,
} from "lucide-react"
import { modules, assignments } from "@/lib/mock-data"
import { notFound } from "next/navigation"
import type { NormalizedCourse } from "@/lib/moodle"

function getLessonIcon(type: string) {
  switch (type) {
    case "video": return <Play className="h-3.5 w-3.5" />
    case "document": return <FileText className="h-3.5 w-3.5" />
    case "quiz": return <HelpCircle className="h-3.5 w-3.5" />
    case "activity": return <Activity className="h-3.5 w-3.5" />
    default: return <Circle className="h-3.5 w-3.5" />
  }
}

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ courseId: string }>
}) {
  const { courseId } = await params

  // ---------------------------------------------------------------------------
  // Fetch course list from Moodle, find this course by ID
  // ---------------------------------------------------------------------------
  const cookieStore = await cookies()
  const token =
    cookieStore.get("moodle_token")?.value ?? process.env.MOODLE_TOKEN ?? null

  let course: NormalizedCourse | null = null
  let fetchError: string | null = null

  if (!token) {
    fetchError = "You are not authenticated."
  } else {
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
        const all: NormalizedCourse[] = data.courses ?? []
        course = all.find((c) => c.id === courseId) ?? null
      } else if (res.status === 401) {
        fetchError = "Your session has expired. Please log in again."
      } else {
        const body = await res.json().catch(() => ({}))
        fetchError = body?.error ?? `Failed to load course (HTTP ${res.status}).`
      }
    } catch {
      fetchError = "Unable to connect to the learning platform."
    }
  }

  if (!fetchError && !course) return notFound()

  // Modules & assignments stay on mock data
  const courseModules = modules.filter((m) => m.courseId === courseId)
  const courseAssignments = assignments.filter((a) => a.courseId === courseId)
  const currentModule = courseModules.find((m) => !m.isCompleted && !m.isLocked)
  const currentLesson = currentModule?.lessons.find((l) => !l.isCompleted)

  // Error state
  if (fetchError) {
    return (
      <div className="space-y-6">
        <Link
          href="/dashboard/courses"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Courses
        </Link>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Could not load course</AlertTitle>
          <AlertDescription>{fetchError}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Back nav */}
      <Link
        href="/dashboard/courses"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Courses
      </Link>

      {/* Course header */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex-1 space-y-3">
          {/* Course image banner */}
          {course!.courseImage && (
            <div className="relative h-40 w-full overflow-hidden rounded-xl border border-border/50">
              <Image
                src={course!.courseImage}
                alt={course!.name}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          )}

          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="secondary" className="bg-primary/10 text-primary border-0">
              {course!.shortname}
            </Badge>
            {course!.completed && (
              <Badge className="bg-success text-success-foreground border-0 flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" />
                Completed
              </Badge>
            )}
            <div className="flex items-center gap-1 text-xs text-success">
              <RefreshCw className="h-3 w-3" />
              Synced from Moodle
            </div>
          </div>

          <h1 className="text-3xl font-bold tracking-tight font-[family-name:var(--font-display)] lg:text-4xl">
            {course!.name}
          </h1>

          <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
            {course!.summary}
          </p>

          <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
            {course!.lastAccessLabel && (
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                Last accessed {course!.lastAccessLabel}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <BookOpen className="h-4 w-4" />
              {courseModules.length} module{courseModules.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {/* Continue Learning card */}
        {currentModule && currentLesson && (
          <Card className="lg:w-80 shrink-0 border-primary/20">
            <CardContent className="p-5 space-y-4">
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Continue Learning
                </p>
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

      {/* Progress bar — gated on completion tracking */}
      {course!.enableCompletion && (
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Course Progress</span>
              <span className="text-sm font-bold text-primary">{course!.progress}%</span>
            </div>
            <Progress value={course!.progress} className="h-2.5" />
            <p className="text-xs text-muted-foreground mt-2">
              {courseModules.filter((m) => m.isCompleted).length} of {courseModules.length}{" "}
              modules completed
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Module list */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-semibold font-[family-name:var(--font-display)]">
            Course Modules
          </h2>
          <div className="space-y-3">
            {courseModules.map((mod) => (
              <Card key={mod.id} className={mod.isLocked ? "opacity-60" : ""}>
                <CardContent className="p-0">
                  <div className="flex items-center gap-4 p-4">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-sm font-bold ${mod.isCompleted
                          ? "bg-success/10 text-success"
                          : mod.isLocked
                            ? "bg-muted text-muted-foreground"
                            : "bg-primary/10 text-primary"
                        }`}
                    >
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
                      <Badge
                        variant="secondary"
                        className="bg-success/10 text-success border-0 shrink-0"
                      >
                        Complete
                      </Badge>
                    )}
                  </div>

                  {!mod.isLocked && (
                    <div className="border-t border-border">
                      {mod.lessons.map((lesson) => (
                        <Link
                          key={lesson.id}
                          href={`/dashboard/courses/${courseId}/lessons/${lesson.id}`}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-secondary/50 transition-colors"
                        >
                          <div
                            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${lesson.isCompleted
                                ? "bg-success/10 text-success"
                                : "bg-muted text-muted-foreground"
                              }`}
                          >
                            {lesson.isCompleted ? (
                              <CheckCircle2 className="h-3.5 w-3.5" />
                            ) : (
                              getLessonIcon(lesson.type)
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm truncate">{lesson.title}</p>
                            <p className="text-[10px] text-muted-foreground capitalize">
                              {lesson.type} &middot; {lesson.duration}
                            </p>
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

            {courseModules.length === 0 && (
              <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-border py-12 text-center">
                <BookOpen className="h-6 w-6 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">
                  No modules available yet for this course.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" />
                About This Course
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {course!.summary}
              </p>
            </CardContent>
          </Card>

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
                        {a.status === "graded"
                          ? `Grade: ${a.grade}/${a.maxGrade}`
                          : `Due: ${new Date(a.dueDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}`}
                      </p>
                    </div>
                    <Badge
                      variant="secondary"
                      className={`shrink-0 border-0 text-[10px] ${a.status === "graded"
                          ? "bg-success/10 text-success"
                          : a.status === "submitted"
                            ? "bg-primary/10 text-primary"
                            : a.status === "overdue"
                              ? "bg-destructive/10 text-destructive"
                              : "bg-warning/10 text-warning-foreground"
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
