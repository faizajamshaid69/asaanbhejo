import { NextRequest, NextResponse } from "next/server";
import { Server, Networks, TransactionBuilder, Operation, Asset, Keypair } from "stellar-sdk";

// Horizon testnet server
const server = new Server("https://horizon-testnet.stellar.org");

// Issuer (USDC testnet address) – Example (Circle’s USDC issuer on testnet)
const USDC = new Asset(
  "USDC",
  "GA5ZSE7GYTGD5KUXYVFSX2CK3NVC7ZR2NK7O34DBQS54V6GJHNS4PSTK" // USDC testnet issuer
);

export async function POST(req: NextRequest) {
  try {
    const { sender, receiver, amount } = await req.json();

    // Load sender account from Stellar
    const account = await server.loadAccount(sender);

    // Create transaction
    const tx = new TransactionBuilder(account, {
      fee: await server.fetchBaseFee(),
      networkPassphrase: Networks.TESTNET,
    })
      .addOperation(
        Operation.payment({
          destination: receiver,
          asset: USDC,
          amount: amount, // Example: "1"
        })
      )
      .setTimeout(30)
      .build();

    // Convert to XDR for signing in Freighter
    return NextResponse.json({ xdr: tx.toXDR() });
  } catch (err: any) {
    console.error("Error building transaction:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
