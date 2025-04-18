"use server"

import connectToDatabase from "@/lib/mongodb"
import Activity from "@/models/Activity"

export async function getRecentActivities() {
  try {
    await connectToDatabase()
    const activities = await Activity.find({}).sort({ time: -1 }).limit(5)

    // Transform the data to match our UI format
    const formattedActivities = activities.map((activity) => {
      const timeAgo = getTimeAgo(activity.time)

      // Determine color based on activity type
      let color = "slate"
      if (activity.type === "weapon-checkout") color = "emerald"
      if (activity.type === "weapon-checkin") color = "amber"
      if (activity.type === "vehicle-deploy") color = "blue"
      if (activity.type === "vehicle-return") color = "purple"
      if (activity.type === "maintenance") color = "red"

      return {
        id: activity._id.toString(),
        type: activity.type,
        user: activity.user,
        userInitials: activity.userInitials,
        item: activity.item,
        time: timeAgo,
        color,
      }
    })

    return { success: true, data: formattedActivities }
  } catch (error) {
    console.error("Failed to fetch activities:", error)
    return { success: false, error: "Failed to fetch activities" }
  }
}

// Helper function to format time
function getTimeAgo(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - new Date(date).getTime()
  const diffSec = Math.round(diffMs / 1000)
  const diffMin = Math.round(diffSec / 60)
  const diffHour = Math.round(diffMin / 60)
  const diffDay = Math.round(diffHour / 24)

  if (diffSec < 60) return `${diffSec} seconds ago`
  if (diffMin < 60) return `${diffMin} minute${diffMin > 1 ? "s" : ""} ago`
  if (diffHour < 24) return `${diffHour} hour${diffHour > 1 ? "s" : ""} ago`
  return `${diffDay} day${diffDay > 1 ? "s" : ""} ago`
}
