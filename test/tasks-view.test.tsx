import { render, screen, fireEvent } from '@testing-library/react';
import TasksView from '../src/components/tasks/tasks-view';

describe('TasksView', () => {
  it('renders tasks view', () => {
    render(<TasksView user={{ id: '1', email: 'test@test.com', memberships: [] }} />);
    expect(screen.getByText(/tasks/i)).toBeInTheDocument();
  });
});
