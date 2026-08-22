import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { FiShield, FiCreditCard, FiTrendingUp, FiUsers, FiArrowRight, FiPhone, FiMail, FiMapPin, FiGlobe, FiTwitter, FiFacebook, FiInstagram, FiLinkedin } from 'react-icons/fi';

const services = [
  { icon: <FiCreditCard />, title: 'Savings Account', desc: 'Grow your wealth with competitive interest rates and zero minimum balance.', color: 'blue' },
  { icon: <FiTrendingUp />, title: 'Current Account', desc: 'Designed for businesses with unlimited transactions and overdraft facility.', color: 'green' },
  { icon: <FiShield />, title: 'Secure Transfers', desc: 'Instant, secure money transfers with real-time notifications and receipts.', color: 'purple' },
  { icon: <FiUsers />, title: 'Personal Banking', desc: 'Tailored financial solutions for individuals and families nationwide.', color: 'orange' },
];

const colorMap = {
  blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-800',
  green: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800',
  purple: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border-purple-100 dark:border-purple-800',
  orange: 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 border-orange-100 dark:border-orange-800',
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600 dark:from-gray-900 dark:via-blue-950 dark:to-blue-900">
          <div className="absolute inset-0 opacity-10">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-white animate-float"
                style={{
                  width: Math.random() * 100 + 20 + 'px',
                  height: Math.random() * 100 + 20 + 'px',
                  left: Math.random() * 100 + '%',
                  top: Math.random() * 100 + '%',
                  animationDelay: Math.random() * 5 + 's',
                  animationDuration: Math.random() * 10 + 10 + 's',
                  opacity: Math.random() * 0.5 + 0.1,
                }}
              />
            ))}
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm text-blue-100 mb-6 border border-white/20">
                <FiShield className="text-blue-300" />
                <span>Trusted by 10 Lakh+ customers</span>
              </div>
              <h1 className="text-5xl lg:text-6xl font-black leading-tight mb-6">
                Banking Made
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-300">
                  Simple & Secure
                </span>
              </h1>
              <p className="text-blue-100 text-lg mb-8 leading-relaxed max-w-lg">
                Experience next-generation banking with SecureBank. Manage accounts, transfer funds, and track transactions — all in one powerful platform.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-400 to-blue-400 text-slate-900 font-extrabold rounded-2xl hover:from-cyan-300 hover:to-blue-300 transition-all shadow-xl hover:shadow-cyan-500/20 hover:-translate-y-1 text-base"
                >
                  Register Account <FiArrowRight />
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white/30 text-white font-bold rounded-2xl hover:bg-white/10 transition-all backdrop-blur-sm text-base"
                >
                  Portal Login
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 mt-12 pt-12 border-t border-white/20">
                {[
                  { value: '₹500Cr+', label: 'Assets Managed' },
                  { value: '10L+', label: 'Happy Customers' },
                  { value: '99.9%', label: 'Uptime SLA' },
                ].map((stat) => (
                  <div key={stat.label}>
                    <p className="text-3xl font-black text-white">{stat.value}</p>
                    <p className="text-blue-300 text-sm">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating Card UI */}
            <div className="hidden lg:block relative">
              <div className="relative">
                {/* Main card */}
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
                  <div className="bg-gradient-to-br from-blue-400 to-cyan-500 rounded-2xl p-6 mb-6 shadow-xl">
                    <div className="flex justify-between items-start mb-8">
                      <div>
                        <p className="text-white/70 text-sm">Account Balance</p>
                        <p className="text-white text-3xl font-black">₹2,45,680.50</p>
                      </div>
                      <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                        <FiCreditCard className="text-white" />
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-white font-semibold">**** **** **** 4521</p>
                      <p className="text-white/70 text-sm">VISA</p>
                    </div>
                  </div>
                  {/* Transaction list */}
                  {[
                    { name: 'Salary Credit', amount: '+₹85,000', type: 'credit', date: 'Today' },
                    { name: 'EMI Debit', amount: '-₹12,500', type: 'debit', date: 'Yesterday' },
                    { name: 'Transfer Received', amount: '+₹5,000', type: 'credit', date: '2 days ago' },
                  ].map((tx) => (
                    <div key={tx.name} className="flex items-center justify-between py-3 border-b border-white/10 last:border-0">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${tx.type === 'credit' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                          {tx.type === 'credit' ? '+' : '-'}
                        </div>
                        <div>
                          <p className="text-white text-sm font-medium">{tx.name}</p>
                          <p className="text-white/50 text-xs">{tx.date}</p>
                        </div>
                      </div>
                      <p className={`text-sm font-semibold ${tx.type === 'credit' ? 'text-green-400' : 'text-red-400'}`}>{tx.amount}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm uppercase tracking-wider">About Us</span>
              <h2 className="text-4xl font-black text-gray-900 dark:text-white mt-2 mb-6 leading-tight">
                India's Most Trusted <span className="text-blue-600">Digital Bank</span>
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-lg mb-6 leading-relaxed">
                Founded in 2010, SecureBank has grown from a small cooperative to India's leading digital banking platform. We believe in making banking accessible, transparent, and secure for every Indian citizen.
              </p>
              <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                Our state-of-the-art technology infrastructure ensures 99.9% uptime, military-grade encryption, and real-time fraud detection — protecting your money 24/7.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: '15+', label: 'Years of Service' },
                  { value: '500+', label: 'Branches Nationwide' },
                  { value: '24/7', label: 'Customer Support' },
                  { value: '100%', label: 'Digitally Secure' },
                ].map((stat) => (
                  <div key={stat.label} className="bg-white dark:bg-gray-700 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-600">
                    <p className="text-2xl font-black text-blue-600 dark:text-blue-400">{stat.value}</p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-10 text-white">
                <h3 className="text-2xl font-bold mb-6">Why Choose SecureBank?</h3>
                {[
                  { icon: '🔒', text: 'Bank-grade 256-bit SSL encryption' },
                  { icon: '⚡', text: 'Instant fund transfers 24x7x365' },
                  { icon: '📱', text: 'Full-featured mobile banking app' },
                  { icon: '🤝', text: 'Dedicated relationship managers' },
                  { icon: '📊', text: 'Real-time account analytics' },
                  { icon: '🛡️', text: 'RBI regulated & DICGC insured' },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-3 mb-4 last:mb-0">
                    <span className="text-2xl">{item.icon}</span>
                    <span className="text-blue-100">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm uppercase tracking-wider">Our Services</span>
            <h2 className="text-4xl font-black text-gray-900 dark:text-white mt-2 mb-4">
              Complete Banking Solutions
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
              Everything you need for modern banking in one seamless platform
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((s) => (
              <div key={s.title} className={`rounded-2xl p-6 border transition-all hover:shadow-xl hover:-translate-y-2 duration-300 ${colorMap[s.color]}`}>
                <div className="text-3xl mb-4">{s.icon}</div>
                <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-2">{s.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm uppercase tracking-wider">Contact Us</span>
            <h2 className="text-4xl font-black text-gray-900 dark:text-white mt-2 mb-4">Get In Touch</h2>
            <p className="text-gray-500 dark:text-gray-400">We're here to help you 24/7</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {[
              { icon: <FiPhone />, title: 'Phone', value: '1800-XXX-XXXX', sub: 'Toll-free 24/7' },
              { icon: <FiMail />, title: 'Email', value: 'support@securebank.in', sub: 'Reply within 2 hours' },
              { icon: <FiMapPin />, title: 'Address', value: 'SecureBank HQ, Mumbai 400001', sub: 'Mon–Sat, 9AM–6PM' },
            ].map((c) => (
              <div key={c.title} className="bg-white dark:bg-gray-700 rounded-2xl p-6 text-center shadow-sm border border-gray-100 dark:border-gray-600 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400 text-xl mx-auto mb-4">
                  {c.icon}
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{c.title}</h3>
                <p className="text-blue-600 dark:text-blue-400 font-medium">{c.value}</p>
                <p className="text-gray-400 text-sm">{c.sub}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center bg-gradient-to-r from-blue-600 to-blue-800 rounded-3xl p-12 text-white">
            <h3 className="text-3xl font-black mb-4">Ready to get started?</h3>
            <p className="text-blue-100 mb-8">Open your account today and experience banking without limits.</p>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-700 font-bold rounded-2xl hover:bg-blue-50 transition-all shadow-xl hover:-translate-y-1"
            >
              Open Account Now <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-black text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xs">SB</span>
                </div>
                <span className="text-white font-bold text-lg">SecureBank</span>
              </div>
              <p className="text-sm leading-relaxed">India's most trusted digital banking platform since 2010.</p>
              <div className="flex gap-3 mt-4">
                {[FiTwitter, FiFacebook, FiInstagram, FiLinkedin].map((Icon, i) => (
                  <a key={i} href="#" className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors">
                    <Icon size={14} />
                  </a>
                ))}
              </div>
            </div>
            {[
              { title: 'Quick Links', links: ['Home', 'About', 'Services', 'Contact'] },
              { title: 'Services', links: ['Savings Account', 'Current Account', 'Fixed Deposit', 'Loans'] },
              { title: 'Legal', links: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Disclaimer'] },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="text-white font-semibold mb-3">{col.title}</h4>
                {col.links.map((l) => (
                  <a key={l} href="#" className="block text-sm mb-2 hover:text-blue-400 transition-colors">{l}</a>
                ))}
              </div>
            ))}
          </div>
          <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm">© 2024 SecureBank. All rights reserved. RBI Reg. No: XXXX/2010</p>
            <p className="text-sm flex items-center gap-1">Made with ❤️ for India</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
