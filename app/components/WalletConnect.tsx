"use client";

import { useState } from "react";

declare global {
  interface Window {
    freighterApi?: any;
  }
}

export default function WalletConnect() {
  const [publicKey, setPublicKey] = useState<string | null>(null);

  // Connect Wallet
  const connectWallet = async () => {
    try {
      if (!window.freighterApi) {
        alert("⚠️ Freighter Wallet not installed or not detected!");
        return;
      }
      const pk = await window.freighterApi.getPublicKey();
      console.log("Connected PK:", pk);
      setPublicKey(pk);
    } catch (err) {
      console.error("Wallet connection failed:", err);
    }
  };

  // Send Payment
  const sendPayment = async () => {
    if (!publicKey) {
      alert("Please connect wallet first!");
      return;
    }

    try {
      const receiver = "GBZXN7PIRZGNMHGA72YMRXQNNYQFJVRMFDJZ6A3BGJN5YUTIVVJ6WFXM";

      const res = await fetch("/api/build-payment/submit-xdr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sender: publicKey, receiver, amount: "1" }),
      });

      const data = await res.json();
      console.log("Server Response:", data);

      if (!data.xdr) {
        alert("Error building transaction");
        return;
      }

      const signed = await window.freighterApi.signAndSubmitTransaction(data.xdr, {
        network: "TESTNET", // Make sure wallet also set to Testnet
      });

      console.log("Transaction result:", signed);
      alert("✅ Transaction Successful: " + signed.hash);
    } catch (err) {
      console.error("Payment error:", err);
      alert("❌ Payment failed");
    }
  };

  return (
    <div className="p-4 border rounded-xl bg-gray-100">
      <h2 className="text-lg font-bold mb-2">Stellar Wallet</h2>

      {publicKey ? (
        <>
          <p className="text-green-600">✅ Connected: {publicKey}</p>

          <button
            onClick={sendPayment}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Send 1 USDC
          </button>
        </>
      ) : (
        <button
          onClick={connectWallet}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Connect Freighter
        </button>
      )}
    </div>
  );
}

