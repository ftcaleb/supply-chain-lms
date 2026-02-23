"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GraduationCap, ArrowRight, Eye, EyeOff, Package, Truck, BarChart3, Globe, Users, Award, Star } from "lucide-react"

export default function AuthPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      router.push("/dashboard")
    }, 800)
  }

  function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      router.push("/dashboard")
    }, 800)
  }

  return (
    <div className="flex min-h-screen">
      {/* Left - Hero Branding Panel */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-[55%] flex-col justify-between bg-primary text-primary-foreground relative overflow-hidden">
        {/* Subtle decorative elements */}
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle at 25% 25%, white 1px, transparent 1px), radial-gradient(circle at 75% 75%, white 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-accent/10 blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-accent/5 blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10 flex flex-col justify-between h-full p-10 xl:p-14">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent">
              <GraduationCap className="h-5 w-5 text-accent-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight font-[family-name:var(--font-display)]">ChainLearn</h1>
              <p className="text-xs text-primary-foreground/50">Excellence in Education</p>
            </div>
          </div>

          {/* Hero Text */}
          <div className="max-w-lg space-y-8">
            <div className="space-y-2">
              <p className="text-sm font-medium text-accent tracking-widest uppercase">Established 2024</p>
              <h2 className="text-4xl xl:text-5xl font-bold tracking-tight leading-[1.15] font-[family-name:var(--font-display)] text-balance">
                Transforming Supply Chain Education
              </h2>
              <p className="text-base text-primary-foreground/65 leading-relaxed mt-4">
                Professional courses designed and delivered by industry experts. Our programmes are practical, relevant, and aligned with modern organisational needs.
              </p>
            </div>

            {/* Stats row -- SkillHub style */}
            <div className="flex items-center gap-8">
              {[
                { value: "20+", label: "Years of Experience" },
                { value: "3,450+", label: "Professionals Trained" },
                { value: "98%", label: "Satisfied Learners" },
              ].map((stat) => (
                <div key={stat.label} className="space-y-1">
                  <p className="text-2xl xl:text-3xl font-bold text-accent">{stat.value}</p>
                  <p className="text-xs text-primary-foreground/50">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Features grid */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Package, label: "Procurement & Sourcing" },
                { icon: Truck, label: "Logistics Operations" },
                { icon: BarChart3, label: "Demand Forecasting" },
                { icon: Globe, label: "Global Trade" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3 rounded-xl border border-primary-foreground/10 bg-primary-foreground/5 p-3.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/15">
                    <item.icon className="h-4 w-4 text-accent" />
                  </div>
                  <p className="text-sm font-medium text-primary-foreground/80">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between text-xs text-primary-foreground/35">
            <p>Powered by Moodle LMS Integration</p>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-3 w-3 fill-accent text-accent" />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right - Auth Forms */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-10 bg-background">
        {/* Mobile logo */}
        <div className="mb-8 flex items-center gap-3 lg:hidden">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary">
            <GraduationCap className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold font-[family-name:var(--font-display)]">ChainLearn</h1>
            <p className="text-xs text-muted-foreground">Supply Chain LMS</p>
          </div>
        </div>

        <Card className="w-full max-w-md border-border/60 shadow-xl shadow-primary/5">
          <Tabs defaultValue="login">
            <CardHeader className="space-y-4 pb-4">
              <TabsList className="w-full bg-secondary">
                <TabsTrigger value="login" className="flex-1">Sign In</TabsTrigger>
                <TabsTrigger value="register" className="flex-1">Register</TabsTrigger>
              </TabsList>
            </CardHeader>

            <CardContent>
              {/* Login Tab */}
              <TabsContent value="login" className="mt-0">
                <div className="space-y-1 mb-6">
                  <CardTitle className="text-xl font-[family-name:var(--font-display)]">Welcome back</CardTitle>
                  <CardDescription>Sign in to continue your learning journey</CardDescription>
                </div>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="you@university.edu" required className="h-11" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      <Link href="#" className="text-xs text-primary hover:underline">
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        required
                        className="h-11"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        <span className="sr-only">{showPassword ? "Hide" : "Show"} password</span>
                      </Button>
                    </div>
                  </div>
                  <Button type="submit" className="w-full h-11 text-sm font-semibold" disabled={isLoading}>
                    {isLoading ? "Signing in..." : "Sign In"}
                    {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
                  </Button>
                </form>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-card px-3 text-xs text-muted-foreground">or continue with</span>
                  </div>
                </div>

                <Button variant="outline" className="w-full h-11" onClick={() => router.push("/dashboard")}>
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Sign in with Moodle SSO
                </Button>
              </TabsContent>

              {/* Register Tab */}
              <TabsContent value="register" className="mt-0">
                <div className="space-y-1 mb-6">
                  <CardTitle className="text-xl font-[family-name:var(--font-display)]">Create account</CardTitle>
                  <CardDescription>Start your supply chain learning journey</CardDescription>
                </div>
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" placeholder="Alex" required className="h-11" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" placeholder="Nakamura" required className="h-11" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="regEmail">Email</Label>
                    <Input id="regEmail" type="email" placeholder="you@university.edu" required className="h-11" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <select
                      id="role"
                      className="flex h-11 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      defaultValue="student"
                    >
                      <option value="student">Student</option>
                      <option value="lecturer">Lecturer</option>
                      <option value="admin">Administrator</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="regPassword">Password</Label>
                    <Input id="regPassword" type="password" placeholder="Create a password" required className="h-11" />
                  </div>
                  <Button type="submit" className="w-full h-11 text-sm font-semibold" disabled={isLoading}>
                    {isLoading ? "Creating account..." : "Create Account"}
                    {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
                  </Button>
                </form>
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          By continuing, you agree to the Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  )
}
