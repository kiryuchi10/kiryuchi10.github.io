import React from 'react';

export function NotFound(): React.ReactElement {
  return (
    <div className="not-found">
      <h1>404</h1>
      <p>Page not found.</p>
      <a href="/" className="btn btn-primary">
        Go home
      </a>
    </div>
  );
}
