'use client'

import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import { RootState } from '@/redux/store'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ThemeToggle } from '@/components/theme-toggle'
import {
  Users,
  BookOpen,
  ArrowRight,
  Rocket,
  Target,
  MessageCircle,
  TrendingUp,
  Building,
  Globe,
  Calendar,
  FileText,
  UserPlus,
  Sparkles,
  Zap,
  Network,
  ChevronLeft,
  ChevronRight,
  Play,
  Star,
  Award,
  Briefcase,
  Lightbulb
} from 'lucide-react'
import { Link } from '@/components/ui/link'
import { useState } from 'react'

export default function HomePage() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth)
  const router = useRouter()
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [currentFeature, setCurrentFeature] = useState(0)

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, router])

  const testimonials = [
    {
      name: "Seja Narkhede",
      role: "Founder at FinTech Innovations",
      content: "StartupLaunch helped me find my technical co-founder. We raised $2M in seed funding within 6 months!",
      avatar: "SN",
      rating: 5
    },
    {
      name: "Niyati Rana",
      role: "CTO at HealthTech Solutions",
      content: "The mentorship I found here was invaluable. Connected with industry experts who guided our product launch.",
      avatar: "NR",
      rating: 5
    },
    {
      name: "Prathmesh Golap",
      role: "CEO at EduTech Pro",
      content: "From idea validation to our Series A, StartupLaunch has been our go-to platform for connections and resources.",
      avatar: "PG",
      rating: 5
    }
  ]

  const featuresCarousel = [
    {
      title: "Smart Founder Matching",
      description: "AI-powered algorithm connects you with ideal co-founders based on skills, experience, and vision",
      icon: <Users className="w-8 h-8" />,
      stats: "2,500+ successful matches"
    },
    {
      title: "Startup Validation Hub",
      description: "Get real feedback from experienced entrepreneurs and validate your ideas before building",
      icon: <Target className="w-8 h-8" />,
      stats: "85% better success rate"
    },
    {
      title: "Investor Network",
      description: "Connect with angel investors and VCs actively looking for promising startups",
      icon: <TrendingUp className="w-8 h-8" />,
      stats: "$50M+ raised through platform"
    }
  ]

  if (isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-slate-900">
      {/* Enhanced Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-800/60">
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Rocket className="w-5 h-5 text-white" />
                </div>
                
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                  StartupLaunch
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 -mt-1">
                  Build. Connect. Succeed.
                </span>
              </div>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/features" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 text-sm font-medium transition-colors">
                Features
              </Link>
              <Link href="/community" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 text-sm font-medium transition-colors">
                Community
              </Link>
              <Link href="/resources" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 text-sm font-medium transition-colors">
                Resources
              </Link>
              <Link href="/pricing" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 text-sm font-medium transition-colors">
                Pricing
              </Link>
            </nav>

            {/* Actions */}
            <div className="flex items-center space-x-3">
              <ThemeToggle />
              <div className="hidden sm:flex items-center space-x-2">
                <Link href="/auth/login">
                  <Button variant="ghost" className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                    Join Now
                    <UserPlus className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Enhanced Hero Section */}
      <section className="relative py-20 px-6 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-blue-50/50 to-teal-50/50 dark:from-transparent dark:via-blue-950/20 dark:to-teal-950/20"></div>
        <div className="absolute top-10 left-10 w-20 h-20 bg-blue-200/30 dark:bg-blue-800/20 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-teal-200/30 dark:bg-teal-800/20 rounded-full blur-xl"></div>
        
        <div className="container mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800 px-4 py-2 text-sm font-medium">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Join 15,000+ Founders Worldwide
                </Badge>

                <h1 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white leading-tight">
                  Launch Your
                  <span className="bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent"> Startup </span>
                  With Confidence
                </h1>

                <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
                  The professional network for startup founders. Connect with co-founders, 
                  find mentors, access resources, and build your dream company with the right team.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col items-center sm:flex-row gap-4">
                <Link href="/auth/register">
                  <Button size="lg" className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white px-8 py-6 text-lg shadow-xl hover:shadow-2xl transition-all duration-300">
                    <Rocket className="mr-3 w-5 h-5" />
                    Start Your Journey
                  </Button>
                </Link>
                
              </div>
            </div>

            {/* Right Content - Interactive Carousel */}
            <div className="relative">
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                {/* Carousel Header */}
                <div className="p-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                  <div className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    Live Founder Activity
                  </div>
                </div>

                {/* Carousel Content */}
                <div className="p-6">
                  <div className="relative h-64 overflow-hidden rounded-lg bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-700 dark:to-slate-800">
                    {featuresCarousel.map((feature, index) => (
                      <div
                        key={index}
                        className={`absolute inset-0 p-6 transition-opacity duration-500 ${
                          index === currentFeature ? 'opacity-100' : 'opacity-0'
                        }`}
                      >
                        <div className="flex flex-col items-center text-center h-full justify-center space-y-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-teal-500 rounded-2xl flex items-center justify-center text-white">
                            {feature.icon}
                          </div>
                          <h3 className="text-xl font-bold text-slate-900 dark:text-white">{feature.title}</h3>
                          <p className="text-slate-600 dark:text-slate-300">{feature.description}</p>
                          <Badge variant="secondary" className="bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                            {feature.stats}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Carousel Controls */}
                  <div className="flex justify-between items-center mt-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCurrentFeature((currentFeature - 1 + featuresCarousel.length) % featuresCarousel.length)}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <div className="flex space-x-2">
                      {featuresCarousel.map((_, index) => (
                        <button
                          key={index}
                          className={`w-2 h-2 rounded-full transition-all ${
                            index === currentFeature ? 'bg-blue-600 w-6' : 'bg-slate-300 dark:bg-slate-600'
                          }`}
                          onClick={() => setCurrentFeature(index)}
                        />
                      ))}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCurrentFeature((currentFeature + 1) % featuresCarousel.length)}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6 bg-white dark:bg-slate-900">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 px-4 py-2 text-sm">
              Platform Features
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Comprehensive tools and networks designed specifically for startup founders
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Users className="w-6 h-6" />,
                title: "Founder Matching",
                description: "AI-powered matching with co-founders based on skills, experience, and vision alignment",
                gradient: "from-blue-500 to-cyan-500"
              },
              {
                icon: <MessageCircle className="w-6 h-6" />,
                title: "Expert Network",
                description: "Connect with experienced mentors, advisors, and industry experts",
                gradient: "from-teal-500 to-green-500"
              },
              {
                icon: <TrendingUp className="w-6 h-6" />,
                title: "Investor Access",
                description: "Get introduced to angel investors and venture capital firms",
                gradient: "from-emerald-500 to-teal-500"
              },
              {
                icon: <Building className="w-6 h-6" />,
                title: "Startup Profiles",
                description: "Showcase your startup with traction metrics and team information",
                gradient: "from-sky-500 to-blue-500"
              },
              {
                icon: <FileText className="w-6 h-6" />,
                title: "Resource Library",
                description: "Access pitch decks, legal templates, and startup documentation",
                gradient: "from-cyan-500 to-blue-500"
              },
              {
                icon: <Calendar className="w-6 h-6" />,
                title: "Founder Events",
                description: "Join networking events, workshops, and pitch sessions",
                gradient: "from-blue-500 to-indigo-500"
              }
            ].map((feature, index) => (
              <Card key={index} className="group hover:shadow-2xl transition-all duration-300 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                <CardHeader className="pb-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${feature.gradient} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform text-white`}>
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">
                    {feature.title}
                  </CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Carousel */}
      <section className="py-20 px-6 bg-slate-50 dark:bg-slate-800/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 px-4 py-2 text-sm">
              Success Stories
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Trusted by Founders Worldwide
            </h2>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-8">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className={`text-center transition-opacity duration-500 ${
                    index === currentTestimonial ? 'opacity-100' : 'opacity-0 absolute inset-0'
                  }`}
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-4">
                    {testimonial.avatar}
                  </div>
                  <div className="flex justify-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <blockquote className="text-xl text-slate-700 dark:text-slate-300 mb-6 leading-relaxed">
                    "{testimonial.content}"
                  </blockquote>
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white">{testimonial.name}</div>
                    <div className="text-slate-600 dark:text-slate-400 text-sm">{testimonial.role}</div>
                  </div>
                </div>
              ))}
              
              {/* Testimonial Controls */}
              <div className="flex justify-center mt-8 space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentTestimonial((currentTestimonial - 1 + testimonials.length) % testimonials.length)}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <div className="flex space-x-2 items-center">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentTestimonial ? 'bg-blue-600 w-6' : 'bg-slate-300 dark:bg-slate-600'
                      }`}
                      onClick={() => setCurrentTestimonial(index)}
                    />
                  ))}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentTestimonial((currentTestimonial + 1) % testimonials.length)}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
           <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4 text-center">Future Targets</h1>
      <section className="py-20 px-6 bg-gradient-to-r from-blue-600 to-teal-600 text-white">
   
        <div className="container mx-auto">
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl font-bold">$150M+</div>
              <div className="text-blue-100">Total Funding Raised by 2032</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold">25K+</div>
              <div className="text-blue-100">Active Founders</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold">5K+</div>
              <div className="text-blue-100">Startups Launched</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold">95%</div>
              <div className="text-blue-100">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6 bg-white dark:bg-slate-900">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <Badge className="mb-4 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 px-4 py-2">
              <Award className="w-4 h-4 mr-2" />
              Most Trusted Founder Platform
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6">
              Ready to Launch Your Startup?
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 mb-8">
              Join thousands of successful founders who built their companies with StartupLaunch. 
              Your co-founders, mentors, and investors are waiting.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/auth/register">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white px-8 py-6 text-lg font-semibold">
                  <Rocket className="mr-3 w-5 h-5" />
                  Start Free Trial
                </Button>
              </Link>
              
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="bg-slate-900 text-slate-400 py-16 px-6">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-teal-500 rounded-lg flex items-center justify-center">
                  <Rocket className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">StartupLaunch</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                The professional network for startup founders to connect, collaborate, and build successful companies.
              </p>
              <div className="flex space-x-4">
                {['Twitter', 'LinkedIn', 'Instagram', 'YouTube'].map((social) => (
                  <button key={social} className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-slate-700 transition-colors">
                    <Globe className="w-4 h-4" />
                  </button>
                ))}
              </div>
            </div>

            {[
              {
                title: "Platform",
                links: ["Features", "Community", "Success Stories", "Pricing"]
              },
              {
                title: "Resources",
                links: ["Blog", "Templates", "Events", "Help Center"]
              },
              {
                title: "Company",
                links: ["About", "Careers", "Contact", "Privacy"]
              }
            ].map((column, index) => (
              <div key={index} className="space-y-4">
                <h3 className="font-semibold text-white">{column.title}</h3>
                <div className="space-y-2">
                  {column.links.map((link) => (
                    <Link key={link} href="#" className="block text-slate-400 hover:text-white transition-colors">
                      {link}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-slate-500 mb-4 md:mb-0">
              © 2025 StartupLaunch. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm text-slate-500">
              <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
              <Link href="#" className="hover:text-white transition-colors">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}