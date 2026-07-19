import { useState, useEffect, useRef } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { ShoppingCart, Menu, X, Sun, Moon, Globe } from 'lucide-react'
import { useCart } from '../../contexts/CartContext'
import { useTheme } from '../../contexts/ThemeContext'
import { useLanguage } from '../../contexts/LanguageContext'

const LANGUAGES = [
  { code: 'en', label: 'EN' },
  { code: 'fr', label: 'FR' },
  { code: 'ar', label: 'عربي' },
]

export default function Navbar() {
  const { cartCount } = useCart()
  const { toggleTheme, isDark } = useTheme()
  const { language, setLanguage, t } = useLanguage()
  const [menuOpen, setMenuOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const langRef = useRef(null)

  const navLinks = [
    { label: t('nav.home'), to: '/' },
    { label: t('nav.products'), to: '/products' },
    { label: t('nav.promotions'), to: '/promotions' },
  ]

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 dark:bg-charcoal-900/95 backdrop-blur-md shadow-soft'
          : 'bg-cream dark:bg-charcoal-900'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5">
          <img src="/logo.png" alt="pax" className="h-12 w-auto" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                `px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-charcoal text-white dark:bg-white dark:text-charcoal'
                    : 'text-charcoal-500 hover:text-charcoal hover:bg-charcoal-100 dark:text-charcoal-300 dark:hover:text-white dark:hover:bg-charcoal-700'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Language switcher */}
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="w-9 h-9 flex items-center justify-center rounded-full text-charcoal-500 hover:text-charcoal hover:bg-charcoal-100 dark:text-charcoal-300 dark:hover:text-white dark:hover:bg-charcoal-700 transition-all"
              aria-label="Change language"
            >
              <Globe size={18} />
            </button>
            {langOpen && (
              <div className="absolute right-0 mt-2 w-28 bg-white dark:bg-charcoal-800 rounded-xl shadow-lg border border-charcoal-100 dark:border-charcoal-700 py-1 z-50">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={async () => {
                      await setLanguage(lang.code)
                      setLangOpen(false)
                    }}
                    className={`w-full text-left px-4 py-2 text-sm font-medium transition-colors ${
                      language === lang.code
                        ? 'bg-charcoal text-white dark:bg-white dark:text-charcoal'
                        : 'text-charcoal-600 dark:text-charcoal-300 hover:bg-charcoal-100 dark:hover:bg-charcoal-700'
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="w-9 h-9 flex items-center justify-center rounded-full text-charcoal-500 hover:text-charcoal hover:bg-charcoal-100 dark:text-charcoal-300 dark:hover:text-white dark:hover:bg-charcoal-700 transition-all"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Cart */}
          <Link
            to="/cart"
            className="relative w-9 h-9 flex items-center justify-center rounded-full text-charcoal-500 hover:text-charcoal hover:bg-charcoal-100 dark:text-charcoal-300 dark:hover:text-white dark:hover:bg-charcoal-700 transition-all"
            aria-label="Cart"
          >
            <ShoppingCart size={18} />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-charcoal dark:bg-white text-white dark:text-charcoal text-[10px] font-bold rounded-full flex items-center justify-center">
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </Link>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-full text-charcoal-500 hover:text-charcoal hover:bg-charcoal-100 transition-all"
            aria-label="Menu"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white dark:bg-charcoal-900 border-t border-charcoal-100 dark:border-charcoal-700 px-4 pb-4 pt-2 animate-slide-down">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `block px-4 py-3 rounded-xl text-sm font-medium mb-1 transition-all ${
                  isActive
                    ? 'bg-charcoal text-white'
                    : 'text-charcoal-600 hover:bg-charcoal-100 dark:text-charcoal-300 dark:hover:bg-charcoal-800'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
          <div className="border-t border-charcoal-100 dark:border-charcoal-700 mt-2 pt-2">
            <p className="px-4 py-2 text-xs text-charcoal-400 font-medium uppercase tracking-wider">Language</p>
            <div className="flex gap-2 px-4">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={async () => {
                    await setLanguage(lang.code)
                    setMenuOpen(false)
                  }}
                  className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${
                    language === lang.code
                      ? 'bg-charcoal text-white dark:bg-white dark:text-charcoal'
                      : 'bg-charcoal-100 dark:bg-charcoal-800 text-charcoal-500 dark:text-charcoal-400 hover:bg-charcoal-200 dark:hover:bg-charcoal-700'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
