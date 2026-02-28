import { cookies } from "next/headers"
import Link from "next/link"
import { CourseImage } from "@/components/ui/course-image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import {
  BookOpen,
  ArrowRight,
  Search,
  RefreshCw,
  AlertCircle,
  GraduationCap,
  CheckCircle2,
  Clock,
} from "lucide-react"
import type { NormalizedCourse } from "@/lib/moodle"

// ---------------------------------------------------------------------------
// Skeleton — shown during streaming / suspense
// ---------------------------------------------------------------------------
export function CoursesSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="h-full border-border/50">
          <Skeleton className="h-36 w-full rounded-t-lg rounded-b-none" />
          <CardHeader className="pb-3">
            <Skeleton className="h-4 w-20 mb-2" />
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-3 w-full mt-1" />
            <Skeleton className="h-3 w-2/3 mt-1" />
          </CardHeader>
          <CardContent className="pt-0 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Skeleton className="h-3 w-14" />
                <Skeleton className="h-3 w-8" />
              </div>
              <Skeleton className="h-1.5 w-full" />
            </div>
            <div className="flex justify-between">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-4 w-4 rounded-sm" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------



function accentOpacity(progress: number) {
  return Math.max(0.25, progress / 100)
}

// ---------------------------------------------------------------------------
// Main page (async Server Component)
// ---------------------------------------------------------------------------
export default async function CoursesPage() {
  const cookieStore = await cookies()
  const token =
    cookieStore.get("moodle_token")?.value ?? process.env.MOODLE_TOKEN ?? null

  let courses: NormalizedCourse[] = []
  let fetchError: string | null = null

  if (!token) {
    fetchError = "You are not authenticated. Please log in to view your courses."
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

      if (res.status === 401) {
        fetchError = "Your session has expired. Please log in again."
      } else if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        fetchError = body?.error ?? `Failed to load courses (HTTP ${res.status}).`
      } else {
        const data = await res.json()
        courses = (data.courses ?? []) as NormalizedCourse[]

        // Sort by lastAccess descending (most recently visited first)
        courses.sort((a, b) => b.lastAccess - a.lastAccess)
      }
    } catch {
      fetchError = "Unable to connect to the learning platform. Please try again later."
    }
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-[family-name:var(--font-display)]">
            My Courses
          </h1>
          <p className="text-muted-foreground mt-1">
            Browse and manage your enrolled courses
          </p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search courses..." className="pl-9" />
        </div>
      </div>

      {/* Category filter pills */}
      <div className="flex flex-wrap gap-2">
        {["All", "Operations", "Procurement", "Warehousing", "Logistics", "ERP", "Forecasting"].map(
          (cat) => (
            <Button
              key={cat}
              variant={cat === "All" ? "default" : "outline"}
              size="sm"
              className="rounded-full"
            >
              {cat}
            </Button>
          )
        )}
      </div>

      {/* Error state */}
      {fetchError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Could not load courses</AlertTitle>
          <AlertDescription>{fetchError}</AlertDescription>
        </Alert>
      )}

      {/* Empty state */}
      {!fetchError && courses.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-border py-20 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <GraduationCap className="h-8 w-8 text-primary" />
          </div>
          <div>
            <p className="text-base font-semibold">No courses found</p>
            <p className="text-sm text-muted-foreground mt-1">
              You are not currently enrolled in any courses.
            </p>
          </div>
        </div>
      )}

      {/* Course Grid */}
      {!fetchError && courses.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course, idx) => (
            <Link key={course.id} href={`/dashboard/courses/${course.id}`}>
              <Card className="h-full transition-all hover:shadow-lg hover:border-accent/30 cursor-pointer group border-border/50 overflow-hidden">

                {/* Course thumbnail with automatic gradient fallback on auth/load failure */}
                <div className="relative h-36 w-full overflow-hidden">
                  <CourseImage
                    src={course.courseImage}
                    alt={course.name}
                    index={idx}
                  />

                  {/* Completion pill overlay */}
                  {course.completed && (
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-success text-success-foreground border-0 shadow-sm flex items-center gap-1 text-[10px]">
                        <CheckCircle2 className="h-3 w-3" />
                        Completed
                      </Badge>
                    </div>
                  )}

                  {/* Progress accent bar at bottom of image */}
                  {course.enableCompletion && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-background/40">
                      <div
                        className="h-full bg-accent transition-all"
                        style={{
                          width: `${course.progress}%`,
                          opacity: accentOpacity(course.progress),
                        }}
                      />
                    </div>
                  )}
                </div>

                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <Badge
                      variant="secondary"
                      className="bg-primary/10 text-primary border-0 shrink-0"
                    >
                      {course.shortname}
                    </Badge>
                    <RefreshCw
                      className="h-3.5 w-3.5 text-success shrink-0"
                      aria-label="Synced from Moodle"
                    />
                  </div>
                  <CardTitle className="text-base leading-tight group-hover:text-primary transition-colors mt-2">
                    {course.name}
                  </CardTitle>
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                    {course.summary}
                  </p>
                </CardHeader>

                <CardContent className="pt-0 space-y-4">
                  {/* Progress bar — only shown when completion tracking is on */}
                  {course.enableCompletion && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-semibold">{course.progress}%</span>
                      </div>
                      <Progress value={course.progress} className="h-1.5" />
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-1">
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      {course.lastAccessLabel ? (
                        <>
                          <Clock className="h-3 w-3 shrink-0" />
                          {course.lastAccessLabel}
                        </>
                      ) : (
                        "Not yet started"
                      )}
                    </p>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
