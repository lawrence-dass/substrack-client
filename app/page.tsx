import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import Navbar from "@/components/Navbar"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <Navbar />

      {/* Hero Section */}
      <div className="container mx-auto px-6 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Track Your{" "}
            <span className="text-primary">Subscriptions</span>
            {" "}& Free Trials
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
            Take control of your recurring expenses and free trials. Monitor, manage, and optimize all your subscriptions and trial periods in one beautiful dashboard.
          </p>
          
          <div className="flex justify-center space-x-4 mb-16">
            <Link href="/signup">
              <Button size="lg" className="text-lg px-8 py-4">
                Start Free Trial
              </Button>
            </Link>
            <Link href="/signin">
              <Button variant="outline" size="lg" className="text-lg px-8 py-4">
                Sign In
              </Button>
            </Link>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                     <Card className="text-center">
             <CardHeader>
               <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                 <div className="w-6 h-6 bg-primary/20 rounded"></div>
               </div>
               <CardTitle>Track Everything</CardTitle>
               <CardDescription>
                 Monitor all your subscriptions and free trials in one place. Never lose track of recurring payments or trial expiration dates again.
               </CardDescription>
             </CardHeader>
           </Card>

                     <Card className="text-center">
             <CardHeader>
               <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                 <div className="w-6 h-6 bg-primary/20 rounded"></div>
               </div>
               <CardTitle>Save Money</CardTitle>
               <CardDescription>
                 Get insights into your spending patterns and find opportunities to save money on unused subscriptions. Cancel trials before they auto-convert to paid plans.
               </CardDescription>
             </CardHeader>
           </Card>

                     <Card className="text-center">
             <CardHeader>
               <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                 <div className="w-6 h-6 bg-primary/20 rounded"></div>
               </div>
               <CardTitle>Smart Alerts</CardTitle>
               <CardDescription>
                 Receive notifications before renewals and trial expirations. Get reminded about upcoming payments and trial end dates.
               </CardDescription>
             </CardHeader>
           </Card>
        </div>
      </div>
    </div>
  )
}
