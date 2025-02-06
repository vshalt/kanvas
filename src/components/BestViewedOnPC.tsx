import { useState, useEffect } from 'react';

const BestViewedOnPC = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (windowWidth > 768) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg text-center max-w-lg mx-4">
        <h2 className="text-xl font-bold">Best viewed on a PC</h2>
        <p className="mt-4 text-sm">This website is optimized for larger screens.</p>
      </div>
    </div>
  );
};

export default BestViewedOnPC;
