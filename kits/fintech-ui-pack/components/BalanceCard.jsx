export default function BalanceCard({ balance = 12450.80, currency = '$' }) {
  return (
    <div className="rounded-3xl bg-zinc-900 border border-zinc-800 p-6 text-white max-w-sm shadow-xl">
      <span className="text-xs uppercase font-bold tracking-wider text-zinc-400">Total Balance</span>
      <div className="mt-2 text-3xl font-extrabold tracking-tight">{currency}{balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
      <div className="mt-4 flex items-center justify-between text-xs text-emerald-400 font-medium">
        <span>+14.8% this month</span>
        <span className="text-zinc-500">Updated 2m ago</span>
      </div>
    </div>
  );
}