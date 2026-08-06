"use client"

import { useEffect, useRef } from "react"
import { useTheme } from "next-themes"

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { theme } = useTheme()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    let particles: Particle[] = []

    // Make canvas fill the entire viewport
    const resizeCanvas = () => {
      const devicePixelRatio = window.devicePixelRatio || 1

      // Set display size (css pixels)
      canvas.style.width = window.innerWidth + "px"
      canvas.style.height = window.innerHeight + "px"

      // Set actual size in memory (scaled to account for extra pixel density)
      canvas.width = window.innerWidth * devicePixelRatio
      canvas.height = window.innerHeight * devicePixelRatio

      // Normalize coordinate system to use css pixels
      ctx.scale(devicePixelRatio, devicePixelRatio)

      initParticles()
    }

    class Particle {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      color: string

      constructor() {
        this.x = Math.random() * window.innerWidth
        this.y = Math.random() * window.innerHeight
        this.size = Math.random() * 3 + 1 // Larger particles
        this.speedX = Math.random() * 0.7 - 0.35 // Slightly faster movement
        this.speedY = Math.random() * 0.7 - 0.35
        // More visible colors with higher opacity
        this.color = theme === "dark" ? "rgba(255, 255, 255, 0.8)" : "rgba(0, 0, 0, 0.7)"
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY

        if (this.x > window.innerWidth) this.x = 0
        else if (this.x < 0) this.x = window.innerWidth

        if (this.y > window.innerHeight) this.y = 0
        else if (this.y < 0) this.y = window.innerHeight
      }

      draw() {
        ctx.fillStyle = this.color
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    const initParticles = () => {
      particles = []
      // Increase particle density but cap it to prevent performance issues
      const particleCount = Math.min(Math.floor((window.innerWidth * window.innerHeight) / 6000), 150)

      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle())
      }
    }

    const connectParticles = () => {
      const maxDistance = 200 // Increase connection distance
      for (let a = 0; a < particles.length; a++) {
        for (let b = a; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x
          const dy = particles[a].y - particles[b].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < maxDistance) {
            const opacity = 1 - distance / maxDistance
            ctx.strokeStyle =
              theme === "dark" ? `rgba(255, 255, 255, ${opacity * 0.4})` : `rgba(0, 0, 0, ${opacity * 0.4})`
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(particles[a].x, particles[a].y)
            ctx.lineTo(particles[b].x, particles[b].y)
            ctx.stroke()
          }
        }
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)

      for (const particle of particles) {
        particle.update()
        particle.draw()
      }

      connectParticles()
      animationFrameId = requestAnimationFrame(animate)
    }

    window.addEventListener("resize", resizeCanvas)
    resizeCanvas()
    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [theme])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ opacity: 1 }} />
}
