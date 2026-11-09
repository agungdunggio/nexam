import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MultipleChoice } from '@/components/test/MultipleChoice';

describe('MultipleChoice Component', () => {
  const mockOptions = [
    { label: 'A', text: 'Opsi Jawaban Pertama' },
    { label: 'B', text: 'Opsi Jawaban Kedua' },
    { label: 'C', text: 'Opsi Jawaban Ketiga' },
  ];

  it('renders all options', () => {
    render(
      <MultipleChoice
        options={mockOptions}
        selectedAnswer={null}
        onSelect={() => {}}
      />
    );

    expect(screen.getByText('Opsi Jawaban Pertama')).toBeInTheDocument();
    expect(screen.getByText('Opsi Jawaban Kedua')).toBeInTheDocument();
    expect(screen.getByText('Opsi Jawaban Ketiga')).toBeInTheDocument();
  });

  it('calls onSelect when an option is clicked', () => {
    const handleSelect = jest.fn();
    render(
      <MultipleChoice
        options={mockOptions}
        selectedAnswer={null}
        onSelect={handleSelect}
      />
    );

    fireEvent.click(screen.getByText('Opsi Jawaban Kedua'));
    expect(handleSelect).toHaveBeenCalledWith('B');
  });
});
