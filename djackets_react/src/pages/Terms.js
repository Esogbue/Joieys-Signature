import { useEffect } from 'react'

const Terms = () => {
  useEffect(() => {
    document.title = "Terms & Privacy — Joiey's Signature"
  }, [])

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-2" style={{ color: '#1a1a1a' }}>Terms & Privacy Policy</h1>
      <p className="text-sm text-gray-400 mb-10">Last updated: June 2026</p>

      <div className="flex flex-col gap-8">

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-3" style={{ color: '#D63384' }}>1. Acceptance of Terms</h2>
          <p className="text-gray-500 text-sm leading-relaxed">
            By accessing and using the Joiey's Signature website, you accept and agree to be bound by these terms. If you do not agree, please do not use our website.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-3" style={{ color: '#D63384' }}>2. Products & Orders</h2>
          <p className="text-gray-500 text-sm leading-relaxed">
            All products are subject to availability. We reserve the right to discontinue any product at any time. Prices are subject to change without notice. Once an order is placed and payment is confirmed, it cannot be cancelled.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-3" style={{ color: '#D63384' }}>3. Payments</h2>
          <p className="text-gray-500 text-sm leading-relaxed">
            All payments are processed securely through Paystack. We do not store your card details. All transactions are in Nigerian Naira (₦). By making a purchase you confirm that you are authorized to use the payment method provided.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-3" style={{ color: '#D63384' }}>4. Returns & Refunds</h2>
          <p className="text-gray-500 text-sm leading-relaxed">
            We accept returns within 7 days of delivery for items that are unused, unworn and in their original condition. To initiate a return, please contact us via email or WhatsApp. Refunds will be processed within 5-7 business days after we receive the returned item.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-3" style={{ color: '#D63384' }}>5. Privacy Policy</h2>
          <p className="text-gray-500 text-sm leading-relaxed">
            We collect personal information (name, email, phone, address) solely to process your orders and improve your shopping experience. We do not sell or share your personal data with third parties. Your data is stored securely and you may request deletion at any time by contacting us.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-3" style={{ color: '#D63384' }}>6. Contact Us</h2>
          <p className="text-gray-500 text-sm leading-relaxed">
            For any questions regarding these terms, please contact us at joieyssignature@gmail.com or via WhatsApp.
          </p>
        </div>

      </div>
    </div>
  )
}

export default Terms
