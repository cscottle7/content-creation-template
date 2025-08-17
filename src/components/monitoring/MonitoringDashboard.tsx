'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/Card'

interface MetricCard {
  title: string
  value: string | number
  change: number
  changeType: 'positive' | 'negative' | 'neutral'
  description: string
}

interface PerformanceMetric {
  name: string
  value: number
  target: number
  status: 'good' | 'warning' | 'critical'
}

export default function MonitoringDashboard() {
  const [metrics, setMetrics] = useState<MetricCard[]>([])
  const [performance, setPerformance] = useState<PerformanceMetric[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      // Simulate loading real metrics
      // In production, these would come from your analytics APIs
      
      const mockMetrics: MetricCard[] = [
        {
          title: 'Total Visitors',
          value: '2,847',
          change: 12.5,
          changeType: 'positive',
          description: 'Unique visitors last 30 days'
        },
        {
          title: 'Lead Conversions',
          value: '156',
          change: 8.3,
          changeType: 'positive',
          description: 'Lead magnet downloads'
        },
        {
          title: 'Conversion Rate',
          value: '5.48%',
          change: -0.2,
          changeType: 'negative',
          description: 'Visitor to lead conversion'
        },
        {
          title: 'Avg. Session Duration',
          value: '3:42',
          change: 15.2,
          changeType: 'positive',
          description: 'Time spent on site'
        },
        {
          title: 'Page Views',
          value: '8,934',
          change: 22.1,
          changeType: 'positive',
          description: 'Total page views'
        },
        {
          title: 'Bounce Rate',
          value: '42.3%',
          change: -5.1,
          changeType: 'positive',
          description: 'Single page sessions'
        }
      ]

      const mockPerformance: PerformanceMetric[] = [
        {
          name: 'First Contentful Paint',
          value: 991,
          target: 1800,
          status: 'good'
        },
        {
          name: 'Largest Contentful Paint',
          value: 1240,
          target: 2500,
          status: 'good'
        },
        {
          name: 'Cumulative Layout Shift',
          value: 0.02,
          target: 0.1,
          status: 'good'
        },
        {
          name: 'Time to Interactive',
          value: 2100,
          target: 3800,
          status: 'good'
        }
      ]

      setMetrics(mockMetrics)
      setPerformance(mockPerformance)
      setIsLoading(false)
      
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
      setIsLoading(false)
    }
  }

  const getChangeIcon = (changeType: string) => {
    switch (changeType) {
      case 'positive':
        return '↗️'
      case 'negative':
        return '↘️'
      default:
        return '→'
    }
  }

  const getChangeColor = (changeType: string) => {
    switch (changeType) {
      case 'positive':
        return 'text-green-600'
      case 'negative':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  const getPerformanceStatus = (status: string) => {
    switch (status) {
      case 'good':
        return '✅'
      case 'warning':
        return '⚠️'
      case 'critical':
        return '❌'
      default:
        return '❓'
    }
  }

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Analytics Dashboard
        </h1>
        <p className="text-gray-600">
          Monitor your website performance and business metrics
        </p>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {metrics.map((metric, index) => (
          <Card key={index} className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {metric.title}
                </p>
                <p className="text-2xl font-bold text-gray-900 mb-1">
                  {metric.value}
                </p>
                <p className="text-xs text-gray-500">
                  {metric.description}
                </p>
              </div>
              <div className={`flex items-center text-sm ${getChangeColor(metric.changeType)}`}>
                <span className="mr-1">{getChangeIcon(metric.changeType)}</span>
                <span>{Math.abs(metric.change)}%</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Core Web Vitals
          </h3>
          <div className="space-y-4">
            {performance.map((perf, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="mr-2">{getPerformanceStatus(perf.status)}</span>
                  <span className="text-sm font-medium text-gray-700">
                    {perf.name}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-semibold text-gray-900">
                    {perf.name.includes('Shift') ? perf.value.toFixed(3) : `${perf.value}ms`}
                  </span>
                  <p className="text-xs text-gray-500">
                    Target: {perf.name.includes('Shift') ? perf.target.toFixed(1) : `${perf.target}ms`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Conversion Funnel
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Website Visitors</span>
              <span className="text-sm font-semibold">2,847</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '100%' }}></div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Page Engagement</span>
              <span className="text-sm font-semibold">1,825 (64%)</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '64%' }}></div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Lead Magnet Views</span>
              <span className="text-sm font-semibold">487 (17%)</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-600 h-2 rounded-full" style={{ width: '17%' }}></div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Conversions</span>
              <span className="text-sm font-semibold">156 (5.5%)</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-600 h-2 rounded-full" style={{ width: '5.5%' }}></div>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Recent Activity
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">New lead magnet download</span>
            <span className="text-gray-500">2 minutes ago</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Contact form submission</span>
            <span className="text-gray-500">15 minutes ago</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Page performance alert resolved</span>
            <span className="text-gray-500">1 hour ago</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">New user session started</span>
            <span className="text-gray-500">2 hours ago</span>
          </div>
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="mt-8 flex flex-wrap gap-4">
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Export Report
        </button>
        <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
          View Google Analytics
        </button>
        <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
          Performance Report
        </button>
      </div>
    </div>
  )
}