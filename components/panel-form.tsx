"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { Panel } from "../types"
import { Plus, X } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"

interface PanelFormProps {
  onOptimize: (stockWidth: number, stockHeight: number, panels: Panel[]) => void
}

export function PanelForm({ onOptimize }: PanelFormProps) {
  const [stockWidth, setStockWidth] = useState(4)
  const [stockHeight, setStockHeight] = useState(7)
  const [panels, setPanels] = useState<Panel[]>([{ width: 1, height: 3, quantity: 1, id: "1" }])

  const addPanel = () => {
    setPanels([...panels, { width: 1, height: 1, quantity: 1, id: crypto.randomUUID() }])
  }

  const removePanel = (id: string) => {
    setPanels(panels.filter((p) => p.id !== id))
  }

  const updatePanel = (id: string, field: keyof Panel, value: number) => {
    setPanels(panels.map((p) => (p.id === id ? { ...p, [field]: value } : p)))
  }

  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="stock-height">Stock Height</Label>
            <Input
              id="stock-height"
              type="number"
              value={stockHeight}
              onChange={(e) => setStockHeight(Number(e.target.value))}
              min={1}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="stock-width">Stock Width</Label>
            <Input
              id="stock-width"
              type="number"
              value={stockWidth}
              onChange={(e) => setStockWidth(Number(e.target.value))}
              min={1}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label>Panels</Label>
          </div>

          <div className="space-y-3">
            {panels.map((panel, index) => (
              <div key={panel.id} className="grid grid-cols-4 gap-2 items-end">
                <div>
                  <Label htmlFor={`height-${panel.id}`} className="text-xs">
                    Height
                  </Label>
                  <Input
                    id={`height-${panel.id}`}
                    type="number"
                    value={panel.height}
                    onChange={(e) => updatePanel(panel.id, "height", Number(e.target.value))}
                    min={1}
                  />
                </div>
                <div>
                  <Label htmlFor={`width-${panel.id}`} className="text-xs">
                    Width
                  </Label>
                  <Input
                    id={`width-${panel.id}`}
                    type="number"
                    value={panel.width}
                    onChange={(e) => updatePanel(panel.id, "width", Number(e.target.value))}
                    min={1}
                  />
                </div>
                <div>
                  <Label htmlFor={`quantity-${panel.id}`} className="text-xs">
                    Qty
                  </Label>
                  <Input
                    id={`quantity-${panel.id}`}
                    type="number"
                    value={panel.quantity}
                    onChange={(e) => updatePanel(panel.id, "quantity", Number(e.target.value))}
                    min={1}
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removePanel(panel.id)}
                  className="h-10"
                  aria-label="Remove panel"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          <Button variant="outline" size="sm" onClick={addPanel} className="w-full">
            <Plus className="h-4 w-4 mr-1" />
            Add Panel
          </Button>

          <Button className="w-full" onClick={() => onOptimize(stockWidth, stockHeight, panels)}>
            Optimize Layout
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

