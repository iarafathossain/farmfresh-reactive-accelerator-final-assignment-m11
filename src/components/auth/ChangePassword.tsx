"use client";

import { doChangePassword } from "@/actions/auth";
import { useForm } from "@/hooks/useForm";
import { useFormSubmit } from "@/hooks/useFormSubmit";
import { validateChangePassword } from "@/validations/validateChangePassword";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Field from "../common/Field";
import Button from "../ui/Button";

const initialValues = {
  currentPassword: "",
  newPassword: "",
  newConfirmPassword: "",
};

const ChangePassword = () => {
  const [showCurrentPass, setShowCurrentPass] = useState<boolean>(false);
  const [showNewPass, setShowNewPass] = useState<boolean>(false);
  const [showNewConfirmPass, setShowNewConfirmPass] = useState<boolean>(false);

  const { loading, submitForm } = useFormSubmit({
    successMessage: "Password updated successfully!",
    onSuccess: () => {
      resetForm();
    },
  });

  const {
    values: formValues,
    touched,
    errors,
    handleChange,
    handleBlur,
    handleSubmit: formikHandleSubmit,
    resetForm,
  } = useForm({
    initialValues,
    validate: validateChangePassword,
    onSubmit: async (values) => {
      await submitForm(values, doChangePassword);
    },
  });
  return (
    <form className="space-y-3" onSubmit={formikHandleSubmit}>
      <Field error={touched.currentPassword && errors.currentPassword}>
        <label
          htmlFor="currentPassword"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Current Password
        </label>
        <div className="relative">
          <input
            id="currentPassword"
            name="currentPassword"
            type={showCurrentPass ? "text" : "password"}
            value={formValues.currentPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            placeholder="••••••••"
          />
          <button
            onClick={() => setShowCurrentPass((prev) => !prev)}
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            {showCurrentPass ? (
              <FaEye className="text-gray-400 hover:text-gray-600" />
            ) : (
              <FaEyeSlash className="text-gray-400 hover:text-gray-600" />
            )}
          </button>
        </div>
      </Field>

      <Field error={touched.newPassword && errors.newPassword}>
        <label
          htmlFor="newPassword"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          New Password
        </label>
        <div className="relative">
          <input
            id="newPassword"
            name="newPassword"
            type={showNewPass ? "text" : "password"}
            value={formValues.newPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            placeholder="••••••••"
          />
          <button
            onClick={() => setShowNewPass((prev) => !prev)}
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            {showCurrentPass ? (
              <FaEye className="text-gray-400 hover:text-gray-600" />
            ) : (
              <FaEyeSlash className="text-gray-400 hover:text-gray-600" />
            )}
          </button>
        </div>
      </Field>
      <Field error={touched.newConfirmPassword && errors.newConfirmPassword}>
        <label
          htmlFor="newConfirmPassword"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          New Confirm Password
        </label>
        <div className="relative">
          <input
            id="newConfirmPassword"
            name="newConfirmPassword"
            type={showNewConfirmPass ? "text" : "password"}
            value={formValues.newConfirmPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            placeholder="••••••••"
          />
          <button
            onClick={() => setShowNewConfirmPass((prev) => !prev)}
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            {showCurrentPass ? (
              <FaEye className="text-gray-400 hover:text-gray-600" />
            ) : (
              <FaEyeSlash className="text-gray-400 hover:text-gray-600" />
            )}
          </button>
        </div>
      </Field>
      <Button label="Change Password" loading={loading} fullWidth={false} />
    </form>
  );
};

export default ChangePassword;
