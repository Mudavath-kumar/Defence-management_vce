import { PenIcon as Gun, ShieldCheck, Truck, Users, AlertTriangle, CheckCircle2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DashboardStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="border-l-4 border-l-emerald-500 shadow-md hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Weapons Available</CardTitle>
          <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center">
            <Gun className="h-4 w-4 text-emerald-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-emerald-600">247</div>
          <div className="flex items-center mt-1">
            <CheckCircle2 className="h-4 w-4 text-emerald-500 mr-1" />
            <p className="text-xs text-emerald-600">+2 returned today</p>
          </div>
          <div className="w-full h-1.5 bg-emerald-100 rounded-full mt-3">
            <div className="h-1.5 bg-emerald-500 rounded-full" style={{ width: "82%" }}></div>
          </div>
          <p className="text-xs text-slate-500 mt-1">82% of total inventory</p>
        </CardContent>
      </Card>
      <Card className="border-l-4 border-l-amber-500 shadow-md hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Weapons Checked Out</CardTitle>
          <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center">
            <ShieldCheck className="h-4 w-4 text-amber-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-amber-600">53</div>
          <div className="flex items-center mt-1">
            <AlertTriangle className="h-4 w-4 text-amber-500 mr-1" />
            <p className="text-xs text-amber-600">-5 from yesterday</p>
          </div>
          <div className="w-full h-1.5 bg-amber-100 rounded-full mt-3">
            <div className="h-1.5 bg-amber-500 rounded-full" style={{ width: "18%" }}></div>
          </div>
          <p className="text-xs text-slate-500 mt-1">18% of total inventory</p>
        </CardContent>
      </Card>
      <Card className="border-l-4 border-l-blue-500 shadow-md hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Vehicles Available</CardTitle>
          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
            <Truck className="h-4 w-4 text-blue-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">32</div>
          <div className="flex items-center mt-1">
            <CheckCircle2 className="h-4 w-4 text-blue-500 mr-1" />
            <p className="text-xs text-blue-600">+3 returned today</p>
          </div>
          <div className="w-full h-1.5 bg-blue-100 rounded-full mt-3">
            <div className="h-1.5 bg-blue-500 rounded-full" style={{ width: "72%" }}></div>
          </div>
          <p className="text-xs text-slate-500 mt-1">72% of total fleet</p>
        </CardContent>
      </Card>
      <Card className="border-l-4 border-l-purple-500 shadow-md hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Personnel</CardTitle>
          <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
            <Users className="h-4 w-4 text-purple-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-600">142</div>
          <div className="flex items-center mt-1">
            <CheckCircle2 className="h-4 w-4 text-purple-500 mr-1" />
            <p className="text-xs text-purple-600">+12 from last week</p>
          </div>
          <div className="w-full h-1.5 bg-purple-100 rounded-full mt-3">
            <div className="h-1.5 bg-purple-500 rounded-full" style={{ width: "85%" }}></div>
          </div>
          <p className="text-xs text-slate-500 mt-1">85% deployment rate</p>
        </CardContent>
      </Card>
    </div>
  )
}
