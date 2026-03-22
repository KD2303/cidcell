import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Footer from './Footer';
import ScrollToTop from './ScrollToTop';

const DashboardLayout = () => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">Loading...</div>;
  }

  // Define routes that shouldn't use the dashboard layout (public routes)
  const isPublicRoute = ['/', '/about', '/projects', '/events', '/team', '/mentors', '/roadmap', '/contact', '/developers', '/auth'].includes(location.pathname);

  // If user is NOT logged in or trying to access public route, render with standard Navbar
  if (!user || isPublicRoute) {
    return (
      <div className="min-h-screen flex flex-col">
        <ScrollToTop />
        <Navbar />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    );
  }

  // Authenticated Dashboard Layout
  return (
    <div className="flex h-screen bg-gray-900 text-white font-sans overflow-hidden">
      <Sidebar />
      <div className="flex-1 overflow-y-auto">
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;