import StatusBadge from "../ui/StatusBadge";
import { Copy, Trash2, Edit3 } from "lucide-react";

type Props = {
  name: string;
  url: string;
  method: string;
  interval: number;
  status?: "UP" | "DOWN";
  responseTime?: number;
};

export default function EndpointCard({
  name,
  url,
  method,
  interval,
  status = "UP",
  responseTime = 0
}: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col hover:shadow-md transition-shadow group relative">
      
      <div className="absolute top-4 right-4 flex opacity-0 group-hover:opacity-100 transition-opacity gap-2">
        <button className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-md transition-colors"><Edit3 className="w-4 h-4" /></button>
        <button className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"><Trash2 className="w-4 h-4" /></button>
      </div>

      <div className="mb-4">
        <h3 className="font-bold text-gray-900 text-lg mb-1">{name}</h3>
        <div className="flex items-center text-sm text-gray-500 truncate w-full pr-16 group/url">
           <span className="truncate">{url}</span>
           <Copy className="w-3 h-3 ml-2 opacity-0 group-hover/url:opacity-100 cursor-pointer hover:text-gray-800" />
        </div>
      </div>

      <div className="flex items-center gap-3 text-xs text-gray-500 font-bold tracking-wide">
        <span className="bg-gray-100 px-2 py-1.5 rounded-md text-gray-600 border border-gray-200">{method}</span>
        <span>Every {interval}s</span>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
        <StatusBadge status={status} />
        <span className="text-sm font-medium text-gray-500 flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full inline-block ${responseTime === 0 ? 'bg-gray-300' : responseTime < 300 ? 'bg-green-400' : responseTime < 800 ? 'bg-yellow-400' : 'bg-red-400'}`}></span>
          {responseTime > 0 ? `${responseTime}ms` : '--'}
        </span>
      </div>

    </div>
  );
}