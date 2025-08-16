// pages/_app.tsx
import { useEffect, useState } from 'react';
import type { AppProps } from 'next/app';
import useAuthStore from '../store/authStore';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import '../styles/globals.css';

const MyApp = ({ Component, pageProps }: AppProps) => {
  const [isSSR, setIsSSR] = useState(true);
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    setIsSSR(false);
    checkAuth();
  }, []);

  if (isSSR) return null;

  return (
    <div className="xl:w-[1200px] m-auto h-[100vh] flex">
      {/* Sidebar */}
      <div className="hidden xl:block sticky top-0 h-screen w-[240px] z-0">
        <Sidebar />
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-auto relative">
        {/* Navbar */}
        <Navbar />

        {/* Page content */}
        <div className="mt-4 flex flex-col gap-10 relative z-20">
          <Component {...pageProps} />
        </div>
      </div>
    </div>
  );
};

export default MyApp;
