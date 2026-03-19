import { NavLink } from "react-router-dom";
import { LayoutDashboard, RadioTower, Bell, Settings, LogOut, Activity } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Sidebar() {
  const { logout } = useAuth();
  
  const navItems = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Endpoints", path: "/endpoints", icon: RadioTower },
    { name: "Alerts", path: "/alerts", icon: Bell },
    { name: "Settings", path: "/settings", icon: Settings },
  ];

  return (
    <div className="w-64 bg-gray-900 text-white p-5 flex flex-col justify-between h-full shadow-xl z-20">
      
      <div>
        <div className="flex items-center gap-3 mb-10 px-2 mt-2">
          <Activity className="w-8 h-8 text-blue-500" />
          <h1 className="text-2xl font-bold tracking-tight">Sentinel</h1>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink 
                key={item.name}
                to={item.path}
                end={item.path === '/'}
                className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${isActive ? 'bg-blue-600 text-white shadow-md' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
              >
                <Icon className="w-5 h-5" />
                {item.name}
              </NavLink>
            )
          })}
        </nav>
      </div>

      <button onClick={logout} className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-red-400 font-medium transition-colors rounded-xl hover:bg-gray-800 w-full text-left">
        <LogOut className="w-5 h-5" />
        Logout
      </button>
    </div>
  );
}