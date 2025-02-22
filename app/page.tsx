"use client"

import { useState } from "react"
import type { Panel, StockSheet } from "../types"
import { PanelForm } from "../components/panel-form"
import { LayoutViewer } from "../components/layout-viewer"
import { ExportButtons } from "../components/export-buttons"
import { LoginPage } from "../components/login-page"
import { optimizePanels } from "../utils/optimizer"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

export default function CutOptimizer() {
  const [sheets, setSheets] = useState<StockSheet[]>([])
  const [currentSheet, setCurrentSheet] = useState(0)
  const [user, setUser] = useState<string | null>(null)
  const [loginRequired, setLoginRequired] = useState(true)

  const handleOptimize = (stockWidth: number, stockHeight: number, panels: Panel[]) => {
    const optimizedSheets = optimizePanels(stockWidth, stockHeight, panels)
    setSheets(optimizedSheets)
    setCurrentSheet(0)
  }

  const handleLogin = (username: string) => {
    setUser(username)
  }

  const handleLogout = () => {
    setUser(null)
  }

  const toggleLoginRequired = () => {
    setLoginRequired(!loginRequired)
  }

  if (loginRequired && !user) {
    return <LoginPage onLogin={handleLogin} />
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Cut Piece Optimizer</h1>
        <div className="space-x-2">
          {user === "admin" && (
            <Button onClick={toggleLoginRequired} variant="outline">
              {loginRequired ? "Disable" : "Enable"} Login
            </Button>
          )}
          <Button onClick={handleLogout} variant="outline">
            Logout
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <PanelForm onOptimize={handleOptimize} />

        {sheets.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                Sheet {currentSheet + 1} of {sheets.length}
              </h2>
              {sheets.length > 1 && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentSheet((prev) => Math.max(0, prev - 1))}
                    disabled={currentSheet === 0}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentSheet((prev) => Math.min(sheets.length - 1, prev + 1))}
                    disabled={currentSheet === sheets.length - 1}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
            <LayoutViewer sheet={sheets[currentSheet]} />
            {sheets.length > 1 && (
              <div className="flex justify-center gap-2">
                {sheets.map((_, index) => (
                  <Button
                    key={index}
                    variant={currentSheet === index ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentSheet(index)}
                    className="w-8 h-8 p-0"
                  >
                    {index + 1}
                  </Button>
                ))}
              </div>
            )}
            <ExportButtons sheets={sheets} />
          </div>
        )}
      </div>

      {sheets.length > 0 && (
        <div className="bg-muted/50 rounded-lg p-4">
          <h3 className="font-semibold mb-2">Summary</h3>
          <ul className="space-y-1">
            <li>Total Sheets Required: {sheets.length}</li>
            <li>
              Stock Sheet Size: {sheets[0].width} x {sheets[0].height}
            </li>
            <li>Total Panels: {sheets.reduce((sum, sheet) => sum + sheet.panels.length, 0)}</li>
          </ul>
        </div>
      )}
    </div>
  )
}

