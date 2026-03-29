'use client'

import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import { RootState } from '@/redux/store'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ThemeToggle } from '@/components/theme-toggle'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Check,
  Target,
  Map,
  BookOpen,
  Zap,
  Shield,
  Users
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

  const features = [
    {
      icon: Target,
      title: "Idea Validation",
      description: "Validate your startup idea with AI-powered market analysis, competitive insights, and viability scoring."
    },
    {
      icon: Map,
      title: "Roadmap Generation",
      description: "Generate comprehensive roadmaps with phase-by-phase milestones tailored to your startup's goals."
    },
    {
      icon: BookOpen,
      title: "Case Studies",
      description: "Learn from real-world success stories and industry leaders with detailed case study analysis."
    }
  ]

  const benefits = [
    "AI-powered validation in seconds",
    "Custom roadmap templates",
    "Real-world case studies",
    "Community of 10,000+ founders",
    "Expert mentorship access",
    "Secure and private"
  ]

  const plans = [
    {
      name: "Free",
      price: "0",
      description: "For exploring ideas",
      features: [
        "Basic idea validation",
        "Community access",
        "3 roadmap templates",
        "5 case studies/month"
      ]
    },
    {
      name: "Pro",
      price: "999",
      description: "For serious founders",
      features: [
        "Unlimited validations",
        "Custom roadmaps",
        "Full case study library",
        "Priority support",
        "Mentorship access"
      ],
      highlighted: true
    },
    {
      name: "Scale",
      price: "2999",
      description: "For growing teams",
      features: [
        "Everything in Pro",
        "Team collaboration",
        "API access",
        "Dedicated support",
        "Custom integrations"
      ]
    }
  ]

  if (isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-gray-100">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-lg font-semibold flex items-center gap-2">
            <div className="w-8 h-8 bg-gray-900 dark:bg-white rounded-full flex items-center justify-center">
              <span className="text-white dark:text-black text-xl">✦</span>
            </div>
            <span>StartupLaunch</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-1 bg-gray-100 dark:bg-gray-900 rounded-full px-2 py-1">
            <Link href="#" className="px-4 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-full transition-colors">
              Home
            </Link>
            <Link href="#features" className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-full hover:bg-white dark:hover:bg-gray-800 transition-colors">
              Features
            </Link>
            <Link href="#pricing" className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-full hover:bg-white dark:hover:bg-gray-800 transition-colors">
              Pricing
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/auth/login">
              <Button variant="ghost" size="sm" className="text-sm">Sign in</Button>
            </Link>
            <Link href="/auth/register">
              <Button size="sm" className="bg-white dark:bg-white text-black hover:bg-gray-100 rounded-full">
                Register
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative pt-24 pb-32 px-6 overflow-hidden bg-white dark:bg-[#0a0a0a]">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          {/* Badge */}
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-sm text-gray-700 dark:text-gray-300">Early Access — Build Your Startup</span>
          </motion.div>

          <motion.h1 
            className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <span className="block">Build Your Startup</span>
            <span className="block italic font-light text-gray-600 dark:text-gray-400">Launch Your World</span>
          </motion.h1>
          
          <motion.p 
            className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Join a vibrant community where ideas come alive — validate, plan, and launch through unique tools that help you stand out in every interaction.
          </motion.p>

          {/* Floating Cards - Desktop */}
          <div className="relative h-[500px] mt-16 hidden lg:block">
            {/* Top Left Card - Community */}
            <motion.div
              className="absolute left-[5%] top-0 w-56 h-36 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-3xl p-6 shadow-2xl z-10 rotate-[-8deg] cursor-pointer"
              initial={{ opacity: 0, y: -50, rotate: -15 }}
              animate={{ opacity: 1, y: 0, rotate: -8 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              whileHover={{ scale: 1.05, rotate: -5 }}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-white/30 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <span className="text-white text-lg font-bold">Community</span>
              </div>
              <p className="text-purple-100 text-sm">10K+ Founders</p>
            </motion.div>

            {/* Top Right Card - Fast */}
            <motion.div
              className="absolute right-[5%] top-0 w-56 h-36 bg-gradient-to-br from-orange-500 to-red-600 rounded-3xl p-6 shadow-2xl z-10 rotate-[8deg] cursor-pointer"
              initial={{ opacity: 0, y: -50, rotate: 15 }}
              animate={{ opacity: 1, y: 0, rotate: 8 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              whileHover={{ scale: 1.05, rotate: 5 }}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-white/30 rounded-full flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="text-white text-lg font-bold">Fast</span>
              </div>
              <p className="text-orange-100 text-sm">Instant Results</p>
            </motion.div>

            {/* Left Card - Roadmap */}
            <motion.div
              className="absolute left-[5%] top-[32%] w-64 h-80 bg-gradient-to-br from-pink-500 to-rose-600 rounded-3xl p-8 shadow-2xl z-20 rotate-[-6deg] cursor-pointer"
              initial={{ opacity: 0, x: -100, rotate: -12 }}
              animate={{ opacity: 1, x: 0, rotate: -6 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              whileHover={{ scale: 1.05, rotate: -3 }}
            >
              <h3 className="text-white text-2xl font-bold mb-2">Roadmap</h3>
              <p className="text-pink-100 text-sm mb-6">Plan Your Journey</p>
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 h-44 flex items-center justify-center">
                <Map className="w-20 h-20 text-white" />
              </div>
            </motion.div>

            {/* Center Card - Validate (shifted left) */}
            <motion.div
              className="absolute left-[35%] -translate-x-1/2 top-[25%] w-80 h-96 bg-gradient-to-br from-cyan-400 via-blue-500 to-blue-600 rounded-3xl p-8 shadow-2xl z-30 glow-card"
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              whileHover={{ scale: 1.05, y: -10 }}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-white text-2xl font-bold mb-1">Validate</h3>
                  <p className="text-cyan-100 text-sm">AI-Powered Analysis</p>
                </div>
                <Link href="/auth/register">
                  <Button size="sm" className="bg-white text-black hover:bg-gray-100 rounded-full font-medium">
                    Get Started <ArrowRight className="ml-1 w-4 h-4" />
                  </Button>
                </Link>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 h-52 flex items-center justify-center">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full border-8 border-white/40 flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full border-8 border-white/60 flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-white"></div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Card - Learn */}
            <motion.div
              className="absolute right-[5%] top-[32%] w-64 h-80 bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl p-8 shadow-2xl z-20 rotate-[6deg] cursor-pointer"
              initial={{ opacity: 0, x: 100, rotate: 12 }}
              animate={{ opacity: 1, x: 0, rotate: 6 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              whileHover={{ scale: 1.05, rotate: 3 }}
            >
              <h3 className="text-white text-2xl font-bold mb-2">Learn</h3>
              <p className="text-green-100 text-sm mb-6">Real Case Studies</p>
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 h-44 flex items-center justify-center">
                <BookOpen className="w-20 h-20 text-white" />
              </div>
            </motion.div>
          </div>

          {/* Mobile Cards - Stacked */}
          <div className="grid gap-6 mt-12 lg:hidden max-w-md mx-auto">
            <motion.div
              className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl p-6 shadow-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-white text-xl font-bold mb-1">Validate</h3>
                  <p className="text-cyan-100 text-sm">AI-Powered Analysis</p>
                </div>
                <Target className="w-12 h-12 text-white" />
              </div>
            </motion.div>

            <motion.div
              className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl p-6 shadow-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-white text-xl font-bold mb-1">Roadmap</h3>
                  <p className="text-pink-100 text-sm">Plan Your Journey</p>
                </div>
                <Map className="w-12 h-12 text-white" />
              </div>
            </motion.div>

            <motion.div
              className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 shadow-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-white text-xl font-bold mb-1">Learn</h3>
                  <p className="text-green-100 text-sm">Real Case Studies</p>
                </div>
                <BookOpen className="w-12 h-12 text-white" />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 dark:bg-purple-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-3xl"></div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything you need to launch
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Powerful tools designed for founders at every stage.
            </p>
          </div>

          <div className="space-y-32">
            {/* Feature 1 - Idea Validation */}
            <motion.div
              className="flex flex-col md:flex-row items-center gap-12"
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex-1">
                <div className="inline-flex p-3 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 text-white mb-6">
                  <Target className="w-8 h-8" />
                </div>
                <h3 className="text-3xl font-bold mb-4">AI-Powered Idea Validation</h3>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                  Get instant feedback on your startup idea with our advanced AI analysis. Understand market viability, competition, and potential pivots.
                </p>
                <Link href="/auth/register">
                  <Button className="bg-gray-900 dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100">
                    Try It Now <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>
              <div className="flex-1">
                <motion.div
                  className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-800"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <img 
                    src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80" 
                    alt="AI-Powered Idea Validation"
                    className="w-full h-[400px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20"></div>
                </motion.div>
              </div>
            </motion.div>

            {/* Feature 2 - Roadmap Generation */}
            <motion.div
              className="flex flex-col md:flex-row-reverse items-center gap-12"
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex-1">
                <div className="inline-flex p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white mb-6">
                  <Map className="w-8 h-8" />
                </div>
                <h3 className="text-3xl font-bold mb-4">Smart Roadmap Generation</h3>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                  Create comprehensive, phase-by-phase roadmaps tailored to your startup. Track milestones and stay on course to success.
                </p>
                <Link href="/auth/register">
                  <Button className="bg-gray-900 dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100">
                    Try It Now <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>
              <div className="flex-1">
                <motion.div
                  className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-800"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <img 
                    src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80" 
                    alt="Smart Roadmap Generation"
                    className="w-full h-[400px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-500/20"></div>
                </motion.div>
              </div>
            </motion.div>

            {/* Feature 3 - Case Studies */}
            <motion.div
              className="flex flex-col md:flex-row items-center gap-12"
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex-1">
                <div className="inline-flex p-3 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 text-white mb-6">
                  <BookOpen className="w-8 h-8" />
                </div>
                <h3 className="text-3xl font-bold mb-4">Real-World Case Studies</h3>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                  Learn from successful startups and industry leaders. Access detailed case studies with actionable insights and strategies.
                </p>
                <Link href="/auth/register">
                  <Button className="bg-gray-900 dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100">
                    Try It Now <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>
              <div className="flex-1">
                <motion.div
                  className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-800"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <img 
                    src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80" 
                    alt="Real-World Case Studies"
                    className="w-full h-[400px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-emerald-500/20"></div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Built for founders who move fast
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                Join thousands of entrepreneurs using StartupLaunch to validate ideas, plan execution, and learn from the best.
              </p>
              <ul className="space-y-4">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-gray-900 dark:text-gray-100 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-black p-6">
                <Zap className="w-6 h-6 mb-3" />
                <div className="text-sm font-medium">Lightning fast</div>
              </Card>
              <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-black p-6">
                <Shield className="w-6 h-6 mb-3" />
                <div className="text-sm font-medium">Secure & private</div>
              </Card>
              <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-black p-6">
                <Users className="w-6 h-6 mb-3" />
                <div className="text-sm font-medium">Global community</div>
              </Card>
              <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-black p-6">
                <Target className="w-6 h-6 mb-3" />
                <div className="text-sm font-medium">Data-driven</div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-6 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Choose the plan that fits your needs. Always know what you'll pay.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className={`border ${plan.highlighted ? 'border-gray-900 dark:border-gray-100' : 'border-gray-200 dark:border-gray-800'} bg-white dark:bg-black h-full`}>
                  <CardContent className="p-8">
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold mb-1">{plan.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{plan.description}</p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-bold">₹{plan.price}</span>
                        {plan.price !== "0" && <span className="text-gray-600 dark:text-gray-400">/month</span>}
                      </div>
                    </div>
                    
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm">
                          <Check className="w-4 h-4 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Button 
                      className={`w-full ${plan.highlighted ? 'bg-gray-900 dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100' : 'bg-white dark:bg-black border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900'}`}
                    >
                      {plan.price === "0" ? "Get started" : "Start free trial"}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to launch your startup?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-10">
            Join thousands of founders building the future.
          </p>
          <Link href="/auth/register">
            <Button size="lg" className="bg-gray-900 dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100">
              Start for free <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="font-semibold mb-4">StartupLaunch</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Empowering founders to build the future.
              </p>
            </div>
            <div>
              <div className="font-medium mb-3 text-sm">Product</div>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li><Link href="#features">Features</Link></li>
                <li><Link href="#pricing">Pricing</Link></li>
                <li><Link href="#">Case Studies</Link></li>
              </ul>
            </div>
            <div>
              <div className="font-medium mb-3 text-sm">Company</div>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li><Link href="#">About</Link></li>
                <li><Link href="#">Blog</Link></li>
                <li><Link href="#">Careers</Link></li>
              </ul>
            </div>
            <div>
              <div className="font-medium mb-3 text-sm">Legal</div>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li><Link href="#">Privacy</Link></li>
                <li><Link href="#">Terms</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-200 dark:border-gray-800 text-sm text-gray-600 dark:text-gray-400">
            © {new Date().getFullYear()} StartupLaunch. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
