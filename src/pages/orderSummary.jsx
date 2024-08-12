import React, { useContext, useEffect, useState, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";
import { v4 as uuidv4 } from "uuid";
import { validateSignature } from "../utils/utils";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function PaymentStatus() {
  const query = useQuery();
  const { user } = useContext(AuthContext);

  const [isValidSignature, setIsValidSignature] = useState(false);
  const [paymentLink, setPaymentLink] = useState("");
  const [order, setOrder] = useState(null);

  const orderDetails = {
    paymentStatus: query.get("paymentStatus"),
    cardDataToken: query.get("cardDataToken"),
    maskedCard: query.get("maskedCard"),
    merchantOrderId: query.get("merchantOrderId"),
    orderId: query.get("orderId"),
    cardBrand: query.get("cardBrand"),
    orderReference: query.get("orderReference"),
    transactionId: query.get("transactionId"),
    amount: query.get("amount"),
    currency: query.get("currency"),
    mode: query.get("mode"),
    signature: query.get("signature"),
  };

  const fetchOrder = useCallback(async () => {
    try {
      const res = await axios.get(
        `/api/orders/${orderDetails.merchantOrderId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setOrder(res.data);
    } catch (error) {
      console.error("Failed to fetch order:", error);
    }
  }, [orderDetails.merchantOrderId]);

  const createPaymentLink = useCallback(async () => {
    if (!order) return;

    const tomorrow = new Date(Date.now() + 86400000).toISOString();
    const items = order.items?.map((item) => ({
      description: item.title,
      quantity: item.amount,
      itemName: item.title,
      unitPrice: item.price,
      subTotal: item.price * item.amount,
    }));

    try {
      const res = await axios.post("/api/invoices/", {
        paymentType: "professional",
        merchantId: import.meta.env.VITE_KASHIER_MID,
        isSuspendedPayment: true,
        customerName: user.name,
        description: "Try to pay order again",
        dueDate: tomorrow,
        totalAmount: orderDetails.amount,
        invoiceReferenceId: uuidv4(),
        invoiceItems: items || [],
        state: "submitted",
        tax: 0,
      });
      setPaymentLink(
        `http://merchant.kashier.io/en/prepay/${res.data.response.paymentRequestId}?mode=test`
      );
    } catch (error) {
      console.error("Failed to create payment link:", error);
    }
  }, [order, orderDetails.amount]);

  useEffect(() => {
    const signatureIsValid = validateSignature(
      orderDetails,
      import.meta.env.VITE_KASHIER_PAYMENTAPIKEY
    );
    setIsValidSignature(signatureIsValid);
  }, [orderDetails]);

  useEffect(() => {
    if (isValidSignature) fetchOrder();
  }, [isValidSignature, fetchOrder]);

  useEffect(() => {
    if (isValidSignature && order) createPaymentLink();
  }, [isValidSignature, order, createPaymentLink]);

  const renderPaymentStatus = () => (
    <div className="flex flex-col items-center justify-center min-h-9 mt-5">
      <div className="max-w-lg w-full bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-6">
          {orderDetails.paymentStatus === "SUCCESS"
            ? "Thanks for your order"
            : "Oops, something went wrong"}
          !
        </h2>
        <p
          className={`mb-4 ${
            orderDetails.paymentStatus === "SUCCESS"
              ? "text-green-600"
              : "text-red-700"
          } font-semibold`}
        >
          Payment Status: {orderDetails.paymentStatus}
        </p>
        <p className="mb-4">
          Order ID:{" "}
          <span className="font-bold">
            <Link
              className="text-blue-500"
              to={`/order/${orderDetails.merchantOrderId}`}
            >
              {orderDetails.merchantOrderId}
            </Link>
          </span>
        </p>
        <p className="mb-4">
          Order Reference:{" "}
          <span className="font-bold">{orderDetails.orderReference}</span>
        </p>
        <p className="mb-4">
          Transaction ID:{" "}
          <span className="font-bold">{orderDetails.transactionId}</span>
        </p>
        <p className="mb-4">
          Amount:{" "}
          <span className="font-bold">
            {orderDetails.amount} {orderDetails.currency}
          </span>
        </p>
        <p className="mb-4">
          Card: <span className="font-bold">{orderDetails.maskedCard}</span> (
          {orderDetails.cardBrand})
        </p>
        {orderDetails.paymentStatus !== "SUCCESS" && (
          <p className="mb-4">
            Payment Link:{" "}
            <span className="font-bold">
              {paymentLink ? (
                <a
                  href={paymentLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500"
                >
                  Payment Link
                </a>
              ) : (
                "Loading..."
              )}
            </span>
          </p>
        )}
      </div>
    </div>
  );

  const renderInvalidSignature = () => (
    <div className="flex items-center justify-center min-h-9 mt-5">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-4xl font-bold text-red-500 mb-4">
          Invalid Signature
        </h1>
        <p className="text-gray-700 mb-6">
          The signature provided is not valid.
        </p>
        <Link
          to="/"
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          Go Back
        </Link>
      </div>
    </div>
  );

  return isValidSignature ? renderPaymentStatus() : renderInvalidSignature();
}

export default PaymentStatus;
