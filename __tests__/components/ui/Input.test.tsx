import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from '@/components/ui/input';

describe('Input Component', () => {
  it('should render input field with label when label prop is provided', () => {
    render(
      <Input 
        id="email" 
        label="Email Address" 
        placeholder="Enter your email" 
      />
    );

    const label = screen.getByText('Email Address');
    const input = screen.getByPlaceholderText('Enter your email');

    expect(label).toBeInTheDocument();
    expect(input).toBeInTheDocument();
    expect(label).toHaveAttribute('for', 'email');
  });

  it('should render input without label when label prop is not provided', () => {
    render(<Input placeholder="Just an input" />);

    const input = screen.getByPlaceholderText('Just an input');
    expect(input).toBeInTheDocument();
    
    const label = screen.queryByRole('label');
    expect(label).not.toBeInTheDocument();
  });

  it('should display error message when error prop is provided', () => {
    render(
      <Input 
        label="Password" 
        error="Password must be at least 6 characters" 
      />
    );

    const errorMessage = screen.getByText('Password must be at least 6 characters');
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveClass('text-red-400');
  });

  it('should apply error styling to input border when error prop is provided', () => {
    render(
      <Input 
        label="Email" 
        error="Invalid email format" 
      />
    );

    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('border-red-500');
  });

  it('should allow user to type text into the input field', async () => {
    const user = userEvent.setup();
    
    render(<Input placeholder="Type here" />);
    const input = screen.getByPlaceholderText('Type here') as HTMLInputElement;

    await user.type(input, 'Hello World');

    expect(input.value).toBe('Hello World');
  });

  it('should call onChange handler when user types in the input', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();

    render(
      <Input 
        placeholder="Test input" 
        onChange={handleChange} 
      />
    );

    const input = screen.getByPlaceholderText('Test input');
    await user.type(input, 'Test');

    expect(handleChange).toHaveBeenCalled();
    expect(handleChange).toHaveBeenCalledTimes(4); // Once per character
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Input disabled placeholder="Disabled input" />);

    const input = screen.getByPlaceholderText('Disabled input');
    
    expect(input).toBeDisabled();
    expect(input).toHaveClass('disabled:opacity-50');
  });

  it('should respect different input types like password or email', () => {
    const { rerender } = render(<Input type="password" placeholder="Password" />);
    
    let input = screen.getByPlaceholderText('Password');
    expect(input).toHaveAttribute('type', 'password');

    rerender(<Input type="email" placeholder="Email" />);
    input = screen.getByPlaceholderText('Email');
    expect(input).toHaveAttribute('type', 'email');
  });

  it('should apply custom className when provided', () => {
    render(<Input className="custom-class" placeholder="Custom styled input" />);

    const input = screen.getByPlaceholderText('Custom styled input');
    expect(input).toHaveClass('custom-class');
  });

  it('should be required when required prop is true', () => {
    render(<Input required placeholder="Required field" />);

    const input = screen.getByPlaceholderText('Required field');
    expect(input).toBeRequired();
  });
});
