import React, { useContext, useEffect, useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { CartContext } from "../contexts/CartContext";
import { IoMdAdd, IoMdClose, IoMdRemove } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { SidebarContext } from "../contexts/SidebarContext";
import { v4 as uuidv4 } from "uuid";
import { AuthContext } from "../contexts/AuthContext";
import { generateKashierOrderHash } from "../utils/utils";

export default function Cart() {
  const { cart, removeFromCart, decreaseAmount, increaseAmount, total } =
    useContext(CartContext);
  const navigate = useNavigate();
  const { isOpen, setIsOpen } = useContext(SidebarContext);
  const { user, getUser, isAuthenticated } = useContext(AuthContext);
  const [order, setOrder] = useState({});
  useEffect(() => {
    const orderDetails = {
      amount: total,
      currency: "EGP",
      merchantOrderId: uuidv4(),
      mid: import.meta.env.VITE_KASHIER_MID,
      secret: import.meta.env.VITE_KASHIER_PAYMENTAPIKEY,
      baseUrl: "http:",
      metaData: JSON.stringify({ cart, user }),
      merchantRedirect: import.meta.env.VITE_KASHIER_REDIRECTURL,
      display: "ar",
      failureRedirect: "true",
      redirectMethod: "get",
      allowedMethods: "bank_installments,card",
      brandColor: "rgba(79, 70, 263, 1)",
    };
    setOrder(orderDetails);
  }, [cart, user, total]);

  const handleCheckout = () => {
    if (total === 0) {
      alert("You should select a product first!");
      return;
    }

    if (!isAuthenticated || !user._id) {
      navigate(`/login?redirect=true`);
      setIsOpen(false);
      return;
    }

    getUser();

    const orderWithHash = {
      ...order,
      hash: generateKashierOrderHash(order),
    };
    setOrder(orderWithHash);

    const queryParams = new URLSearchParams({
      merchantId: orderWithHash.mid,
      orderId: orderWithHash.merchantOrderId,
      amount: orderWithHash.amount,
      currency: orderWithHash.currency,
      hash: orderWithHash.hash,
      merchantRedirect: orderWithHash.merchantRedirect,
      metaData: orderWithHash.metaData,
      allowedMethods: orderWithHash.allowedMethods || "",
      failureRedirect: orderWithHash.failureRedirect || "",
      redirectMethod: orderWithHash.redirectMethod || "",
      display: orderWithHash.display || "",
      brandColor: order.brandColor,
      mode: import.meta.env.VITE_KASHIER_MODE,
      serverWebhook: import.meta.env.VITE_KASHIER_WEBHOOK,
    });

    const payUrl = `${
      import.meta.env.VITE_KASKIER_BASEURL
    }?${queryParams.toString()}`;

    window.open(payUrl, "_self", "noopener,noreferrer");
  };
  return (
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      className="relative z-10"
    >
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity duration-500 ease-in-out data-[closed]:opacity-0"
      />

      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
            <DialogPanel
              transition
              className="pointer-events-auto w-screen max-w-md transform transition duration-500 ease-in-out data-[closed]:translate-x-full sm:duration-700"
            >
              <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                  <div className="flex items-start justify-between">
                    <DialogTitle className="text-lg font-medium text-gray-900">
                      Shopping cart
                    </DialogTitle>
                    <div className="ml-3 flex h-7 items-center">
                      <button
                        type="button"
                        onClick={() => setIsOpen(false)}
                        className="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
                      >
                        <span className="absolute -inset-0.5" />
                        <span className="sr-only">Close panel</span>
                        <XMarkIcon aria-hidden="true" className="h-6 w-6" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-8">
                    <div className="flow-root">
                      <ul
                        role="list"
                        className="-my-6 divide-y divide-gray-200"
                      >
                        {cart.map((product) => (
                          <div
                            className="flex gap-x-4 py-2 lg:px-6 border-b border-gray-200 w-full font-light text-gray-500"
                            key={product.id}
                          >
                            <div className="w-full min-h-[150px] flex items-center gap-x-4">
                              <img
                                className="max-w-[80px]"
                                src={product.imageUrl}
                                alt=""
                              />
                              <div className="w-full flex flex-col">
                                <div className="flex justify-between mb-2">
                                  <Link
                                    to={`/product/${product.id}`}
                                    className="text-sm uppercase font-medium max-w-[240px] text-primary hover:underline"
                                  >
                                    {product.name}
                                  </Link>
                                  <div
                                    onClick={() => removeFromCart(product.id)}
                                    className="text-xl cursor-pointer"
                                  >
                                    <IoMdClose className="text-gray-500 hover:text-red-500 transition" />
                                  </div>
                                </div>
                                <div className="flex gap-x-2 h-[36px] text-sm">
                                  <div className="flex flex-1 max-w-[100px] items-center h-full border text-primary font-medium">
                                    <div
                                      onClick={() => decreaseAmount(product.id)}
                                      className="h-full flex-1 flex justify-center items-center cursor-pointer"
                                    >
                                      <IoMdRemove />
                                    </div>
                                    <div className="h-full flex justify-center items-center px-2">
                                      {product.amount}
                                    </div>
                                    <div
                                      onClick={() => increaseAmount(product.id)}
                                      className="h-full flex flex-1 justify-center items-center cursor-pointer"
                                    >
                                      <IoMdAdd />
                                    </div>
                                  </div>
                                  <div className="flex flex-1 justify-around items-center">
                                    $ {product.price}
                                  </div>
                                  <div className="flex flex-1 justify-end items-center text-primary font-medium">
                                    {`$ ${parseFloat(
                                      product.price * product.amount
                                    ).toFixed(2)}`}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                  <div className="flex justify-between text-base font-medium text-gray-900">
                    <p>Subtotal</p>
                    <p>${total}</p>
                  </div>
                  <p className="mt-0.5 text-sm text-gray-500">
                    Shipping and taxes calculated at checkout.
                  </p>
                  <div className="mt-6">
                    <a
                      onClick={handleCheckout}
                      className={`flex items-center justify-center rounded-md border border-transparent px-6 py-3 text-base font-medium text-white shadow-sm ${
                        total === 0
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-indigo-600 hover:bg-indigo-700 cursor-pointer"
                      }`}
                    >
                      Checkout
                    </a>
                  </div>
                  <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                    <p>
                      or
                      <button
                        type="button"
                        onClick={() => setIsOpen(false)}
                        className="font-medium text-indigo-600 hover:text-indigo-500"
                      >
                        Continue Shopping
                        <span aria-hidden="true"> &rarr;</span>
                      </button>
                    </p>
                  </div>
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
