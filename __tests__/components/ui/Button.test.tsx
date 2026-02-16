import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '@/components/ui/button';

describe('Button Component', () => {
  it('should render button with text content', () => {
    render(<Button>Click Me</Button>);

    const button = screen.getByRole('button', { name: 'Click Me' });
    expect(button).toBeInTheDocument();
  });

  it('should call onClick handler when button is clicked', async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();

    render(<Button onClick={handleClick}>Submit</Button>);

    const button = screen.getByRole('button', { name: 'Submit' });
    await user.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should not call onClick when button is disabled', async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();

    render(
      <Button onClick={handleClick} disabled>
        Disabled Button
      </Button>
    );

    const button = screen.getByRole('button', { name: 'Disabled Button' });
    
    expect(button).toBeDisabled();
    await user.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('should render with default variant styling when no variant is specified', () => {
    render(<Button>Default Button</Button>);

    const button = screen.getByRole('button', { name: 'Default Button' });
    expect(button).toHaveClass('bg-indigo-500');
  });

  it('should render with destructive variant for dangerous actions', () => {
    render(<Button variant="destructive">Delete Account</Button>);

    const button = screen.getByRole('button', { name: 'Delete Account' });
    expect(button).toHaveClass('bg-red-600');
  });

  it('should render with outline variant for secondary actions', () => {
    render(<Button variant="outline">Cancel</Button>);

    const button = screen.getByRole('button', { name: 'Cancel' });
    expect(button).toHaveClass('border', 'border-white/10');
  });

  it('should render with ghost variant for subtle actions', () => {
    render(<Button variant="ghost">Skip</Button>);

    const button = screen.getByRole('button', { name: 'Skip' });
    expect(button).toHaveClass('hover:bg-white/10');
  });

  it('should render with link variant for text-only buttons', () => {
    render(<Button variant="link">Learn More</Button>);

    const button = screen.getByRole('button', { name: 'Learn More' });
    expect(button).toHaveClass('text-indigo-400', 'underline-offset-4');
  });

  it('should render with small size when size prop is sm', () => {
    render(<Button size="sm">Small</Button>);

    const button = screen.getByRole('button', { name: 'Small' });
    expect(button).toHaveClass('h-8', 'px-3', 'text-xs');
  });

  it('should render with large size when size prop is lg', () => {
    render(<Button size="lg">Large Button</Button>);

    const button = screen.getByRole('button', { name: 'Large Button' });
    expect(button).toHaveClass('h-12', 'px-6', 'text-base');
  });

  it('should render with icon size for square icon-only buttons', () => {
    render(<Button size="icon" aria-label="Settings">⚙️</Button>);

    const button = screen.getByRole('button', { name: 'Settings' });
    expect(button).toHaveClass('h-10', 'w-10');
  });

  it('should apply custom className along with default styles', () => {
    render(<Button className="mt-4 custom-class">Custom</Button>);

    const button = screen.getByRole('button', { name: 'Custom' });
    expect(button).toHaveClass('mt-4', 'custom-class', 'bg-indigo-500');
  });

  it('should support button type attribute for form submissions', () => {
    render(<Button type="submit">Submit Form</Button>);

    const button = screen.getByRole('button', { name: 'Submit Form' });
    expect(button).toHaveAttribute('type', 'submit');
  });

  it('should show disabled state styling when disabled prop is true', () => {
    render(<Button disabled>Loading...</Button>);

    const button = screen.getByRole('button', { name: 'Loading...' });
    expect(button).toBeDisabled();
    expect(button).toHaveClass('disabled:opacity-50');
  });

  it('should render button with child elements like icons and text', () => {
    render(
      <Button>
        <span>🚀</span>
        <span>Launch</span>
      </Button>
    );

    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('🚀');
    expect(button).toHaveTextContent('Launch');
  });
});
