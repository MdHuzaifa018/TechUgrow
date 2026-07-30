import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/components/ThemeProvider';
import { LenisProvider } from '@/components/LenisProvider';
import CustomCursor from '@/components/CustomCursor';
import { BookingProvider } from '@/context/BookingContext';
import BookingModal from '@/components/BookingModal';

// Public Pages
import Home from './pages/Home';
import About from './pages/About';
import Blog from './pages/Blog';
import CaseStudies from './pages/CaseStudies';
import Contact from './pages/Contact';
import Packages from './pages/Packages';
import Services from './pages/Services';

// Admin
import AdminLayout from './pages/AdminLayout';
import Admin from './pages/Admin';
import Dashboard from './pages/admin/Dashboard';
import Leads from './pages/admin/Leads';
import AdminBlogs from './pages/admin/Blogs';
import AdminContacts from './pages/admin/Contacts';
import AdminFounders from './pages/admin/Founders';
import AdminTeam from './pages/admin/Team';
import AdminGallery from './pages/admin/Gallery';
import AdminPackages from './pages/admin/Packages';
import AdminTestimonials from './pages/admin/Testimonials';
import AdminSettings from './pages/admin/Settings';
import AdminSeoSettings from './pages/admin/SeoSettings';
import AdminServices from './pages/admin/Services';
import AdminManagement from './pages/admin/AdminManagement';
import AuditLogs from './pages/admin/AuditLogs';
import Forbidden from './pages/admin/Forbidden';

function App() {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange={false}
    >
      <BookingProvider>
        <BrowserRouter>
          <LenisProvider>
            <CustomCursor />
            <BookingModal />
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/case-studies" element={<CaseStudies />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/packages" element={<Packages />} />
              <Route path="/services" element={<Services />} />

              {/* Admin Routes */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Admin />} />
                <Route path="login" element={<Admin />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="leads" element={<Leads />} />
                <Route path="services" element={<AdminServices />} />
                <Route path="blogs" element={<AdminBlogs />} />
                <Route path="contacts" element={<AdminContacts />} />
                <Route path="founders" element={<AdminFounders />} />
                <Route path="team" element={<AdminTeam />} />
                <Route path="gallery" element={<AdminGallery />} />
                <Route path="packages" element={<AdminPackages />} />
                <Route path="testimonials" element={<AdminTestimonials />} />
                <Route path="settings" element={<AdminSettings />} />
                <Route path="seo-settings" element={<AdminSeoSettings />} />
                <Route path="admin-management" element={<AdminManagement />} />
                <Route path="audit-logs" element={<AuditLogs />} />
                <Route path="403" element={<Forbidden />} />
              </Route>
            </Routes>
          </LenisProvider>
        </BrowserRouter>
      </BookingProvider>
    </ThemeProvider>
  );
}

export default App;
