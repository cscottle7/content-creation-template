'use client'

import { useState } from 'react'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline'

interface FAQItem {
  question: string
  answer: string
}

interface FAQProps {
  title?: string
  description?: string
  items: FAQItem[]
  className?: string
}

export function FAQ({ title = "Frequently Asked Questions", description, items, className = "" }: FAQProps) {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set())

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems)
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index)
    } else {
      newOpenItems.add(index)
    }
    setOpenItems(newOpenItems)
  }

  return (
    <section className={`py-16 ${className}`}>
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{title}</h2>
            {description && (
              <p className="text-xl text-gray-600">{description}</p>
            )}
          </div>
          
          <div className="space-y-4">
            {items.map((item, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden"
              >
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
                  aria-expanded={openItems.has(index)}
                >
                  <span className="font-semibold text-gray-900">{item.question}</span>
                  {openItems.has(index) ? (
                    <ChevronUpIcon className="h-5 w-5 text-gray-500 flex-shrink-0" />
                  ) : (
                    <ChevronDownIcon className="h-5 w-5 text-gray-500 flex-shrink-0" />
                  )}
                </button>
                
                {openItems.has(index) && (
                  <div className="px-6 pb-4">
                    <div className="text-gray-700 leading-relaxed">
                      {item.answer}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}