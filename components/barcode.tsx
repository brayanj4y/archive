"use client"

import { useEffect, useRef } from "react"

interface BarcodeProps {
  value: string
  width?: number
  height?: number
}

export default function Barcode({ value, width = 200, height = 50 }: BarcodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // Simple barcode generation (Code 128 style)
    const barWidth = 2
    const bars = value.split("").map((char, index) => {
      return char.charCodeAt(0) % 2 === 0 ? 1 : 0
    })

    let x = 10
    bars.forEach((bar, index) => {
      if (bar === 1) {
        ctx.fillStyle = "#000000"
        ctx.fillRect(x, 5, barWidth, height - 20)
      }
      x += barWidth + 1
    })

    // Add text below barcode
    ctx.fillStyle = "#000000"
    ctx.font = "12px monospace"
    ctx.textAlign = "center"
    ctx.fillText(value, width / 2, height - 5)
  }, [value, width, height])

  return <canvas ref={canvasRef} width={width} height={height} className="border border-gray-200 rounded" />
}
