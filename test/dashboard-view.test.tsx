import { render, screen } from '@testing-library/react';
import DashboardView from '../src/components/dashboard/dashboard-view';

describe('DashboardView', () => {
  it('renders dashboard widgets', () => {
    render(<DashboardView user={{ id: '1', email: 'test@test.com', memberships: [] }} />);
    expect(screen.getByText(/welcome/i)).toBeInTheDocument();
    // Add more assertions for widgets if needed
  });
});
