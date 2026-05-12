"use client";

import { doCredentialLogIn } from "@/actions/auth";
import { useForm } from "@/hooks/useForm";
import { useFormSubmit } from "@/hooks/useFormSubmit";
import { IUserLoginForm } from "@/types";
import { validateLoginForm } from "@/validations/validateLoginForm";
import { useState } from "react";
import { FaEyeSlash } from "react-icons/fa";
import { FaEnvelope, FaEye, FaLock } from "react-icons/fa6";
import Field from "../common/Field";
import Button from "../ui/Button";
import GoogleAuth from "./GoogleAuth";

const initialValues: IUserLoginForm = {
  email: "",
  password: "",
};

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const { loading, submitForm } = useFormSubmit<IUserLoginForm>({
    successMessage: "Login successful!",
    onSuccess: () => {
      resetForm();
      window.location.href = "/my-orders";
    },
  });

  const {
    values: formValues,
    resetForm,
    touched,
    errors,
    handleBlur,
    handleChange,
    handleSubmit: formikHandleSubmit,
  } = useForm<IUserLoginForm>({
    initialValues,
    validate: validateLoginForm,
    onSubmit: async (values) => {
      await submitForm(values, doCredentialLogIn);
    },
  });

  return (
    <>
      <form className="space-y-6" onSubmit={formikHandleSubmit}>
        <Field error={touched.email && errors.email}>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Email Address
          </label>
          <div className="relative">
            <input
              value={formValues.email}
              onChange={handleChange}
              onBlur={handleBlur}
              id="email"
              name="email"
              type="email"
              required
              className="w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="john@example.com"
            />
            <FaEnvelope className="absolute left-3 top-3.5 text-gray-400" />
          </div>
        </Field>

        <Field error={touched.password && errors.password}>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Password
          </label>
          <div className="relative">
            <input
              value={formValues.password}
              onChange={handleChange}
              onBlur={handleBlur}
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              className="w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="••••••••"
            />
            <FaLock className="absolute left-3 top-3.5 text-gray-400" />
            <button
              onClick={() => setShowPassword((prev) => !prev)}
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showPassword ? (
                <FaEye className="text-gray-400 hover:text-gray-600" />
              ) : (
                <FaEyeSlash className="text-gray-400 hover:text-gray-600" />
              )}
            </button>
          </div>
        </Field>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember"
              name="remember"
              type="checkbox"
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label
              htmlFor="remember"
              className="ml-2 text-sm text-gray-600 dark:text-gray-400"
            >
              Remember me
            </label>
          </div>
          <a
            href="/forgot-password"
            className="text-sm text-primary-600 hover:text-primary-500"
          >
            Forgot password?
          </a>
        </div>

        <Button label="Sign In" loading={loading} hasSpinner={true} />

        {/* <!-- Divider --> */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
              Or continue with
            </span>
          </div>
        </div>

        {/* <!-- Social Login --> */}
        <GoogleAuth />
      </form>
    </>
  );
};

export default LoginForm;
