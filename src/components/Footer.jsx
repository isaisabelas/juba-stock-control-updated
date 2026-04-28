import React from 'react';
import '../styles/Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <p>&copy; Feito com carinho por Isabela Silva - {new Date().getFullYear()}</p>
    </footer>
  );
}
