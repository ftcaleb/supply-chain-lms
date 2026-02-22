"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  ClipboardList,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  Send,
  FileText,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Filter,
} from "lucide-react"
import { assignments, courses } from "@/lib/mock-data"

type FilterType = "all" | "pending" | "submitted" | "graded" | "overdue"

function getStatusConfig(status: string) {
  switch (status) {
    case "graded":
      return { label: "Graded", icon: CheckCircle2, className: "bg-success/10 text-success border-0" }
    case "submitted":
      return { label: "Submitted", icon: Send, className: "bg-primary/10 text-primary border-0" }
    case "pending":
      return { label: "Pending", icon: Clock, className: "bg-warning/10 text-warning-foreground border-0" }
    case "overdue":
      return { label: "Overdue", icon: AlertCircle, className: "bg-destructive/10 text-destructive border-0" }
    default:
      return { label: status, icon: Clock, className: "" }
  }
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

function getDaysUntilDue(dateStr: string) {
  const due = new Date(dateStr)
  const now = new Date()
  const diff = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  return diff
}

export default function AssignmentsPage() {
  const [filter, setFilter] = useState<FilterType>("all")
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const filteredAssignments = filter === "all" ? assignments : assignments.filter((a) => a.status === filter)

  const stats = {
    total: assignments.length,
    pending: assignments.filter((a) => a.status === "pending").length,
    submitted: assignments.filter((a) => a.status === "submitted").length,
    graded: assignments.filter((a) => a.status === "graded").length,
    overdue: assignments.filter((a) => a.status === "overdue").length,
  }

  const averageGrade = Math.round(
    assignments.filter((a) => a.grade).reduce((sum, a) => sum + (a.grade || 0), 0) /
    Math.max(assignments.filter((a) => a.grade).length, 1)
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight font-[family-name:var(--font-display)]">
          Assignments & Assessments
        </h1>
        <p className="text-sm text-muted-foreground">
          View your assignments, grades, and feedback synced from Moodle
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <ClipboardList className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-xl font-bold">{stats.total}</p>
              <p className="text-[10px] text-muted-foreground">Total</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-warning/10">
              <Clock className="h-4 w-4 text-warning-foreground" />
            </div>
            <div>
              <p className="text-xl font-bold">{stats.pending}</p>
              <p className="text-[10px] text-muted-foreground">Pending</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <Send className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-xl font-bold">{stats.submitted}</p>
              <p className="text-[10px] text-muted-foreground">Submitted</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-success/10">
              <CheckCircle2 className="h-4 w-4 text-success" />
            </div>
            <div>
              <p className="text-xl font-bold">{stats.graded}</p>
              <p className="text-[10px] text-muted-foreground">Graded</p>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-2 lg:col-span-1">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-destructive/10">
              <AlertCircle className="h-4 w-4 text-destructive" />
            </div>
            <div>
              <p className="text-xl font-bold">{stats.overdue}</p>
              <p className="text-[10px] text-muted-foreground">Overdue</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <Filter className="h-4 w-4 text-muted-foreground" />
        {(["all", "pending", "submitted", "graded", "overdue"] as FilterType[]).map((f) => (
          <Button
            key={f}
            variant={filter === f ? "default" : "outline"}
            size="sm"
            className="rounded-full capitalize"
            onClick={() => setFilter(f)}
          >
            {f}
            {f !== "all" && (
              <span className="ml-1 text-[10px]">
                ({f === "pending" ? stats.pending : f === "submitted" ? stats.submitted : f === "graded" ? stats.graded : stats.overdue})
              </span>
            )}
          </Button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Assignment List */}
        <div className="lg:col-span-2 space-y-3">
          {filteredAssignments.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <ClipboardList className="h-10 w-10 mb-3 opacity-50" />
                <p className="text-sm font-medium">No assignments found</p>
                <p className="text-xs">Try changing the filter</p>
              </CardContent>
            </Card>
          ) : (
            filteredAssignments.map((assignment) => {
              const course = courses.find((c) => c.id === assignment.courseId)
              const statusConfig = getStatusConfig(assignment.status)
              const StatusIcon = statusConfig.icon
              const daysUntilDue = getDaysUntilDue(assignment.dueDate)
              const isExpanded = expandedId === assignment.id

              return (
                <Card
                  key={assignment.id}
                  className={`transition-all ${assignment.status === "overdue" ? "border-destructive/30" : ""}`}
                >
                  <CardContent className="p-0">
                    {/* Main row */}
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : assignment.id)}
                      className="flex items-center gap-4 p-4 w-full text-left hover:bg-secondary/30 transition-colors"
                    >
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                        assignment.status === "graded" ? "bg-success/10" :
                        assignment.status === "overdue" ? "bg-destructive/10" :
                        assignment.status === "submitted" ? "bg-primary/10" :
                        "bg-warning/10"
                      }`}>
                        <StatusIcon className={`h-5 w-5 ${
                          assignment.status === "graded" ? "text-success" :
                          assignment.status === "overdue" ? "text-destructive" :
                          assignment.status === "submitted" ? "text-primary" :
                          "text-warning-foreground"
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-semibold">{assignment.title}</p>
                          <RefreshCw className="h-3 w-3 text-success shrink-0" aria-label="Synced from Moodle" />
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{course?.title}</p>
                      </div>
                      <div className="hidden sm:flex flex-col items-end gap-1 shrink-0">
                        <Badge variant="secondary" className={statusConfig.className}>
                          {statusConfig.label}
                        </Badge>
                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {formatDate(assignment.dueDate)}
                        </div>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                      )}
                    </button>

                    {/* Expanded Details */}
                    {isExpanded && (
                      <div className="border-t border-border px-4 py-4 space-y-4 bg-secondary/20">
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="space-y-2">
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Due Date</p>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{formatDate(assignment.dueDate)}</span>
                              {assignment.status === "pending" && daysUntilDue > 0 && (
                                <span className="text-xs text-muted-foreground">({daysUntilDue} days left)</span>
                              )}
                              {assignment.status === "overdue" && (
                                <span className="text-xs text-destructive">(Overdue by {Math.abs(daysUntilDue)} days)</span>
                              )}
                            </div>
                          </div>
                          <div className="space-y-2">
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</p>
                            <Badge variant="secondary" className={statusConfig.className}>
                              {statusConfig.label}
                            </Badge>
                          </div>
                        </div>

                        {assignment.grade !== undefined && (
                          <div className="space-y-2">
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Grade</p>
                            <div className="flex items-center gap-3">
                              <div className={`text-2xl font-bold ${
                                (assignment.grade / assignment.maxGrade) >= 0.8 ? "text-success" :
                                (assignment.grade / assignment.maxGrade) >= 0.6 ? "text-warning-foreground" :
                                "text-destructive"
                              }`}>
                                {assignment.grade}
                              </div>
                              <span className="text-sm text-muted-foreground">/ {assignment.maxGrade}</span>
                              <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all ${
                                    (assignment.grade / assignment.maxGrade) >= 0.8 ? "bg-success" :
                                    (assignment.grade / assignment.maxGrade) >= 0.6 ? "bg-warning" :
                                    "bg-destructive"
                                  }`}
                                  style={{ width: `${(assignment.grade / assignment.maxGrade) * 100}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        )}

                        {assignment.feedback && (
                          <div className="space-y-2">
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Instructor Feedback</p>
                            <div className="rounded-lg bg-card border border-border p-3">
                              <p className="text-sm text-foreground leading-relaxed">{assignment.feedback}</p>
                            </div>
                          </div>
                        )}

                        {(assignment.status === "pending" || assignment.status === "overdue") && (
                          <div className="flex items-center gap-2 pt-1">
                            <Button size="sm">
                              <FileText className="mr-2 h-3.5 w-3.5" />
                              Submit via Moodle
                            </Button>
                            <p className="text-[10px] text-muted-foreground">Submission handled through Moodle</p>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })
          )}
        </div>

        {/* Right Sidebar */}
        <div className="space-y-4">
          {/* Grade Summary */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Grade Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-center">
                <div className="relative flex h-28 w-28 items-center justify-center">
                  <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="8"
                      className="text-secondary"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="8"
                      strokeDasharray={`${averageGrade * 2.51} 251`}
                      strokeLinecap="round"
                      className="text-primary"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-2xl font-bold">{averageGrade}%</span>
                    <span className="text-[10px] text-muted-foreground">Average</span>
                  </div>
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                {assignments.filter((a) => a.grade).map((a) => {
                  const course = courses.find((c) => c.id === a.courseId)
                  return (
                    <div key={a.id} className="flex items-center justify-between">
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium truncate">{a.title}</p>
                        <p className="text-[10px] text-muted-foreground">{course?.title}</p>
                      </div>
                      <span className={`text-sm font-bold shrink-0 ml-2 ${
                        (a.grade! / a.maxGrade) >= 0.8 ? "text-success" :
                        (a.grade! / a.maxGrade) >= 0.6 ? "text-warning-foreground" :
                        "text-destructive"
                      }`}>
                        {a.grade}%
                      </span>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Deadlines */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Deadlines</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {assignments
                .filter((a) => a.status === "pending")
                .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
                .map((a) => {
                  const daysLeft = getDaysUntilDue(a.dueDate)
                  return (
                    <div key={a.id} className="flex items-start gap-3">
                      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                        daysLeft <= 3 ? "bg-destructive/10 text-destructive" :
                        daysLeft <= 7 ? "bg-warning/10 text-warning-foreground" :
                        "bg-primary/10 text-primary"
                      }`}>
                        {daysLeft}d
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-medium truncate">{a.title}</p>
                        <p className="text-[10px] text-muted-foreground">{formatDate(a.dueDate)}</p>
                      </div>
                    </div>
                  )
                })}
            </CardContent>
          </Card>

          {/* Moodle Info */}
          <Card className="border-success/20 bg-success/5">
            <CardContent className="p-4 flex items-start gap-3">
              <RefreshCw className="h-4 w-4 text-success shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-medium">Synced from Moodle</p>
                <p className="text-[10px] text-muted-foreground leading-relaxed mt-1">
                  All assignments and grades are pulled from your institution{"'"}s Moodle instance. Submit assignments directly through Moodle.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
