import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("/api/orders/userOrders", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setOrders(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-2xl font-semibold">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500 text-2xl font-semibold">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">my Orders</h1>
      {orders.length === 0 ? (
        <div className="flex justify-center items-center h-64 bg-gray-100 rounded-lg">
          <p className="text-2xl font-semibold text-gray-500">
            No orders found.
          </p>
        </div>
      ) : (
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="w-full bg-gray-200 text-left">
              <th className="py-3 px-6 font-medium">Order ID</th>
              <th className="py-3 px-6 font-medium">Price</th>
              <th className="py-3 px-6 font-medium">Status</th>
              <th className="py-3 px-6 font-medium">User</th>
              <th className="py-3 px-6 font-medium">Items</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="border-t">
                <td className="py-4 px-6">
                  <Link
                    className="text-blue-500"
                    to={`/order/${order.orderId}`}
                  >
                    {order.orderId}
                  </Link>
                </td>
                <td className="py-4 px-6">${order.price.toFixed(2)}</td>
                <td
                  className={`py-4 px-6 ${
                    order.status === "SUCCESS"
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {order.status}
                </td>
                <td className="py-4 px-6">{order.user?.name || "N/A"}</td>
                <td className="py-4 px-6">
                  {order.items.length === 0 ? (
                    <span className="text-gray-500">
                      No items in this order.
                    </span>
                  ) : (
                    <ul className="list-disc list-inside">
                      {order.items.map((item) => (
                        <li key={item.id} className="mb-2 flex items-center">
                          {item.imageUrl && (
                            <img
                              src={item.imageUrl}
                              alt={item.title}
                              className="w-10 h-10 mr-4 object-cover rounded"
                            />
                          )}
                          <div>
                            <p className="font-medium">{item.title}</p>
                            <p>Qty: {item.amount}</p>
                            <p>Price: ${item.price.toFixed(2)}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyOrders;
