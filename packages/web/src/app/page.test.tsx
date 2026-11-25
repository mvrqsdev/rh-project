import Home from '@/app/page';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('Home', () => {
  it('exibe o título principal', () => {
    render(<Home />);

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'To get started, edit the page.tsx file.',
      }),
    ).toBeInTheDocument();
  });

  it('abre o link de deploy em uma nova aba', () => {
    render(<Home />);

    const link = screen.getByRole('link', { name: /deploy now/i });

    expect(link).toHaveAttribute(
      'href',
      expect.stringContaining('https://vercel.com/new'),
    );
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
