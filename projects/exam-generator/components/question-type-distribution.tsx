"use client"

import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"

interface QuestionTypeDistributionProps {
  distribution: {
    multipleChoice: number
    trueFalse: number
    shortAnswer: number
    essay: number
  }
  onChange: (type: string, value: number) => void
}

export default function QuestionTypeDistribution({ distribution, onChange }: QuestionTypeDistributionProps) {
  const questionTypes = [
    { id: "multipleChoice", label: "Multiple Choice" },
    { id: "trueFalse", label: "True/False" },
    { id: "shortAnswer", label: "Short Answer" },
    { id: "essay", label: "Essay" },
  ]

  return (
    <div className="space-y-4">
      {questionTypes.map((type) => (
        <div key={type.id} className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor={type.id}>{type.label}</Label>
            <span className="text-sm font-medium">{distribution[type.id]}%</span>
          </div>
          <Slider
            id={type.id}
            min={0}
            max={100}
            step={5}
            value={[distribution[type.id]]}
            onValueChange={(value) => onChange(type.id, value[0])}
          />
        </div>
      ))}

      <div className="mt-6 p-3 bg-muted rounded-md">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium">Distribution Preview</span>
          <span className="text-sm font-medium">100%</span>
        </div>
        <div className="w-full h-6 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-primary" style={{ width: `${distribution.multipleChoice}%` }} />
          <div
            className="h-full bg-blue-400 -mt-6"
            style={{
              width: `${distribution.trueFalse}%`,
              marginLeft: `${distribution.multipleChoice}%`,
            }}
          />
          <div
            className="h-full bg-green-400 -mt-6"
            style={{
              width: `${distribution.shortAnswer}%`,
              marginLeft: `${distribution.multipleChoice + distribution.trueFalse}%`,
            }}
          />
          <div
            className="h-full bg-yellow-400 -mt-6"
            style={{
              width: `${distribution.essay}%`,
              marginLeft: `${distribution.multipleChoice + distribution.trueFalse + distribution.shortAnswer}%`,
            }}
          />
        </div>
        <div className="flex text-xs mt-2 text-muted-foreground">
          <div style={{ width: `${distribution.multipleChoice}%` }}>MC</div>
          <div style={{ width: `${distribution.trueFalse}%` }}>T/F</div>
          <div style={{ width: `${distribution.shortAnswer}%` }}>SA</div>
          <div style={{ width: `${distribution.essay}%` }}>Essay</div>
        </div>
      </div>
    </div>
  )
}

