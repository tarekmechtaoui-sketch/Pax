import { Link } from 'react-router-dom'
import { useLanguage } from '../../contexts/LanguageContext'
import { Package, Shield, Truck } from 'lucide-react'

export default function Hero() {
    const { t } = useLanguage()
    return (
        <section className="max-w-7xl mx-auto px-4 md:px-8 pt-10 pb-16 overflow-hidden">
            <div className="relative bg-cream dark:bg-charcoal-900 rounded-3xl overflow-hidden min-h-[500px] flex items-center">
                {/* Subtle background pattern */}
                <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]">
                    <div className="absolute top-10 -right-20 w-72 h-72 bg-charcoal rounded-full blur-3xl" />
                    <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-charcoal rounded-full blur-3xl" />
                </div>

                {/* Left Content */}
                <div className="relative z-10 flex-1 px-8 md:px-14 py-12">
                    {/* Tag - slides from left */}
                    <div className="opacity-0 animate-slide-in-left mb-6">
                        <div className="inline-flex items-center gap-2 bg-white dark:bg-charcoal-800 border border-charcoal-100 dark:border-charcoal-700 rounded-full px-4 py-1.5">
                            <span className="w-2 h-2 bg-charcoal rounded-full animate-pulse" />
                            <span className="text-xs font-semibold text-charcoal-500 dark:text-charcoal-300">
                                {t('hero.tag')}
                            </span>
                        </div>
                    </div>

                    {/* "Everything in" - slides from left */}
                    <h1 className="opacity-0 animate-slide-in-left text-5xl md:text-6xl lg:text-7xl font-black text-charcoal dark:text-white leading-none mb-2">
                        {t('hero.title1')}
                    </h1>

                    {/* "Packs" - slides from left with delay, bigger & bolder */}
                    <div className="opacity-0 animate-slide-in-left-delay mb-6">
                        <span className="text-7xl md:text-8xl lg:text-9xl font-black text-charcoal dark:text-white leading-none tracking-tight block">
                            {t('hero.title2')}
                        </span>
                    </div>

                    {/* Subtitle */}
                    <p className="opacity-0 animate-slide-in-left-delay-2 text-charcoal-500 dark:text-charcoal-300 text-base max-w-lg leading-relaxed mb-8">
                        {t('hero.subtitle')}
                    </p>

                    {/* CTAs */}
                    <div className="opacity-0 animate-slide-in-left-delay-2 flex flex-wrap items-center gap-3 mb-10">
                        <Link
                            to="/products"
                            className="bg-charcoal dark:bg-white text-white dark:text-charcoal px-8 py-3.5 rounded-full font-semibold text-sm hover:bg-charcoal-700 dark:hover:bg-charcoal-100 active:scale-95 transition-all duration-200 shadow-medium"
                        >
                            {t('hero.cta_shop')}
                        </Link>
                        <Link
                            to="/products"
                            className="border-2 border-charcoal dark:border-charcoal-400 text-charcoal dark:text-charcoal-200 px-8 py-3.5 rounded-full font-semibold text-sm hover:bg-charcoal hover:text-white dark:hover:bg-charcoal-700 active:scale-95 transition-all duration-200"
                        >
                            {t('hero.cta_about')}
                        </Link>
                    </div>

                    {/* Stats */}
                    <div className="opacity-0 animate-slide-in-left-delay-2 flex items-center gap-6 flex-wrap">
                        <div>
                            <p className="text-2xl font-black text-charcoal dark:text-white">100+</p>
                            <p className="text-xs text-charcoal-400 font-medium">{t('hero.stat_products')}</p>
                        </div>
                        <div className="w-px h-10 bg-charcoal-200 dark:bg-charcoal-700" />
                        <div className="flex items-center gap-3">
                            <div className="flex -space-x-2">
                                {[1, 2, 3].map((i) => (
                                    <div
                                        key={i}
                                        className="w-8 h-8 rounded-full bg-charcoal-200 border-2 border-white dark:border-charcoal-900 flex items-center justify-center text-xs font-bold text-charcoal"
                                    >
                                        {String.fromCharCode(64 + i)}
                                    </div>
                                ))}
                            </div>
                            <div>
                                <p className="text-2xl font-black text-charcoal dark:text-white">2K+</p>
                                <p className="text-xs text-charcoal-400 font-medium">{t('hero.stat_clients')}</p>
                            </div>
                        </div>
                        <div className="w-px h-10 bg-charcoal-200 dark:bg-charcoal-700 hidden sm:block" />
                        <div className="hidden sm:block">
                            <p className="text-2xl font-black text-charcoal dark:text-white">98%</p>
                            <p className="text-xs text-charcoal-400 font-medium">{t('hero.stat_rating')}</p>
                        </div>
                    </div>
                </div>

                {/* Right side - visual representation of packs */}
                <div className="hidden md:flex flex-1 items-center justify-center relative h-full min-h-[500px]">
                    <div className="absolute inset-0 bg-gradient-to-r from-cream dark:from-charcoal-900 to-transparent z-10 w-32" />

                    <div className="relative flex items-center justify-center">
                        {/* Stacked pack boxes */}
                        <div className="relative w-72 h-80">
                            {/* Box 1 - back */}
                            <div className="absolute top-2 right-4 w-56 h-56 bg-charcoal-200 dark:bg-charcoal-700 rounded-3xl rotate-6 opacity-60" />
                            {/* Box 2 - middle */}
                            <div className="absolute top-1 right-2 w-56 h-56 bg-charcoal-100 dark:bg-charcoal-600 rounded-3xl rotate-3 opacity-80" />
                            {/* Box 3 - front */}
                            <div className="absolute top-0 right-0 w-56 h-56 bg-white dark:bg-charcoal-800 rounded-3xl shadow-hard flex flex-col items-center justify-center p-6">
                                <Package size={40} className="text-charcoal dark:text-white mb-3" />
                                <span className="text-lg font-black text-charcoal dark:text-white">pax</span>
                                <div className="flex gap-1.5 mt-3">
                                    <div className="w-2 h-2 rounded-full bg-charcoal dark:bg-white" />
                                    <div className="w-2 h-2 rounded-full bg-charcoal-300" />
                                    <div className="w-2 h-2 rounded-full bg-charcoal-500" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Trust badges */}
            <div className="flex items-center justify-center gap-8 md:gap-12 mt-8 text-charcoal-400 dark:text-charcoal-500 text-xs font-medium">
                <div className="flex items-center gap-2">
                    <Package size={14} />
                    <span>Curated Packs</span>
                </div>
                <div className="flex items-center gap-2">
                    <Shield size={14} />
                    <span>Quality Guaranteed</span>
                </div>
                <div className="flex items-center gap-2">
                    <Truck size={14} />
                    <span>Fast Delivery</span>
                </div>
            </div>
        </section>
    )
}
