// components/WalletConnect.tsx
import { useEffect, useState } from "react";
import { isConnected, connect, getPublicKey } from "@stellar/freighter-api";
import axios from "axios";

export default function WalletConnect() {
  const [connected, setConnected] = useState(false);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    (async () => {
      if (window && (window as any).freighterApi) {
        const c = await isConnected();
        setConnected(c);
        if (c) {
          const pk = await getPublicKey();888888888888jum 
          setPublicKey(pk);
        }
      }
    })();
  }, []);

  const handleConnect = async () => {
    try {
      // triggers Freighter connection flow (opens extension)
      await connect();
      const pk = await getPublicKey();
      setPublicKey(pk);
      setConnected(true);
      setStatus(`Connected ${pk}`);
    } catch (e: any) {
      setStatus("Connect failed: " + e.message);
    }
  };

  const sendTestPayment = async () => {
    if (!publicKey) return setStatus("Connect wallet first");
    try {
      setStatus("Building transaction…");
      // For demo: destination is another testnet pubkey or one you choose
      const dest = "G...DESTINATION_PUBLIC_KEY..."; // replace or prompt user
      const amount = "10"; // 10 XLM

      // 1) Ask server to build unsigned transaction XDR for the sender public key
      const r = await axios.post("/api/build-payment", {
        senderPublicKey: publicKey,
        destination: dest,
        amount,
      });

      const { xdr } = r.data;

      // 2) Ask Freighter to sign the transaction XDR
      // freighterApi.signTransaction expects network passphrase
      const freighter = (window as any).freighterApi;
      setStatus("Signing transaction in Freighter...");
      const signed = await freighter.signTransaction(xdr, "TESTNET");

      // signed is { signature: '...', xdr: '...' } or contains signedTx
      // You can submit signed transaction via Horizon:
      setStatus("Submitting transaction...");
      const submitRes = await axios.post("/api/submit-xdr", { signedXdr: signed.xdr });
      setStatus("Transaction submitted: " + submitRes.data.txHash);
    } catch (err: any) {
      console.error(err);
      setStatus("Error: " + (err?.response?.data?.error || err.message));
    }
  };

  return (
    <div className="space-y-3">
      <div>Status: {status}</div>
      {!connected ? (
        <button onClick={handleConnect} className="px-4 py-2 bg-white text-blue-600 rounded">
          Connect Freighter
        </button>
      ) : (
        <>
          <div>Connected: {publicKey}</div>
          <button onClick={sendTestPayment} className="px-4 py-2 bg-white text-blue-600 rounded">
            Send Test Payment
          </button>
        </>
      )}
    </div>
  );
}
