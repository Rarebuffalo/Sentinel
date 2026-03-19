import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import API from "../services/api";
import StatsCard from "../components/cards/StatsCard";
import EndpointCard from "../components/cards/EndpointCard";
import { RadioTower, CheckCircle, AlertTriangle, Timer } from "lucide-react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar
} from "recharts";

export default function Dashboard() {
  const [endpoints, setEndpoints] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, active: 0, down: 0, avgResponseTime: 0 });
  const [chartsData, setChartsData] = useState({ responseTrend: [], uptimeTrend: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async (isPolling = false) => {
      if (!isPolling) setLoading(true);
      try {
        const { data: eps } = await API.get("/endpoints/");
        
        const completeEndpoints = eps.map((ep: any) => ({
          ...ep,
          status: ep.last_status || (ep.is_active ? "NEW" : "PAUSED"),
          responseTime: ep.last_response_time ? Math.round(ep.last_response_time * 1000) : 0
        }));
        
        setEndpoints(completeEndpoints);
        
        const downCount = completeEndpoints.filter((e: any) => e.status === "DOWN").length;
        const upCount = completeEndpoints.filter((e: any) => e.status === "UP").length;
        
        const validResponseTimes = completeEndpoints.map((e: any) => e.responseTime).filter((t: number) => t > 0);
        const avgResponse = validResponseTimes.length > 0 
          ? validResponseTimes.reduce((a: number, b: number) => a + b, 0) / validResponseTimes.length 
          : 0;
        
        setStats({
          total: completeEndpoints.length,
          active: upCount,
          down: downCount,
          avgResponseTime: Math.round(avgResponse)
        });

        const { data: chartRes } = await API.get("/dashboard/charts");
        setChartsData(chartRes);
      } catch (error) {
        console.error("Failed to fetch dashboard summary", error);
      } finally {
        if (!isPolling) setLoading(false);
      }
    };

    fetchDashboardData();
    const interval = setInterval(() => fetchDashboardData(true), 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Overview of your API monitoring status</p>
        </div>
        <Link to="/endpoints" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-sm transition-all focus:ring-4 focus:ring-blue-100">+ Add Endpoint</Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard title="Total Endpoints" value={loading ? "..." : stats.total} icon={<RadioTower className="w-6 h-6 text-blue-500" />} />
        <StatsCard title="Active Endpoints" value={loading ? "..." : stats.active} icon={<CheckCircle className="w-6 h-6 text-green-500" />} />
        <StatsCard title="Down Endpoints" value={loading ? "..." : stats.down} icon={<AlertTriangle className="w-6 h-6 text-red-500" />} />
        <StatsCard title="Avg Response" value={loading ? "..." : `${stats.avgResponseTime} ms`} icon={<Timer className="w-6 h-6 text-purple-500" />} />
      </div>

      {!loading && chartsData.responseTrend.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 mt-10">
          {/* Response Time Chart */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Response Time Trend</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartsData.responseTrend}>
                  <defs>
                    <linearGradient id="colorRt" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} minTickGap={30} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dx={-10} />
                  <RechartsTooltip 
                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                    formatter={(value: any) => [`${value} ms`, 'Latency']}
                  />
                  <Area type="monotone" dataKey="responseTime" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorRt)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Uptime Trend Chart */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Uptime % (7 Days)</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartsData.uptimeTrend}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dx={-10} domain={[0, 100]} />
                  <RechartsTooltip 
                    cursor={{fill: '#f3f4f6'}}
                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                    formatter={(value: any) => [`${value}%`, 'Uptime']}
                  />
                  <Bar dataKey="uptime" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-6 mt-12">
        <h2 className="text-xl font-bold text-gray-900">Recent Endpoints</h2>
        <Link to="/endpoints" className="text-sm font-semibold text-blue-600 hover:text-blue-800">View All →</Link>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400 font-medium">Loading your endpoints...</div>
      ) : endpoints.length === 0 ? (
        <div className="text-center bg-white rounded-2xl border border-dashed border-gray-300 py-20 mt-6">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <RadioTower className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">No endpoints monitored</h3>
          <p className="text-gray-500 mb-8 max-w-sm mx-auto">Get started by adding your first API endpoint to start collecting uptime metrics.</p>
          <Link to="/endpoints" className="bg-gray-900 text-white px-6 py-3 rounded-xl font-medium shadow-sm hover:bg-gray-800 transition-colors">Add your first endpoint</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {endpoints.slice(0, 4).map((ep) => (
            <EndpointCard
              key={ep.id}
              name={ep.name}
              url={ep.url}
              method={ep.method}
              interval={ep.interval}
              status={ep.status}
              responseTime={ep.responseTime}
            />
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}