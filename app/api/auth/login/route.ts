import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export const dynamic = "force-dynamic"

export async function POST(req: NextRequest) {
    const body = await req.json().catch(() => null)
    const { username, password } = (body ?? {}) as {
        username?: string
        password?: string
    }

    if (!username || !password) {
        return NextResponse.json(
            { error: "Username and password are required." },
            { status: 400 }
        )
    }

    const moodleUrl = process.env.MOODLE_URL
    const serviceName = process.env.MOODLE_SERVICE_NAME

    if (!moodleUrl || !serviceName) {
        console.error(
            "[login] Missing MOODLE_URL or MOODLE_SERVICE_NAME environment variables."
        )
        return NextResponse.json(
            { error: "Server misconfiguration. Please contact support." },
            { status: 500 }
        )
    }

    // Step B — Call Moodle token endpoint
    const tokenUrl = `${moodleUrl}/login/token.php`
    const params = new URLSearchParams({
        username,
        password,
        service: serviceName,
    })

    let moodleResponse: Response
    try {
        moodleResponse = await fetch(`${tokenUrl}?${params.toString()}`, {
            method: "GET",
            headers: { Accept: "application/json" },
            cache: "no-store",
        })
    } catch (err) {
        console.error("[login] Failed to reach Moodle:", err)
        return NextResponse.json(
            { error: "Unable to reach authentication server. Please try again." },
            { status: 502 }
        )
    }

    if (!moodleResponse.ok) {
        console.error(
            "[login] Moodle token.php responded with HTTP",
            moodleResponse.status
        )
        return NextResponse.json(
            { error: "Authentication server error. Please try again." },
            { status: 502 }
        )
    }

    // Step C — Parse Moodle response
    const data = await moodleResponse.json().catch(() => null)

    if (!data) {
        return NextResponse.json(
            { error: "Unexpected response from authentication server." },
            { status: 502 }
        )
    }

    // Moodle returns { error: "...", errorcode: "..." } on failure
    if ("error" in data || "errorcode" in data) {
        const moodleError = data as { error?: string; errorcode?: string }
        console.error("[login] Moodle auth failure:", {
            error: moodleError.error,
            errorcode: moodleError.errorcode,
            username,
        })

        const devDetail =
            process.env.NODE_ENV !== "production"
                ? ` (Moodle: ${moodleError.errorcode ?? moodleError.error})`
                : ""

        return NextResponse.json(
            { error: `Invalid username or password.${devDetail}` },
            { status: 401 }
        )
    }

    const token = data?.token as string | undefined
    if (!token) {
        return NextResponse.json(
            { error: "Authentication server did not return a token." },
            { status: 502 }
        )
    }

    // Step D — Fetch the user's real Moodle numeric ID via site info
    let moodleUserId: string | null = null
    try {
        const siteInfoParams = new URLSearchParams({
            wstoken: token,
            wsfunction: "core_webservice_get_site_info",
            moodlewsrestformat: "json",
        })
        const siteInfoRes = await fetch(
            `${moodleUrl}/webservice/rest/server.php?${siteInfoParams.toString()}`,
            { cache: "no-store", headers: { Accept: "application/json" } }
        )
        const siteInfo = await siteInfoRes.json().catch(() => null)
        console.log("[login] site_info HTTP", siteInfoRes.status, "body:", JSON.stringify(siteInfo)?.slice(0, 300))

        if (siteInfo?.userid) {
            moodleUserId = String(siteInfo.userid)
            console.log("[login] resolved userid:", moodleUserId)
        } else {
            console.warn("[login] site_info returned no userid. errorcode:", siteInfo?.errorcode, "message:", siteInfo?.message)
        }
    } catch (err) {
        console.error("[login] Failed to fetch site info for userid:", err)
    }

    if (!moodleUserId) {
        console.warn("[login] Could not determine Moodle userid for", username)
    }


    // Step E — Store token and userid securely in HTTP-only cookies
    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax" as const,
        path: "/",
    }

    const cookieStore = await cookies()
    cookieStore.set("moodle_token", token, cookieOptions)
    if (moodleUserId) {
        cookieStore.set("moodle_userid", moodleUserId, cookieOptions)
    }

    return NextResponse.json(
        { success: true },
        { headers: { "Cache-Control": "no-store" } }
    )
}
