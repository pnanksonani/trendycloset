import { Link } from 'react-router-dom'

export default function Navbar(){
  const btnGhost = "inline-flex items-center justify-center font-semibold rounded-xl px-4 py-2 border border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-50 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300"
  const btnPrimary = "inline-flex items-center justify-center font-semibold rounded-xl px-4 py-2 text-white bg-gradient-to-br from-indigo-500 to-purple-600 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300"

  return (
    <header className="sticky top-0 z-50 bg-white/85 backdrop-blur border-b border-zinc-200">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-black bg-gradient-to-br from-indigo-500 to-purple-600 bg-clip-text text-transparent">
          TrendyCloset
        </Link>
        <nav className="flex items-center gap-2">
          <Link to="/login" className={btnGhost}>Login</Link>
          <Link to="/signup/user" className={btnPrimary}>Sign Up</Link>
        </nav>
      </div>
    </header>
  )
}
