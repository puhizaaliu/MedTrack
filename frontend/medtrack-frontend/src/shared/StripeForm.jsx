// components/StripeForm.jsx
import React, { useState, useEffect } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";

const CARD_OPTIONS = {
  style: {
    base: {
      fontSize: "16px",
      color: "#424770",
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#c23d4b",
    },
  },
};

export default function StripeForm({ amount, appointmentId, onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();

  const [clientSecret, setClientSecret] = useState("");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  // Fetch the clientSecret from the backend
  useEffect(() => {
    if (!amount) return;

    const createPaymentIntent = async () => {
      try {
        const res = await axios.post("https://localhost:7210/api/Stripe/CreatePaymentIntent", {
          amount: Math.round(amount * 100), // in cents
          appointmentId,
        });
        setClientSecret(res.data.clientSecret);
      } catch (err) {
        setError("Failed to initiate payment.");
      }
    };

    createPaymentIntent();
  }, [amount, appointmentId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setError(null);

    if (!stripe || !elements || !clientSecret) return;

    const cardElement = elements.getElement(CardElement);

    const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
      },
    });

    if (stripeError) {
      setError(stripeError.message);
      setProcessing(false);
      return;
    }

    if (paymentIntent.status === "succeeded") {
      onSuccess(); // call the parent component's success handler
    } else {
      setError("Payment failed. Try again.");
    }

    setProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 mt-4 rounded shadow space-y-4">
      <label className="block mb-1 font-medium">Enter Card Details</label>
      <CardElement options={CARD_OPTIONS} className="border px-3 py-2 rounded" />
      {error && <div className="text-red-600 font-medium">{error}</div>}
      <button
        type="submit"
        disabled={!stripe || processing}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {processing ? "Processing..." : "Pay Now"}
      </button>
    </form>
  );
}
