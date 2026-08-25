import { useState } from "react";
import { Link, useLocation, Navigate } from "react-router-dom";

import { processPayment } from "../services/paymentService";

import "./PaymentPage.css";

function PaymentPage() {
  const location = useLocation();

  const order = location.state?.order;

  const [outcome, setOutcome] = useState("SUCCESS");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [payment, setPayment] = useState(null);

  if (!order) {
    return <Navigate to="/cart" replace />;
  }

  const handlePayment = async () => {
    try {
      setProcessing(true);
      setError("");

      const response = await processPayment(
        order.id,
        outcome
      );

      setPayment(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to process the demo payment."
      );
    } finally {
      setProcessing(false);
    }
  };

  if (payment) {
    const isSuccess = payment.status === "SUCCESS";
    const isFailed = payment.status === "FAILED";
    const isCancelled = payment.status === "CANCELLED";

    return (
        <main className="payment-page">
        <section
            className={`payment-result ${
            isSuccess
                ? "payment-result--success"
                : "payment-result--failure"
            }`}
        >
            <p className="payment-page__eyebrow">
            Demo Payment
            </p>

            <h1>
            {isSuccess
                ? "Payment Successful"
                : isFailed
                ? "Payment Failed"
                : isCancelled
                    ? "Payment Cancelled"
                    : "Payment Processed"}
            </h1>

            <p>
            {isSuccess
                ? "Your payment was successful and your order has been confirmed."
                : isFailed
                ? "Your payment failed. Your order was not confirmed and inventory was not reduced."
                : isCancelled
                    ? "Your payment was cancelled. Your order was not confirmed and inventory was not reduced."
                    : "Your demo payment has been processed."}
            </p>

            <div className="payment-result__status">
            {isSuccess
                ? "✓ Order Confirmed"
                : "Inventory Unchanged"}
            </div>

            <div className="payment-result__details">
            <div>
                <span>Order ID</span>
                <strong>#{order.id}</strong>
            </div>

            <div>
                <span>Payment Status</span>
                <strong>{payment.status}</strong>
            </div>

            <div>
                <span>Amount</span>
                <strong>
                ₹{Number(payment.amount).toFixed(2)}
                </strong>
            </div>

            <div>
                <span>Transaction ID</span>
                <strong>{payment.transactionId}</strong>
            </div>
            </div>

            <Link
            to="/marketplace"
            className="payment-primary-button"
            >
            Back to Marketplace
            </Link>
        </section>
        </main>
    );
    }

  return (
    <main className="payment-page">
      <header className="payment-page__header">
        <div>
          <p className="payment-page__eyebrow">
            Demo Payment
          </p>

          <h1>Complete Payment</h1>
        </div>

        <Link
          to="/checkout"
          state={{ order }}
          className="payment-secondary-button"
        >
          Back to Checkout
        </Link>
      </header>

      {error && (
        <div className="payment-alert">
          {error}
        </div>
      )}

      <section className="payment-layout">
        <div className="payment-card">
          <h2>Order #{order.id}</h2>

          <p>
            This is a simulated payment screen for
            the client demonstration.
          </p>

          <div className="payment-summary">
            <span>Order Total</span>

            <strong>
              ₹{Number(order.total).toFixed(2)}
            </strong>
          </div>

          <div className="payment-options">
            <h3>Choose Demo Outcome</h3>

            <label>
              <input
                type="radio"
                name="paymentOutcome"
                value="SUCCESS"
                checked={outcome === "SUCCESS"}
                onChange={(event) =>
                  setOutcome(event.target.value)
                }
              />

              Successful Payment
            </label>

            <label>
              <input
                type="radio"
                name="paymentOutcome"
                value="FAILED"
                checked={outcome === "FAILED"}
                onChange={(event) =>
                  setOutcome(event.target.value)
                }
              />

              Failed Payment
            </label>

            <label>
              <input
                type="radio"
                name="paymentOutcome"
                value="CANCELLED"
                checked={outcome === "CANCELLED"}
                onChange={(event) =>
                  setOutcome(event.target.value)
                }
              />

              Cancelled Payment
            </label>
          </div>

          <button
            type="button"
            className="payment-primary-button payment-submit"
            onClick={handlePayment}
            disabled={processing}
          >
            {processing
              ? "Processing Payment..."
              : "Process Demo Payment"}
          </button>

          <p className="payment-note">
            This payment is simulated. The backend
            remains responsible for validating the
            payment result.
          </p>
        </div>
      </section>
    </main>
  );
}

export default PaymentPage;