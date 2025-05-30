import { Outlet } from 'react-router';
//import Navbar from '../components/Navbar';
//import Footer from '../components/Footer';
import Navbar from './navbar';
import Footer from './footer';

export default function AppLayout() {
  return (
    
    <div className="flex flex-col min-h-screen bg-black text-gray-100">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

