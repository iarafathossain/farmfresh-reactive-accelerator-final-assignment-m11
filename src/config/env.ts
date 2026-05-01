const required = (name: string, value: string | undefined) => {
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }

  return value;
};

const baseUrl = (() => {
  const configuredBaseUrl = process.env.BASE_URL;

  if (configuredBaseUrl) {
    return configuredBaseUrl.replace(/\/$/, "");
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return "http://localhost:3000";
})();

const smtpUser = process.env.SMTP_USER;

export const env = {
  get baseUrl() {
    return baseUrl;
  },
  get mongoConnectionString() {
    return required(
      "MONGO_CONNECTION_STRING",
      process.env.MONGO_CONNECTION_STRING,
    );
  },
  cloudinary: {
    get cloudName() {
      return required(
        "CLOUDINARY_CLOUD_NAME",
        process.env.CLOUDINARY_CLOUD_NAME,
      );
    },
    get apiKey() {
      return required("CLOUDINARY_API_KEY", process.env.CLOUDINARY_API_KEY);
    },
    get apiSecret() {
      return required(
        "CLOUDINARY_API_SECRET",
        process.env.CLOUDINARY_API_SECRET,
      );
    },
  },
  auth: {
    get nextAuthSecret() {
      return required("NEXTAUTH_SECRET", process.env.NEXTAUTH_SECRET);
    },
    get googleClientId() {
      return required("GOOGLE_CLIENT_ID", process.env.GOOGLE_CLIENT_ID);
    },
    get googleClientSecret() {
      return required("GOOGLE_CLIENT_SECRET", process.env.GOOGLE_CLIENT_SECRET);
    },
  },
  smtp: {
    get host() {
      return required("SMTP_HOST", process.env.SMTP_HOST);
    },
    get port() {
      return Number(process.env.SMTP_PORT || 587);
    },
    get user() {
      return required("SMTP_USER", smtpUser);
    },
    get pass() {
      return required("SMTP_PASS", process.env.SMTP_PASS);
    },
    get from() {
      return process.env.MAIL_FROM || required("SMTP_USER", smtpUser);
    },
  },
} as const;
