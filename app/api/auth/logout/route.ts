import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export const dynamic = "force-dynamic"

export async function POST() {
    const cookieStore = await cookies()
    cookieStore.delete("moodle_token")
    cookieStore.delete("moodle_userid")

    return NextResponse.json(
        { success: true },
        { headers: { "Cache-Control": "no-store" } }
    )
}
