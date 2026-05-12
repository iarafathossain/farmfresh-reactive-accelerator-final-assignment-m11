import { useState } from "react";
import { showToast } from "@/providers/ToastProvider";
import { useCatchErr } from "./useCatchErr";
import { catchErr as catchErrorUtil } from "@/utils/catchErr";

interface FormSubmitConfig<T extends object = Record<string, unknown>> {
  buildFormData?: (values: T) => FormData;
  onSuccess?: (response: unknown) => void | Promise<void>;
  onError?: (error: string) => void;
  successMessage?: string;
  errorMessage?: string;
}

interface FormSubmitResponse<T extends object = Record<string, unknown>> {
  loading: boolean;
  error: string | null;
  submitForm: (values: T, submitAction: (fd: FormData) => Promise<unknown>) => Promise<void>;
}

/**
 * Shared form submission hook to reduce duplication across forms.
 * Handles FormData building, loading state, error handling, and toast notifications.
 */
export const useFormSubmit = <T extends object = Record<string, unknown>>(
  config: FormSubmitConfig<T> = {}
): FormSubmitResponse<T> => {
  const [loading, setLoading] = useState(false);
  const { setErr } = useCatchErr();
  const [error, setError] = useState<string | null>(null);
  const {
    buildFormData,
    onSuccess,
    onError,
    successMessage = "Operation successful!",
    errorMessage = "An error occurred. Please try again.",
  } = config;

  const defaultBuildFormData = (values: T): FormData => {
    const formData = new FormData();
    for (const [key, value] of Object.entries(values)) {
      if (Array.isArray(value)) {
        value.forEach((v) =>
          formData.append(key, v instanceof File ? v : String(v))
        );
      } else if (value !== null && value !== undefined) {
        formData.append(key, String(value));
      }
    }
    return formData;
  };

  const submitForm = async (
    values: T,
    submitAction: (fd: FormData) => Promise<unknown>
  ): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const formData = buildFormData ? buildFormData(values) : defaultBuildFormData(values);
      const response = await submitAction(formData);

      // Handle different response shapes
      if (typeof response === "object" && response !== null) {
        const res = response as Record<string, unknown>;
        if (res.success === false) {
          const errMsg = (res.error as string) || errorMessage;
          setError(errMsg);
          setErr(errMsg);
          showToast(errMsg, "ERROR");
          onError?.(errMsg);
          return;
        }
        if (res.error) {
          showToast("Wrong Credentials!", "ERROR");
          return;
        }
      }

      showToast(successMessage, "SUCCESS");
      onSuccess?.(response);
    } catch (error) {
      const errMsg = catchErrorUtil(error).error || errorMessage;
      setError(errMsg);
      setErr(errMsg);
      showToast(errMsg, "ERROR");
      onError?.(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, submitForm };
};
