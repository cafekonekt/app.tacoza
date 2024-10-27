'use client';

export const PaymentLink = ({ order }) => {
    const upiPaymentUrl = `upi://pay?pa=${encodeURIComponent(order.outlet.payment_link)}&am=${order.total}&tn=${encodeURIComponent(order.order_id.split('-')[0])}&pn=${encodeURIComponent(order.user.name)}&cu=INR`;
    return (
        <span className="text-blue-600 mx-1" onClick={() => window.open(upiPaymentUrl)}>
            here
        </span>
    );
}
