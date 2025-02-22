import type { Panel, StockSheet } from "../types"

export function optimizePanels(stockWidth: number, stockHeight: number, panels: Panel[]): StockSheet[] {
  const sheets: StockSheet[] = []

  // Sort panels by area (largest first) to improve packing efficiency
  const sortedPanels = [...panels].sort((a, b) => b.width * b.height - a.width * a.height)

  let remainingPanels = sortedPanels.flatMap((panel) =>
    Array(panel.quantity)
      .fill(null)
      .map(() => ({
        ...panel,
        id: crypto.randomUUID(),
      })),
  )

  while (remainingPanels.length > 0) {
    const sheet: StockSheet = {
      width: stockWidth,
      height: stockHeight,
      panels: [],
    }

    const panelsToPlace = [...remainingPanels]
    remainingPanels = []

    // Try to place each panel
    panelsToPlace.forEach((panel) => {
      // Try both orientations in both positions
      const fits = [
        // Normal orientation
        { rotated: false, pos: findBestPosition(sheet, panel, false) },
        // Rotated orientation
        { rotated: true, pos: findBestPosition(sheet, panel, true) },
      ].filter((fit) => fit.pos !== null)

      // Sort fits by y position (prefer top placement)
      fits.sort((a, b) => a.pos!.y - b.pos!.y || a.pos!.x - b.pos!.x)

      if (fits.length > 0) {
        const bestFit = fits[0]
        sheet.panels.push({
          ...panel,
          x: bestFit.pos!.x,
          y: bestFit.pos!.y,
          rotated: bestFit.rotated,
        })
      } else {
        // If panel couldn't be placed, add it to remaining panels
        remainingPanels.push(panel)
      }
    })

    sheets.push(sheet)
  }

  return sheets
}

function findBestPosition(sheet: StockSheet, panel: Panel, rotated: boolean): { x: number; y: number } | null {
  const panelWidth = rotated ? panel.height : panel.width
  const panelHeight = rotated ? panel.width : panel.height

  // If panel doesn't fit in stock sheet at all, return null
  if (panelWidth > sheet.width || panelHeight > sheet.height) {
    return null
  }

  // Find all possible positions
  const positions: { x: number; y: number }[] = []

  for (let x = 0; x <= sheet.width - panelWidth; x++) {
    for (let y = 0; y <= sheet.height - panelHeight; y++) {
      if (isSpaceAvailable(sheet, x, y, panelWidth, panelHeight)) {
        positions.push({ x, y })
      }
    }
  }

  // Return the position closest to the top-left corner
  return (
    positions.sort((a, b) => {
      if (a.y === b.y) return a.x - b.x
      return a.y - b.y
    })[0] || null
  )
}

function isSpaceAvailable(sheet: StockSheet, x: number, y: number, width: number, height: number): boolean {
  return !sheet.panels.some((panel) => {
    const panelWidth = panel.rotated ? panel.height : panel.width
    const panelHeight = panel.rotated ? panel.width : panel.height

    return x < panel.x + panelWidth && x + width > panel.x && y < panel.y + panelHeight && y + height > panel.y
  })
}

