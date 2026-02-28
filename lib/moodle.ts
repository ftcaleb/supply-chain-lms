/**
 * Server-only Moodle REST API utility.
 * Never import this file from client components.
 */

// ---------------------------------------------------------------------------
// Raw Moodle types
// ---------------------------------------------------------------------------

/** Raw shape returned by core_enrol_get_users_courses */
export interface MoodleCourseRaw {
    id: number
    shortname: string
    fullname: string
    displayname: string
    enrolleduserid: number
    idnumber: string
    summary: string
    summaryformat: number
    format: string
    showgrades: number
    lang: string
    enablecompletion: number
    completionhascriteria: number
    completionusertracked: number
    category: number
    /** Completion percentage 0–100, or null when tracking is disabled */
    progress: number | null
    completed: boolean
    startdate: number
    enddate: number
    marker: number
    lastaccess: number
    isfavourite: boolean
    hidden: boolean
    overviewfiles: Array<{ fileurl: string; filename: string; filesize: number }>
    showactivitydates: boolean
    showcompletionconditions: boolean
    timemodified: number
    /** Some Moodle versions return a top-level courseimage field */
    courseimage?: string
}

/** Moodle error envelope — returned as JSON body with HTTP 200 */
interface MoodleError {
    exception: string
    errorcode: string
    message: string
}

// ---------------------------------------------------------------------------
// Normalised type consumed by UI
// ---------------------------------------------------------------------------

export interface NormalizedCourse {
    /** String version of the Moodle course id (used as Next.js route param) */
    id: string
    moodleId: number
    /** Full course name — used as the card/page title */
    name: string
    shortname: string
    /** Plain-text summary — HTML stripped, with fallback */
    summary: string
    /** Completion percentage 0–100 */
    progress: number
    /** True when the course is 100 % complete per Moodle */
    completed: boolean
    /** True when completion tracking is enabled for this course */
    enableCompletion: boolean
    /** Moodle category numeric id as a string */
    category: string
    /** Unix timestamp of the user's last access (raw, for sorting) */
    lastAccess: number
    /** Human-readable last-access string, e.g. "2 hours ago" */
    lastAccessLabel: string | undefined
    /** Course overview image URL (with token appended when needed) */
    courseImage: string | undefined
}

// ---------------------------------------------------------------------------
// Private helpers
// ---------------------------------------------------------------------------

/** Strip HTML tags from Moodle summary text (server-safe, no DOM required) */
function stripHtml(html: string): string {
    return html
        .replace(/<[^>]+>/g, " ")
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'")
        .replace(/\s{2,}/g, " ")
        .trim()
}

/** Format a Unix timestamp as a relative label, e.g. "3 days ago" */
function formatLastAccess(unixTs: number): string | undefined {
    if (!unixTs || unixTs === 0) return undefined
    const diff = Math.floor(Date.now() / 1000) - unixTs
    if (diff < 3600) return "Just now"
    const h = Math.floor(diff / 3600)
    if (diff < 86400) return `${h} hour${h === 1 ? "" : "s"} ago`
    const d = Math.floor(diff / 86400)
    if (diff < 604800) return `${d} day${d === 1 ? "" : "s"} ago`
    const w = Math.floor(diff / 604800)
    if (diff < 2592000) return `${w} week${w === 1 ? "" : "s"} ago`
    const mo = Math.floor(diff / 2592000)
    return `${mo} month${mo === 1 ? "" : "s"} ago`
}

/**
 * Resolve the best available course image URL.
 * Moodle's overviewfiles URLs require the wstoken query param to be served;
 * we append it server-side so the browser never needs the token.
 */
function resolveCourseImage(
    raw: MoodleCourseRaw,
    token: string
): string | undefined {
    // Prefer `courseimage` (a pre-built URL returned by some Moodle versions)
    if (raw.courseimage) return raw.courseimage

    const file = raw.overviewfiles?.[0]
    if (!file?.fileurl) return undefined

    // Append token so the image is accessible without a session cookie
    const url = new URL(file.fileurl)
    url.searchParams.set("token", token)
    return url.toString()
}

/** Normalize a raw Moodle course into the UI-ready shape */
function normalizeCourse(raw: MoodleCourseRaw, token: string): NormalizedCourse {
    return {
        id: String(raw.id),
        moodleId: raw.id,
        name: raw.displayname || raw.fullname,
        shortname: raw.shortname,
        summary: stripHtml(raw.summary || "") || "No description available.",
        progress: typeof raw.progress === "number" ? Math.round(raw.progress) : 0,
        completed: Boolean(raw.completed),
        enableCompletion: raw.enablecompletion === 1,
        category: String(raw.category ?? ""),
        lastAccess: raw.lastaccess ?? 0,
        lastAccessLabel: formatLastAccess(raw.lastaccess),
        courseImage: resolveCourseImage(raw, token),
    }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Fetches and normalises enrolled courses from Moodle.
 *
 * @param token  Moodle WS token (from HTTP-only cookie or env var)
 * @param userId Moodle user ID. Pass `"0"` to resolve to the token owner,
 *               or a specific numeric ID (e.g. `"2"`) for dev/admin use.
 */
export async function fetchMoodleCourses(
    token: string,
    userId: string = "0"
): Promise<NormalizedCourse[]> {
    const moodleUrl = process.env.MOODLE_URL
    if (!moodleUrl) throw new Error("MOODLE_URL environment variable is not set.")

    const params = new URLSearchParams({
        wstoken: token,
        wsfunction: "core_enrol_get_users_courses",
        moodlewsrestformat: "json",
        userid: userId,
    })

    const endpoint = `${moodleUrl}/webservice/rest/server.php?${params.toString()}`

    const response = await fetch(endpoint, {
        method: "GET",
        cache: "no-store",
        headers: { Accept: "application/json" },
    })

    if (!response.ok) {
        throw new Error(`Moodle responded with HTTP ${response.status}`)
    }

    const data = await response.json()

    // Moodle encodes errors inside a 200 response body
    if (
        data &&
        typeof data === "object" &&
        !Array.isArray(data) &&
        "exception" in data
    ) {
        const err = data as MoodleError
        throw new Error(`Moodle error [${err.errorcode}]: ${err.message}`)
    }

    if (!Array.isArray(data)) {
        throw new Error("Unexpected response format from Moodle.")
    }

    return (data as MoodleCourseRaw[]).map((raw) => normalizeCourse(raw, token))
}
