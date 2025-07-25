// components/ToastAlert.tsx
"use client";

import { useEffect, useState } from "react";

type Props = {
  message: string;
  type?: "error" | "success" | "info";
};

export default function ToastAlert({ message, type = "info" }: Props) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  const color =
    type === "error"
      ? "bg-red-600"
      : type === "success"
      ? "bg-green-600"
      : "bg-blue-600";

  return (
    <div className={`fixed bottom-6 right-6 px-4 py-2 rounded shadow-lg text-white ${color}`}>
      {message}
    </div>
  );
}
