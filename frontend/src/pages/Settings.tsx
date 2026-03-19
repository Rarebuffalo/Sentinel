import { useState, useEffect } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { Bell, Key, Sliders, User, Plus, Trash2, Mail, MessageSquare, Hash, Loader2, CheckCircle2 } from "lucide-react";
import { settingsService } from "../services/settings";
import type { UserSettings, ApiKey } from "../services/settings";
import { useAuth } from "../context/AuthContext";

export default function Settings() {
  const { user } = useAuth();
  
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [settingsData, keysData] = await Promise.all([
          settingsService.getSettings(),
          settingsService.getApiKeys()
        ]);
        setSettings(settingsData);
        setApiKeys(keysData);
      } catch (err) {
        console.error("Failed to load settings", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    try {
      await settingsService.updateSettings(settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleGenerateKey = async () => {
    try {
      const newKey = await settingsService.generateApiKey();
      setApiKeys([...apiKeys, newKey]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteKey = async (id: number) => {
    try {
      await settingsService.deleteApiKey(id);
      setApiKeys(apiKeys.filter(k => k.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading || !settings) {
    return (
      <DashboardLayout>
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Settings</h1>
          <p className="text-gray-500 mt-1">Manage integrations, alert rules, and API access</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-5 py-2.5 rounded-xl font-medium shadow-sm transition-all focus:ring-4 focus:ring-blue-100 flex items-center gap-2"
        >
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : (saved ? <CheckCircle2 className="w-5 h-5" /> : null)}
          {saved ? "Saved!" : "Save Changes"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (Settings Navigation & Profile) */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-6">
              <User className="w-5 h-5 text-blue-500" /> Account
            </h2>
            <div className="space-y-4">
              <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                 <input disabled type="email" value={user?.email || "Loading..."} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-gray-500 cursor-not-allowed"/>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-6">
              <Key className="w-5 h-5 text-amber-500" /> API Keys
            </h2>
            <p className="text-sm text-gray-500 mb-4">Use API keys to authenticate scripts and custom integrations.</p>
            
            {apiKeys.map(k => (
              <div key={k.id} className="bg-gray-50 border border-gray-200 rounded-lg p-3 flex justify-between items-center mb-4">
                <div className="font-mono text-sm text-gray-600 truncate mr-4">{k.key}</div>
                <button onClick={() => handleDeleteKey(k.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            
            <button onClick={handleGenerateKey} className="w-full border-2 border-dashed border-gray-200 text-gray-600 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600 rounded-xl px-4 py-3 font-medium transition-all flex items-center justify-center gap-2 mt-2">
              <Plus className="w-4 h-4" /> Generate New Key
            </button>
          </div>
        </div>

        {/* Right Column (Alerts & Notifications) */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-4 mb-6">
              <Bell className="w-5 h-5 text-green-500" /> Notification Channels
            </h2>
            <div className="space-y-6">
              
              {/* Email */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center"><Mail className="w-5 h-5"/></div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Email Alerts</h3>
                    <p className="text-sm text-gray-500">Receive alerts directly to {user?.email || "admin@example.com"}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSettings({ ...settings, email_alerts: !settings.email_alerts })} 
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${settings.email_alerts ? 'bg-green-500' : 'bg-gray-300'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.email_alerts ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>

              {/* Slack */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center"><Hash className="w-5 h-5"/></div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Slack Integration</h3>
                    <p className="text-sm text-gray-500">Send alerts to #devops channel</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSettings({ ...settings, slack_alerts: !settings.slack_alerts })} 
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${settings.slack_alerts ? 'bg-green-500' : 'bg-gray-300'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.slack_alerts ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>

              {/* Discord */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center"><MessageSquare className="w-5 h-5"/></div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Discord Webhook</h3>
                    <p className="text-sm text-gray-500">Post incidents to Discord server</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSettings({ ...settings, discord_alerts: !settings.discord_alerts })} 
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${settings.discord_alerts ? 'bg-green-500' : 'bg-gray-300'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.discord_alerts ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>

            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-4 mb-6">
              <Sliders className="w-5 h-5 text-purple-500" /> Global Alert Thresholds
            </h2>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-semibold text-gray-700">Latency Alert Target</label>
                  <span className="text-sm font-bold text-purple-600">{settings.global_latency_threshold} ms</span>
                </div>
                <input 
                  type="range" 
                  min="500" 
                  max="5000" 
                  step="100"
                  value={settings.global_latency_threshold}
                  onChange={(e) => setSettings({ ...settings, global_latency_threshold: Number(e.target.value) })}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                />
                <p className="text-xs text-gray-500 mt-2">Trigger an alert if an endpoint's average response time stays above this limit.</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Failure Tolerance</label>
                <select 
                  value={settings.global_failure_tolerance}
                  onChange={(e) => setSettings({ ...settings, global_failure_tolerance: Number(e.target.value) })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                >
                  <option value={1}>1 failed check (Immediate)</option>
                  <option value={3}>3 consecutive failures</option>
                  <option value={5}>5 consecutive failures</option>
                </select>
                <p className="text-xs text-gray-500 mt-2">How many times an endpoint must reply with a 4xx/5xx code before triggering an active down alert.</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}
