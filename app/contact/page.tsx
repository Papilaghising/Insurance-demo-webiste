import Link from "next/link"
import { ArrowRight, Mail, Phone, MapPin } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen bg-blue-100">
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
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white mb-4">Contact Us</h1>
              <p className="text-xl text-blue-100">
                We're here to answer your questions and discuss how TrueClaim can help your business.
              </p>
            </div>
          </div>
        </section>

        <section className="w-full py-24 bg-white">
          <div className="container px-8 mx-auto">
            <div className="grid gap-12 lg:grid-cols-2">
              <div className="space-y-8">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tight text-blue-800">Get in Touch</h2>
                  <p className="text-lg text-blue-700">
                    Fill out the form and our team will get back to you within 24 hours.
                  </p>
                </div>
                <div className="space-y-6 bg-blue-50 p-8 rounded-lg shadow-sm">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium leading-none text-blue-800" htmlFor="first-name">
                        First name
                      </label>
                      <Input
                        id="first-name"
                        placeholder="Enter your first name"
                        className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium leading-none text-blue-800" htmlFor="last-name">
                        Last name
                      </label>
                      <Input
                        id="last-name"
                        placeholder="Enter your last name"
                        className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none text-blue-800" htmlFor="email">
                      Email
                    </label>
                    <Input
                      id="email"
                      placeholder="Enter your email"
                      type="email"
                      className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none text-blue-800" htmlFor="company">
                      Company
                    </label>
                    <Input
                      id="company"
                      placeholder="Enter your company name"
                      className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none text-blue-800" htmlFor="message">
                      Message
                    </label>
                    <Textarea
                      className="min-h-[150px] border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                      id="message"
                      placeholder="Enter your message"
                    />
                  </div>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white w-full py-6">
                    Send Message
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-8">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tight text-blue-800">Contact Information</h2>
                  <p className="text-lg text-blue-700">Reach out to us directly using the information below.</p>
                </div>
                <div className="grid gap-6">
                  <Card className="border-blue-100 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center gap-4 pb-2 bg-blue-500 border-b border-blue-100">
                      <Mail className="h-6 w-6 text-white" />
                      <CardTitle className="text-white">Email</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <CardDescription>
                        <a className="text-blue-600 hover:underline" href="mailto:info@trueclaim.com">
                          info@trueclaim.com
                        </a>
                      </CardDescription>
                    </CardContent>
                  </Card>
                  <Card className="border-blue-100 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center gap-4 pb-2 bg-blue-500 border-b border-blue-100">
                      <Phone className="h-6 w-6 text-white" />
                      <CardTitle className="text-white">Phone</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <CardDescription>
                        <a className="text-blue-600 hover:underline" href="tel:+18005551234">
                          +1 (800) 555-1234
                        </a>
                      </CardDescription>
                    </CardContent>
                  </Card>
                  <Card className="border-blue-100 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center gap-4 pb-2 bg-blue-500 border-b border-blue-100">
                      <MapPin className="h-6 w-6 text-white" />
                      <CardTitle className="text-white">Office</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <CardDescription className="text-blue-700">
                        123 Business Avenue, Suite 500
                        <br />
                        Chicago, IL 60601
                      </CardDescription>
                    </CardContent>
                  </Card>
                </div>
                <div className="rounded-lg border border-blue-100 overflow-hidden shadow-sm">
                  <img
                    alt="Map of TrueClaim office location"
                    className="w-full h-[300px] object-cover"
                    src="/placeholder.svg?height=300&width=600"
                    width="600"
                    height="300"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 w-full bg-blue-800 text-white">
        <div className="container px-8 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <img src="/logo.png" alt="TrueClaim Logo" className="h-16 w-auto mb-4" />
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
