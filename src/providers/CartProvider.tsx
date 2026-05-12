"use client";

import { CartContext } from "@/context";
import { cartReducer, initialCartState } from "@/reducers/cartReducer";
import { createCartService } from "@/services/CartService";
import { ICartFrontend, IProductFrontend } from "@/types";
import { fetchData } from "@/utils/fetchData";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useReducer, useRef, useState } from "react";
import { showToast } from "./ToastProvider";

const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(cartReducer, initialCartState);
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [err, setErr] = useState<string | null>(null);
  type DispatchAction = Parameters<typeof dispatch>[0];

  const router = useRouter();
  const { data: session, status } = useSession();
  const customerId = session?.user?.id;
  const cartServiceRef = useRef<ReturnType<typeof createCartService> | null>(
    null,
  );

  // Initialize cart service
  useEffect(() => {
    if (!customerId) return;

    const service = createCartService({
      customerId,
      onDispatch: (action) => {
        dispatch(action as unknown as DispatchAction);
      },
      onError: (error) => {
        setErr(error);
        showToast(error, "ERROR");
      },
      onFetchCart: () => fetchData(`/api/cart?customerId=${customerId}`),
    });

    cartServiceRef.current = service;
  }, [customerId]);

  // Load initial cart
  useEffect(() => {
    if (status !== "authenticated" || !customerId || !cartServiceRef.current)
      return;

    const loadCart = async () => {
      try {
        const data = (await cartServiceRef.current!.fetchInitialCart()) as {
          cart?: ICartFrontend;
        };
        if (data?.cart) {
          dispatch({ type: "SET_CART", payload: data.cart });
        }
      } catch {
        // Error already handled by service
      }
    };

    loadCart();
  }, [status, customerId]);

  // Main cart update handler
  const updateCart = async (
    action: "ADD_ITEM" | "INCREMENT" | "DECREMENT" | "REMOVE_ITEM",
    payload: IProductFrontend | string,
  ): Promise<void> => {
    if (status === "loading") {
      showToast("Please wait, checking login...", "WARNING");
      return;
    }

    if (status === "unauthenticated" || !customerId) {
      showToast("Please login to add to cart.", "WARNING");
      router.push("/login");
      return;
    }

    if (session?.user?.role === "Farmer") {
      showToast("Only customer can add to cart.");
      return;
    }

    if (!cartServiceRef.current) return;

    // Delegate to appropriate service method
    switch (action) {
      case "ADD_ITEM":
        await cartServiceRef.current.addItem(
          payload as IProductFrontend,
          setLoading,
        );
        break;
      case "INCREMENT":
      case "DECREMENT":
        await cartServiceRef.current.updateQuantity(
          action,
          payload as string,
          setLoading,
        );
        break;
      case "REMOVE_ITEM":
        await cartServiceRef.current.removeItem(payload as string, setLoading);
        break;
    }
  };

  return (
    <CartContext.Provider
      value={{ cart: state, updateCart, error: err, loading }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
