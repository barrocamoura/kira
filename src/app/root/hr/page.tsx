"use client";

import React, { useEffect, useState } from 'react';
import { Users, Euro, Briefcase, CalendarClock, TrendingUp, AlertCircle, Building2, UserCheck } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function CHRODashboard() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const supabase = createClient();
    
    // Fetch Employees
    const { data: empData } = await supabase
      .from('employee_records')
      .select('*, user:users(full_name, avatar_url, role)')
      .order('base_salary', { ascending: false });
      
    if (empData) setEmployees(empData);

    // Fetch OPEX
    const { data: expData } = await supabase
      .from('operating_expenses')
      .select('*')
      .order('expense_date', { ascending: false });

    if (expData) setExpenses(expData);

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalPayroll = employees.filter(e => e.status === 'active').reduce((acc, curr) => acc + Number(curr.base_salary), 0);
  const totalOpex = expenses.reduce((acc, curr) => acc + Number(curr.amount), 0);
  const activeCount = employees.filter(e => e.status === 'active').length;

  const chartData = [
    { name: 'Payroll', amount: totalPayroll },
    { name: 'Infrastructure', amount: expenses.filter(e => e.category === 'infrastructure').reduce((a, b) => a + Number(b.amount), 0) },
    { name: 'Marketing', amount: expenses.filter(e => e.category === 'marketing').reduce((a, b) => a + Number(b.amount), 0) },
    { name: 'Freelance', amount: expenses.filter(e => e.category === 'freelance').reduce((a, b) => a + Number(b.amount), 0) },
  ];

  return (
    <div className="max-w-[1600px] mx-auto space-y-8 pb-10">
      {/* HEADER */}
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-4xl font-black text-white flex items-center gap-3">
            <Users className="w-8 h-8 text-fuchsia-500" />
            Human Resources & OPEX
          </h2>
          <p className="text-slate-500 mt-2 text-sm uppercase tracking-widest font-bold">Office of the CHRO</p>
        </div>
      </div>

      {/* KPI GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 p-6 rounded-3xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-fuchsia-500/10 rounded-full blur-[40px] group-hover:bg-fuchsia-500/20 transition-all" />
          <div className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-2 flex justify-between items-center">
            Active Workforce <UserCheck className="w-4 h-4 text-fuchsia-500" />
          </div>
          <div className="text-4xl font-black text-white">{activeCount}</div>
          <div className="text-xs text-slate-500 mt-2 font-mono">STAFF & CONTRACTORS</div>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 p-6 rounded-3xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-[40px] group-hover:bg-rose-500/20 transition-all" />
          <div className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-2 flex justify-between items-center">
            Monthly Payroll <Euro className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-4xl font-black text-rose-400">€{totalPayroll.toLocaleString('pt-PT', { minimumFractionDigits: 2 })}</div>
          <div className="text-xs text-slate-500 mt-2 font-mono">FIXED SALARY COMMITMENT</div>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 p-6 rounded-3xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-[40px] group-hover:bg-orange-500/20 transition-all" />
          <div className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-2 flex justify-between items-center">
            Other OPEX <Building2 className="w-4 h-4 text-orange-500" />
          </div>
          <div className="text-4xl font-black text-orange-400">€{totalOpex.toLocaleString('pt-PT', { minimumFractionDigits: 2 })}</div>
          <div className="text-xs text-slate-500 mt-2 font-mono">VARIABLE EXPENSES YTD</div>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 p-6 rounded-3xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-[40px] group-hover:bg-indigo-500/20 transition-all" />
          <div className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-2 flex justify-between items-center">
            Absence Rate <CalendarClock className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-4xl font-black text-white">2.4%</div>
          <div className="text-xs text-slate-500 mt-2 font-mono">NOMINAL OPERATIONAL CAPACITY</div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* OPEX BREAKDOWN CHART */}
        <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-3xl p-8">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-8">OPEX Distribution</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(value) => `€${value}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px', color: '#fff' }}
                  cursor={{ fill: '#1e293b' }}
                />
                <Bar dataKey="amount" fill="#f43f5e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* WORKFORCE MANAGEMENT */}
        <div className="xl:col-span-2 bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-3xl flex flex-col relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-fuchsia-500/5 blur-[100px] rounded-full pointer-events-none" />
          
          <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-black/40 relative z-10">
            <h3 className="text-sm font-bold text-fuchsia-400 uppercase tracking-widest">Team Ledger (Staff & Contracts)</h3>
            <button className="px-4 py-2 bg-fuchsia-600 hover:bg-fuchsia-500 text-white rounded-xl text-xs font-bold transition">
              + Add Personnel
            </button>
          </div>

          <div className="flex-1 overflow-x-auto relative z-10">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  <th className="p-4">Personnel</th>
                  <th className="p-4">Role / Dept</th>
                  <th className="p-4">Type</th>
                  <th className="p-4 text-right">Base Salary</th>
                  <th className="p-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={5} className="py-8 text-center text-slate-500 text-xs font-mono">LOADING WORKFORCE DATA...</td></tr>
                ) : employees.length === 0 ? (
                  <tr><td colSpan={5} className="py-8 text-center text-slate-500 text-xs font-mono">NO RECORDS FOUND</td></tr>
                ) : (
                  employees.map(emp => (
                    <tr key={emp.id} className="border-b border-slate-800/30 hover:bg-white/5 transition">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-xs text-white">
                            {emp.user?.full_name?.substring(0, 2).toUpperCase() || 'UK'}
                          </div>
                          <div>
                            <div className="text-sm font-bold text-white">{emp.user?.full_name || 'Unknown'}</div>
                            <div className="text-[10px] text-slate-500 font-mono">Score: {emp.productivity_score}/100</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm font-bold text-slate-300">{emp.department}</div>
                        <div className="text-[10px] text-slate-500 uppercase">{emp.user?.role}</div>
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-1 bg-slate-800 text-slate-400 border border-slate-700 rounded-md text-[10px] font-bold uppercase tracking-widest">
                          {emp.employment_type}
                        </span>
                      </td>
                      <td className="p-4 text-right font-black text-rose-400">
                        €{Number(emp.base_salary).toLocaleString('pt-PT', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="p-4 text-center">
                        {emp.status === 'active' ? (
                          <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg text-[10px] font-black uppercase tracking-widest">Active</span>
                        ) : (
                          <span className="px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-lg text-[10px] font-black uppercase tracking-widest">{emp.status}</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
