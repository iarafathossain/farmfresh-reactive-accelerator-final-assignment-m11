import Link from "next/link";
import { FaEnvelope, FaUserPlus } from "react-icons/fa6";

const CTA = () => {
  return (
    <div className="bg-gray-100 dark:bg-gray-800 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Get in Touch
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
          Have questions about our platform or want to learn more about
          partnering with us?
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="mailto:info@farmfresh.com"
            className="inline-flex items-center justify-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition"
          >
            <FaEnvelope className="mr-2" />
            Contact Us
          </a>
          <Link
            href="/register"
            className="inline-flex items-center justify-center px-6 py-3 border border-primary-600 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900 rounded-lg font-medium transition"
          >
            <FaUserPlus className="mr-2" />
            Join as Farmer
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CTA;
