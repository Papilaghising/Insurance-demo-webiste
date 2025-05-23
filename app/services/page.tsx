import Link from "next/link"
import { ArrowRight, Shield, FileCheck, Clock, CheckCircle, BarChart, Users, Headphones } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function ServicesPage() {
  return (
    <div className="flex flex-col min-h-screen bg-blue-50">
      <header className="px-8 h-24 flex items-center border-b bg-white fixed w-full z-10 shadow-sm">
        <Link className="flex items-center justify-center" href="/">
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/A__2_-removebg-preview-ZabQoiu2niiPHLJlKWKnvBDhqIBgyh.png"
            alt="TrueClaim Logo"
            className="h-16 w-auto"
          />
        </Link>
        <nav className="mx-auto flex gap-8">
          <Link className="text-sm font-medium text-blue-600 hover:text-blue-800" href="/">
            Home
          </Link>
          <Link className="text-sm font-medium text-blue-600 hover:text-blue-800" href="/about">
            About
          </Link>
          <Link className="text-sm font-medium text-blue-600 hover:text-blue-800" href="/services">
            Services
          </Link>
          <Link className="text-sm font-medium text-blue-600 hover:text-blue-800" href="/contact">
            Contact
          </Link>
        </nav>
        <div className="flex gap-4">
          <Button variant="outline" className="border-blue-600 bg-transparent text-blue-600 hover:bg-blue-50">
            Log In
          </Button>
          <Button className="bg-blue-600 text-white hover:bg-blue-700">Get Started</Button>
        </div>
      </header>

      <main className="flex-1 pt-24">
        <section className="w-full py-24 md:py-32 bg-gradient-to-b from-blue-600 to-blue-500">
          <div className="container px-8 mx-auto">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white mb-4">Our Services</h1>
              <p className="text-xl text-blue-100">
                Comprehensive insurance claims processing solutions tailored to your needs.
              </p>
            </div>
          </div>
        </section>

        <section className="w-full py-24 bg-white">
          <div className="container px-8 mx-auto">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <Card className="bg-white border border-blue-100 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center gap-4 border-b border-blue-50 bg-blue-500 p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white">
                    <FileCheck className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="space-y-1">
                    <CardTitle className="text-white">Claims Verification</CardTitle>
                    <CardDescription className="text-blue-100">Thorough documentation review</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="pt-6 px-6 pb-6">
                  <p className="text-blue-700 mb-4">
                    Our expert team meticulously reviews all claims documentation to ensure accuracy, completeness, and
                    compliance with policy terms. We identify potential issues before they become problems.
                  </p>
                  <ul className="space-y-2 text-blue-700">
                    <li className="flex items-center">
                      <CheckCircle className="mr-2 h-4 w-4 text-blue-500 flex-shrink-0" />
                      <span>Policy verification</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="mr-2 h-4 w-4 text-blue-500 flex-shrink-0" />
                      <span>Documentation completeness check</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="mr-2 h-4 w-4 text-blue-500 flex-shrink-0" />
                      <span>Fraud detection</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-white border border-blue-100 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center gap-4 border-b border-blue-50 bg-blue-500 p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white">
                    <Clock className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="space-y-1">
                    <CardTitle className="text-white">Expedited Processing</CardTitle>
                    <CardDescription className="text-blue-100">Faster claim resolution</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="pt-6 px-6 pb-6">
                  <p className="text-blue-700 mb-4">
                    Our streamlined workflows and proprietary technology enable us to process claims up to 40% faster
                    than industry averages, without sacrificing accuracy or compliance.
                  </p>
                  <ul className="space-y-2 text-blue-700">
                    <li className="flex items-center">
                      <CheckCircle className="mr-2 h-4 w-4 text-blue-500 flex-shrink-0" />
                      <span>Automated document sorting</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="mr-2 h-4 w-4 text-blue-500 flex-shrink-0" />
                      <span>Parallel processing workflows</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="mr-2 h-4 w-4 text-blue-500 flex-shrink-0" />
                      <span>Priority handling options</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-white border border-blue-100 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center gap-4 border-b border-blue-50 bg-blue-500 p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white">
                    <BarChart className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="space-y-1">
                    <CardTitle className="text-white">Analytics & Reporting</CardTitle>
                    <CardDescription className="text-blue-100">Data-driven insights</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="pt-6 px-6 pb-6">
                  <p className="text-blue-700 mb-4">
                    Gain valuable insights into your claims processing with our comprehensive analytics and reporting
                    tools. Identify trends, bottlenecks, and opportunities for improvement.
                  </p>
                  <ul className="space-y-2 text-blue-700">
                    <li className="flex items-center">
                      <CheckCircle className="mr-2 h-4 w-4 text-blue-500 flex-shrink-0" />
                      <span>Custom dashboard creation</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="mr-2 h-4 w-4 text-blue-500 flex-shrink-0" />
                      <span>Trend analysis</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="mr-2 h-4 w-4 text-blue-500 flex-shrink-0" />
                      <span>Performance benchmarking</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-white border border-blue-100 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center gap-4 border-b border-blue-50 bg-blue-500 p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="space-y-1">
                    <CardTitle className="text-white">Customer Communication</CardTitle>
                    <CardDescription className="text-blue-100">Keeping claimants informed</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="pt-6 px-6 pb-6">
                  <p className="text-blue-700 mb-4">
                    We handle all aspects of customer communication throughout the claims process, ensuring claimants
                    stay informed and satisfied with clear, timely updates.
                  </p>
                  <ul className="space-y-2 text-blue-700">
                    <li className="flex items-center">
                      <CheckCircle className="mr-2 h-4 w-4 text-blue-500 flex-shrink-0" />
                      <span>Automated status updates</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="mr-2 h-4 w-4 text-blue-500 flex-shrink-0" />
                      <span>Multi-channel communication</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="mr-2 h-4 w-4 text-blue-500 flex-shrink-0" />
                      <span>Personalized messaging</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-white border border-blue-100 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center gap-4 border-b border-blue-50 bg-blue-500 p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white">
                    <Headphones className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="space-y-1">
                    <CardTitle className="text-white">Support Services</CardTitle>
                    <CardDescription className="text-blue-100">24/7 assistance</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="pt-6 px-6 pb-6">
                  <p className="text-blue-700 mb-4">
                    Our dedicated support team is available around the clock to address any questions or concerns from
                    your team or your customers.
                  </p>
                  <ul className="space-y-2 text-blue-700">
                    <li className="flex items-center">
                      <CheckCircle className="mr-2 h-4 w-4 text-blue-500 flex-shrink-0" />
                      <span>24/7 availability</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="mr-2 h-4 w-4 text-blue-500 flex-shrink-0" />
                      <span>Multilingual support</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="mr-2 h-4 w-4 text-blue-500 flex-shrink-0" />
                      <span>Dedicated account managers</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-white border border-blue-100 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center gap-4 border-b border-blue-50 bg-blue-500 p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white">
                    <Shield className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="space-y-1">
                    <CardTitle className="text-white">Compliance Management</CardTitle>
                    <CardDescription className="text-blue-100">Regulatory adherence</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="pt-6 px-6 pb-6">
                  <p className="text-blue-700 mb-4">
                    Stay compliant with all relevant regulations and industry standards. Our team keeps up with changing
                    requirements so you don't have to.
                  </p>
                  <ul className="space-y-2 text-blue-700">
                    <li className="flex items-center">
                      <CheckCircle className="mr-2 h-4 w-4 text-blue-500 flex-shrink-0" />
                      <span>Regulatory monitoring</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="mr-2 h-4 w-4 text-blue-500 flex-shrink-0" />
                      <span>Compliance reporting</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="mr-2 h-4 w-4 text-blue-500 flex-shrink-0" />
                      <span>Audit preparation</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="w-full py-24 bg-blue-600">
          <div className="container px-8 mx-auto">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold tracking-tight text-white mb-6">Ready to Get Started?</h2>
              <p className="text-xl text-blue-100 mb-8">
                Contact us today to discuss how TrueClaim can transform your insurance claims processing.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-white hover:bg-blue-100 text-blue-600 px-8 py-6 text-lg">
                  Contact Us
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button variant="outline" className="border-blue-300 text-white hover:bg-blue-700 px-8 py-6 text-lg">
                  Request Demo
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 w-full bg-blue-800 text-white">
        <div className="container px-8 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="bg-white p-3 rounded-lg inline-block mb-4">
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/A__2_-removebg-preview-ZabQoiu2niiPHLJlKWKnvBDhqIBgyh.png"
                  alt="TrueClaim Logo"
                  className="h-16 w-auto"
                />
              </div>
              <p className="text-blue-100 text-sm">
                Transforming insurance claims processing with efficiency, accuracy, and customer satisfaction.
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-4 text-white">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Link className="text-blue-100 hover:text-white text-sm" href="/about">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link className="text-blue-100 hover:text-white text-sm" href="/careers">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link className="text-blue-100 hover:text-white text-sm" href="/contact">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4 text-white">Services</h3>
              <ul className="space-y-2">
                <li>
                  <Link className="text-blue-100 hover:text-white text-sm" href="/services">
                    Claims Verification
                  </Link>
                </li>
                <li>
                  <Link className="text-blue-100 hover:text-white text-sm" href="/services">
                    Expedited Processing
                  </Link>
                </li>
                <li>
                  <Link className="text-blue-100 hover:text-white text-sm" href="/services">
                    Compliance Management
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4 text-white">Contact</h3>
              <ul className="space-y-2">
                <li className="text-blue-100 text-sm">123 Business Avenue, Suite 500</li>
                <li className="text-blue-100 text-sm">Chicago, IL 60601</li>
                <li className="text-blue-100 text-sm">info@trueclaim.com</li>
                <li className="text-blue-100 text-sm">+1 (800) 555-1234</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-blue-700 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-xs text-blue-100">© 2024 TrueClaim. All rights reserved.</p>
            <nav className="flex gap-6 mt-4 md:mt-0">
              <Link className="text-xs hover:underline text-blue-100" href="#">
                Terms of Service
              </Link>
              <Link className="text-xs hover:underline text-blue-100" href="#">
                Privacy Policy
              </Link>
              <Link className="text-xs hover:underline text-blue-100" href="#">
                Cookie Policy
              </Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  )
}
