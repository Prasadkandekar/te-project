'use client'

import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import { RootState } from '@/redux/store'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ThemeToggle } from '@/components/theme-toggle'
import {
  Users,
  Rocket,
  Lightbulb,
  CheckCircle,
  FileText,
  Briefcase,
  ShieldCheck,
  DollarSign,
  TrendingUp,
  Megaphone,
  ArrowRight,
  Sparkles
} from 'lucide-react'
import { Link } from '@/components/ui/link'

export default function HomePage() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth)
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, router])

  const testimonials = [
    {
      name: "Seja Narkhede",
      role: "Founder, FinTech Innovations",
      content: "StartupLaunch is the most comprehensive platform for founders. It guided us through every step, from idea to launch.",
      avatar: "SN",
    },
    {
      name: "Niyati Rana",
      role: "CTO, HealthTech Solutions",
      content: "The community and mentorship have been invaluable. We found our lead investor through a connection made on StartupLaunch.",
      avatar: "NR",
    },
    {
      name: "Prathmesh Golap",
      role: "CEO, EduTech Pro",
      content: "We were able to validate our idea, build a team, and secure funding all within the StartupLaunch ecosystem.",
      avatar: "PG",
    }
  ]

  const startupJourney = [
    { icon: <Lightbulb className="w-8 h-8" />, title: "Idea" },
    { icon: <CheckCircle className="w-8 h-8" />, title: "Validate" },
    { icon: <FileText className="w-8 h-8" />, title: "Plan" },
    { icon: <ShieldCheck className="w-8 h-8" />, title: "Register" },
    { icon: <Briefcase className="w-8 h-8" />, title: "Build" },
    { icon: <DollarSign className="w-8 h-8" />, title: "Fund" },
    { icon: <Megaphone className="w-8 h-8" />, title: "Launch" },
    { icon: <TrendingUp className="w-8 h-8" />, title: "Grow" },
    { icon: <Users className="w-8 h-8" />, title: "Community" },
  ];

  if (isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/70 dark:bg-gray-950/70 border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <Rocket className="w-6 h-6 text-purple-600" />
              <span className="text-xl font-bold">StartupLaunch</span>
            </Link>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="#features" className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                Features
              </Link>
              <Link href="#pricing" className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                Pricing
              </Link>
              <Link href="#testimonials" className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                Testimonials
              </Link>
            </nav>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Link href="/auth/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/auth/register">
                <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                  Get Started <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-24 md:py-32 px-6 text-center">
        <div className="container mx-auto">
          <Sparkles className="w-12 h-12 text-purple-600 mx-auto mb-6" />
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
            Your All-in-One Startup Ecosystem
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-10">
            From idea to IPO, StartupLaunch provides the tools, resources, and network you need to build a successful company.
          </p>
          <div className="flex justify-center items-center space-x-4">
            <Link href="/auth/register">
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3">
                Start Your Journey
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Startup Journey Section */}
      <section id="features" className="py-20 px-6 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need to Succeed</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              We guide you through every stage of the startup lifecycle.
            </p>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-8 text-center">
            {startupJourney.map((step, index) => (
              <div key={index} className="flex flex-col items-center space-y-2">
                <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-md text-purple-600">{step.icon}</div>
                <span className="font-semibold">{step.title}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Flexible Pricing for Every Stage</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Choose the plan that fits your startup's needs and budget.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="bg-white dark:bg-gray-800 shadow-lg border-t-4 border-purple-600">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Founder</CardTitle>
                <p className="text-4xl font-extrabold">Free</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li>Access to Community Forum</li>
                  <li>Basic Founder Profile</li>
                  <li>Limited Resource Access</li>
                </ul>
                <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">Get Started</Button>
              </CardContent>
            </Card>
            <Card className="bg-white dark:bg-gray-800 shadow-lg border-t-4 border-purple-600 relative">
              <div className="absolute top-0 right-4 -mt-3 bg-purple-600 text-white text-sm font-bold px-3 py-1 rounded-full">Most Popular</div>
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Pro</CardTitle>
                <p className="text-4xl font-extrabold">$49<span className="text-lg font-medium">/mo</span></p>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li>Advanced Co-Founder Matching</li>
                  <li>Full Mentorship Access</li>
                  <li>Unlimited Resource Library</li>
                  <li>Pitch Deck Reviews</li>
                </ul>
                <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">Choose Pro</Button>
              </CardContent>
            </Card>
            <Card className="bg-white dark:bg-gray-800 shadow-lg border-t-4 border-purple-600">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Scale</CardTitle>
                <p className="text-4xl font-extrabold">$99<span className="text-lg font-medium">/mo</span></p>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li>Dedicated Investor Relations</li>
                  <li>Priority Support</li>
                  <li>Team Management Tools</li>
                  <li>API Access</li>
                </ul>
                <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">Contact Sales</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-6 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Loved by Founders</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Hear what our successful members have to say about StartupLaunch.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white dark:bg-gray-800 shadow-md">
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                      {testimonial.avatar}
                    </div>
                    <div className="ml-4">
                      <div className="font-bold">{testimonial.name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</div>
                    </div>
                  </div>
                  <blockquote className="italic text-gray-600 dark:text-gray-300">
                    “{testimonial.content}”
                  </blockquote>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 bg-gray-900 text-gray-400">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Rocket className="w-6 h-6 text-purple-600" />
                <span className="text-xl font-bold text-white">StartupLaunch</span>
              </div>
              <p>Your all-in-one startup ecosystem.</p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Platform</h3>
              <ul className="space-y-2">
                <li><Link href="#features" className="hover:text-purple-400">Features</Link></li>
                <li><Link href="#pricing" className="hover:text-purple-400">Pricing</Link></li>
                <li><Link href="#testimonials" className="hover:text-purple-400">Testimonials</Link></li>
                <li><Link href="/auth/register" className="hover:text-purple-400">Sign Up</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link href="#" className="hover:text-purple-400">About Us</Link></li>
                <li><Link href="#" className="hover:text-purple-400">Careers</Link></li>
                <li><Link href="#" className="hover:text-purple-400">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link href="#" className="hover:text-purple-400">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-purple-400">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center">
            <p>&copy; {new Date().getFullYear()} StartupLaunch. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
