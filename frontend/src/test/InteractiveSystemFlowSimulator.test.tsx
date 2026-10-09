import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { InteractiveSystemFlowSimulator } from '../components/common/InteractiveSystemFlowSimulator';

describe('InteractiveSystemFlowSimulator', () => {
  it('renders simulator header and scenario buttons', () => {
    render(<InteractiveSystemFlowSimulator />);
    expect(screen.getByText(/Load Balancing & Scaling/i)).toBeInTheDocument();
    expect(screen.getByText(/Redis Cache-Aside/i)).toBeInTheDocument();
    expect(screen.getByText(/Async Kafka Queue/i)).toBeInTheDocument();
    expect(screen.getByText(/Master-Replica Replication/i)).toBeInTheDocument();
  });

  it('renders telemetry HUD metrics', () => {
    render(<InteractiveSystemFlowSimulator />);
    expect(screen.getByText(/Throughput Rate/i)).toBeInTheDocument();
    expect(screen.getByText(/req \/ s/i)).toBeInTheDocument();
  });

  it('allows switching scenarios', () => {
    render(<InteractiveSystemFlowSimulator />);
    const redisBtn = screen.getByText(/Redis Cache-Aside/i);
    fireEvent.click(redisBtn);
    expect(screen.getByText(/Redis Cache Optimization/i)).toBeInTheDocument();
  });
});
