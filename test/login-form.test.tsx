import { render, screen, fireEvent } from '@testing-library/react';
import { LoginForm } from '../src/components/auth/login-form';

describe('LoginForm', () => {
  it('renders email and password fields', () => {
    render(<LoginForm />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it('shows error on empty submit', async () => {
    render(<LoginForm />);
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    expect(await screen.findByText(/required/i)).toBeInTheDocument();
  });
});
