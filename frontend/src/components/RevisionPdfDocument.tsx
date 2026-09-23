import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    backgroundColor: '#FFFFFF',
    fontFamily: 'Helvetica',
  },
  headerBanner: {
    backgroundColor: '#0F172A',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    color: '#F8FAFC',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 10,
    color: '#94A3B8',
  },
  readinessBox: {
    backgroundColor: '#F1F5F9',
    padding: 12,
    borderRadius: 6,
    marginBottom: 18,
    borderLeftWidth: 4,
    borderLeftColor: '#6366F1',
  },
  readinessTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  readinessText: {
    fontSize: 10,
    color: '#475569',
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4F46E5',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingBottom: 4,
    marginBottom: 8,
  },
  card: {
    backgroundColor: '#F8FAFC',
    padding: 10,
    borderRadius: 6,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cardTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 3,
  },
  cardCategory: {
    fontSize: 9,
    color: '#64748B',
    marginBottom: 4,
  },
  cardContent: {
    fontSize: 9.5,
    color: '#334155',
    lineHeight: 1.4,
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 8,
    color: '#94A3B8',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 8,
  },
});

export interface PdfNoteItem {
  id: string;
  title: string;
  category?: string;
  content: string;
}

export interface PdfTrickItem {
  title: string;
  pattern: string;
  keyTakeaway: string;
}

export interface RevisionPdfProps {
  candidateName: string;
  targetCompany: string;
  readinessScore: number;
  readinessStatus: string;
  notes: PdfNoteItem[];
  dsaTricks: PdfTrickItem[];
  weakConcepts: string[];
}

export const RevisionPdfDocument: React.FC<RevisionPdfProps> = ({
  candidateName,
  targetCompany,
  readinessScore,
  readinessStatus,
  notes,
  dsaTricks,
  weakConcepts,
}) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header Banner */}
      <View style={styles.headerBanner}>
        <Text style={styles.headerTitle}>AlgoVault — Interview Cheat Sheet</Text>
        <Text style={styles.headerSubtitle}>
          Generated for {candidateName} • Target Company: {targetCompany} • Date: {new Date().toLocaleDateString()}
        </Text>
      </View>

      {/* Target Company Readiness Summary */}
      <View style={styles.readinessBox}>
        <Text style={styles.readinessTitle}>
          Target Company: {targetCompany} | AI Readiness Score: {readinessScore}% ({readinessStatus})
        </Text>
        <Text style={styles.readinessText}>
          This custom cheat sheet compiles your starred notes, formula tricks, and weak concepts tailored for {targetCompany} technical rounds.
        </Text>
      </View>

      {/* Starred Notes & Key Concepts */}
      {notes && notes.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📌 Starred Technical Notes & Summaries</Text>
          {notes.map((note, index) => (
            <View key={index} style={styles.card}>
              <Text style={styles.cardTitle}>{note.title}</Text>
              {note.category && <Text style={styles.cardCategory}>Topic Domain: {note.category}</Text>}
              <Text style={styles.cardContent}>{note.content}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Essential DSA Patterns & Tricks */}
      {dsaTricks && dsaTricks.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚡ Essential DSA Patterns & Formulas</Text>
          {dsaTricks.map((trick, index) => (
            <View key={index} style={styles.card}>
              <Text style={styles.cardTitle}>{trick.title} ({trick.pattern})</Text>
              <Text style={styles.cardContent}>{trick.keyTakeaway}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Weak Concepts Checklist */}
      {weakConcepts && weakConcepts.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎯 Priority Focus & Weak Concepts Checklist</Text>
          {weakConcepts.map((concept, index) => (
            <View key={index} style={{ marginBottom: 4 }}>
              <Text style={{ fontSize: 9.5, color: '#334155' }}>
                [ ] {concept}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Footer */}
      <View style={styles.footer}>
        <Text>AlgoVault Pro Technical Interview Accelerator • Keep practicing & stay relentless!</Text>
      </View>
    </Page>
  </Document>
);
