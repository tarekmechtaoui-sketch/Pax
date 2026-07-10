import { Link } from 'react-router-dom'
import { useLanguage } from '../../contexts/LanguageContext'
import { Gift } from 'lucide-react'

export default function PromoBanner() {
  const { t } = useLanguage()
  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 my-10">
      <div className="relative bg-charcoal dark:bg-charcoal-800 rounded-3xl overflow-hidden min-h-[220px] flex items-center">
        {/* Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal via-charcoal/90 to-charcoal/60" />

        {/* Content */}
        <div className="relative z-10 px-8 md:px-14 py-10">
          <p className="text-charcoal-300 text-sm font-semibold uppercase tracking-widest mb-3">
            {t('promo.badge')}
          </p>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-6 leading-tight">
            {t('promo.title1')}
            <br />
            {t('promo.title2')}
          </h2>
          <Link
            to="/promotions"
            className="inline-flex items-center gap-2 bg-transparent border-2 border-white text-white px-6 py-3 rounded-full font-semibold text-sm hover:bg-white hover:text-charcoal active:scale-95 transition-all duration-200"
          >
            {t('promo.cta')}
          </Link>
        </div>

        {/* Right side */}
        <div className="hidden md:flex flex-1 items-center justify-end pr-14">
          <div className="w-52 h-52 flex items-center justify-center">
            <Gift size={100} className="text-white/20" />
          </div>
        </div>
      </div>
    </section>
  )
}
