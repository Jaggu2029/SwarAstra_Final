import React, { useEffect, useState } from 'react';
import { useSession } from '../context/SessionContext';
import { useProgress } from '../context/ProgressContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity } from 'lucide-react';

const ActivityChart = () => {
  const { session } = useSession();
  const { fetchAttempts } = useProgress();
  const [data, setData] = useState([]);
  const [totalThisMonth, setTotalThisMonth] = useState(0);

  useEffect(() => {
    const userId = session?.user?.id;
    if (!userId) return;

    const loadActivity = async () => {
      try {
        const [maths, science] = await Promise.all([
          fetchAttempts(userId, 'maths'),
          fetchAttempts(userId, 'science')
        ]);
        
        const allAttempts = [...(maths || []), ...(science || [])];
        
        // Filter for current month
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const dailyCounts = Array.from({ length: daysInMonth }, (_, i) => ({
          day: i + 1,
          tests: 0
        }));

        let total = 0;
        allAttempts.forEach(attempt => {
          const d = new Date(attempt.timestamp);
          if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
            dailyCounts[d.getDate() - 1].tests++;
            total++;
          }
        });

        setData(dailyCounts);
        setTotalThisMonth(total);
      } catch (err) {
        console.error("Failed to load activity", err);
      }
    };

    loadActivity();
  }, [session, fetchAttempts]);

  return (
    <div className="glass-card p-6 h-full flex flex-col relative overflow-hidden group">
      <div className="absolute -right-10 -top-10 w-32 h-32 bg-primary-progress/10 rounded-full blur-2xl"></div>
      
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div>
          <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-1 flex items-center gap-2">
            <Activity size={16} className="text-primary-progress" /> Activity
          </h3>
          <div className="flex items-baseline gap-2">
            <h2 className="text-3xl font-bold text-white">{totalThisMonth}</h2>
            <span className="text-gray-500 text-sm">tests this month</span>
          </div>
        </div>
      </div>

      <div className="flex-1 w-full min-h-[140px] relative z-10">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
            <XAxis 
              dataKey="day" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#666', fontSize: 10 }}
              interval="preserveStartEnd"
            />
            <YAxis 
              hide={true} 
            />
            <Tooltip 
              cursor={{ fill: 'rgba(255,255,255,0.05)' }}
              contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
              labelFormatter={(label) => `Day ${label}`}
              formatter={(value) => [value, 'Tests Given']}
            />
            <Bar 
              dataKey="tests" 
              fill="#22d3ee" 
              radius={[4, 4, 0, 0]} 
              maxBarSize={12}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ActivityChart;
