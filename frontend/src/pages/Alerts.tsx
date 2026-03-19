import { useEffect } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import StatusBadge from "../components/ui/StatusBadge";
import { useAlerts } from "../hooks/useAlerts";
import { Bell, Loader2, CheckCircle2, AlertTriangle } from "lucide-react";

export default function Alerts() {
  const { alerts, loading, fetchAlerts } = useAlerts();

  useEffect(() => {
    fetchAlerts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sort alerts so new ones appear on top
  const sortedAlerts = [...alerts].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Alerts History</h1>
          <p className="text-gray-500 mt-1">Review system notifications and downtime events</p>
        </div>
        <button className="bg-white hover:bg-gray-50 text-gray-700 px-5 py-2.5 rounded-xl font-medium shadow-sm transition-all border border-gray-200 focus:ring-4 focus:ring-gray-100 flex items-center gap-2">
          <Bell className="w-5 h-5 opacity-70" /> Manage Alert Settings
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading && alerts.length === 0 ? (
          <div className="p-20 flex justify-center text-gray-400">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 text-gray-500 text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 font-medium">Alert Details</th>
                  <th className="px-6 py-4 font-medium">Time Triggered</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sortedAlerts.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-20 text-center">
                      <div className="bg-green-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 className="w-6 h-6 text-green-500" />
                      </div>
                      <h3 className="text-gray-900 font-bold mb-1">All clear!</h3>
                      <p className="text-gray-500 text-sm">No alerts have been triggered by your endpoints.</p>
                    </td>
                  </tr>
                ) : (
                  sortedAlerts.map((alert) => (
                    <tr key={alert.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${alert.is_resolved ? 'bg-gray-100 text-gray-500' : 'bg-red-100 text-red-600'}`}>
                            {alert.is_resolved ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 flex items-center gap-2">
                              {alert.endpoint?.name || "Unknown Endpoint"}
                            </div>
                            <div className="text-sm text-gray-500 mt-0.5">{alert.message}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-gray-600 text-sm">
                        {new Date(alert.created_at).toLocaleString(undefined, {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </td>
                      <td className="px-6 py-5">
                        <StatusBadge status={alert.is_resolved ? "RESOLVED" : "NEW"} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
