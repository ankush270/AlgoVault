/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    fs: {
      allow: ['..'],
    },
  },
  build: {
    target: 'esnext',
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          const normalizedId = id.replace(/\\/g, '/');

          // 1. Isolate LLD dataset
          if (normalizedId.includes('lld.json') || normalizedId.includes('lldLoader')) {
            return 'lld-data';
          }

          // 2. Isolate System Design deep-dive architectural case study examples
          if (
            normalizedId.includes('system-design-example') ||
            normalizedId.includes('systemDesignExamplesLoader')
          ) {
            return 'system-design-examples';
          }

          // 3. Isolate System Design core questions, concepts, and topics
          if (
            normalizedId.includes('system-design-question') ||
            normalizedId.includes('systemDesignQuestionsLoader') ||
            normalizedId.includes('systemDesignConceptsLoader') ||
            normalizedId.includes('system-design.json') ||
            normalizedId.includes('system_design_topics.json') ||
            normalizedId.includes('systemDesignTopics')
          ) {
            return 'system-design-core';
          }

          // 3. Azure Cloud architecture data
          if (normalizedId.includes('azure.json') || normalizedId.includes('azureLoader')) {
            return 'azure-data';
          }

          // 4. Catch-all for any raw JSON text imports
          if (normalizedId.includes('.json?raw') || normalizedId.includes('?raw')) {
            return 'system-design-core';
          }

          // 5. Break down curriculum datasets by technical domain to avoid monolithic >1MB bundles
          if (
            normalizedId.includes('operating_system.json') ||
            normalizedId.includes('os_topics.json') ||
            normalizedId.includes('osTopics')
          ) {
            return 'curriculum-os';
          }

          if (
            normalizedId.includes('dbmsRoadmap.json') ||
            normalizedId.includes('dbms_sql_topics.json') ||
            normalizedId.includes('dbmsSqlTopics')
          ) {
            return 'curriculum-dbms';
          }

          if (
            normalizedId.includes('Computer_network.json') ||
            normalizedId.includes('networks_topics.json') ||
            normalizedId.includes('networksTopics')
          ) {
            return 'curriculum-networks';
          }

          if (
            normalizedId.includes('javascript_topics.json') ||
            normalizedId.includes('node_topics.json') ||
            normalizedId.includes('react_topics.json') ||
            normalizedId.includes('javascriptTopics') ||
            normalizedId.includes('nodeTopics') ||
            normalizedId.includes('reactTopics')
          ) {
            return 'curriculum-webdev';
          }

          if (
            normalizedId.includes('dsa_topics.json') ||
            normalizedId.includes('dsaTopics') ||
            normalizedId.includes('algorithmsData') ||
            normalizedId.includes('oops.json') ||
            normalizedId.includes('oops_topics.json') ||
            normalizedId.includes('oopsTopics') ||
            normalizedId.includes('ai_ml_topics.json') ||
            normalizedId.includes('aiMlTopics')
          ) {
            return 'curriculum-dsa';
          }

          if (normalizedId.includes('/src/data/')) {
            return 'curriculum-data';
          }

          // 6. Heavy 3rd-party vendor libraries
          if (normalizedId.includes('node_modules')) {
            if (
              normalizedId.includes('@react-pdf') ||
              normalizedId.includes('pdfkit') ||
              normalizedId.includes('fontkit') ||
              normalizedId.includes('png-js') ||
              normalizedId.includes('yoga-layout') ||
              normalizedId.includes('restructure') ||
              normalizedId.includes('brotli')
            ) {
              return 'vendor-pdf';
            }
            if (normalizedId.includes('alasql')) {
              return 'vendor-alasql';
            }
            if (normalizedId.includes('@monaco-editor') || normalizedId.includes('monaco-editor')) {
              return 'vendor-monaco';
            }
            if (normalizedId.includes('@xyflow') || normalizedId.includes('xyflow')) {
              return 'vendor-xyflow';
            }
            if (normalizedId.includes('lucide-react')) {
              return 'vendor-icons';
            }
            if (normalizedId.includes('socket.io-client') || normalizedId.includes('engine.io-client')) {
              return 'vendor-socket';
            }
            if (normalizedId.includes('react') || normalizedId.includes('react-dom') || normalizedId.includes('scheduler')) {
              return 'vendor-react';
            }
          }
        },
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    server: {
      deps: {
        inline: true,
      },
    },
  },
});
