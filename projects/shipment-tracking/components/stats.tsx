"use client"

import { useEffect, useState, useRef } from "react"

interface AnimatedStatProps {
    stat: {
        label: string
        value: string
        icon: any
    }
}

export default function AnimatedStat({ stat }: AnimatedStatProps) {
    const [count, setCount] = useState(0)
    const [visible, setVisible] = useState(false)
    const ref = useRef<HTMLDivElement>(null)
    const Icon = stat.icon
    const targetValue = Number(stat.value.replace(/[^0-9.]/g, ""))

    // Intersection Observer
    useEffect(() => {
        if (!ref.current) return

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setVisible(true)
                        observer.unobserve(entry.target)
                    }
                })
            },
            { threshold: 0.3 }
        )

        observer.observe(ref.current)

        return () => observer.disconnect()
    }, [])

    // Count animation
    useEffect(() => {
        if (!visible) return
        let start = 0
        const duration = 1500
        const increment = targetValue / (duration / 16)
        const timer = setInterval(() => {
            start += increment
            if (start >= targetValue) {
                start = targetValue
                clearInterval(timer)
            }
            setCount(Math.floor(start))
        }, 16)
        return () => clearInterval(timer)
    }, [visible, targetValue])

    return (
        <div ref={ref} className="text-center text-white">
            <div className="bg-white/10 border border-white/20 rounded-lg p-6">
                <Icon className="w-10 h-10 mx-auto mb-3 text-white/80" />
                <div className="text-3xl md:text-4xl font-bold mb-1">
                    {count}
                    {stat.value.includes("+") && "+"}
                    {stat.value.includes("%") && "%"}
                </div>
                <div className="text-blue-100 text-sm">{stat.label}</div>
            </div>
        </div>
    )
}
