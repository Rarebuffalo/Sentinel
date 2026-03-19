import { Bell, Search, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

export default function Navbar() {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState<any[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const { data } = await API.get("/alerts/");
        const activeAlerts = data.filter((a: any) => !a.is_resolved);
        setAlerts(activeAlerts);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-8 shadow-sm z-10 sticky top-0">
      
      <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 w-96 transition-all opacity-50">
        <Search className="w-4 h-4 text-gray-400 mr-2" />
        <input 
          type="text" 
          placeholder="Global search disabled (Use Endpoints Search)..." 
          disabled
          className="bg-transparent border-none outline-none w-full text-sm placeholder-gray-400 text-gray-700 cursor-not-allowed"
        />
      </div>

      <div className="flex items-center gap-6">
        <div className="relative">
          <button onClick={() => setDropdownOpen(!dropdownOpen)} className="text-gray-400 hover:text-gray-600 relative transition-colors focus:outline-none flex items-center justify-center p-1">
            <Bell className="w-5 h-5" />
            {alerts.length > 0 && <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-white"></span>}
          </button>
          
          {dropdownOpen && (
            <div className="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50 animate-fade-in origin-top-right">
              <div className="p-3 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                <h4 className="text-sm font-bold text-gray-900">Notifications</h4>
                <span className="text-xs font-semibold bg-red-100 text-red-600 px-2 py-0.5 rounded-full">{alerts.length} New</span>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {alerts.length === 0 ? (
                  <div className="p-6 text-center text-sm text-gray-500 flex flex-col items-center">
                    <Bell className="w-6 h-6 text-gray-300 mb-2" />
                    No active alerts right now!
                  </div>
                ) : (
                  alerts.map(a => (
                    <div key={a.id} className="p-3 border-b border-gray-50 hover:bg-gray-50/50 transition-colors cursor-pointer group">
                      <div className="flex gap-3">
                        <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">{a.endpoint?.name || "System"}</p>
                          <p className="text-xs text-gray-500 line-clamp-2 mt-0.5">{a.message}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="p-2 bg-gray-50/50 border-t border-gray-100 text-center">
                <Link to="/alerts" onClick={() => setDropdownOpen(false)} className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors block py-1">View All Alerts →</Link>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 pl-6 border-l border-gray-200">
            <div className="text-right hidden md:block">
              <p className="text-sm font-medium text-gray-700">{user?.email.split('@')[0] || "Loading..."}</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
          <div className="w-9 h-9 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm border border-blue-200 uppercase">
            {user?.email ? user.email.charAt(0) : "A"}
          </div>
        </div>
      </div>
    </div>
  );
}