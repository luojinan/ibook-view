import { FC } from 'react'
import { Annotation } from '../types'

interface AnnotationListProps {
  annotations: Annotation[]
}

export const AnnotationList: FC<AnnotationListProps> = ({ annotations }) => {
  return (
    <div className="h-full">
      <h2 className="text-xl font-semibold mb-4">Annotations</h2>
      <div className="overflow-y-auto max-h-[calc(100vh-12rem)]">
        {annotations.map((annotation, index) => (
          <div key={index} className="card bg-base-100 shadow-md mb-2">
            <div className="card-body p-4">
              {annotation.text && (
                <p className="text-base">🔖 {index+1}、{annotation.text}</p>
              )}
              {annotation.note && (
                <p className="text-sm opacity-70 mt-2">✍️ Note: {annotation.note}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}