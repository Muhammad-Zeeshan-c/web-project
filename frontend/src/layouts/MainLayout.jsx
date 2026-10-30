import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

// MainLayout wraps pages that need the Navbar on top and Footer at bottom
// "children" is whatever page content we pass inside <MainLayout>...</MainLayout>
export const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1 pt-16">
        {children}
      </main>
      <Footer />
    </div>
  );
};
