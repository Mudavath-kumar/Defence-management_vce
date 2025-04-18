"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function DashboardCharts() {
  return (
    <div className="mt-6">
      <Tabs defaultValue="overview" className="w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Analytics Overview</h2>
          <TabsList className="bg-slate-100 dark:bg-slate-800">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="weapons">Weapons</TabsTrigger>
            <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
            <TabsTrigger value="personnel">Personnel</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Asset Utilization</CardTitle>
                <CardDescription>Monthly deployment rates for all assets</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-[240px] w-full">
                  {/* Chart placeholder */}
                  <div className="w-full h-full bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 rounded-md flex items-center justify-center">
                    <div className="space-y-2 w-full px-4">
                      <div className="w-full bg-slate-200 dark:bg-slate-700 h-8 rounded-md relative overflow-hidden">
                        <div className="absolute top-0 left-0 h-full w-[65%] bg-emerald-500 rounded-md"></div>
                        <div className="absolute inset-0 flex items-center justify-between px-3">
                          <span className="text-xs font-medium text-white">Weapons</span>
                          <span className="text-xs font-medium text-slate-700 dark:text-white">65%</span>
                        </div>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 h-8 rounded-md relative overflow-hidden">
                        <div className="absolute top-0 left-0 h-full w-[42%] bg-blue-500 rounded-md"></div>
                        <div className="absolute inset-0 flex items-center justify-between px-3">
                          <span className="text-xs font-medium text-white">Vehicles</span>
                          <span className="text-xs font-medium text-slate-700 dark:text-white">42%</span>
                        </div>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 h-8 rounded-md relative overflow-hidden">
                        <div className="absolute top-0 left-0 h-full w-[78%] bg-purple-500 rounded-md"></div>
                        <div className="absolute inset-0 flex items-center justify-between px-3">
                          <span className="text-xs font-medium text-white">Personnel</span>
                          <span className="text-xs font-medium text-slate-700 dark:text-white">78%</span>
                        </div>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 h-8 rounded-md relative overflow-hidden">
                        <div className="absolute top-0 left-0 h-full w-[35%] bg-amber-500 rounded-md"></div>
                        <div className="absolute inset-0 flex items-center justify-between px-3">
                          <span className="text-xs font-medium text-white">Equipment</span>
                          <span className="text-xs font-medium text-slate-700 dark:text-white">35%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Operational Status</CardTitle>
                <CardDescription>Current deployment distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[240px] w-full">
                  {/* Chart placeholder */}
                  <div className="w-full h-full bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 rounded-md flex items-center justify-center">
                    <div className="relative w-40 h-40">
                      <div className="absolute inset-0 rounded-full border-8 border-emerald-500"></div>
                      <div
                        className="absolute inset-0 rounded-full border-8 border-transparent border-t-blue-500"
                        style={{ transform: "rotate(45deg)" }}
                      ></div>
                      <div
                        className="absolute inset-0 rounded-full border-8 border-transparent border-t-amber-500 border-r-amber-500"
                        style={{ transform: "rotate(180deg)" }}
                      ></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <span className="text-2xl font-bold text-slate-800 dark:text-white">75%</span>
                          <p className="text-xs text-slate-600 dark:text-slate-300">Operational</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="weapons">
          <Card>
            <CardHeader>
              <CardTitle>Weapons Analytics</CardTitle>
              <CardDescription>Detailed weapons usage and status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                {/* Chart placeholder */}
                <div className="w-full h-full bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 rounded-md flex items-center justify-center">
                  <p className="text-slate-500 dark:text-slate-400">Weapons analytics visualization</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vehicles">
          <Card>
            <CardHeader>
              <CardTitle>Vehicles Analytics</CardTitle>
              <CardDescription>Detailed vehicle usage and status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                {/* Chart placeholder */}
                <div className="w-full h-full bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 rounded-md flex items-center justify-center">
                  <p className="text-slate-500 dark:text-slate-400">Vehicles analytics visualization</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="personnel">
          <Card>
            <CardHeader>
              <CardTitle>Personnel Analytics</CardTitle>
              <CardDescription>Detailed personnel deployment and status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                {/* Chart placeholder */}
                <div className="w-full h-full bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 rounded-md flex items-center justify-center">
                  <p className="text-slate-500 dark:text-slate-400">Personnel analytics visualization</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
