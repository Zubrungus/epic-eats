import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className='footer'>
      <div>
        <p>Copyright by Epic Eats 2025</p>
      </div>
      <div>
        <button onClick={() => window.open('https://github.com/Zubrungus/epic-eats', '_blank')}>
          Github
        </button>
      </div>
    </footer>
  );
};

export default Footer;
