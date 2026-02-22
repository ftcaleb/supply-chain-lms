// Mock data for the Supply Chain LMS
// In production, this would be fetched from Moodle via API/LTI

export interface User {
  id: string
  name: string
  email: string
  role: "student" | "lecturer" | "admin"
  avatar?: string
}

export interface Course {
  id: string
  title: string
  description: string
  category: string
  instructor: string
  instructorTitle: string
  progress: number
  totalModules: number
  completedModules: number
  enrolledStudents: number
  duration: string
  level: "Beginner" | "Intermediate" | "Advanced"
  lastAccessed?: string
  outcomes: string[]
  syncedFromMoodle: boolean
}

export interface Module {
  id: string
  courseId: string
  title: string
  weekNumber: number
  description: string
  lessons: Lesson[]
  isCompleted: boolean
  isLocked: boolean
}

export interface Lesson {
  id: string
  moduleId: string
  title: string
  type: "video" | "document" | "quiz" | "activity"
  duration: string
  isCompleted: boolean
  resources: Resource[]
}

export interface Resource {
  id: string
  name: string
  type: "pdf" | "pptx" | "xlsx" | "doc" | "link"
  size?: string
  url: string
}

export interface Assignment {
  id: string
  courseId: string
  title: string
  dueDate: string
  status: "pending" | "submitted" | "graded" | "overdue"
  grade?: number
  maxGrade: number
  feedback?: string
  syncedFromMoodle: boolean
}

export interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "deadline" | "grade" | "announcement"
  timestamp: string
  isRead: boolean
}

export const currentUser: User = {
  id: "u1",
  name: "Alex Nakamura",
  email: "alex.nakamura@university.edu",
  role: "student",
}

export const courses: Course[] = [
  {
    id: "c1",
    title: "Supply Chain Fundamentals",
    description: "Comprehensive introduction to supply chain management principles, covering end-to-end supply chain operations, key frameworks, and foundational concepts used across industries.",
    category: "Operations",
    instructor: "Dr. Sarah Mitchell",
    instructorTitle: "Professor of Operations Management",
    progress: 72,
    totalModules: 8,
    completedModules: 5,
    enrolledStudents: 145,
    duration: "10 weeks",
    level: "Beginner",
    lastAccessed: "2 hours ago",
    outcomes: [
      "Understand core supply chain concepts and terminology",
      "Analyze supply chain networks and flow patterns",
      "Apply demand forecasting techniques",
      "Evaluate supplier selection criteria",
      "Design basic supply chain strategies",
    ],
    syncedFromMoodle: true,
  },
  {
    id: "c2",
    title: "Procurement & Sourcing Strategy",
    description: "Learn strategic procurement methodologies, supplier relationship management, and cost optimization techniques used by leading organizations.",
    category: "Procurement",
    instructor: "Prof. James Okafor",
    instructorTitle: "Head of Procurement Studies",
    progress: 45,
    totalModules: 6,
    completedModules: 3,
    enrolledStudents: 98,
    duration: "8 weeks",
    level: "Intermediate",
    lastAccessed: "1 day ago",
    outcomes: [
      "Develop strategic sourcing plans",
      "Negotiate supplier contracts effectively",
      "Implement procurement best practices",
      "Manage supplier performance metrics",
    ],
    syncedFromMoodle: true,
  },
  {
    id: "c3",
    title: "Warehouse & Inventory Management",
    description: "Master inventory control systems, warehouse layout optimization, and modern fulfillment strategies for efficient distribution operations.",
    category: "Warehousing",
    instructor: "Dr. Lisa Chen",
    instructorTitle: "Director of Logistics Research",
    progress: 20,
    totalModules: 7,
    completedModules: 1,
    enrolledStudents: 112,
    duration: "9 weeks",
    level: "Intermediate",
    lastAccessed: "3 days ago",
    outcomes: [
      "Design optimal warehouse layouts",
      "Implement inventory control methods (ABC, EOQ, JIT)",
      "Utilize warehouse management systems (WMS)",
      "Optimize order fulfillment processes",
    ],
    syncedFromMoodle: true,
  },
  {
    id: "c4",
    title: "Global Trade & Logistics",
    description: "Navigate international logistics operations including customs, trade compliance, freight management, and cross-border supply chain coordination.",
    category: "Logistics",
    instructor: "Prof. Ahmed Hassan",
    instructorTitle: "International Trade Specialist",
    progress: 0,
    totalModules: 10,
    completedModules: 0,
    enrolledStudents: 76,
    duration: "12 weeks",
    level: "Advanced",
    lastAccessed: undefined,
    outcomes: [
      "Navigate international trade regulations",
      "Manage cross-border logistics operations",
      "Optimize freight and transportation costs",
      "Implement trade compliance frameworks",
    ],
    syncedFromMoodle: true,
  },
  {
    id: "c5",
    title: "ERP Systems for Supply Chain",
    description: "Hands-on course covering Enterprise Resource Planning (ERP) systems with focus on supply chain modules including SAP, Oracle, and emerging platforms.",
    category: "ERP",
    instructor: "Dr. Maria Gonzalez",
    instructorTitle: "ERP Implementation Consultant",
    progress: 88,
    totalModules: 6,
    completedModules: 5,
    enrolledStudents: 64,
    duration: "8 weeks",
    level: "Advanced",
    lastAccessed: "5 hours ago",
    outcomes: [
      "Configure ERP supply chain modules",
      "Integrate procurement and inventory systems",
      "Generate and analyze supply chain reports",
      "Plan ERP implementation strategies",
    ],
    syncedFromMoodle: true,
  },
  {
    id: "c6",
    title: "Demand Forecasting & Planning",
    description: "Statistical and data-driven approaches to demand forecasting, sales and operations planning (S&OP), and supply-demand balancing in modern supply chains.",
    category: "Forecasting",
    instructor: "Dr. Sarah Mitchell",
    instructorTitle: "Professor of Operations Management",
    progress: 60,
    totalModules: 5,
    completedModules: 3,
    enrolledStudents: 89,
    duration: "7 weeks",
    level: "Intermediate",
    lastAccessed: "12 hours ago",
    outcomes: [
      "Apply statistical forecasting methods",
      "Design S&OP processes",
      "Balance supply and demand effectively",
      "Use forecasting software tools",
    ],
    syncedFromMoodle: true,
  },
]

export const modules: Module[] = [
  {
    id: "m1",
    courseId: "c1",
    title: "Introduction to Supply Chain",
    weekNumber: 1,
    description: "Overview of supply chain management, its evolution, and importance in modern business.",
    isCompleted: true,
    isLocked: false,
    lessons: [
      { id: "l1", moduleId: "m1", title: "What is Supply Chain Management?", type: "video", duration: "18 min", isCompleted: true, resources: [{ id: "r1", name: "SCM Overview Slides", type: "pptx", size: "2.4 MB", url: "#" }] },
      { id: "l2", moduleId: "m1", title: "History & Evolution of SCM", type: "document", duration: "12 min", isCompleted: true, resources: [{ id: "r2", name: "Reading: SCM Timeline", type: "pdf", size: "1.1 MB", url: "#" }] },
      { id: "l3", moduleId: "m1", title: "Key Concepts Quiz", type: "quiz", duration: "15 min", isCompleted: true, resources: [] },
    ],
  },
  {
    id: "m2",
    courseId: "c1",
    title: "Supply Chain Strategy & Design",
    weekNumber: 2,
    description: "Strategic frameworks for designing effective supply chains aligned with business objectives.",
    isCompleted: true,
    isLocked: false,
    lessons: [
      { id: "l4", moduleId: "m2", title: "Strategic Fit in Supply Chains", type: "video", duration: "22 min", isCompleted: true, resources: [{ id: "r3", name: "Strategy Framework", type: "pdf", size: "3.2 MB", url: "#" }] },
      { id: "l5", moduleId: "m2", title: "Push vs. Pull Strategies", type: "video", duration: "15 min", isCompleted: true, resources: [] },
      { id: "l6", moduleId: "m2", title: "Case Study: Amazon Supply Chain", type: "document", duration: "20 min", isCompleted: true, resources: [{ id: "r4", name: "Amazon Case Study", type: "pdf", size: "2.8 MB", url: "#" }] },
      { id: "l7", moduleId: "m2", title: "Module 2 Assessment", type: "quiz", duration: "20 min", isCompleted: true, resources: [] },
    ],
  },
  {
    id: "m3",
    courseId: "c1",
    title: "Demand Planning & Forecasting",
    weekNumber: 3,
    description: "Methods and tools for predicting customer demand and planning supply accordingly.",
    isCompleted: true,
    isLocked: false,
    lessons: [
      { id: "l8", moduleId: "m3", title: "Forecasting Methods Overview", type: "video", duration: "25 min", isCompleted: true, resources: [{ id: "r5", name: "Forecasting Techniques", type: "pptx", size: "4.1 MB", url: "#" }] },
      { id: "l9", moduleId: "m3", title: "Quantitative Forecasting", type: "video", duration: "20 min", isCompleted: true, resources: [{ id: "r6", name: "Excel Template", type: "xlsx", size: "0.8 MB", url: "#" }] },
      { id: "l10", moduleId: "m3", title: "Demand Planning Exercise", type: "activity", duration: "30 min", isCompleted: true, resources: [] },
    ],
  },
  {
    id: "m4",
    courseId: "c1",
    title: "Procurement & Supplier Management",
    weekNumber: 4,
    description: "Fundamentals of procurement processes, supplier evaluation, and vendor management.",
    isCompleted: true,
    isLocked: false,
    lessons: [
      { id: "l11", moduleId: "m4", title: "The Procurement Process", type: "video", duration: "20 min", isCompleted: true, resources: [] },
      { id: "l12", moduleId: "m4", title: "Supplier Evaluation Criteria", type: "document", duration: "15 min", isCompleted: true, resources: [{ id: "r7", name: "Supplier Scorecard Template", type: "xlsx", size: "0.5 MB", url: "#" }] },
      { id: "l13", moduleId: "m4", title: "Procurement Quiz", type: "quiz", duration: "15 min", isCompleted: true, resources: [] },
    ],
  },
  {
    id: "m5",
    courseId: "c1",
    title: "Inventory Management",
    weekNumber: 5,
    description: "Inventory control methods, safety stock calculations, and optimization techniques.",
    isCompleted: true,
    isLocked: false,
    lessons: [
      { id: "l14", moduleId: "m5", title: "Inventory Control Systems", type: "video", duration: "22 min", isCompleted: true, resources: [] },
      { id: "l15", moduleId: "m5", title: "EOQ & Safety Stock", type: "video", duration: "18 min", isCompleted: true, resources: [{ id: "r8", name: "EOQ Calculator", type: "xlsx", size: "0.3 MB", url: "#" }] },
      { id: "l16", moduleId: "m5", title: "Inventory Optimization Case", type: "activity", duration: "25 min", isCompleted: true, resources: [] },
    ],
  },
  {
    id: "m6",
    courseId: "c1",
    title: "Logistics & Transportation",
    weekNumber: 6,
    description: "Transportation modes, route optimization, and logistics network design principles.",
    isCompleted: false,
    isLocked: false,
    lessons: [
      { id: "l17", moduleId: "m6", title: "Transportation Modes & Selection", type: "video", duration: "20 min", isCompleted: true, resources: [] },
      { id: "l18", moduleId: "m6", title: "Route Optimization", type: "video", duration: "18 min", isCompleted: false, resources: [{ id: "r9", name: "Route Planning Guide", type: "pdf", size: "1.9 MB", url: "#" }] },
      { id: "l19", moduleId: "m6", title: "Logistics Network Design", type: "document", duration: "15 min", isCompleted: false, resources: [] },
      { id: "l20", moduleId: "m6", title: "Module 6 Assessment", type: "quiz", duration: "20 min", isCompleted: false, resources: [] },
    ],
  },
  {
    id: "m7",
    courseId: "c1",
    title: "Warehousing & Distribution",
    weekNumber: 7,
    description: "Warehouse operations, layout design, and distribution center management.",
    isCompleted: false,
    isLocked: false,
    lessons: [
      { id: "l21", moduleId: "m7", title: "Warehouse Layout Design", type: "video", duration: "22 min", isCompleted: false, resources: [] },
      { id: "l22", moduleId: "m7", title: "Order Fulfillment Processes", type: "video", duration: "15 min", isCompleted: false, resources: [] },
      { id: "l23", moduleId: "m7", title: "WMS Systems Overview", type: "document", duration: "20 min", isCompleted: false, resources: [] },
    ],
  },
  {
    id: "m8",
    courseId: "c1",
    title: "Supply Chain Analytics & KPIs",
    weekNumber: 8,
    description: "Performance measurement, KPI frameworks, and data-driven supply chain decision making.",
    isCompleted: false,
    isLocked: true,
    lessons: [
      { id: "l24", moduleId: "m8", title: "Supply Chain KPIs", type: "video", duration: "20 min", isCompleted: false, resources: [] },
      { id: "l25", moduleId: "m8", title: "Analytics & Dashboards", type: "video", duration: "18 min", isCompleted: false, resources: [] },
      { id: "l26", moduleId: "m8", title: "Final Course Assessment", type: "quiz", duration: "45 min", isCompleted: false, resources: [] },
    ],
  },
]

export const assignments: Assignment[] = [
  {
    id: "a1",
    courseId: "c1",
    title: "Supply Chain Strategy Analysis Report",
    dueDate: "2026-03-05",
    status: "graded",
    grade: 85,
    maxGrade: 100,
    feedback: "Excellent analysis of the push-pull boundary. Consider expanding on the risk factors section.",
    syncedFromMoodle: true,
  },
  {
    id: "a2",
    courseId: "c1",
    title: "Demand Forecasting Exercise",
    dueDate: "2026-03-12",
    status: "graded",
    grade: 92,
    maxGrade: 100,
    feedback: "Outstanding work with statistical methods. Very thorough approach.",
    syncedFromMoodle: true,
  },
  {
    id: "a3",
    courseId: "c2",
    title: "Supplier Evaluation Framework",
    dueDate: "2026-03-01",
    status: "submitted",
    maxGrade: 100,
    syncedFromMoodle: true,
  },
  {
    id: "a4",
    courseId: "c1",
    title: "Logistics Network Design Project",
    dueDate: "2026-03-20",
    status: "pending",
    maxGrade: 100,
    syncedFromMoodle: true,
  },
  {
    id: "a5",
    courseId: "c3",
    title: "Warehouse Layout Optimization",
    dueDate: "2026-02-28",
    status: "overdue",
    maxGrade: 100,
    syncedFromMoodle: true,
  },
  {
    id: "a6",
    courseId: "c6",
    title: "S&OP Process Design",
    dueDate: "2026-03-15",
    status: "pending",
    maxGrade: 100,
    syncedFromMoodle: true,
  },
]

export const notifications: Notification[] = [
  {
    id: "n1",
    title: "Assignment Graded",
    message: "Your Demand Forecasting Exercise has been graded. Score: 92/100",
    type: "grade",
    timestamp: "2 hours ago",
    isRead: false,
  },
  {
    id: "n2",
    title: "Upcoming Deadline",
    message: "Logistics Network Design Project is due on March 20",
    type: "deadline",
    timestamp: "5 hours ago",
    isRead: false,
  },
  {
    id: "n3",
    title: "New Module Available",
    message: "Week 7: Warehousing & Distribution is now available in Supply Chain Fundamentals",
    type: "info",
    timestamp: "1 day ago",
    isRead: true,
  },
  {
    id: "n4",
    title: "Course Announcement",
    message: "Guest lecture by DHL logistics director scheduled for next week",
    type: "announcement",
    timestamp: "2 days ago",
    isRead: true,
  },
]

// Admin/Lecturer specific data
export const lecturerCourses = [
  {
    id: "c1",
    title: "Supply Chain Fundamentals",
    enrolledStudents: 145,
    averageProgress: 58,
    averageGrade: 76,
    activeStudents: 132,
  },
  {
    id: "c6",
    title: "Demand Forecasting & Planning",
    enrolledStudents: 89,
    averageProgress: 42,
    averageGrade: 71,
    activeStudents: 78,
  },
]

export const studentOverview = [
  { name: "Emma Thompson", progress: 85, lastActive: "Today", grade: 88 },
  { name: "Carlos Rivera", progress: 72, lastActive: "Yesterday", grade: 76 },
  { name: "Yuki Tanaka", progress: 95, lastActive: "Today", grade: 94 },
  { name: "Priya Sharma", progress: 45, lastActive: "3 days ago", grade: 62 },
  { name: "Marcus Williams", progress: 68, lastActive: "Today", grade: 73 },
  { name: "Fatima Al-Rashid", progress: 90, lastActive: "Today", grade: 91 },
  { name: "David Chen", progress: 30, lastActive: "1 week ago", grade: 55 },
  { name: "Sophie Laurent", progress: 78, lastActive: "Yesterday", grade: 80 },
]
