import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Minus, Plus, ChevronRight, Building2, Home } from 'lucide-react'
import { useProduct } from '../../hooks/useProducts'
import { useLanguage } from '../../contexts/LanguageContext'
import { PageLoader } from '../../components/ui/LoadingSpinner'
import { formatPrice } from '../../utils/helpers'
import { placeOrder } from '../../hooks/useOrders'
import { useForm } from 'react-hook-form'
import WILAYAS_DATA from '../../utils/wilayas.json'
import COMMUNES_DATA from '../../utils/communes.json'
import Button from '../../components/ui/Button'
import toast from 'react-hot-toast'

export default function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { product, loading, error } = useProduct(id)
  const { t } = useLanguage()
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [deliveryType, setDeliveryType] = useState('desk')
  const [selectedWilayaId, setSelectedWilayaId] = useState('')

  const DELIVERY_OPTIONS = [
    { value: 'desk', label: t('checkout.desk_label'), description: t('checkout.desk_desc'), fee: 500, icon: Building2 },
    { value: 'home', label: t('checkout.home_label'), description: t('checkout.home_desc'), fee: 700, icon: Home },
  ]

  const availableCommunes = COMMUNES_DATA.filter((c) => c.wilaya_id === selectedWilayaId)

  const allItemsFreeDelivery = product?.free_delivery
  const selectedDelivery = DELIVERY_OPTIONS.find((o) => o.value === deliveryType)
  const deliveryFee = allItemsFreeDelivery ? 0 : (selectedDelivery?.fee || 500)
  const totalPrice = product ? (product.promotion ? product.effective_price : product.price) * quantity + deliveryFee : 0

  const { register, handleSubmit, setValue, formState: { errors } } = useForm()

  useEffect(() => {
    window.scrollTo(0, 0)
    setSelectedImage(0)
    setQuantity(1)
  }, [id])

  if (loading) return <PageLoader />
  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-20 text-center">
        <h2 className="text-2xl font-bold text-charcoal dark:text-white mb-4">{t('detail.not_found')}</h2>
        <Link to="/products" className="btn-primary inline-flex">
          {t('detail.back')}
        </Link>
      </div>
    )
  }

  const inStock = product.stock > 0

  const onSubmit = async (data) => {
    if (!inStock) return
    setSubmitting(true)
    try {
      const productPrice = product.promotion ? product.effective_price : product.price
      const order = await placeOrder({
        customerInfo: {
          fullName: data.fullName,
          phone: data.phone,
          wilaya: data.wilaya,
          commune: data.commune,
          notes: data.notes,
        },
        items: [{ ...product, quantity, price: productPrice }],
        total: totalPrice,
        deliveryType,
        deliveryFee,
      })
      toast.success('Order placed successfully!')
      navigate(`/order-confirmation/${order.id}`, {
        state: {
          order: {
            id: order.id,
            customer_name: data.fullName,
            phone: data.phone,
            wilaya: data.wilaya,
            commune: data.commune,
            notes: data.notes || null,
            total_price: totalPrice,
            delivery_type: deliveryType,
            delivery_fee: deliveryFee,
            status: 'new',
            created_at: new Date().toISOString(),
            order_items: [{
              product_name: product.name,
              quantity,
              price: productPrice,
              products: { name: product.name, images: product.images || [] },
            }],
          },
        },
      })
    } catch (err) {
      toast.error('Failed to place order: ' + err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 animate-fade-in">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-charcoal-400 mb-8">
        <Link to="/" className="hover:text-charcoal transition-colors">{t('detail.home')}</Link>
        <ChevronRight size={14} />
        <Link to="/products" className="hover:text-charcoal transition-colors">{t('detail.products')}</Link>
        <ChevronRight size={14} />
        <span className="text-charcoal dark:text-white font-medium truncate">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
        {/* Images */}
        <div>
          {/* Main image */}
          <div className="bg-card-gray rounded-3xl aspect-square flex items-center justify-center overflow-hidden mb-4">
            {product.images?.[selectedImage] ? (
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-contain p-8"
              />
            ) : (
              <div className="text-charcoal-300 text-sm">No image</div>
            )}
          </div>
          {/* Thumbnails */}
          {product.images?.length > 1 && (
            <div className="flex gap-3">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`w-16 h-16 bg-card-gray rounded-xl overflow-hidden flex-shrink-0 transition-all ${
                    selectedImage === i
                      ? 'ring-2 ring-charcoal dark:ring-white'
                      : 'opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-contain p-2" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col">
          {/* Category */}
          <p className="text-xs text-charcoal-400 uppercase tracking-widest font-medium mb-2">
            {product.categories?.name || t('detail.accessory')}
          </p>

          {/* Name */}
          <h1 className="text-3xl md:text-4xl font-black text-charcoal dark:text-white mb-4 leading-tight">
            {product.name}
          </h1>

          {/* Price */}
          {product.promotion ? (
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3">
                <span className="text-xl font-semibold text-charcoal-500 dark:text-charcoal-300 line-through">
                  {formatPrice(product.original_price)}
                </span>
                <span className="text-3xl font-black text-charcoal dark:text-white">
                  {formatPrice(product.effective_price)}
                </span>
              </div>
              <p className="text-sm uppercase tracking-widest text-emerald-600 font-semibold">
                {t('product_card.promo')}
              </p>
            </div>
          ) : (
            <p className="text-3xl font-black text-charcoal dark:text-white mb-6">
              {formatPrice(product.price)}
            </p>
          )}

          {/* Description */}
          {product.description && (
            <p className="text-charcoal-500 dark:text-charcoal-300 text-sm leading-relaxed mb-8">
              {product.description}
            </p>
          )}

          {/* Stock */}
          <div className="flex items-center gap-2 mb-6">
            <div className={`w-2 h-2 rounded-full ${inStock ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className={`text-sm font-semibold ${inStock ? 'text-green-600' : 'text-red-500'}`}>
              {inStock ? t('common.in_stock') : t('common.out_of_stock')}
            </span>
          </div>

          {/* Quantity */}
          {inStock && (
            <div className="mb-6">
              <label className="label">{t('detail.quantity')}</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-10 h-10 bg-charcoal-100 dark:bg-charcoal-700 rounded-full flex items-center justify-center hover:bg-charcoal-200 dark:hover:bg-charcoal-600 transition-colors"
                >
                  <Minus size={16} />
                </button>
                <span className="w-12 text-center font-bold text-lg text-charcoal dark:text-white">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  className="w-10 h-10 bg-charcoal-100 dark:bg-charcoal-700 rounded-full flex items-center justify-center hover:bg-charcoal-200 dark:hover:bg-charcoal-600 transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          )}

          {/* ── Checkout Form ── */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Delivery Type */}
            <div>
              <p className="font-bold text-sm text-charcoal dark:text-white mb-3">{t('checkout.delivery_method')}</p>
              <div className="grid grid-cols-2 gap-3">
                {DELIVERY_OPTIONS.map((option) => {
                  const Icon = option.icon
                  const active = deliveryType === option.value
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setDeliveryType(option.value)}
                      className={`relative flex items-start gap-3 p-3 rounded-2xl border-2 text-left transition-all ${
                        active
                          ? 'border-charcoal dark:border-white bg-charcoal-50 dark:bg-charcoal-700'
                          : 'border-charcoal-100 dark:border-charcoal-600 hover:border-charcoal-300'
                      }`}
                    >
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        active ? 'bg-charcoal dark:bg-white' : 'bg-charcoal-100 dark:bg-charcoal-700'
                      }`}>
                        <Icon size={16} className={active ? 'text-white dark:text-charcoal' : 'text-charcoal-500 dark:text-charcoal-300'} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-semibold text-xs ${active ? 'text-charcoal dark:text-white' : 'text-charcoal-600 dark:text-charcoal-300'}`}>
                          {option.label}
                        </p>
                        {allItemsFreeDelivery ? (
                          <p className="text-xs font-black mt-0.5 text-green-600">{t('common.free_delivery')}</p>
                        ) : (
                          <p className={`text-xs font-black mt-0.5 ${active ? 'text-charcoal dark:text-white' : 'text-charcoal-500 dark:text-charcoal-400'}`}>
                            +{formatPrice(option.fee)}
                          </p>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Customer Info */}
            <div className="space-y-3">
              <p className="font-bold text-sm text-charcoal dark:text-white">{t('checkout.delivery_info')}</p>
              <div className="space-y-3">
                <input className="input-field" placeholder={t('checkout.full_name_placeholder')} {...register('fullName', { required: 'Full name is required' })} />
                {errors.fullName && <p className="text-xs text-red-500">{errors.fullName.message}</p>}
                <input className="input-field" placeholder={t('checkout.phone_placeholder')} type="tel" {...register('phone', { required: 'Phone is required', pattern: { value: /^0[567][0-9]{8}$/, message: 'Must be 10 digits starting with 05, 06, or 07' } })} />
                {errors.phone && <p className="text-xs text-red-500">{errors.phone.message}</p>}
                <select className="input-field" {...register('wilaya', { required: 'Wilaya is required' })} onChange={(e) => { const opt = e.target.options[e.target.selectedIndex]; setValue('wilaya', opt.value); setSelectedWilayaId(opt.dataset.id || ''); setValue('commune', '') }}>
                  <option value="">{t('checkout.wilaya_placeholder')}</option>
                  {WILAYAS_DATA.map((w) => (<option key={w.id} value={`${w.code.padStart(2, '0')} - ${w.name}`} data-id={w.id}>{w.code.padStart(2, '0')} - {w.name}</option>))}
                </select>
                {errors.wilaya && <p className="text-xs text-red-500">{errors.wilaya.message}</p>}
                <select className="input-field" disabled={!selectedWilayaId} {...register('commune', { required: 'Commune is required' })}>
                  <option value="">{selectedWilayaId ? t('checkout.commune_placeholder') : t('checkout.commune_first')}</option>
                  {availableCommunes.map((c) => (<option key={c.id} value={c.name}>{c.name}</option>))}
                </select>
                {errors.commune && <p className="text-xs text-red-500">{errors.commune.message}</p>}
                <textarea className="input-field resize-none" rows={2} placeholder={t('checkout.notes_placeholder')} {...register('notes')} />
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-charcoal-50 dark:bg-charcoal-800 rounded-2xl p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-charcoal-500 dark:text-charcoal-400">{t('checkout.subtotal')}</span>
                <span className="font-semibold text-charcoal dark:text-white">{formatPrice((product.promotion ? product.effective_price : product.price) * quantity)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-charcoal-500 dark:text-charcoal-400">{t('checkout.delivery_fee')}</span>
                <span className={`font-semibold ${allItemsFreeDelivery ? 'text-green-600' : ''}`}>{allItemsFreeDelivery ? t('common.free_delivery') : `+${formatPrice(deliveryFee)}`}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-charcoal-200 dark:border-charcoal-700">
                <span className="font-bold text-charcoal dark:text-white">{t('checkout.grand_total')}</span>
                <span className="font-black text-lg text-charcoal dark:text-white">{formatPrice(totalPrice)}</span>
              </div>
            </div>

            <Button type="submit" loading={submitting} className="w-full" size="lg" disabled={!inStock}>
              {submitting ? t('checkout.placing') : `${t('checkout.place_order')} • ${formatPrice(totalPrice)}`}
            </Button>
          </form>

          {/* Back */}
          <Link
            to="/products"
            className="mt-6 flex items-center gap-2 text-sm font-medium text-charcoal-400 hover:text-charcoal dark:hover:text-white transition-colors w-fit"
          >
            <ArrowLeft size={15} />
            {t('detail.back')}
          </Link>
        </div>
      </div>
    </div>
  )
}
