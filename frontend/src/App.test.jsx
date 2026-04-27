import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

test('renders App component', () => {
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  );
  // Since it renders Login by default, check for something in Login
  expect(screen.getByText(/login/i)).toBeInTheDocument();
});