"use server";

import { signIn, signOut } from "@/auth";
import { connectDB } from "@/libs/connectDB";
import { Reset } from "@/models/resetPasswordModel";
import { User } from "@/models/userModel";
import { createUser } from "@/queries/user";
import { uploadImage } from "@/services/UploadImage";
import {
  IResetForm,
  IResetPassword,
  IUserDB,
  IUserRegistrationForm,
} from "@/types";
import { catchErr } from "@/utils/catchErr";
import { getBaseUrl } from "@/utils/getBaseUrl";
import { getUserSession } from "@/utils/getUserSession";
import { transformMongoDoc } from "@/utils/transformMongoDoc";
import { validateChangePassword } from "@/validations/validateChangePassword";
import { validateRegistrationForm } from "@/validations/validateRegistrationForm";
import { validateResetForm } from "@/validations/validateResetForm";
import bcrypt from "bcryptjs";
import { getUserByEmail } from "./../../queries/user/index";

// Perform registration
export const doRegistration = async (formData: FormData) => {
  await connectDB();
  try {
    const formValues = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      address: formData.get("address"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
      role: formData.get("role"),
      bio: formData.get("bio"),
      avatar: formData.get("avatar"),
      farmName: formData.get("farmName"),
      farmSize: formData.get("farmSize"),
      farmSizeUnit: formData.get("farmSizeUnit"),
      specialization: formData.get("specialization"),
      terms: formData.get("terms") === "true" || formData.get("terms") === "on",
      farmDistrict: formData.get("farmDistrict"),
      farmAddress: formData.get("farmAddress"),
    } as IUserRegistrationForm;

    // run validation
    const validationErrors = validateRegistrationForm(formValues);
    if (
      validationErrors &&
      Object.values(validationErrors).some((field) => field)
    ) {
      throw new Error(Object.values(validationErrors)[0]!); // return first err
    }

    const {
      firstName,
      lastName,
      email,
      phone,
      address,
      password,
      role,
      bio,
      avatar,
      farmName,
      farmSize,
      farmSizeUnit,
      specialization,
      farmDistrict,
      farmAddress,
    } = formValues;

    // Reject duplicate
    const exist = await getUserByEmail(email);
    if (exist) throw new Error("This email already exists.");

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // build the payload (no farms fields for the customer)
    const payload: Omit<IUserDB, "id"> = {
      role,
      firstName,
      lastName,
      email,
      phone,
      bio,
      address,
      password: hashedPassword,
      terms: true,
    };

    if (role === "Farmer") {
      if (farmName) payload.farmName = farmName;
      if (specialization) payload.specialization = specialization;
      if (farmSize) payload.farmSize = farmSize;
      if (farmSizeUnit) payload.farmSizeUnit = farmSizeUnit;
      if (farmDistrict) payload.farmDistrict = farmDistrict;
      if (farmAddress) payload.farmAddress = farmAddress;
    }

    // upload avatar
    if (avatar) {
      const upload = await uploadImage(avatar, "avatar");
      if (!upload.success) throw new Error(upload.error);
      payload.image = upload.secure_url;
    } else {
      payload.image = undefined;
    }

    // create user
    const created = await createUser(payload);
    return { success: true, userId: created._id.toString() };
  } catch (err: unknown) {
    if (err instanceof Error) {
      return { success: false, error: err.message };
    }
    if (typeof err === "string") {
      return { success: false, error: err };
    }
    return { success: false, error: "Unknown registration error" };
  }
};

// Perform credential login
export const doCredentialLogIn = async (formData: FormData) => {
  await connectDB();
  const result = await signIn("credentials", {
    email: formData.get("email"),
    password: formData.get("password"),
    redirect: false,
  });

  return result;
};

// Perform sing out
export const doSignOut = async () => {
  await connectDB();
  await signOut();
};

// Perform google auth
export const doSignIn = async () => {
  await connectDB();
  await signIn("google", { redirectTo: "/products" });
};

// Perform update profile
export const doUpdateProfile = async (formData: FormData) => {
  await connectDB();
  try {
    const email = formData.get("email");
    if (typeof email !== "string") {
      throw new Error("Email is required and must be string.");
    }
    const existingUser = await getUserByEmail(email);
    if (!existingUser) {
      throw new Error("Email does not exist.");
    }

    const userDataForUpdate: Record<string, unknown> = {};

    // upload avatar
    const avatar = formData.get("avatar");
    if (avatar && avatar instanceof File) {
      const upload = await uploadImage(avatar, "avatar");
      if (!upload.success) throw new Error(upload.error);
      userDataForUpdate.image = upload.secure_url;
    } else {
      userDataForUpdate.image = undefined;
    }

    for (const [key, value] of Object.entries(
      Object.fromEntries(formData.entries()),
    )) {
      if (
        typeof value === "string" &&
        existingUser[key as keyof typeof existingUser] !== value
      ) {
        userDataForUpdate[key] = value;
      }
    }

    delete userDataForUpdate["email"];

    const updatedUserWithMetaData = await User.findByIdAndUpdate(
      { _id: existingUser.id },
      userDataForUpdate,
      { new: true },
    ).lean();

    const updatedUserWithoutMetaData = transformMongoDoc(
      updatedUserWithMetaData,
    );

    return { success: true, updatedUser: updatedUserWithoutMetaData };
  } catch (error) {
    const errMsg = catchErr(error);
    return { success: false, err: errMsg };
  }
};

// Perform change password
export const doChangePassword = async (
  formData: FormData,
): Promise<{ success: boolean; message: string }> => {
  await connectDB();
  try {
    const currentPassword = formData.get("currentPassword") as string;
    const newPassword = formData.get("newPassword") as string;
    const newConfirmPassword = formData.get("newConfirmPassword") as string;

    const user = await getUserSession();

    if (!user || !user?.email) {
      throw new Error("Session expired. Please login again.");
    }

    const validationErr = validateChangePassword({
      currentPassword,
      newPassword,
      newConfirmPassword,
    });

    for (const value of Object.values(validationErr)) {
      if (value) {
        throw new Error("Please fill up the all required fields.");
      }
    }

    const existingUser = await getUserByEmail(user.email);

    if (!existingUser) {
      throw new Error("Bad Credentials");
    }

    if (newPassword !== newConfirmPassword) {
      throw new Error(
        "Please match the new password with new confirm password.",
      );
    }

    const isMatch = await bcrypt.compare(
      currentPassword,
      existingUser.password,
    );

    if (!isMatch) {
      throw new Error("Password does not match to current password.");
    }

    const hashedPassword = await bcrypt.hash(newConfirmPassword, 10);

    await User.findOneAndUpdate(
      { email: existingUser.email },
      { password: hashedPassword },
    );

    return { success: true, message: "Password updated successfully." };
  } catch (error) {
    const errMsg = catchErr(error);
    return { success: false, message: errMsg.error };
  }
};

// Perform reset password
export const doResetPassword = async (formData: FormData) => {
  await connectDB();
  try {
    const email = formData.get("email");
    const isExist = await getUserByEmail(email as string);

    if (!isExist) {
      throw new Error("This email does not exist.");
    }

    const userName =
      isExist.name ?? isExist.firstName + " " + isExist?.lastName;

    const res = await fetch(
      `${getBaseUrl()}/api/send-email/send-reset-password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, userName }),
      },
    );

    if (!res.ok) {
      throw new Error("Failed to send reset key link.");
    }

    const data = await res.json();

    return { success: true, message: data.message, email };
  } catch (error) {
    const errMsg = catchErr(error);
    return { success: false, message: errMsg.error };
  }
};

// Perform verify reset key
export const doVerifyResetKey = async (
  formData: FormData,
): Promise<{ success: boolean; message: string }> => {
  await connectDB();
  try {
    const formValues: IResetForm = {
      email: formData.get("email") as string,
      resetKey: formData.get("resetKey") as string,
      newPassword: formData.get("newPassword") as string,
      confirmPassword: formData.get("confirmPassword") as string,
    };

    // run validation
    const validationErrors = validateResetForm(formValues);

    if (
      validationErrors &&
      Object.values(validationErrors).some((field) => field)
    ) {
      throw new Error(Object.values(validationErrors)[0]!); // return first err
    }

    const isExist = await Reset.findOne({
      email: formValues.email,
    }).lean<IResetPassword>();

    if (!isExist) {
      throw new Error("This reset key does not exist.");
    }

    const user = await getUserByEmail(formValues.email);
    if (!user) {
      throw new Error("This user does not exist.");
    }
    const userName = user.name ?? user.firstName + " " + user?.lastName;

    // verify reset key
    if (isExist.resetKey !== formValues.resetKey) {
      throw new Error("This reset key does not match.");
    }

    // hash password
    const hashPassword = await bcrypt.hash(formValues.confirmPassword, 10);

    // update the password
    await User.findOneAndUpdate(
      { email: formValues.email },
      { password: hashPassword },
      { new: true },
    );

    // delete this reset key
    await Reset.findByIdAndDelete(isExist._id);

    // send success mail
    await fetch(`${getBaseUrl()}/api/send-email/send-reset-success`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: formValues.email, userName }),
    });

    return { success: true, message: "Password updated successfully." };
  } catch (error) {
    const errMsg = catchErr(error);
    return { success: false, message: errMsg.error };
  }
};
