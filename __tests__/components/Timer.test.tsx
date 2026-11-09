import React from 'react';
import { render, screen } from '@testing-library/react';
import { Timer } from '@/components/test/Timer';

describe('Timer Component', () => {
  it('renders the formatted time correctly', () => {
    render(<Timer formattedTime="14:35" urgencyLevel="normal" />);
    expect(screen.getByText('14:35')).toBeInTheDocument();
  });

  it('renders with warning styling when urgency is warning', () => {
    const { container } = render(<Timer formattedTime="04:50" urgencyLevel="warning" />);
    expect(container.firstChild).toHaveClass('text-amber-600');
  });

  it('renders with critical pulsing styling when urgency is critical', () => {
    const { container } = render(<Timer formattedTime="00:45" urgencyLevel="critical" />);
    expect(container.firstChild).toHaveClass('text-red-600');
  });
});
