'use client'

import { useState, useEffect } from 'react'
import { AB_TESTS, getActiveTests, ABTestConfig } from '@/lib/abTestConfig'

interface ABTestStats {
  testName: string
  variant: string
  exposures: number
  conversions: number
  conversionRate: number
}

// A/B Test Dashboard Component (for internal use/admin)
export function ABTestDashboard() {
  const [activeTests, setActiveTests] = useState<Record<string, ABTestConfig>>({})
  const [testStats, setTestStats] = useState<ABTestStats[]>([])
  const [selectedTest, setSelectedTest] = useState<string | null>(null)

  useEffect(() => {
    setActiveTests(getActiveTests())
    // In production, fetch real stats from analytics API
    fetchMockStats()
  }, [])

  // Mock function - in production, this would fetch real data
  const fetchMockStats = () => {
    const mockStats: ABTestStats[] = [
      {
        testName: 'lead_magnet_type',
        variant: 'pdf',
        exposures: 1250,
        conversions: 156,
        conversionRate: 12.48
      },
      {
        testName: 'lead_magnet_type',
        variant: 'webinar',
        exposures: 1180,
        conversions: 165,
        conversionRate: 13.98
      },
      {
        testName: 'cta_button_text',
        variant: 'Get Started Free',
        exposures: 890,
        conversions: 98,
        conversionRate: 11.01
      },
      {
        testName: 'cta_button_text',
        variant: 'Start Your Trial',
        exposures: 856,
        conversions: 89,
        conversionRate: 10.40
      },
      {
        testName: 'cta_button_text',
        variant: 'Try It Now',
        exposures: 834,
        conversions: 102,
        conversionRate: 12.23
      }
    ]
    setTestStats(mockStats)
  }

  const getStatsForTest = (testName: string) => {
    return testStats.filter(stat => stat.testName === testName)
  }

  const calculateStatisticalSignificance = (variantA: ABTestStats, variantB: ABTestStats) => {
    // Simplified z-test calculation
    const p1 = variantA.conversionRate / 100
    const p2 = variantB.conversionRate / 100
    const n1 = variantA.exposures
    const n2 = variantB.exposures
    
    const pooledP = (variantA.conversions + variantB.conversions) / (n1 + n2)
    const se = Math.sqrt(pooledP * (1 - pooledP) * (1/n1 + 1/n2))
    const z = Math.abs(p1 - p2) / se
    
    // Rough approximation - in production, use proper statistical library
    return z > 1.96 ? 'Significant' : 'Not Significant'
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">A/B Test Dashboard</h2>
      
      {/* Active Tests Overview */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Tests</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(activeTests).map(([testName, config]) => (
            <div 
              key={testName}
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedTest === testName 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedTest(testName)}
            >
              <h4 className="font-medium text-gray-900">{config.name}</h4>
              <p className="text-sm text-gray-600 mt-1">{config.description}</p>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                  Active
                </span>
                <span className="text-xs text-gray-500">
                  {config.variants.length} variants
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Test Details */}
      {selectedTest && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Test Results: {activeTests[selectedTest]?.name}
          </h3>
          
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <p className="text-sm text-gray-600">
              <strong>Hypothesis:</strong> {activeTests[selectedTest]?.hypothesis}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              <strong>Success Metric:</strong> {activeTests[selectedTest]?.successMetric}
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-2 px-4 text-sm font-medium text-gray-900">Variant</th>
                  <th className="py-2 px-4 text-sm font-medium text-gray-900">Exposures</th>
                  <th className="py-2 px-4 text-sm font-medium text-gray-900">Conversions</th>
                  <th className="py-2 px-4 text-sm font-medium text-gray-900">Conversion Rate</th>
                  <th className="py-2 px-4 text-sm font-medium text-gray-900">Confidence</th>
                </tr>
              </thead>
              <tbody>
                {getStatsForTest(selectedTest).map((stat, index) => {
                  const stats = getStatsForTest(selectedTest)
                  const isControlVariant = index === 0
                  const significance = !isControlVariant && stats.length > 1 
                    ? calculateStatisticalSignificance(stats[0], stat)
                    : 'Control'

                  return (
                    <tr key={`${stat.testName}-${stat.variant}`} className="border-b border-gray-100">
                      <td className="py-2 px-4 text-sm text-gray-900">
                        {stat.variant}
                        {isControlVariant && (
                          <span className="ml-2 text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
                            Control
                          </span>
                        )}
                      </td>
                      <td className="py-2 px-4 text-sm text-gray-600">{stat.exposures.toLocaleString()}</td>
                      <td className="py-2 px-4 text-sm text-gray-600">{stat.conversions.toLocaleString()}</td>
                      <td className="py-2 px-4 text-sm text-gray-600">
                        <span className={`font-medium ${
                          !isControlVariant && stat.conversionRate > stats[0].conversionRate
                            ? 'text-green-600'
                            : !isControlVariant && stat.conversionRate < stats[0].conversionRate
                            ? 'text-red-600'
                            : 'text-gray-900'
                        }`}>
                          {stat.conversionRate.toFixed(2)}%
                        </span>
                        {!isControlVariant && (
                          <span className="ml-2 text-xs text-gray-500">
                            ({stat.conversionRate > stats[0].conversionRate ? '+' : ''}
                            {(stat.conversionRate - stats[0].conversionRate).toFixed(2)}%)
                          </span>
                        )}
                      </td>
                      <td className="py-2 px-4 text-sm">
                        <span className={`px-2 py-1 rounded text-xs ${
                          significance === 'Significant'
                            ? 'bg-green-100 text-green-800'
                            : significance === 'Not Significant'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {significance}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
            Export Results
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors">
            Start New Test
          </button>
          <button className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors">
            Pause All Tests
          </button>
          <button className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors">
            View Full Analytics
          </button>
        </div>
      </div>
    </div>
  )
}

// Simpler component for displaying test status
export function ABTestStatus() {
  const [activeTests, setActiveTests] = useState<Record<string, ABTestConfig>>({})

  useEffect(() => {
    setActiveTests(getActiveTests())
  }, [])

  const testCount = Object.keys(activeTests).length

  if (testCount === 0) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg text-sm">
      🧪 {testCount} A/B test{testCount !== 1 ? 's' : ''} running
    </div>
  )
}