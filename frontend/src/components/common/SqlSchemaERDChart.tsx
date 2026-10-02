import React, { useState } from 'react';
import { Database, Table, Key, Link2, Sparkles, Layers } from 'lucide-react';

export interface ERDTableColumn {
  name: string;
  type: string;
  isPk?: boolean;
  isFk?: boolean;
  fkRef?: { table: string; column: string };
}

export interface ERDTable {
  name: string;
  columns: ERDTableColumn[];
}

export const SqlSchemaERDChart: React.FC<{ tables?: ERDTable[] }> = ({ tables }) => {
  const [hoveredTable, setHoveredTable] = useState<string | null>(null);

  // Default sample schema if not provided
  const defaultTables: ERDTable[] = [
    {
      name: 'employees',
      columns: [
        { name: 'employee_id', type: 'INT', isPk: true },
        { name: 'name', type: 'VARCHAR(100)' },
        { name: 'department_id', type: 'INT', isFk: true, fkRef: { table: 'departments', column: 'department_id' } },
        { name: 'salary', type: 'DECIMAL(10,2)' },
        { name: 'hire_date', type: 'DATE' },
      ],
    },
    {
      name: 'departments',
      columns: [
        { name: 'department_id', type: 'INT', isPk: true },
        { name: 'department_name', type: 'VARCHAR(100)' },
        { name: 'location', type: 'VARCHAR(100)' },
      ],
    },
    {
      name: 'projects',
      columns: [
        { name: 'project_id', type: 'INT', isPk: true },
        { name: 'project_name', type: 'VARCHAR(100)' },
        { name: 'budget', type: 'DECIMAL(12,2)' },
        { name: 'department_id', type: 'INT', isFk: true, fkRef: { table: 'departments', column: 'department_id' } },
      ],
    },
  ];

  const activeTables = tables && tables.length > 0 ? tables : defaultTables;

  return (
    <div className="card-surface p-6 rounded-3xl border border-slate-200 space-y-5 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-50 border border-cyan-500/20 text-cyan-600">
            <Layers size={20} />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              Entity-Relationship Schema Diagram (ERD)
            </h3>
            <p className="text-xs text-slate-400">Visual table relationships & primary/foreign key connections</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold">
          <span className="px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-600 flex items-center gap-1">
            <Key size={12} /> PK = Primary Key
          </span>
          <span className="px-2.5 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-600 flex items-center gap-1">
            <Link2 size={12} /> FK = Foreign Key
          </span>
        </div>
      </div>

      {/* ERD Table Cards Container */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 relative p-4 bg-slate-50/70 rounded-2xl border border-slate-200">
        {activeTables.map((t) => {
          const isHighlighted = hoveredTable === t.name;

          return (
            <div
              key={t.name}
              onMouseEnter={() => setHoveredTable(t.name)}
              onMouseLeave={() => setHoveredTable(null)}
              className={`rounded-2xl border overflow-hidden transition-all duration-300 ${
                isHighlighted
                  ? 'bg-white border-cyan-500/80 shadow-lg shadow-cyan-500/10 scale-[1.02]'
                  : 'bg-slate-50/80 border-slate-200'
              }`}
            >
              {/* Table Header */}
              <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-3 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Table size={16} className="text-cyan-600" />
                  <span className="font-extrabold text-sm text-slate-900">{t.name}</span>
                </div>
                <span className="text-[10px] text-slate-400 font-semibold px-2 py-0.5 rounded bg-slate-100 border border-slate-200">
                  {t.columns.length} cols
                </span>
              </div>

              {/* Columns List */}
              <div className="p-3 space-y-1.5 divide-y divide-slate-800/40">
                {t.columns.map((c) => (
                  <div key={c.name} className="flex items-center justify-between text-xs pt-1.5 first:pt-0">
                    <div className="flex items-center gap-2 truncate">
                      {c.isPk && <Key size={13} className="text-amber-600 flex-shrink-0" />}
                      {c.isFk && <Link2 size={13} className="text-purple-600 flex-shrink-0" />}
                      <span className={`font-semibold ${c.isPk ? 'text-amber-700 font-bold' : c.isFk ? 'text-purple-700' : 'text-slate-600'}`}>
                        {c.name}
                      </span>
                    </div>

                    <span className="text-[10px] font-mono text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200">
                      {c.type}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
