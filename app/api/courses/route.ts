import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { fetchMoodleCourses } from "@/lib/moodle"

export const dynamic = "force-dynamic"

/** Resolve the Moodle user ID for this token.
 *  Tries the cookie first; if missing, calls core_webservice_get_site_info. */
async function resolveUserId(
    token: string,
    cookieStore: Awaited<ReturnType<typeof cookies>>
): Promise<string | null> {
    // Fast path: already stored in cookie
    const cached = cookieStore.get("moodle_userid")?.value
    if (cached) return cached

    // Slow path: fetch from Moodle and backfill the cookie
    const moodleUrl = process.env.MOODLE_URL
    if (!moodleUrl) return null

    try {
        const params = new URLSearchParams({
            wstoken: token,
            wsfunction: "core_webservice_get_site_info",
            moodlewsrestformat: "json",
        })
        const res = await fetch(
            `${moodleUrl}/webservice/rest/server.php?${params.toString()}`,
            { cache: "no-store", headers: { Accept: "application/json" } }
        )
        if (!res.ok) return null

        const info = await res.json().catch(() => null)
        const userid = info?.userid ? String(info.userid) : null

        if (userid) {
            // Backfill for future requests on this session
            cookieStore.set("moodle_userid", userid, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/",
            })
        }
        return userid
    } catch {
        return null
    }
}

export async function GET(_req: NextRequest) {
    const cookieStore = await cookies()

    const token = cookieStore.get("moodle_token")?.value ?? null

    if (!token) {
        return NextResponse.json(
            { error: "Unauthorized: please log in." },
            { status: 401, headers: { "Cache-Control": "no-store" } }
        )
    }

    // Resolve userid from cookie or live from Moodle
    const userId = await resolveUserId(token, cookieStore)

    if (!userId) {
        return NextResponse.json(
            { error: "Unauthorized: could not identify user — please log in again." },
            { status: 401, headers: { "Cache-Control": "no-store" } }
        )
    }

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

        if (isAuthError) {
            cookieStore.delete("moodle_token")
            cookieStore.delete("moodle_userid")
        }

        return NextResponse.json(
            { error: isAuthError ? "Invalid or expired session. Please log in again." : message },
            {
                status: isAuthError ? 401 : 502,
                headers: { "Cache-Control": "no-store" },
            }
        )
    }
}
