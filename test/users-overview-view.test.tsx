import { render, screen } from '@testing-library/react';
import UsersOverviewView from '../src/components/users/users-overview-view';

describe('UsersOverviewView', () => {
  it('renders users overview', () => {
    render(<UsersOverviewView />);
    expect(screen.getByText(/users/i)).toBeInTheDocument();
  });
});
