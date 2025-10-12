import { motion } from "framer-motion";
import { Train, TrendingUp, Clock, Fuel, BarChart3, Activity, Download } from "lucide-react";
import MetricCard from "@/components/MetricCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const utilizationData = [
  { month: "Jan", utilization: 78 },
  { month: "Feb", utilization: 82 },
  { month: "Mar", utilization: 85 },
  { month: "Apr", utilization: 79 },
  { month: "May", utilization: 88 },
  { month: "Jun", utilization: 92 },
];

const dispatchData = [
  { day: "Mon", volume: 245 },
  { day: "Tue", volume: 312 },
  { day: "Wed", volume: 289 },
  { day: "Thu", volume: 356 },
  { day: "Fri", volume: 401 },
  { day: "Sat", volume: 298 },
  { day: "Sun", volume: 267 },
];

const priorityData = [
  { name: "High Priority", value: 35, color: "#f97316" },
  { name: "Medium Priority", value: 45, color: "#3b82f6" },
  { name: "Low Priority", value: 20, color: "#10b981" },
];

export default function Dashboard() {
  const handleDownload = () => {
    const dashboardData = {
      metrics: {
        activeRakes: 24,
        avgUtilization: "87%",
        dailyDispatch: 2847,
        etaAccuracy: "94%"
      },
      utilizationTrend: utilizationData,
      dispatchVolume: dispatchData,
      priorityDistribution: priorityData,
      recentActivity: [
        { rake: "R1234", status: "Departed", time: "10:45 AM", destination: "CMO Kolkata" },
        { rake: "R5678", status: "Loading", time: "11:20 AM", destination: "Customer A123" },
        { rake: "R9012", status: "Arrived", time: "12:05 PM", destination: "CMO Mumbai" },
        { rake: "R3456", status: "In Transit", time: "12:30 PM", destination: "Customer B456" },
      ],
      generatedAt: new Date().toISOString(),
      reportType: "Dashboard Overview"
    };

    const fileName = `dashboard_data_${new Date().toISOString().split('T')[0]}.json`;
    const blob = new Blob([JSON.stringify(dashboardData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-fade-in-up" style={{ position: 'relative', zIndex: 1 }}>
      {/* Controls */}
      <div className="flex justify-end items-start">
        <Button onClick={handleDownload} variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Download Data
        </Button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-fr">
        <MetricCard
          title="Active Rakes"
          value={24}
          icon={Train}
          trend="+2 from yesterday"
          color="primary"
          delay={0}
        />
        <MetricCard
          title="Avg Utilization"
          value="87%"
          icon={TrendingUp}
          trend="+5% this month"
          color="accent"
          delay={0.1}
        />
        <MetricCard
          title="Daily Dispatch"
          value="2,847"
          icon={BarChart3}
          trend="Tons today"
          color="primary"
          delay={0.2}
        />
        <MetricCard
          title="ETA Accuracy"
          value="94%"
          icon={Clock}
          trend="+3% improvement"
          color="accent"
          delay={0.3}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Utilization Trend */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6 shadow-elevated bg-transparent backdrop-blur-sm border-border/50">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Rake Utilization Trend</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={utilizationData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="utilization"
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  dot={{ fill: "hsl(var(--primary))", r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>

        {/* Daily Dispatch Volume */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-6 shadow-elevated bg-transparent backdrop-blur-sm border-border/50">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="h-5 w-5 text-accent" />
              <h3 className="text-lg font-semibold">Weekly Dispatch Volume</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dispatchData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="day" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="volume" fill="hsl(var(--accent))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Priority Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="lg:col-span-1"
        >
          <Card className="p-6 shadow-elevated bg-transparent backdrop-blur-sm border-border/50">
            <h3 className="text-lg font-semibold mb-4">Order Priority Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={priorityData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="lg:col-span-2"
        >
          <Card className="p-6 shadow-elevated bg-transparent backdrop-blur-sm border-border/50">
            <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {[
                { rake: "R1234", status: "Departed", time: "10:45 AM", destination: "CMO Kolkata" },
                { rake: "R5678", status: "Loading", time: "11:20 AM", destination: "Customer A123" },
                { rake: "R9012", status: "Arrived", time: "12:05 PM", destination: "CMO Mumbai" },
                { rake: "R3456", status: "In Transit", time: "12:30 PM", destination: "Customer B456" },
              ].map((activity, index) => (
                <motion.div
                  key={activity.rake}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Train className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">{activity.rake}</p>
                      <p className="text-sm text-muted-foreground">{activity.destination}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-accent">{activity.status}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
