"use client";
import React from "react";

async function gql<T>(query: string, variables: any) {
  const url = process.env.NEXT_PUBLIC_BFF_URL || "http://localhost:4000/graphql";
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables })
  });
  return res.json() as Promise<{ data: T }>;
}

export default function BillingPage() {
  const [accountId, setAccountId] = React.useState<string>("");
  const [amountCents, setAmountCents] = React.useState<number>(10000);
  const [channel, setChannel] = React.useState<string>("telebirr");
  const [summary, setSummary] = React.useState<any>(null);
  const [intent, setIntent] = React.useState<string>("");

  const fetchSummary = async () => {
    if (!accountId) return;
    const q = `query($accountId: ID!) { myBilling(accountId: $accountId) { balanceCents currency receipts { id amountCents channel settledAt } } }`;
    const { data } = await gql<{ myBilling: any }>(q, { accountId });
    setSummary(data.myBilling);
  };

  const initiate = async () => {
    const m = `mutation($accountId: ID!, $amountCents: Int!, $channel: String!) { initiatePayment(accountId:$accountId, amountCents:$amountCents, channel:$channel) }`;
    const { data } = await gql<{ initiatePayment: string }>(m, { accountId, amountCents, channel });
    setIntent(data.initiatePayment);
    alert(`Payment initiated (stub). Intent: ${data.initiatePayment}`);
  };

  const simulateWebhook = async () => {
    // direct to payments-adapter stub
    const url = (process.env.NEXT_PUBLIC_PAYMENTS_BASE || "http://localhost:4002") + "/payments/webhooks/" + channel;
    const txnRef = "SIM-" + Date.now();
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accountId, amountCents, txnRef })
    });
    await fetchSummary();
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">Billing (Stub)</h1>
      <div className="flex gap-2">
        <input className="border p-2" placeholder="Account ID" value={accountId} onChange={e => setAccountId(e.target.value)} />
        <button className="px-3 py-2 bg-emerald-600 text-white rounded" onClick={fetchSummary}>Fetch</button>
      </div>
      {summary && (
        <div className="space-y-2">
          <div>Balance: ETB {(summary.balanceCents/100).toFixed(2)} ({summary.currency})</div>
          <div>
            <h2 className="font-medium">Receipts</h2>
            <ul className="list-disc pl-6">
              {summary.receipts.map((r:any) => (
                <li key={r.id}>{r.channel} — ETB {(r.amountCents/100).toFixed(2)} — {new Date(r.settledAt).toLocaleString()}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
      <div className="space-y-2">
        <h2 className="font-medium">Pay (stub)</h2>
        <div className="flex gap-2">
          <input className="border p-2" type="number" value={amountCents} onChange={e => setAmountCents(parseInt(e.target.value,10))}/>
          <select className="border p-2" value={channel} onChange={e => setChannel(e.target.value)}>
            <option value="telebirr">Telebirr</option>
            <option value="mpesa">M-Pesa</option>
          </select>
          <button className="px-3 py-2 bg-indigo-600 text-white rounded" onClick={initiate}>Initiate</button>
          <button className="px-3 py-2 bg-gray-700 text-white rounded" onClick={simulateWebhook}>Simulate webhook (settle)</button>
        </div>
        {intent && <div className="text-xs text-slate-500">Last intent: {intent}</div>}
      </div>
    </div>
  );
}