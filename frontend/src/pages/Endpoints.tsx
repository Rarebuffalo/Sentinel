import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import StatusBadge from "../components/ui/StatusBadge";
import EndpointModal from "../components/modals/EndpointModal";
import { useEndpoints } from "../hooks/useEndpoints";
import { Search, Loader2, Trash2, Plus, Edit2, Zap, ExternalLink, Clock, Timer } from "lucide-react";

export default function Endpoints() {
  const { 
    endpoints, 
    loading, 
    fetchEndpoints, 
    addEndpoint, 
    updateEndpoint, 
    deleteEndpoint,
    toggleEndpoint,
    triggerManualCheck
  } = useEndpoints();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [methodFilter, setMethodFilter] = useState("ALL");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEndpoint, setEditingEndpoint] = useState<any>(null);

  useEffect(() => {
    fetchEndpoints();
    const interval = setInterval(() => fetchEndpoints(true), 5000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddClick = () => {
    setEditingEndpoint(null);
    setModalOpen(true); 
  };

  const handleEditClick = (endpoint: any) => {
    setEditingEndpoint(endpoint);
    setModalOpen(true);
  };

  const handleModalSubmit = async (data: any) => {
    if (editingEndpoint) {
      await updateEndpoint(editingEndpoint.id, data);
    } else {
      await addEndpoint(data);
    }
  };

  const filteredEndpoints = endpoints.filter(ep => {
    const matchesSearch = ep.name.toLowerCase().includes(search.toLowerCase()) || 
                          ep.url.toLowerCase().includes(search.toLowerCase());
                          
    const currentStatus = ep.last_status || (ep.is_active ? "NEW" : "PAUSED");
    const matchesStatus = statusFilter === "ALL" || currentStatus === statusFilter;
    
    const matchesMethod = methodFilter === "ALL" || ep.method === methodFilter;
    
    return matchesSearch && matchesStatus && matchesMethod;
  });

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Endpoints</h1>
          <p className="text-gray-500 mt-1">Manage and monitor your API targets</p>
        </div>
        <button 
          onClick={handleAddClick}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-sm transition-all focus:ring-4 focus:ring-blue-100 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" /> Add Endpoint
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex gap-4 bg-white flex-col sm:flex-row">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search endpoints..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-gray-50/50 border border-gray-200 rounded-xl pl-10 pr-4 py-2 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400"
            />
          </div>
          
          <div className="flex gap-3">
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-600 appearance-none min-w-[130px] cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="UP">🟢 Up</option>
              <option value="DOWN">🔴 Down</option>
              <option value="NEW">⚪ New</option>
              <option value="PAUSED">⏸️ Paused</option>
            </select>
            
            <select 
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              className="bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-600 appearance-none min-w-[130px] cursor-pointer"
            >
              <option value="ALL">All Methods</option>
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="DELETE">DELETE</option>
            </select>
          </div>
        </div>

        {loading && endpoints.length === 0 ? (
          <div className="p-20 flex justify-center text-gray-400">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-gray-50/80 text-gray-500 text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 font-medium">Name</th>
                  <th className="px-6 py-4 font-medium">URL</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-center">Active</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredEndpoints.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      No endpoints found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  filteredEndpoints.map((ep) => (
                    <tr key={ep.id} className={`hover:bg-gray-50/50 transition-colors group ${!ep.is_active ? 'opacity-60' : ''}`}>
                      <td className="px-6 py-5">
                        <div className="font-medium text-gray-900">{ep.name}</div>
                        <div className="text-xs text-gray-400 mt-0.5 flex items-center gap-1.5">
                          <span className="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-mono font-semibold uppercase">{ep.method}</span>
                          Every {ep.interval}s
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <a href={ep.url} target="_blank" rel="noreferrer" className="text-sm text-gray-500 hover:text-blue-600 truncate max-w-[250px] inline-flex items-center gap-1.5 group/url transition-colors">
                          {ep.url}
                          <ExternalLink className="w-3 h-3 opacity-0 group-hover/url:opacity-100 transition-opacity" />
                        </a>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col gap-2 items-start">
                          <StatusBadge status={(ep.last_status as any) || (ep.is_active ? "NEW" : "PAUSED")} />
                          {ep.last_checked_at && (
                            <div className="text-xs text-gray-500 flex items-center gap-1.5" title="Last Checked">
                              <Clock className="w-3 h-3" /> 
                              {new Date(ep.last_checked_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </div>
                          )}
                          {ep.last_response_time != null && (
                            <div className="text-xs text-gray-500 flex items-center gap-1.5" title="Response Time">
                              <Timer className="w-3 h-3" /> 
                              {(ep.last_response_time * 1000).toFixed(0)} ms
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <button
                          onClick={() => toggleEndpoint(ep.id, !ep.is_active)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${ep.is_active ? 'bg-green-500' : 'bg-gray-300'}`}
                        >
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${ep.is_active ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                      </td>
                      <td className="px-6 py-5 flex items-center justify-end gap-2 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                         <button 
                          onClick={() => triggerManualCheck(ep.id)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Run Manual Check"
                        >
                          <Zap className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleEditClick(ep)}
                          className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Edit Endpoint"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => deleteEndpoint(ep.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Endpoint"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <EndpointModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        onSubmit={handleModalSubmit}
        initialData={editingEndpoint}
      />
    </DashboardLayout>
  );
}
