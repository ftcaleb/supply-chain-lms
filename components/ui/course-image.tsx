"use client"

import Image from "next/image"
import { BookOpen } from "lucide-react"
import { useState } from "react"

const GRADIENT_COLORS = [
    "from-violet-500/20 to-indigo-500/20",
    "from-cyan-500/20 to-teal-500/20",
    "from-orange-500/20 to-amber-500/20",
    "from-rose-500/20 to-pink-500/20",
    "from-emerald-500/20 to-green-500/20",
    "from-sky-500/20 to-blue-500/20",
]

interface CourseImageProps {
    src: string | undefined
    alt: string
    /** Index used to pick a deterministic gradient when the image fails */
    index?: number
    className?: string
}

/**
 * Client component that renders a Moodle course image with an automatic
 * gradient + icon fallback when the image fails to load (e.g. auth-gated
 * Moodle pluginfile URLs in development).
 */
export function CourseImage({ src, alt, index = 0, className }: CourseImageProps) {
    const [failed, setFailed] = useState(false)
    const gradient = GRADIENT_COLORS[index % GRADIENT_COLORS.length]

    if (!src || failed) {
        return (
            <div
                className={`h-full w-full bg-gradient-to-br ${gradient} flex items-center justify-center ${className ?? ""}`}
            >
                <BookOpen className="h-10 w-10 text-foreground/20" />
            </div>
        )
    }

    return (
        <Image
            src={src}
            alt={alt}
            fill
            className={`object-cover transition-transform duration-300 group-hover:scale-105 ${className ?? ""}`}
            unoptimized
            onError={() => setFailed(true)}
        />
    )
}
