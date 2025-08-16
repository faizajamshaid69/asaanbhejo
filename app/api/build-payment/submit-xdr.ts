// pages/api/submit-xdr.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { Server } from "stellar-sdk";
const server = new Server("https://horizon-testnet.stellar.org");

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { signedXdr } = req.body;
    if (!signedXdr) return res.status(400).json({ error: "missing signedXdr" });

    const tx = await server.submitTransaction(signedXdr);
    return res.status(200).json({ txHash: tx.hash });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: err.response?.data || err.message });
  }
}
