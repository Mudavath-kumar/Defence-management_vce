"use client"

import { useEffect, useState } from "react"
import { Clock } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { getRecentActivities } from "@/app/actions/activity-actions"
import { useToast } from "@/components/ui/use-toast"

export default function RecentActivities() {
  const [activities, setActivities] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    async function loadActivities() {
      setIsLoading(true)
      try {
        const result = await getRecentActivities()
        if (result.success) {
          setActivities(result.data)
        } else {
          toast({
            title: "Error",
            description: result.error || "Failed to load activities",
            variant: "destructive",
          })
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load activities",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadActivities()
  }, [toast])

  // Helper function to get the correct color classes
  const getColorClasses = (colorName: string) => {
    switch (colorName) {
      case "emerald":
        return {
          border: "border-emerald-200",
          bg: "bg-emerald-100",
          text: "text-emerald-700",
          textMedium: "text-emerald-600",
          bgBar: "bg-emerald-100",
          bgBarFill: "bg-emerald-500",
        }
      case "blue":
        return {
          border: "border-blue-200",
          bg: "bg-blue-100",
          text: "text-blue-700",
          textMedium: "text-blue-600",
          bgBar: "bg-blue-100",
          bgBarFill: "bg-blue-500",
        }
      case "amber":
        return {
          border: "border-amber-200",
          bg: "bg-amber-100",
          text: "text-amber-700",
          textMedium: "text-amber-600",
          bgBar: "bg-amber-100",
          bgBarFill: "bg-amber-500",
        }
      case "purple":
        return {
          border: "border-purple-200",
          bg: "bg-purple-100",
          text: "text-purple-700",
          textMedium: "text-purple-600",
          bgBar: "bg-purple-100",
          bgBarFill: "bg-purple-500",
        }
      case "red":
        return {
          border: "border-red-200",
          bg: "bg-red-100",
          text: "text-red-700",
          textMedium: "text-red-600",
          bgBar: "bg-red-100",
          bgBarFill: "bg-red-500",
        }
      default:
        return {
          border: "border-slate-200",
          bg: "bg-slate-100",
          text: "text-slate-700",
          textMedium: "text-slate-600",
          bgBar: "bg-slate-100",
          bgBarFill: "bg-slate-500",
        }
    }
  }

  return (
    <Card className="shadow-md border-slate-200 dark:border-slate-700 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-b">
        <CardTitle className="text-xl text-purple-800 dark:text-purple-400">Recent Activities</CardTitle>
        <CardDescription>Latest check-ins and check-outs</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-purple-500 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
            <p className="mt-2 text-sm text-slate-500">Loading recent activities...</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-200 dark:divide-slate-700">
            {activities.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-sm text-slate-500">No recent activities found.</p>
              </div>
            ) : (
              activities.map((activity) => {
                const colors = getColorClasses(activity.color)
                return (
                  <div
                    key={activity.id}
                    className="flex items-start gap-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <Avatar className={`h-10 w-10 border-2 ${colors.border} ${colors.bg}`}>
                      <AvatarFallback className={`${colors.bg} ${colors.text}`}>{activity.userInitials}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1 flex-1">
                      <div className="flex justify-between items-start">
                        <p className="text-sm font-medium leading-none">{activity.user}</p>
                        <p className="flex items-center text-xs text-muted-foreground">
                          <Clock className="mr-1 h-3 w-3" />
                          {activity.time}
                        </p>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        <span className={`font-medium ${colors.textMedium}`}>
                          {activity.type === "weapon-checkout" && "Checked out"}
                          {activity.type === "weapon-checkin" && "Returned"}
                          {activity.type === "vehicle-deploy" && "Deployed"}
                          {activity.type === "vehicle-return" && "Returned"}
                          {activity.type === "maintenance" && "Sent for maintenance"}
                        </span>{" "}
                        <span className="font-medium">{activity.item}</span>
                      </p>
                      <div className={`w-full h-0.5 ${colors.bgBar} rounded-full mt-2`}>
                        <div className={`h-0.5 ${colors.bgBarFill} rounded-full`} style={{ width: "30%" }}></div>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
