export interface Panel {
  width: number
  height: number
  quantity: number
  id: string
}

export interface PlacedPanel extends Panel {
  x: number
  y: number
  rotated: boolean
}

export interface StockSheet {
  width: number
  height: number
  panels: PlacedPanel[]
}

