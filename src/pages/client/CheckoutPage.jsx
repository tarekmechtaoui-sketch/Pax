import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { ChevronRight, ShoppingBag, Building2, Home, Minus, Plus, X } from 'lucide-react'
import { useCart } from '../../contexts/CartContext'
import { placeOrder } from '../../hooks/useOrders'
import { formatPrice } from '../../utils/helpers'
import { useLanguage } from '../../contexts/LanguageContext'
import WILAYAS_DATA from '../../utils/wilayas.json'
import COMMUNES_DATA from '../../utils/communes.json'
import Button from '../../components/ui/Button'
import toast from 'react-hot-toast'

export default function CheckoutPage() {
  const { items, cartTotal, clearCart, updateQuantity } = useCart()
  const navigate = useNavigate()
  const { t } = useLanguage()
  const [submitting, setSubmitting] = useState(false)
  const [deliveryType, setDeliveryType] = useState('desk')
  const [selectedWilayaId, setSelectedWilayaId] = useState('')
  const [zoomImage, setZoomImage] = useState(null)

  const DELIVERY_OPTIONS = [
    {
      value: 'desk',
      label: t('checkout.desk_label'),
      description: t('checkout.desk_desc'),
      fee: 500,
      icon: Building2,
    },
    {
      value: 'home',
      label: t('checkout.home_label'),
      description: t('checkout.home_desc'),
      fee: 700,
      icon: Home,
    },
  ]

  const allItemsFreeDelivery = items.length > 0 && items.every((item) => item.free_delivery)

  const availableCommunes = COMMUNES_DATA.filter(
    (c) => c.wilaya_id === selectedWilayaId
  )

  const selectedDelivery = DELIVERY_OPTIONS.find((o) => o.value === deliveryType)
  const deliveryFee = allItemsFreeDelivery ? 0 : selectedDelivery.fee
  const grandTotal = cartTotal + deliveryFee

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm()

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-20 text-center">
        <ShoppingBag size={48} className="text-charcoal-300 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-charcoal dark:text-white mb-4">Your cart is empty</h2>
        <Link to="/products" className="btn-primary inline-flex">
          Browse Products
        </Link>
      </div>
    )
  }

  const onSubmit = async (data) => {
    setSubmitting(true)
    try {
      const order = await placeOrder({
        customerInfo: {
          fullName: data.fullName,
          phone: data.phone,
          wilaya: data.wilaya,
          commune: data.commune,
          notes: data.notes,
        },
        items,
        total: grandTotal,
        deliveryType,
        deliveryFee,
      })
      clearCart()
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
            total_price: grandTotal,
            delivery_type: deliveryType,
            delivery_fee: deliveryFee,
            status: 'new',
            created_at: new Date().toISOString(),
            order_items: items.map((item) => ({
              product_name: item.name,
              quantity: item.quantity,
              price: item.price,
              products: { name: item.name, images: item.images || [] },
            })),
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
        <Link to="/cart" className="hover:text-charcoal transition-colors">{t('checkout.cart')}</Link>
        <ChevronRight size={14} />
        <span className="text-charcoal dark:text-white font-medium">{t('checkout.title')}</span>
      </nav>

      <h1 className="text-3xl font-black text-charcoal dark:text-white mb-8">{t('checkout.title')}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Summary — first */}
        <div className="lg:col-span-1 order-1">
          <div className="bg-white dark:bg-charcoal-800 rounded-2xl p-6 shadow-soft lg:sticky lg:top-24">
            <h2 className="font-bold text-lg text-charcoal dark:text-white mb-5">{t('checkout.order_summary')}</h2>

            <div className="space-y-4 mb-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => item.images?.[0] && setZoomImage(item.images[0])}
                    className="w-32 h-32 bg-card-gray rounded-2xl overflow-hidden shrink-0 cursor-zoom-in hover:ring-2 hover:ring-charcoal/20 dark:hover:ring-white/20 transition-all"
                  >
                    {item.images?.[0] && (
                      <img src={item.images[0]} alt="" className="w-full h-full object-contain p-2" />
                    )}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-semibold text-charcoal dark:text-white line-clamp-2">
                      {item.name}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        type="button"
                        onClick={() => {
                          if (item.quantity <= 1) {
                            if (window.confirm(`${item.name} will be removed from your cart. Continue?`)) {
                              updateQuantity(item.id, 0)
                            }
                          } else {
                            updateQuantity(item.id, item.quantity - 1)
                          }
                        }}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-charcoal-100 dark:bg-charcoal-700 text-charcoal-600 dark:text-charcoal-300 hover:bg-charcoal-200 dark:hover:bg-charcoal-600 transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center font-bold text-charcoal dark:text-white">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.stock}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-charcoal-100 dark:bg-charcoal-700 text-charcoal-600 dark:text-charcoal-300 hover:bg-charcoal-200 dark:hover:bg-charcoal-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <p className="text-base font-bold text-charcoal dark:text-white mt-1.5">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-charcoal-100 dark:border-charcoal-700 pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-charcoal-500 dark:text-charcoal-400">{t('checkout.subtotal')}</span>
                <span className="font-semibold text-charcoal dark:text-charcoal-200">{formatPrice(cartTotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-charcoal-500 dark:text-charcoal-400">
                  {t('checkout.delivery_fee')}
                </span>
                <span className={`font-semibold ${allItemsFreeDelivery ? 'text-green-600 dark:text-green-400' : 'text-charcoal dark:text-charcoal-200'}`}>
                  {allItemsFreeDelivery ? t('common.free_delivery') : `+${formatPrice(deliveryFee)}`}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-charcoal-100 dark:border-charcoal-700">
                <span className="font-bold text-charcoal dark:text-white">{t('checkout.grand_total')}</span>
                <span className="font-black text-lg text-charcoal dark:text-white">
                  {formatPrice(grandTotal)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Form — second */}
        <div className="lg:col-span-2 order-2">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

            {/* ── Delivery Type ── */}
            <div className="bg-white dark:bg-charcoal-800 rounded-2xl p-6 shadow-soft">
              <h2 className="font-bold text-lg text-charcoal dark:text-white mb-5">
                {t('checkout.delivery_method')}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {DELIVERY_OPTIONS.map((option) => {
                  const Icon = option.icon
                  const active = deliveryType === option.value
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setDeliveryType(option.value)}
                      className={`relative flex items-start gap-4 p-4 rounded-2xl border-2 text-left transition-all duration-200 ${
                        active
                          ? 'border-charcoal dark:border-white bg-charcoal-50 dark:bg-charcoal-700'
                          : 'border-charcoal-100 dark:border-charcoal-600 hover:border-charcoal-300 dark:hover:border-charcoal-500'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        active ? 'bg-charcoal dark:bg-white' : 'bg-charcoal-100 dark:bg-charcoal-700'
                      }`}>
                        <Icon size={18} className={active ? 'text-white dark:text-charcoal' : 'text-charcoal-500 dark:text-charcoal-300'} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-semibold text-sm ${active ? 'text-charcoal dark:text-white' : 'text-charcoal-600 dark:text-charcoal-300'}`}>
                          {option.label}
                        </p>
                        <p className="text-xs text-charcoal-400 mt-0.5">{option.description}</p>
                        {allItemsFreeDelivery ? (
                          <p className="text-sm font-black mt-1 text-green-600 dark:text-green-400">
                            {t('common.free_delivery')}
                          </p>
                        ) : (
                          <p className={`text-sm font-black mt-1 ${active ? 'text-charcoal dark:text-white' : 'text-charcoal-500 dark:text-charcoal-400'}`}>
                            +{formatPrice(option.fee)}
                          </p>
                        )}
                      </div>
                      {/* Radio dot */}
                      <div className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center ${
                        active ? 'border-charcoal dark:border-white' : 'border-charcoal-300 dark:border-charcoal-600'
                      }`}>
                        {active && <div className="w-2.5 h-2.5 rounded-full bg-charcoal dark:bg-white" />}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* ── Customer Info ── */}
            <div className="bg-white dark:bg-charcoal-800 rounded-2xl p-6 shadow-soft">
              <h2 className="font-bold text-lg text-charcoal dark:text-white mb-5">
                {t('checkout.delivery_info')}
              </h2>

              <div className="space-y-4">
                {/* Full Name */}
                <div>
                  <label className="label">{t('checkout.full_name')}</label>
                  <input
                    className="input-field"
                    placeholder={t('checkout.full_name_placeholder')}
                    {...register('fullName', { required: 'Full name is required' })}
                  />
                  {errors.fullName && (
                    <p className="text-xs text-red-500 mt-1">{errors.fullName.message}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="label">{t('checkout.phone')}</label>
                  <input
                    className="input-field"
                    placeholder={t('checkout.phone_placeholder')}
                    type="tel"
                    {...register('phone', {
                      required: 'Phone number is required',
                      pattern: {
                        value: /^0[567][0-9]{8}$/,
                        message: 'Must be 10 digits starting with 05, 06, or 07',
                      },
                    })}
                  />
                  {errors.phone && (
                    <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>
                  )}
                </div>

                {/* Wilaya */}
                <div>
                  <label className="label">{t('checkout.wilaya')}</label>
                  <select
                    className="input-field"
                    {...register('wilaya', { required: 'Wilaya is required' })}
                    onChange={(e) => {
                      const opt = e.target.options[e.target.selectedIndex]
                      setValue('wilaya', opt.value)
                      setSelectedWilayaId(opt.dataset.id || '')
                      setValue('commune', '')
                    }}
                  >
                    <option value="">{t('checkout.wilaya_placeholder')}</option>
                    {WILAYAS_DATA.map((w) => (
                      <option
                        key={w.id}
                        value={`${w.code.padStart(2, '0')} - ${w.name}`}
                        data-id={w.id}
                      >
                        {w.code.padStart(2, '0')} - {w.name}
                      </option>
                    ))}
                  </select>
                  {errors.wilaya && (
                    <p className="text-xs text-red-500 mt-1">{errors.wilaya.message}</p>
                  )}
                </div>

                {/* Commune */}
                <div>
                  <label className="label">{t('checkout.commune')}</label>
                  <select
                    className="input-field"
                    disabled={!selectedWilayaId}
                    {...register('commune', { required: 'Commune is required' })}
                  >
                    <option value="">
                      {selectedWilayaId ? t('checkout.commune_placeholder') : t('checkout.commune_first')}
                    </option>
                    {availableCommunes.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  {errors.commune && (
                    <p className="text-xs text-red-500 mt-1">{errors.commune.message}</p>
                  )}
                </div>

                {/* Notes */}
                <div>
                  <label className="label">{t('checkout.notes')}</label>
                  <textarea
                    className="input-field resize-none"
                    rows={3}
                    placeholder={t('checkout.notes_placeholder')}
                    {...register('notes')}
                  />
                </div>
              </div>
            </div>

            <Button type="submit" loading={submitting} className="w-full" size="lg">
              {submitting ? t('checkout.placing') : `${t('checkout.place_order')} • ${formatPrice(grandTotal)}`}
            </Button>

            <p className="text-xs text-charcoal-400 text-center">
              {t('checkout.no_account')}
            </p>
          </form>
        </div>
      </div>

      {/* Image Zoom Lightbox */}
      {zoomImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setZoomImage(null)}
        >
          <button
            onClick={() => setZoomImage(null)}
            className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors"
          >
            <X size={20} />
          </button>
          <img
            src={zoomImage}
            alt=""
            className="max-w-full max-h-[85vh] object-contain rounded-2xl animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  )
}
