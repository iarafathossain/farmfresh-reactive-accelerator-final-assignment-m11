"use client";

import { showToast } from "@/providers/ToastProvider";
import { IOrderFronted } from "@/types";
import { catchErr } from "@/utils/catchErr";
import { FormEvent, useState } from "react";
import { FaDownload } from "react-icons/fa";
import Button from "../ui/Button";

const DownloadReceipt = ({ order }: { order: IOrderFronted }) => {
  const [loading, setLoading] = useState<boolean>(false);

  const handleDownloadPDF = async (e: FormEvent) => {
    e.preventDefault();

    setLoading(true);
    try {
      const response = await fetch("/api/send-email/order-invoice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ order }),
      });

      if (!response.ok) {
        setLoading(false);
        throw new Error("Failed to download the receipt.");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `receipt-${order.id}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      setLoading(false);
    } catch (error) {
      const errMsg = catchErr(error);
      showToast(errMsg.error, "ERROR");
      setLoading(false);
    }
  };
  return (
    <form onSubmit={handleDownloadPDF} className="w-full max-w-xs">
      <Button
        label="Download Receipt (PDF)"
        loading={loading}
        hasSpinner={true}
        icon={<FaDownload className="mr-2" />}
        loadingText="Downloading..."
      />
    </form>
  );
};

export default DownloadReceipt;
