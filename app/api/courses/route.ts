import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { fetchMoodleCourses } from "@/lib/moodle"

export const dynamic = "force-dynamic"

export async function GET(_req: NextRequest) {
    const cookieStore = await cookies()

    // Per-user HTTP-only cookie takes priority (future login flow)
    const cookieToken = cookieStore.get("moodle_token")?.value ?? null
    const envToken = process.env.MOODLE_TOKEN ?? null

    const token = cookieToken ?? envToken

    if (!token) {
        return NextResponse.json(
            { error: "Unauthorized: no Moodle token found." },
            { status: 401, headers: { "Cache-Control": "no-store" } }
        )
    }

    /**
     * userid strategy:
     *  - Cookie token present → userid=0 (resolves to that token's owner)
     *  - Env-var token (dev fallback) → userid=2 (explicit dev/admin user)
     *
     * Swap to userid=0 for both paths once per-user auth is fully implemented.
     */
    const userId = cookieToken ? "0" : "2"

    try {
        const courses = await fetchMoodleCourses(token, userId)
        return NextResponse.json(
            { courses },
            { headers: { "Cache-Control": "no-store" } }
        )
    } catch (err) {
        const message =
            err instanceof Error
                ? err.message
                : "Unknown error communicating with Moodle."

        const isAuthError =
            message.includes("invalidtoken") ||
            message.includes("Invalid token") ||
            message.includes("accessdenied")

        return NextResponse.json(
            { error: isAuthError ? "Invalid or expired Moodle token." : message },
            {
                status: isAuthError ? 401 : 502,
                headers: { "Cache-Control": "no-store" },
            }
        )
    }
}
