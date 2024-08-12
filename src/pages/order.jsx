import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(`/api/orders/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setOrder(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500">Error: {error}</div>;
  }

  if (!order) {
    return <div className="text-center mt-10">Order not found.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Order Details</h1>
      <div className="border rounded-lg p-4 shadow-md">
        <h2 className="text-xl font-semibold mb-2">
          Order ID: {order.orderId}
        </h2>
        <p className="mb-1">
          <span className="font-medium">Price:</span> ${order.price.toFixed(2)}
        </p>
        <p className="mb-1">
          <span className="font-medium">Status:</span>{" "}
          <span
            className={`${
              order.status === "SUCCESS" ? "text-green-500" : "text-red-500"
            }`}
          >
            {order.status}{" "}
          </span>
        </p>
        <p className="mb-3">
          <span className="font-medium">User:</span> {order.user?.name || "N/A"}
        </p>
        <h3 className="font-semibold mb-2">Items:</h3>
        {order.items.length === 0 ? (
          <p>No items in this order.</p>
        ) : (
          <ul className="list-disc list-inside">
            {order.items.map((item) => (
              <li key={item.id} className="mb-1">
                <div className="flex items-center">
                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-12 h-12 mr-4 object-cover rounded"
                    />
                  )}
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p>Quantity: {item.amount}</p>
                    <p>Price: ${item.price.toFixed(2)}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default OrderDetails;
