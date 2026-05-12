/**
 * Cart service that encapsulates all cart operations.
 * Handles optimistic updates, rollback logic, and API communication.
 * Separates business logic from React state management.
 */

import { ICartFrontend, IProductFrontend } from "@/types";
import { catchErr } from "@/utils/catchErr";
import { fetchData } from "@/utils/fetchData";

export type CartReducerAction =
  | { type: "SET_CART"; payload: ICartFrontend }
  | { type: "ADD_ITEM"; payload: { product: IProductFrontend } }
  | { type: "INCREMENT"; payload: { productId: string } }
  | { type: "DECREMENT"; payload: { productId: string } }
  | { type: "REMOVE_ITEM"; payload: { productId: string } };

type CartMutationAction = Exclude<CartReducerAction, { type: "SET_CART" }>;

export interface CartServiceConfig {
  customerId: string;
  onDispatch: (action: CartReducerAction) => void;
  onError: (error: string) => void;
  onFetchCart: () => Promise<unknown>;
}

/**
 * Service for managing cart operations with optimistic updates and rollback.
 */
export const createCartService = (config: CartServiceConfig) => {
  const { customerId, onDispatch, onError, onFetchCart } = config;

  const handleOptimisticUpdate = async (
    action: CartMutationAction,
    loadingKey: string,
    setLoading: (
      fn: (prev: Record<string, boolean>) => Record<string, boolean>,
    ) => void,
    apiAction: "ADD_ITEM" | "INCREMENT" | "DECREMENT" | "REMOVE_ITEM",
  ) => {
    setLoading((prev) => ({ ...prev, [loadingKey]: true }));
    onDispatch(action);

    try {
      const productId =
        action.type === "ADD_ITEM"
          ? action.payload.product.id
          : action.payload.productId;

      await fetch(`/api/cart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId, productId, action: apiAction }),
      });
    } catch (error) {
      // Rollback: fetch latest cart state
      try {
        const data = (await fetchData(`/api/cart?customerId=${customerId}`)) as {
          cart: ICartFrontend;
        };
        onDispatch({ type: "SET_CART", payload: data?.cart });
      } catch {
        // Ignore if rollback also fails
      }
      const errMsg = catchErr(error).error;
      onError(errMsg);
    } finally {
      setLoading((prev) => ({ ...prev, [loadingKey]: false }));
    }
  };

  const addItem = async (
    product: IProductFrontend,
    setLoading: (
      fn: (prev: Record<string, boolean>) => Record<string, boolean>,
    ) => void,
  ) => {
    await handleOptimisticUpdate(
      { type: "ADD_ITEM", payload: { product } },
      product.id,
      setLoading,
      "ADD_ITEM",
    );
  };

  const updateQuantity = async (
    action: "INCREMENT" | "DECREMENT",
    productId: string,
    setLoading: (
      fn: (prev: Record<string, boolean>) => Record<string, boolean>,
    ) => void,
  ) => {
    await handleOptimisticUpdate(
      { type: action, payload: { productId } },
      productId,
      setLoading,
      action,
    );
  };

  const removeItem = async (
    productId: string,
    setLoading: (
      fn: (prev: Record<string, boolean>) => Record<string, boolean>,
    ) => void,
  ) => {
    await handleOptimisticUpdate(
      { type: "REMOVE_ITEM", payload: { productId } },
      productId,
      setLoading,
      "REMOVE_ITEM",
    );
  };

  const fetchInitialCart = async () => {
    try {
      return await onFetchCart();
    } catch (error) {
      const errMsg = catchErr(error).error;
      onError(errMsg);
      throw error;
    }
  };

  return {
    addItem,
    updateQuantity,
    removeItem,
    fetchInitialCart,
  };
};

export type CartService = ReturnType<typeof createCartService>;
