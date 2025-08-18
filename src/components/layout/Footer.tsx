import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white" role="contentinfo">
      <div className="container mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">The Bigger Boss</h3>
            <p className="text-gray-300 mb-4">
              AI-powered content strategy that levels the playing field for Australian SMBs and agencies.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Solutions</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/solutions/for-smbs" className="text-gray-300 hover:text-white">
                  For SMBs
                </Link>
              </li>
              <li>
                <Link href="/solutions/for-agencies" className="text-gray-300 hover:text-white">
                  For Agencies
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-gray-300 hover:text-white">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Get Started</h4>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors w-full mb-4">
              Start Free Trial
            </button>
            <p className="text-sm text-gray-400">
              No credit card required
            </p>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 The Bigger Boss. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}