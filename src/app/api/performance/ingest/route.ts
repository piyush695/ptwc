import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const { accountNumber, balance, equity } = await req.json();

  if (!accountNumber || balance == null || equity == null) {
    return NextResponse.json({ error: "accountNumber, balance, equity required" }, { status: 400 });
  }

  const account = await prisma.tradingAccount.findUnique({ where: { accountNumber } });
  if (!account) return NextResponse.json({ error: "Account not found" }, { status: 404 });

  const opening = Number(account.openingBalance);
  const peak = Math.max(Number(account.peakBalance), Number(equity));
  const dd = peak > 0 ? (peak - Number(equity)) / peak : 0;

  await prisma.tradingAccount.update({
    where: { id: account.id },
    data: {
      currentBalance: balance,
      currentEquity: equity,
      peakBalance: peak,
      maxDrawdown: Math.max(Number(account.maxDrawdown), dd),
      lastSyncAt: new Date(),
    },
  });

  return NextResponse.json({ ok: true, pnl: Number(equity) - opening, dd });
}
