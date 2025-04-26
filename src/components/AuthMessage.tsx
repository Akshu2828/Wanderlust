"use client";

import { useSearchParams } from "next/navigation";

const AuthMessage = () => {
  const searchParams = useSearchParams();
  const authMessage = searchParams.get("message");

  if (!authMessage) return null;

  return (
    <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
      {authMessage}
    </div>
  );
};

export default AuthMessage;
