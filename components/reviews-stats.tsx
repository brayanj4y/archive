"use client"

import { useEffect, useState, useRef, ReactElement } from "react"

interface AnimatedStatProps {
    value: number | string
    label: string
    suffix?: string
    icon?: ReactElement
    iconColor?: string
}

export default function AnimatedStat({ value, label, suffix, icon, iconColor = "text-gray-400" }: AnimatedStatProps) {
    const [count, setCount] = useState(0)
    const [visible, setVisible] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    const numericValue = typeof value === "string" ? Number(value.replace(/[^0-9.]/g, "")) : value

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

    useEffect(() => {
        if (!visible) return
        let start = 0
        const duration = 1500
        const increment = numericValue / (duration / 16)
        const timer = setInterval(() => {
            start += increment
            if (start >= numericValue) {
                start = numericValue
                clearInterval(timer)
            }
            setCount(Math.floor(start))
        }, 16)
        return () => clearInterval(timer)
    }, [visible, numericValue])

    return (
        <div ref={ref} className="text-center">
            {icon && <div className={`mx-auto mb-2 ${iconColor}`}>{icon}</div>}
            <div className="text-4xl font-bold text-slate-900 mb-1">
                {count}
                {suffix}
            </div>
            <div className="text-sm text-slate-600">{label}</div>
        </div>
    )
}
