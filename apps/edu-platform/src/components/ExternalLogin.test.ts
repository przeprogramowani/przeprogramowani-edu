import { cleanup, render, screen } from '@testing-library/svelte';
import { afterEach, describe, expect, it } from 'vitest';
import ExternalLogin from './ExternalLogin.svelte';

const baseProps = {
  cfSiteKey: '1x00000000000000000000AA',
  courseId: '10xdevs-3-prework',
  returnUrl: '/external/10xdevs-3-prework/pl/02',
};

describe('ExternalLogin', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders Polish external login copy by default', () => {
    render(ExternalLogin, baseProps);

    expect(screen.getByPlaceholderText('Adres email')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Wyślij link do logowania' })).toBeInTheDocument();
    expect(screen.getByText('Adres email musi być taki sam, jak ten użyty w społeczności Circle.')).toBeInTheDocument();
  });

  it('renders English external login copy', () => {
    render(ExternalLogin, {
      ...baseProps,
      returnUrl: '/external/10xdevs-3-prework/en/02',
      lang: 'en',
    });

    expect(screen.getByPlaceholderText('Email address')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Send sign-in link' })).toBeInTheDocument();
    expect(screen.getByText('Use the same email address you use in the Circle community.')).toBeInTheDocument();
  });
});
