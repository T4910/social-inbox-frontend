import { render, screen, fireEvent } from '@testing-library/react';
import { SignupForm } from '../src/components/auth/signup-form';

describe('SignupForm', () => {
  it('renders email and password fields', () => {
    render(<SignupForm />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it('shows error on empty submit', async () => {
    render(<SignupForm />);
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));
    expect(await screen.findByText(/required/i)).toBeInTheDocument();
  });
});
