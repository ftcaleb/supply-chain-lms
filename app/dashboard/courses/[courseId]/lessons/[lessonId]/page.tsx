"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Circle,
  Play,
  FileText,
  HelpCircle,
  Activity,
  Download,
  RefreshCw,
  ChevronRight,
  BookOpen,
  Clock,
} from "lucide-react"
import { courses, modules } from "@/lib/mock-data"
import { useState } from "react"

function getLessonIcon(type: string, size: string = "h-4 w-4") {
  switch (type) {
    case "video": return <Play className={size} />
    case "document": return <FileText className={size} />
    case "quiz": return <HelpCircle className={size} />
    case "activity": return <Activity className={size} />
    default: return <Circle className={size} />
  }
}

function getFileIcon(type: string) {
  switch (type) {
    case "pdf": return "PDF"
    case "pptx": return "PPT"
    case "xlsx": return "XLS"
    case "doc": return "DOC"
    default: return "FILE"
  }
}

export default function LessonPage() {
  const params = useParams()
  const courseId = params.courseId as string
  const lessonId = params.lessonId as string

  const course = courses.find((c) => c.id === courseId)
  const courseModules = modules.filter((m) => m.courseId === courseId)

  // Find current lesson across all modules
  let currentLesson = null
  let currentModule = null
  let allLessons: { lesson: (typeof courseModules)[0]["lessons"][0]; module: (typeof courseModules)[0] }[] = []

  for (const mod of courseModules) {
    for (const lesson of mod.lessons) {
      allLessons.push({ lesson, module: mod })
      if (lesson.id === lessonId) {
        currentLesson = lesson
        currentModule = mod
      }
    }
  }

  const currentIndex = allLessons.findIndex((l) => l.lesson.id === lessonId)
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null

  const [completed, setCompleted] = useState(currentLesson?.isCompleted || false)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  if (!course || !currentLesson || !currentModule) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-muted-foreground">Lesson not found</p>
      </div>
    )
  }

  const moduleProgress = Math.round(
    (currentModule.lessons.filter((l) => l.isCompleted).length / currentModule.lessons.length) * 100
  )

  return (
    <div className="space-y-4">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-sm text-muted-foreground flex-wrap">
        <Link href="/dashboard/courses" className="hover:text-foreground transition-colors">Courses</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href={`/dashboard/courses/${courseId}`} className="hover:text-foreground transition-colors">{course.title}</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground font-medium truncate">{currentModule.title}</span>
      </div>

      <div className="flex gap-6">
        {/* Main Content Area */}
        <div className="flex-1 min-w-0 space-y-6">
          {/* Video/Content Area */}
          <Card className="overflow-hidden">
            <div className="relative bg-foreground/5 flex items-center justify-center" style={{ minHeight: "360px" }}>
              {currentLesson.type === "video" ? (
                <div className="flex flex-col items-center gap-4 text-muted-foreground">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <Play className="h-8 w-8 text-primary" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-foreground">{currentLesson.title}</p>
                    <p className="text-xs mt-1">Video Lesson &middot; {currentLesson.duration}</p>
                  </div>
                  <Button size="lg" className="mt-2">
                    <Play className="mr-2 h-4 w-4" /> Play Video
                  </Button>
                </div>
              ) : currentLesson.type === "document" ? (
                <div className="flex flex-col items-center gap-4 text-muted-foreground p-8">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <FileText className="h-8 w-8 text-primary" />
                  </div>
                  <div className="text-center max-w-md">
                    <p className="text-sm font-medium text-foreground">{currentLesson.title}</p>
                    <p className="text-xs mt-1">Reading Material &middot; {currentLesson.duration}</p>
                    <p className="text-xs mt-3 leading-relaxed">
                      This reading covers key concepts in {currentModule.title.toLowerCase()}.
                      Review the material below and complete the associated activities to mark this lesson as done.
                    </p>
                  </div>
                </div>
              ) : currentLesson.type === "quiz" ? (
                <div className="flex flex-col items-center gap-4 text-muted-foreground p-8">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <HelpCircle className="h-8 w-8 text-primary" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-foreground">{currentLesson.title}</p>
                    <p className="text-xs mt-1">Assessment &middot; {currentLesson.duration}</p>
                  </div>
                  <Button size="lg" className="mt-2">
                    Start Quiz
                  </Button>
                  <p className="text-[10px]">Quiz delivered via Moodle</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4 text-muted-foreground p-8">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
                    <Activity className="h-8 w-8 text-accent" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-foreground">{currentLesson.title}</p>
                    <p className="text-xs mt-1">Interactive Activity &middot; {currentLesson.duration}</p>
                  </div>
                  <Button size="lg" className="mt-2">
                    Begin Activity
                  </Button>
                </div>
              )}

              {/* Moodle sync badge */}
              <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-card/80 backdrop-blur px-2.5 py-1">
                <RefreshCw className="h-3 w-3 text-success" />
                <span className="text-[10px] font-medium text-success">Moodle Synced</span>
              </div>
            </div>
          </Card>

          {/* Lesson Info */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="space-y-1">
              <h1 className="text-xl font-bold font-[family-name:var(--font-display)]">{currentLesson.title}</h1>
              <p className="text-sm text-muted-foreground">
                {currentModule.title} &middot; Week {currentModule.weekNumber} &middot;{" "}
                <span className="capitalize">{currentLesson.type}</span> &middot; {currentLesson.duration}
              </p>
            </div>
            <Button
              variant={completed ? "outline" : "default"}
              onClick={() => setCompleted(!completed)}
              className={completed ? "border-success text-success hover:bg-success/10" : ""}
            >
              {completed ? <CheckCircle2 className="mr-2 h-4 w-4" /> : <Circle className="mr-2 h-4 w-4" />}
              {completed ? "Completed" : "Mark as Complete"}
            </Button>
          </div>

          {/* Resources */}
          {currentLesson.resources.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Downloadable Resources</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {currentLesson.resources.map((resource) => (
                  <div
                    key={resource.id}
                    className="flex items-center justify-between rounded-lg border border-border p-3 hover:bg-secondary/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded bg-primary/10 text-[10px] font-bold text-primary">
                        {getFileIcon(resource.type)}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{resource.name}</p>
                        <p className="text-[10px] text-muted-foreground">{resource.type.toUpperCase()} {resource.size && `&middot; ${resource.size}`}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Download className="h-4 w-4" />
                      <span className="sr-only">Download {resource.name}</span>
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between pt-2">
            {prevLesson ? (
              <Link href={`/dashboard/courses/${courseId}/lessons/${prevLesson.lesson.id}`}>
                <Button variant="outline" size="sm">
                  <ArrowLeft className="mr-2 h-3.5 w-3.5" /> Previous
                </Button>
              </Link>
            ) : (
              <div />
            )}
            {nextLesson ? (
              <Link href={`/dashboard/courses/${courseId}/lessons/${nextLesson.lesson.id}`}>
                <Button size="sm">
                  Next <ArrowRight className="ml-2 h-3.5 w-3.5" />
                </Button>
              </Link>
            ) : (
              <Link href={`/dashboard/courses/${courseId}`}>
                <Button size="sm">
                  Back to Course <ArrowRight className="ml-2 h-3.5 w-3.5" />
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Lesson Sidebar */}
        <div className="hidden xl:block w-72 shrink-0 space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" />
                {currentModule.title}
              </CardTitle>
              <div className="space-y-1 pt-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Module progress</span>
                  <span className="font-medium">{moduleProgress}%</span>
                </div>
                <Progress value={moduleProgress} className="h-1" />
              </div>
            </CardHeader>
            <CardContent className="space-y-0.5">
              {currentModule.lessons.map((lesson) => (
                <Link
                  key={lesson.id}
                  href={`/dashboard/courses/${courseId}/lessons/${lesson.id}`}
                  className={`flex items-center gap-2 rounded-md px-2 py-2 text-xs transition-colors ${
                    lesson.id === lessonId
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  }`}
                >
                  <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                    lesson.isCompleted ? "bg-success/10 text-success" : lesson.id === lessonId ? "bg-primary/20" : "bg-muted"
                  }`}>
                    {lesson.isCompleted ? (
                      <CheckCircle2 className="h-3 w-3" />
                    ) : (
                      getLessonIcon(lesson.type, "h-2.5 w-2.5")
                    )}
                  </span>
                  <span className="truncate">{lesson.title}</span>
                </Link>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
              <div>
                <p className="text-xs font-medium">Estimated Time</p>
                <p className="text-xs text-muted-foreground">{currentLesson.duration}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
