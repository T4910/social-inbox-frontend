import { render, screen } from '@testing-library/react';
import RolesManagementView from '../src/components/admin/roles-management-view';

describe('RolesManagementView', () => {
  it('renders roles management', () => {
    render(<RolesManagementView />);
    expect(screen.getByText(/roles/i)).toBeInTheDocument();
  });
});
