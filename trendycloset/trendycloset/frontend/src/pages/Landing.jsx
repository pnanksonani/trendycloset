import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'

export default function Landing(){
  // Per-page button styles (no global CSS)
  const btnLight = "inline-flex items-center justify-center font-semibold rounded-xl px-5 py-3 bg-white text-zinc-900 shadow transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300"
  const btnOLight = "inline-flex items-center justify-center font-semibold rounded-xl px-5 py-3 border border-white/40 text-white/90 hover:bg-white/10 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
  const btnPrimary = "inline-flex items-center justify-center font-semibold rounded-xl px-5 py-3 text-white bg-gradient-to-br from-indigo-500 to-purple-600 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300"

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-tr from-indigo-500 to-purple-600">
      

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 grid items-center gap-12 lg:grid-cols-2 py-20">
          <div>
            <h1 className="text-white font-black leading-tight text-4xl sm:text-5xl">
              Discover, Cart, and Wear the Latest Fits
            </h1>
            <p className="mt-4 max-w-prose text-white/90 text-lg leading-relaxed">
              TrendyCloset connects fashion-forward shoppers with curated collections from premium partners. Browse exclusive drops, build your perfect cart, and place orders seamlessly.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link to="/signup/user" className={btnLight}>Start Shopping</Link>
              <Link to="/signup/partner" className={btnOLight}>Become a Partner</Link>
              <Link to="/login" className={btnOLight}>Sign In</Link>
            </div>
          </div>

          {/* How It Works card */}
          <div className="relative">
            <div className="rounded-2xl border border-white/30 bg-white/95 shadow-lg p-7">
              <div className="flex items-center gap-2 font-bold text-zinc-900 mb-5">
                <span className="h-2 w-2 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600"/>
                How It Works
              </div>
              <ol className="space-y-3">
                {[
                  'Create your account as User or Partner',
                  'Browse curated collections from premium partners',
                  'Add favorites to cart and place your order',
                  'Get instant notifications when orders are confirmed',
                ].map((t, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="h-7 w-7 shrink-0 grid place-items-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-xs font-extrabold mt-0.5">{i+1}</span>
                    <p className="m-0 text-zinc-600 text-sm leading-6">{t}</p>
                  </li>
                ))}
              </ol>
            </div>

            {/* Decorative blobs */}
            <div className="pointer-events-none absolute -top-16 -right-12 h-72 w-72 rounded-full bg-white/20 blur-3xl"/>
            <div className="pointer-events-none absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-white/10 blur-3xl"/>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-zinc-900">Why Choose TrendyCloset?</h2>
            <p className="text-zinc-600 max-w-2xl mx-auto mt-2">Experience fashion retail reimagined with our innovative platform</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {icon:'👥', title:'Curated Partners', text:'Connect with vetted fashion retailers and discover exclusive collections from emerging and established brands.'},
              {icon:'🛒', title:'Smart Shopping Cart', text:'Seamless cart experience with real-time inventory updates, saved favorites, and instant checkout process.'},
              {icon:'🔔', title:'Real-Time Updates', text:'Stay informed with instant email and in-app notifications for confirmations and shipping.'},
            ].map(({icon,title,text})=> (
              <article key={title} className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm p-7 transition hover:-translate-y-0.5 hover:shadow-md">
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-600"/>
                <div className="text-4xl mb-3" aria-hidden>{icon}</div>
                <h3 className="font-extrabold text-zinc-900 text-lg">{title}</h3>
                <p className="text-zinc-600 leading-7 mt-1">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-zinc-950 to-zinc-800 text-white">
        <div className="max-w-6xl mx-auto px-4 py-16 text-center">
          <h2 className="text-3xl font-black">Ready to Elevate Your Style?</h2>
          <p className="text-white/80 text-lg mt-2 max-w-2xl mx-auto">Join thousands of fashion enthusiasts discovering their next favorite outfit.</p>
          <div className="mt-8 flex justify-center gap-3 flex-wrap">
            <Link to="/signup/user" className={btnPrimary}>Get Started Free</Link>
            <Link to="/signup/partner" className={btnOLight}>Partner With Us</Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-zinc-950 text-white/80">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <div className="grid gap-6 md:grid-cols-3">
            <div>
              <div className="text-2xl font-black bg-gradient-to-br from-indigo-500 to-purple-600 bg-clip-text text-transparent">TrendyCloset</div>
              <p className="mt-3 text-sm leading-7">Your destination for curated fashion from premium partners. Discover, shop, and style with confidence.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm mb-3 tracking-wide">Quick Links</h4>
              <div className="grid gap-2 text-sm">
                <Link to="/login" className="hover:text-white">Login</Link>
                <Link to="/signup/user" className="hover:text-white">Sign Up as User</Link>
                <Link to="/signup/partner" className="hover:text-white">Become Partner</Link>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 mt-6 pt-4 text-center text-xs">© {new Date().getFullYear()} TrendyCloset — Elevating fashion retail, one fit at a time.</div>
        </div>
      </footer>
    </div>
  )
}
