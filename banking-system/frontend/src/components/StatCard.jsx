export default function StatCard({ title, value, icon, color = 'blue', subtitle, trend }) {
  const badgeStyles = {
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20 glow-blue',
    green: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 glow-emerald',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20 glow-purple',
    orange: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    red: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  };

  const iconGradients = {
    blue: 'from-blue-500 to-indigo-600 shadow-blue-500/30',
    green: 'from-emerald-500 to-teal-600 shadow-emerald-500/30',
    purple: 'from-purple-500 to-pink-600 shadow-purple-500/30',
    orange: 'from-amber-500 to-orange-600 shadow-amber-500/30',
    red: 'from-rose-500 to-red-600 shadow-rose-500/30',
    cyan: 'from-cyan-500 to-blue-600 shadow-cyan-500/30',
  };

  return (
    <div className="glass-card rounded-2xl p-5 hover:border-slate-700 transition-all duration-300 hover:-translate-y-1 shadow-xl relative overflow-hidden group">
      {/* Accent glow corner */}
      <div className="absolute -top-10 -right-10 w-24 h-24 bg-blue-500/5 rounded-full blur-xl group-hover:bg-blue-500/15 transition-all" />

      <div className="flex items-center justify-between mb-4">
        <div className={`p-3.5 rounded-2xl bg-gradient-to-br ${iconGradients[color] || iconGradients.blue} shadow-lg text-white`}>
          <span className="text-xl">{icon}</span>
        </div>
        {trend && (
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
            trend > 0 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
          }`}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>

      <div>
        <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">{title}</p>
        <p className="text-2xl lg:text-3xl font-black text-white tracking-tight">{value}</p>
        {subtitle && <p className="text-xs text-slate-400 mt-2 font-medium">{subtitle}</p>}
      </div>
    </div>
  );
}
