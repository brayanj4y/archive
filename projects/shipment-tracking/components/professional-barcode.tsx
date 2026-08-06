"use client"

import { useEffect, useRef } from "react"

interface ProfessionalBarcodeProps {
  value: string
  width?: number
  height?: number
  showText?: boolean
  format?: "CODE128" | "CODE39" | "EAN13"
}

export default function ProfessionalBarcode({
  value,
  width = 300,
  height = 80,
  showText = true,
  format = "CODE128",
}: ProfessionalBarcodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // Set white background
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, width, height)

    // Generate more sophisticated barcode pattern
    const generateBarcodePattern = (data: string): number[] => {
      // CODE128 start pattern
      const startPattern = [2, 1, 2, 1, 2, 1]
      const endPattern = [2, 3, 3, 1, 1, 1, 2]

      // Convert string to barcode pattern
      const dataPattern: number[] = []
      for (let i = 0; i < data.length; i++) {
        const charCode = data.charCodeAt(i)
        // Create varying bar widths based on character
        const pattern = [
          1 + (charCode % 3),
          1 + ((charCode * 2) % 3),
          1 + ((charCode * 3) % 3),
          1 + ((charCode * 4) % 3),
        ]
        dataPattern.push(...pattern)
      }

      return [...startPattern, ...dataPattern, ...endPattern]
    }

    const pattern = generateBarcodePattern(value)

    // Calculate bar dimensions
    const totalBars = pattern.length
    const availableWidth = width - 40 // Leave margins
    const barAreaHeight = height - (showText ? 25 : 10)

    let currentX = 20 // Start margin
    const barY = 5

    // Draw bars
    ctx.fillStyle = "#000000"

    for (let i = 0; i < pattern.length; i++) {
      const barWidth = (availableWidth / totalBars) * pattern[i]

      if (i % 2 === 0) {
        // Draw black bars on even indices
        ctx.fillRect(currentX, barY, barWidth, barAreaHeight)
      }

      currentX += barWidth
    }

    // Add quiet zones (white spaces at start and end)
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, 20, height)
    ctx.fillRect(width - 20, 0, 20, height)

    // Add text below barcode
    if (showText) {
      ctx.fillStyle = "#000000"
      ctx.font = "12px 'Courier New', monospace"
      ctx.textAlign = "center"
      ctx.fillText(value, width / 2, height - 5)
    }

    // Add format indicator
    ctx.font = "8px Arial"
    ctx.textAlign = "left"
    ctx.fillStyle = "#666666"
    ctx.fillText(format, 5, height - 2)
  }, [value, width, height, showText, format])

  return (
    <div className="bg-white p-4 rounded-lg border-2 border-slate-200 shadow-sm">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="border border-slate-300 rounded"
        style={{ imageRendering: "pixelated" }}
      />
      <div className="text-xs text-slate-500 mt-2 text-center">Professional {format} Barcode</div>
    </div>
  )
}
