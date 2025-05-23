import Link from "next/link"
import { Users, Building, Award } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-blue-200">
      <header className="px-8 h-24 flex items-center border-b bg-blue-200 fixed w-full z-10 shadow-sm">
        <Link className="flex items-center justify-center" href="/">
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/A__2_-removebg-preview-ZabQoiu2niiPHLJlKWKnvBDhqIBgyh.png"
            alt="TrueClaim Logo"
            className="h-48 w-auto"
          />
        </Link>
        <nav className="mx-auto flex gap-8">
          <Link className="text-lg font-medium text-blue-600 hover:text-blue-800" href="/">
            Home
          </Link>
          <Link className="text-lg font-medium text-blue-600 hover:text-blue-800" href="/about">
            About
          </Link>
          <Link className="text-lg font-medium text-blue-600 hover:text-blue-800" href="/services">
            Services
          </Link>
          <Link className="text-lg font-medium text-blue-600 hover:text-blue-800" href="/contact">
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
        <section className="w-full py-24 md:py-32 bg-gradient-to-b bg-blue-200">
          <div className="container px-8 mx-auto">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-blue mb-4">About TrueClaim</h1>
              <p className="text-xl text-blue-500">Faster settlements! Smarter decisions! Happier customers!</p>
            </div>
          </div>
        </section>

        <section className="w-full py-24 bg-blue-300">
          <div className="container px-8 mx-auto">
            <div className="grid gap-12 lg:grid-cols-2 items-center">
              <div className="space-y-6">
                <h2 className="text-3xl font-bold tracking-tight text-blue-800">Our Story</h2>
                <p className="text-lg text-blue-700">
                  Founded in 2010, TrueClaim was born out of a simple observation: insurance claims processing was
                  unnecessarily complex, time-consuming, and frustrating for all parties involved.
                </p>
                <p className="text-lg text-blue-700">
                  Our founders, with over 30 years of combined experience in the insurance industry, set out to resolve
                  claims in minutes, reduce fraud, and deliver real-time transparency in insurance claims.
                </p>
                <p className="text-lg text-blue-700">
                  Today, TrueClaim serves over 200 insurance companies nationwide, processing millions of claims
                  annually with industry-leading speed,accuracy and efficiency.
                </p>
              </div>
              <div className="flex items-center justify-center">
                <img
                  alt="TrueClaim Team"
                  className="rounded-lg object-cover shadow-lg"
                  src="/placeholder.svg?height=400&width=600"
                  width="600"
                  height="400"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-24 bg-blue-400">
          <div className="container px-8 mx-auto">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-white mb-4">Our Values</h2>
              <p className="text-xl text-blue-100">The principles that guide everything we do.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center space-y-4 bg-white p-8 rounded-lg shadow-sm">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-500">
                  <Award className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-blue-800">Excellence</h3>
                <p className="text-blue-600 text-center">
                  We strive for excellence in every aspect of our work, from the accuracy of our processing to the
                  quality of our customer service.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 bg-white p-8 rounded-lg shadow-sm">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-500">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-blue-800">Integrity</h3>
                <p className="text-blue-600 text-center">
                  We operate with complete transparency and honesty, building trust with our clients and their
                  customers.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 bg-white p-8 rounded-lg shadow-sm">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-500">
                  <Building className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-blue-800">Innovation</h3>
                <p className="text-blue-600 text-center">
                  We continuously seek new ways to improve our processes and technology to better serve our clients.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-24 bg-blue-500">
          <div className="container px-8 mx-auto">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-blue-800 mb-4">Leadership Team</h2>
              <p className="text-xl text-blue-700">Meet the experienced professionals guiding TrueClaim's mission.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center space-y-4 bg-blue-50 p-8 rounded-lg shadow-sm">
                <img
                  alt="CEO Portrait"
                  className="rounded-full object-cover w-32 h-32 border-4 border-blue-100"
                  src="/placeholder.svg?height=128&width=128"
                  width="128"
                  height="128"
                />
                <div>
                  <h3 className="text-xl font-bold text-blue-800">Sarah Johnson</h3>
                  <p className="text-sm text-blue-600">CEO & Co-Founder</p>
                </div>
                <p className="text-blue-600 text-center">
                  25+ years of experience in insurance operations and technology transformation.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 bg-blue-50 p-8 rounded-lg shadow-sm">
                <img
                  alt="CTO Portrait"
                  className="rounded-full object-cover w-32 h-32 border-4 border-blue-100"
                  src="/placeholder.svg?height=128&width=128"
                  width="128"
                  height="128"
                />
                <div>
                  <h3 className="text-xl font-bold text-blue-800">Michael Chen</h3>
                  <p className="text-sm text-blue-600">CTO & Co-Founder</p>
                </div>
                <p className="text-blue-600 text-center">
                  Former insurance technology executive with expertise in process automation.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 bg-blue-50 p-8 rounded-lg shadow-sm">
                <img
                  alt="COO Portrait"
                  className="rounded-full object-cover w-32 h-32 border-4 border-blue-100"
                  src="/placeholder.svg?height=128&width=128"
                  width="128"
                  height="128"
                />
                <div>
                  <h3 className="text-xl font-bold text-blue-800">David Rodriguez</h3>
                  <p className="text-sm text-blue-600">COO</p>
                </div>
                <p className="text-blue-600 text-center">
                  Operational excellence specialist with a background in scaling service organizations.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 w-full bg-blue-800 text-white">
        <div className="container px-8 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/A__2_-removebg-preview-ZabQoiu2niiPHLJlKWKnvBDhqIBgyh.png"
                alt="TrueClaim Logo"
                className="h-16 w-auto mb-4"
              />
              <p className="text-blue-100 text-sm">
                Transforming insurance claims processing with efficiency, accuracy, and customer satisfaction.
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-4 text-white">Company</h3>
              <ul className="space-y-1">
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
