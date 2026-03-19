import type { ReactNode } from "react";

type Props = {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: string;
  trendUp?: boolean;
};

export default function StatsCard({ title, value, icon, trend, trendUp }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-gray-50/80 rounded-xl text-gray-500">
          {icon}
        </div>
        {trend && (
          <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${trendUp ? 'text-green-700 bg-green-50 border border-green-100' : 'text-red-700 bg-red-50 border border-red-100'}`}>
            {trend}
          </span>
        )}
      </div>
      <div>
        <h2 className="text-3xl font-bold text-gray-900">{value}</h2>
        <p className="text-xs font-semibold text-gray-400 mt-1 tracking-widest uppercase">{title}</p>
      </div>
    </div>
  );
}