"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Home() {
  const features = [
    {
      title: "Subscription Tracking",
      description: "Monitor all your active subscriptions in one centralized dashboard. Never lose track of what you're paying for.",
      icon: "📊"
    },
    {
      title: "Free Trial Management",
      description: "Get notified before your free trials end. Convert or cancel before unexpected charges hit your account.",
      icon: "⏰"
    },
    {
      title: "Smart Notifications",
      description: "Receive timely alerts for renewal dates, price changes, and subscription updates via email or SMS.",
      icon: "🔔"
    },
    {
      title: "Cost Optimization",
      description: "Identify unused or underutilized subscriptions and get recommendations to reduce your monthly expenses.",
      icon: "💰"
    },
    {
      title: "Category Organization",
      description: "Organize subscriptions by categories like Entertainment, Productivity, Health, and more for better management.",
      icon: "🗂️"
    },
    {
      title: "Payment Method Tracking",
      description: "Keep track of which payment methods are used for each subscription and get alerts for card expirations.",
      icon: "💳"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Take Control of Your
            <span className="text-primary"> Subscriptions</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Track, manage, and optimize all your subscriptions and free trials in one powerful dashboard. 
            Save money and never miss an important renewal date again.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-4">
            <Link href="/signup">
              <Button size="lg" className="text-lg px-8 py-3">
                Get Started Free
              </Button>
            </Link>
            <Link href="/signin">
              <Button variant="outline" size="lg" className="text-lg px-8 py-3">
                Sign In
              </Button>
            </Link>
          </div>
          <Link href="/dashboard">
            <Button variant="outline" size="lg" className="text-lg px-8 py-3 border-dashed border-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:border-solid">
              Try without signing up →
            </Button>
          </Link>
        </div>

        {/* Features Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Everything You Need to Manage Subscriptions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 