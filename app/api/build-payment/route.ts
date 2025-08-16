// pages/api/build-payment.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { Server, Networks, TransactionBuilder, Operation, Asset, Keypair } from "stellar-sdk";

const HORIZON_URL = "https://horizon-testnet.stellar.org";
const server = new Server(HORIZON_URL);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== "POST") return res.status(405).end();

    const { senderPublicKey, destination, amount, assetCode, assetIssuer } = req.body;
    if (!senderPublicKey || !destination || !amount) {
      return res.status(400).json({ error: "missing params" });
    }

    // load account sequence
    const account = await server.loadAccount(senderPublicKey);

    // choose asset (native XLM if no assetCode)
    const asset = assetCode && assetIssuer ? new Asset(assetCode, assetIssuer) : Asset.native();

    const tx = new TransactionBuilder(account, {
      fee: (await server.fetchBaseFee()).toString(),
      networkPassphrase: Networks.TESTNET,
    })
      .addOperation(
        Operation.payment({
          destination,
          asset,
          amount: amount.toString(),
        })
      )
      .setTimeout(180)
      .build();

    // Return XDR for client to sign
    const xdr = tx.toXDR();
    return res.status(200).json({ xdr, network: "TESTNET" });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: err.message || err });
  }
}
