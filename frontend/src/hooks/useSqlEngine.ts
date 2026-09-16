import { useState, useCallback } from 'react';
import alasql from 'alasql';
import { InputTable } from '../types';

export interface SqlQueryResult {
  columns: string[];
  rows: Record<string, any>[];
  executionTimeMs: number;
  rowCount: number;
  error?: string;
}

export function useSqlEngine() {
  const [isExecuting, setIsExecuting] = useState(false);
  const [lastResult, setLastResult] = useState<SqlQueryResult | null>(null);

  const executeQuery = useCallback((query: string, inputTables?: InputTable[]): SqlQueryResult => {
    setIsExecuting(true);
    const startTime = performance.now();

    try {
      // 1. Setup tables in AlaSQL memory
      if (inputTables && inputTables.length > 0) {
        inputTables.forEach((table) => {
          try {
            alasql(`DROP TABLE IF EXISTS ${table.table_name}`);
          } catch (e) {
            // Ignore drop table errors
          }

          const colDefs = table.columns.map((c) => `${c} STRING`).join(', ');
          alasql(`CREATE TABLE ${table.table_name} (${colDefs})`);

          table.rows.forEach((row) => {
            const keys = Object.keys(row);
            const vals = Object.values(row).map((v) =>
              typeof v === 'string' ? `'${v.replace(/'/g, "''")}'` : v ?? 'NULL'
            );
            alasql(`INSERT INTO ${table.table_name} (${keys.join(', ')}) VALUES (${vals.join(', ')})`);
          });
        });
      }

      // 2. Execute SQL query
      const res = alasql(query);
      const endTime = performance.now();

      let formattedRows: Record<string, any>[] = [];
      let columns: string[] = [];

      if (Array.isArray(res)) {
        formattedRows = res;
        if (formattedRows.length > 0) {
          columns = Object.keys(formattedRows[0]);
        }
      }

      const result: SqlQueryResult = {
        columns,
        rows: formattedRows,
        executionTimeMs: Math.round((endTime - startTime) * 100) / 100,
        rowCount: formattedRows.length,
      };

      setLastResult(result);
      setIsExecuting(false);
      return result;
    } catch (err: any) {
      const result: SqlQueryResult = {
        columns: [],
        rows: [],
        executionTimeMs: 0,
        rowCount: 0,
        error: err?.message || 'SQL Execution Error',
      };
      setLastResult(result);
      setIsExecuting(false);
      return result;
    }
  }, []);

  return {
    executeQuery,
    isExecuting,
    lastResult,
  };
}
