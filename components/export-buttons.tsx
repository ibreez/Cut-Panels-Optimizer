"use client"

import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import type { StockSheet } from "../types"
import jsPDF from "jspdf"

interface ExportButtonsProps {
  sheets: StockSheet[]
}

export function ExportButtons({ sheets }: ExportButtonsProps) {
  const A4_WIDTH = 210
  const A4_HEIGHT = 297
  const DPI = 300
  const PIXELS_PER_MM = DPI / 25.4
  const PAGE_WIDTH = Math.floor(A4_WIDTH * PIXELS_PER_MM)
  const PAGE_HEIGHT = Math.floor(A4_HEIGHT * PIXELS_PER_MM)

  const drawSheet = (
    ctx: CanvasRenderingContext2D,
    sheet: StockSheet,
    scale: number,
    offsetX: number,
    offsetY: number,
  ) => {
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

    // Fill background with pattern
    if (pattern) {
      ctx.fillStyle = pattern
      ctx.fillRect(offsetX, offsetY, sheet.width * scale, sheet.height * scale)
    }

    // Draw sheet border
    ctx.strokeStyle = "#374151"
    ctx.lineWidth = 3
    ctx.strokeRect(offsetX, offsetY, sheet.width * scale, sheet.height * scale)

    // Draw sheet dimensions with arrows
    ctx.fillStyle = "#dc2626" // red-600
    ctx.strokeStyle = "#dc2626"
    ctx.lineWidth = 2
    ctx.font = `bold ${48}px sans-serif`
    ctx.textAlign = "center"

    // Width dimension
    const arrowSize = 15

    // Bottom arrow and dimension
    ctx.beginPath()
    // Left arrow
    ctx.moveTo(offsetX - arrowSize, offsetY + sheet.height * scale + 40)
    ctx.lineTo(offsetX, offsetY + sheet.height * scale + 40)
    // Line
    ctx.lineTo(offsetX + sheet.width * scale, offsetY + sheet.height * scale + 40)
    // Right arrow
    ctx.lineTo(offsetX + sheet.width * scale + arrowSize, offsetY + sheet.height * scale + 40)
    ctx.stroke()

    ctx.fillText(`${sheet.width}`, offsetX + (sheet.width * scale) / 2, offsetY + sheet.height * scale + 100)

    // Height dimension
    ctx.beginPath()
    // Top arrow
    ctx.moveTo(offsetX - 40, offsetY - arrowSize)
    ctx.lineTo(offsetX - 40, offsetY)
    // Line
    ctx.lineTo(offsetX - 40, offsetY + sheet.height * scale)
    // Bottom arrow
    ctx.lineTo(offsetX - 40, offsetY + sheet.height * scale + arrowSize)
    ctx.stroke()

    ctx.save()
    ctx.translate(offsetX - 100, offsetY + (sheet.height * scale) / 2)
    ctx.rotate(-Math.PI / 2)
    ctx.fillText(`${sheet.height}`, 0, 0)
    ctx.restore()

    // Draw panels
    sheet.panels.forEach((panel) => {
      const width = panel.rotated ? panel.height : panel.width
      const height = panel.rotated ? panel.width : panel.height

      // Fill panel with white
      ctx.fillStyle = "white"
      ctx.fillRect(panel.x * scale + offsetX, panel.y * scale + offsetY, width * scale, height * scale)

      // Draw panel border
      ctx.strokeStyle = "#374151"
      ctx.lineWidth = 2
      ctx.strokeRect(panel.x * scale + offsetX, panel.y * scale + offsetY, width * scale, height * scale)

      // Draw panel dimensions
      ctx.fillStyle = "#374151"
      ctx.font = `${32}px sans-serif`
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"

      // Draw width and height separately
      if (width >= 2 && height >= 2) {
        // Width on top
        ctx.fillText(
          `${width}`,
          panel.x * scale + (width * scale) / 2 + offsetX,
          panel.y * scale + height * scale * 0.25 + offsetY,
        )
        // Height on bottom
        ctx.fillText(
          `${height}`,
          panel.x * scale + (width * scale) / 2 + offsetX,
          panel.y * scale + height * scale * 0.75 + offsetY,
        )
      } else {
        // For smaller panels, just show one number
        const displayValue = width > height ? width : height
        ctx.fillText(
          `${displayValue}`,
          panel.x * scale + (width * scale) / 2 + offsetX,
          panel.y * scale + (height * scale) / 2 + offsetY,
        )
      }
    })
  }

  const exportPDF = async () => {
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    })

    sheets.forEach((sheet, index) => {
      if (index > 0) {
        pdf.addPage()
      }

      const canvas = document.createElement("canvas")
      canvas.width = PAGE_WIDTH
      canvas.height = PAGE_HEIGHT
      const ctx = canvas.getContext("2d")
      if (!ctx) return

      ctx.fillStyle = "white"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const margin = 40 * PIXELS_PER_MM // Increased margin for arrows
      const availableWidth = PAGE_WIDTH - 2 * margin
      const availableHeight = PAGE_HEIGHT - 2 * margin
      const scaleX = availableWidth / sheet.width
      const scaleY = availableHeight / sheet.height
      const scale = Math.min(scaleX, scaleY)

      const offsetX = margin + (availableWidth - sheet.width * scale) / 2
      const offsetY = margin + (availableHeight - sheet.height * scale) / 2

      drawSheet(ctx, sheet, scale, offsetX, offsetY)

      const imgData = canvas.toDataURL("image/jpeg", 1.0)
      pdf.addImage(imgData, "JPEG", 0, 0, A4_WIDTH, A4_HEIGHT)
    })

    pdf.save("cut-layouts.pdf")
  }

  const exportPNG = async () => {
    sheets.forEach((sheet, index) => {
      const canvas = document.createElement("canvas")
      canvas.width = PAGE_WIDTH
      canvas.height = PAGE_HEIGHT
      const ctx = canvas.getContext("2d")
      if (!ctx) return

      ctx.fillStyle = "white"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const margin = 40 * PIXELS_PER_MM // Increased margin for arrows
      const availableWidth = PAGE_WIDTH - 2 * margin
      const availableHeight = PAGE_HEIGHT - 2 * margin
      const scaleX = availableWidth / sheet.width
      const scaleY = availableHeight / sheet.height
      const scale = Math.min(scaleX, scaleY)

      const offsetX = margin + (availableWidth - sheet.width * scale) / 2
      const offsetY = margin + (availableHeight - sheet.height * scale) / 2

      drawSheet(ctx, sheet, scale, offsetX, offsetY)

      const link = document.createElement("a")
      link.download = `cut-layout-${index + 1}.png`
      link.href = canvas.toDataURL("image/png")
      link.click()
    })
  }

  return (
    <div className="flex gap-2">
      <Button onClick={exportPDF} variant="outline">
        <Download className="h-4 w-4 mr-2" />
        Export PDF
      </Button>
      <Button onClick={exportPNG} variant="outline">
        <Download className="h-4 w-4 mr-2" />
        Export PNG
      </Button>
    </div>
  )
}

