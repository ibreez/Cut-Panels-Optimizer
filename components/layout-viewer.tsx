"use client"

import { useEffect, useRef } from "react"
import type { StockSheet } from "../types"

interface LayoutViewerProps {
  sheet: StockSheet
}

export function LayoutViewer({ sheet }: LayoutViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Calculate scale based on container size and sheet dimensions
    const maxWidth = container.clientWidth - 40
    const maxHeight = window.innerHeight * 0.7

    const scaleX = maxWidth / sheet.width
    const scaleY = maxHeight / sheet.height
    const scale = Math.min(scaleX, scaleY)

    // Set canvas size with padding
    const padding = 20
    canvas.width = sheet.width * scale + padding * 2
    canvas.height = sheet.height * scale + padding * 2

    // Create diagonal stripe pattern
    const patternCanvas = document.createElement("canvas")
    const patternSize = 10
    patternCanvas.width = patternSize
    patternCanvas.height = patternSize
    const patternCtx = patternCanvas.getContext("2d")
    if (patternCtx) {
      patternCtx.strokeStyle = "#e5e7eb"
      patternCtx.lineWidth = 1
      patternCtx.beginPath()
      patternCtx.moveTo(0, patternSize)
      patternCtx.lineTo(patternSize, 0)
      patternCtx.stroke()
    }
    const pattern = ctx.createPattern(patternCanvas, "repeat")

    // Clear canvas and fill with pattern
    ctx.fillStyle = "white"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    if (pattern) {
      ctx.fillStyle = pattern
      ctx.fillRect(padding, padding, sheet.width * scale, sheet.height * scale)
    }

    // Draw grid
    ctx.strokeStyle = "#e5e7eb"
    ctx.lineWidth = 0.5

    // Draw vertical grid lines every 100 units
    for (let x = 0; x <= sheet.width; x += 100) {
      ctx.beginPath()
      ctx.moveTo(x * scale + padding, padding)
      ctx.lineTo(x * scale + padding, sheet.height * scale + padding)
      ctx.stroke()
    }

    // Draw horizontal grid lines every 100 units
    for (let y = 0; y <= sheet.height; y += 100) {
      ctx.beginPath()
      ctx.moveTo(padding, y * scale + padding)
      ctx.lineTo(sheet.width * scale + padding, y * scale + padding)
      ctx.stroke()
    }

    // Draw stock sheet border
    ctx.strokeStyle = "#374151"
    ctx.lineWidth = 2
    ctx.strokeRect(padding, padding, sheet.width * scale, sheet.height * scale)

    // Draw dimensions
    ctx.fillStyle = "#374151"
    ctx.font = "12px sans-serif"
    ctx.textAlign = "center"

    // Width dimension
    ctx.fillText(`${sheet.width}`, (sheet.width * scale) / 2 + padding, padding - 5)

    // Height dimension
    ctx.save()
    ctx.translate(padding - 5, (sheet.height * scale) / 2 + padding)
    ctx.rotate(-Math.PI / 2)
    ctx.fillText(`${sheet.height}`, 0, 0)
    ctx.restore()

    // Draw panels
    sheet.panels.forEach((panel) => {
      const width = panel.rotated ? panel.height : panel.width
      const height = panel.rotated ? panel.width : panel.height

      // Fill panel with white
      ctx.fillStyle = "white"
      ctx.fillRect(panel.x * scale + padding, panel.y * scale + padding, width * scale, height * scale)

      // Draw panel border
      ctx.strokeStyle = "#374151"
      ctx.lineWidth = 1
      ctx.strokeRect(panel.x * scale + padding, panel.y * scale + padding, width * scale, height * scale)

      // Draw panel dimensions
      ctx.fillStyle = "#374151"
      ctx.font = "12px sans-serif"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      const text = panel.rotated ? `${panel.height}x${panel.width}` : `${panel.width}x${panel.height}`
      ctx.fillText(
        text,
        panel.x * scale + (width * scale) / 2 + padding,
        panel.y * scale + (height * scale) / 2 + padding,
      )
    })
  }, [sheet])

  return (
    <div className="border rounded-lg p-4 bg-white" ref={containerRef}>
      <canvas ref={canvasRef} className="max-w-full h-auto" />
    </div>
  )
}

