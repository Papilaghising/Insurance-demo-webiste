import Link from "next/link"
import { ArrowRight, CheckCircle, Clock, BarChart, Users, Mail, Phone, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-blue-400/20 bg-gradient-to-r from-blue-600 via-blue-400 to-blue-600 backdrop-blur-md shadow-[0_0_20px_rgba(37,99,235,0.5)]">
        <div className="container flex h-24 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-white p-4 rounded-xl inline-block shadow-[0_0_30px_rgba(255,255,255,0.5)] glow-blue-animate">
              <img
                src="/logo.png"
                alt="TrueClaim Logo"
                className="h-16 w-auto drop-shadow-[0_0_15px_rgba(37,99,235,0.6)]"
              />
            </div>
          </Link>
          <nav className="hidden md:flex gap-8">
            <Link
              href="#features"
              className="text-lg font-medium text-white hover:text-blue-200 transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-white after:transition-all after:duration-300 after:glow-white"
            >
              Features
            </Link>
            <Link
              href="#benefits"
              className="text-lg font-medium text-white hover:text-blue-200 transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-white after:transition-all after:duration-300 after:glow-white"
            >
              Benefits
            </Link>
            <Link
              href="#how-it-works"
              className="text-lg font-medium text-white hover:text-blue-200 transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-white after:transition-all after:duration-300 after:glow-white"
            >
              How It Works
            </Link>
            <Link
              href="#contact"
              className="text-lg font-medium text-white hover:text-blue-200 transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-white after:transition-all after:duration-300 after:glow-white"
            >
              Contact
            </Link>
          </nav>
          <div className="flex gap-4">
            <Button
              className="hidden md:flex border-white/70 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 text-base px-6 py-6 shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:shadow-[0_0_20px_rgba(255,255,255,0.5)] transition-all duration-300"
              asChild
            >
              <Link href="/login">Log In</Link>
            </Button>
            <Button
              className="bg-white text-blue-700 hover:bg-blue-5- text-base px-6 py-6 shadow-[0_0_20px_rgba(255,255,255,0.5)] hover:shadow-[0_0_30px_rgba(255,255,255,0.8)] transition-all duration-300"
              asChild
            >
              <Link href="/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-24 md:py-36 bg-gradient-to-r from-blue-500 via-blue-300 to-blue-500">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-blue-400/30 mix-blend-overlay blur-3xl animate-pulse"></div>
            <div
              className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-blue-300/30 mix-blend-overlay blur-3xl animate-pulse"
              style={{ animationDelay: "1s" }}
            ></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle,rgba(25,118,210,0.4)_0%,transparent_70%)]"></div>
          </div>

          <div className="container relative px-4 md:px-6">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
              <div className="space-y-8">
                <div className="inline-block rounded-lg bg-blue/10 backdrop-blur-sm px-4 py-2 text-base text-white font-medium shadow-[0_0_20px_rgba(255,255,255,0.3)] animate-pulse-slow">
                  Transforming Insurance Claims
                </div>
                <h1 className="font-montserrat text-3xl md:text-4xl lg:text-4xl font-bold tracking-tight text-white text-glow-lg">
                  <span>Trueclaim</span>
                  <br />
                  Your Partner in Insurance Claims
                </h1>
                <p className="text-xl text-blue-100 max-w-[600px] text-glow-sm">
                  Our platform TrueClaim Intel leverages Generative AI to resolve claims in minutes, reduce fraud, and
                  deliver real-time transparency. It's not just automation—it's a leap in trust, speed, and accuracy.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button className="bg-white text-blue-700 hover:bg-blue-50 h-14 px-8 text-lg shadow-[0_0_25px_rgba(255,255,255,0.6)] hover:shadow-[0_0_35px_rgba(255,255,255,0.8)] transition-all duration-300 hover:scale-105">
                    Request Demo
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <Button
                    className="border-white/70 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 h-14 px-8 text-lg transition-all duration-300 shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:shadow-[0_0_25px_rgba(255,255,255,0.5)] hover:scale-105"
                  >
                    Learn More
                  </Button>
                </div>
                <div className="flex items-center gap-4 pt-4">
                  <div className="flex -space-x-3">
                    <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 text-sm border-2 border-white shadow-[0_0_15px_rgba(255,255,255,0.5)]">
                      JD
                    </div>
                    <div className="w-10 h-10 rounded-full bg-blue-300 flex items-center justify-center text-blue-700 text-sm border-2 border-white shadow-[0_0_15px_rgba(255,255,255,0.5)]">
                      MR
                    </div>
                    <div className="w-10 h-10 rounded-full bg-blue-400 flex items-center justify-center text-white text-sm border-2 border-white shadow-[0_0_15px_rgba(255,255,255,0.5)]">
                      KL
                    </div>
                  </div>
                  <span className="text-base font-medium text-blue-100 text-glow-sm">
                    Trusted by 200+ policy holders
                  </span>
                </div>
              </div>
              <div className="relative">
                <div className="absolute -top-10 -left-10 w-64 h-64 bg-blue-400/40 rounded-full blur-3xl animate-pulse"></div>
                <div
                  className="absolute -bottom-10 -right-10 w-64 h-64 bg-blue-300/40 rounded-full blur-3xl animate-pulse"
                  style={{ animationDelay: "1.5s" }}
                ></div>
                <div className="relative z-10 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(255,255,255,0.4)] border-4 border-white/20 transition-all duration-500 hover:shadow-[0_0_70px_rgba(255,255,255,0.6)] hover:scale-[1.02] glow-blue-animate">
                  <img
                    src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=2070&auto=format&fit=crop"
                    alt="TrueClaim Intel Dashboard"
                    className="w-full h-auto object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section id="benefits" className="py-20 bg-gradient-to-b from-blue-600 via-blue-500 to-blue-400">
          <div className="container px-4 md:px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="font-montserrat text-3xl font-bold tracking-tight text-white sm:text-4xl text-glow-lg">
                Trueclaim Intel
              </h2>
              <p className="mt-4 text-lg text-blue-100 text-glow-sm">
                Experience the future of insurance claims processing
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl shadow-[0_0_30px_rgba(255,255,255,0.3)] border border-white/20 flex flex-col items-center text-center transform transition-all duration-500 hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.5)] glow-blue-animate">
                <div className="h-20 w-20 rounded-full bg-white/20 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(255,255,255,0.4)] glow-white-animate">
                  <Clock className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 text-glow-md">Faster Settlements</h3>
                <p className="text-blue-100 text-glow-sm">
                  Process claims up to 80% faster with our AI-powered system, reducing settlement time from weeks to
                  minutes.
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl shadow-[0_0_30px_rgba(255,255,255,0.3)] border border-white/20 flex flex-col items-center text-center transform transition-all duration-500 hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.5)] glow-blue-animate">
                <div className="h-20 w-20 rounded-full bg-white/20 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(255,255,255,0.4)] glow-white-animate">
                  <BarChart className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 text-glow-md">Smarter Decisions</h3>
                <p className="text-blue-100 text-glow-sm">
                  Our AI analyzes thousands of data points to make accurate, consistent, and fair claim assessments.
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl shadow-[0_0_30px_rgba(255,255,255,0.3)] border border-white/20 flex flex-col items-center text-center transform transition-all duration-500 hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.5)] glow-blue-animate">
                <div className="h-20 w-20 rounded-full bg-white/20 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(255,255,255,0.4)] glow-white-animate">
                  <Users className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 text-glow-md">Happier Customers</h3>
                <p className="text-blue-100 text-glow-sm">
                  Transparent, fast processing leads to higher customer satisfaction and improved retention rates.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonial Section */}
        <section className="py-20 bg-gradient-to-b from-blue-50 to-white">
          <div className="container px-4 md:px-6">
            <div className="max-w-4xl mx-auto">
              <div className="bg-blue-600 rounded-2xl shadow-[0_0_40px_rgba(37,99,235,0.5)] p-8 md:p-12 text-white glow-blue-animate">
                <div className="flex flex-col md:flex-row gap-8 items-center">
                  <div className="w-32 h-32 rounded-full overflow-hidden flex-shrink-0 border-4 border-white shadow-[0_0_20px_rgba(255,255,255,0.5)] glow-white-animate">
                    <img
                      src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=2787&auto=format&fit=crop"
                      alt="Sarah Johnson, CIO at National Insurance"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <svg
                      className="h-12 w-12 text-blue-300 mb-4 drop-shadow-[0_0_10px_rgba(147,197,253,0.5)]"
                      fill="currentColor"
                      viewBox="0 0 32 32"
                      aria-hidden="true"
                    >
                      <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L25.864 4z" />
                    </svg>
                    <p className="text-lg md:text-xl mb-6">
                      TrueClaim has revolutionized our claims processing. What used to take weeks now takes minutes, and
                      our customer satisfaction scores have increased by 47%. The AI-powered fraud detection has saved
                      us millions.
                    </p>
                    <div>
                      <p className="font-semibold">Sarah Johnson</p>
                      <p className="text-blue-200">CIO at National Insurance</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="py-20 bg-gradient-to-b from-white to-blue-50">
          <div className="container px-4 md:px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="font-montserrat text-3xl font-bold tracking-tight text-blue-800 sm:text-4xl drop-shadow-[0_0_10px_rgba(30,64,175,0.3)]">
                TrueClaim by the Numbers
              </h2>
              <p className="mt-4 text-lg text-blue-700">
                Transforming the insurance industry with proven results and measurable impact.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="group bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl shadow-[0_0_30px_rgba(37,99,235,0.3)] border border-blue-100 flex flex-col items-center text-center hover:shadow-[0_0_40px_rgba(37,99,235,0.5)] transition-all duration-500 hover:scale-[1.02]">
                <div className="text-5xl font-bold text-blue-600 mb-2 transition-all duration-500 group-hover:scale-110 group-hover:text-blue-700">80%</div>
                <p className="text-blue-700 font-medium">Faster Claims Processing</p>
                <p className="text-blue-500 text-sm mt-2">From weeks to minutes</p>
              </div>
              <div className="group bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl shadow-[0_0_30px_rgba(37,99,235,0.3)] border border-blue-100 flex flex-col items-center text-center hover:shadow-[0_0_40px_rgba(37,99,235,0.5)] transition-all duration-500 hover:scale-[1.02]">
                <div className="text-5xl font-bold text-blue-600 mb-2 transition-all duration-500 group-hover:scale-110 group-hover:text-blue-700">99.8%</div>
                <p className="text-blue-700 font-medium">Fraud Detection Accuracy</p>
                <p className="text-blue-500 text-sm mt-2">AI-powered verification</p>
              </div>
              <div className="group bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl shadow-[0_0_30px_rgba(37,99,235,0.3)] border border-blue-100 flex flex-col items-center text-center hover:shadow-[0_0_40px_rgba(37,99,235,0.5)] transition-all duration-500 hover:scale-[1.02]">
                <div className="text-5xl font-bold text-blue-600 mb-2 transition-all duration-500 group-hover:scale-110 group-hover:text-blue-700">47%</div>
                <p className="text-blue-700 font-medium">Customer Satisfaction</p>
                <p className="text-blue-500 text-sm mt-2">Increase in NPS score</p>
              </div>
              <div className="group bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl shadow-[0_0_30px_rgba(37,99,235,0.3)] border border-blue-100 flex flex-col items-center text-center hover:shadow-[0_0_40px_rgba(37,99,235,0.5)] transition-all duration-500 hover:scale-[1.02]">
                <div className="text-5xl font-bold text-blue-600 mb-2 transition-all duration-500 group-hover:scale-110 group-hover:text-blue-700">$2.5M</div>
                <p className="text-blue-700 font-medium">Annual Savings</p>
                <p className="text-blue-500 text-sm mt-2">Average per client</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-12 w-full bg-blue-600 text-white">
        <div className="container px-4 md:px-6 mx-auto">
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
          <div className="border-t border-blue-500 pt-8 flex flex-col md:flex-row justify-between items-center">
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
