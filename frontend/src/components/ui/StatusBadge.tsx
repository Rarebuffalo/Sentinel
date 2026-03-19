export default function StatusBadge({ status }: { status: "UP" | "DOWN" | "NEW" | "RESOLVED" | "PAUSED" }) {
  const styles = {
    UP: "bg-green-100 text-green-700 border-green-200",
    DOWN: "bg-red-100 text-red-700 border-red-200",
    NEW: "bg-blue-100 text-blue-700 border-blue-200",
    RESOLVED: "bg-green-100 text-green-700 border-green-200",
    PAUSED: "bg-gray-100 text-gray-500 border-gray-200",
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border flex items-center gap-1.5 w-fit ${styles[status]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${status === 'UP' ? 'bg-green-500' : status === 'DOWN' ? 'bg-red-500' : status === 'NEW' ? 'bg-blue-500' : 'bg-gray-500'}`}></span>
      {status}
    </span>
  );
}