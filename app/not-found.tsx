import Link from "next/link"
import { Shield } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="container flex flex-col items-center justify-center gap-6 px-4 py-16 text-center">
        <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center">
          <Shield className="h-8 w-8 text-emerald-600" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50">404 - Not Found</h1>
        <p className="max-w-[600px] text-slate-600 dark:text-slate-400 md:text-xl">
          The resource you are looking for does not exist or has been moved.
        </p>
        <Button asChild className="mt-4 bg-emerald-600 hover:bg-emerald-700">
          <Link href="/dashboard">Return to Dashboard</Link>
        </Button>
      </div>
    </div>
  )
}
