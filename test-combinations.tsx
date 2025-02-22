"use client"

import { useState } from "react"
import type { Panel, StockSheet } from "./types"
import { optimizePanels } from "./utils/optimizer"
import { LayoutViewer } from "./components/layout-viewer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TestCombinations() {
  const [currentResults, setCurrentResults] = useState<{
    combination1: StockSheet[]
    combination2: StockSheet[]
  } | null>(null)

  const runTest = () => {
    // Combination 1
    const combination1Panels: Panel[] = [
      { height: 6, width: 2, quantity: 1, id: "1" },
      { height: 3, width: 1, quantity: 1, id: "2" },
      { height: 4, width: 2, quantity: 1, id: "3" },
    ]

    // Combination 2
    const combination2Panels: Panel[] = [
      { height: 3, width: 1, quantity: 1, id: "1" },
      { height: 6, width: 2, quantity: 1, id: "2" },
      { height: 4, width: 2, quantity: 1, id: "3" },
    ]

    const results1 = optimizePanels(4, 7, combination1Panels)
    const results2 = optimizePanels(4, 7, combination2Panels)

    setCurrentResults({
      combination1: results1,
      combination2: results2,
    })
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Cut Optimizer Test</h1>
        <Button onClick={runTest}>Run Test</Button>
      </div>

      {currentResults && (
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Combination 1</CardTitle>
              <div className="text-sm text-muted-foreground">Order: 6x2, 3x1, 4x2</div>
              <div className="text-sm">Sheets Required: {currentResults.combination1.length}</div>
            </CardHeader>
            <CardContent>
              {currentResults.combination1.map((sheet, index) => (
                <div key={index} className="space-y-2">
                  <div className="font-medium">Sheet {index + 1}</div>
                  <LayoutViewer sheet={sheet} />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Combination 2</CardTitle>
              <div className="text-sm text-muted-foreground">Order: 3x1, 6x2, 4x2</div>
              <div className="text-sm">Sheets Required: {currentResults.combination2.length}</div>
            </CardHeader>
            <CardContent>
              {currentResults.combination2.map((sheet, index) => (
                <div key={index} className="space-y-2">
                  <div className="font-medium">Sheet {index + 1}</div>
                  <LayoutViewer sheet={sheet} />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

