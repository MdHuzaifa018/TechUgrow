import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/components/ThemeProvider';
import { LenisProvider } from '@/components/LenisProvider';
import CustomCursor from '@/components/CustomCursor';
import { BookingProvider } from '@/context/BookingContext';
import BookingModal from '@/components/BookingModal';

// Public Pages — lazy loaded for smaller initial bundle
const Home        = lazy(() => import('./pages/Home'));
const About       = lazy(() => import('./pages/About'));
const Blog        = lazy(() => import('./pages/Blog'));
const CaseStudies = lazy(() => import('./pages/CaseStudies'));
const Contact     = lazy(() => import('./pages/Contact'));
const Packages    = lazy(() => import('./pages/Packages'));
const Services    = lazy(() => import('./pages/Services'));

// Admin — lazy loaded (never needed on public pages)
const AdminLayout         = lazy(() => import('./pages/AdminLayout'));
const Admin               = lazy(() => import('./pages/Admin'));
const Dashboard           = lazy(() => import('./pages/admin/Dashboard'));
const Leads               = lazy(() => import('./pages/admin/Leads'));
const AdminBlogs          = lazy(() => import('./pages/admin/Blogs'));
const AdminContacts       = lazy(() => import('./pages/admin/Contacts'));
const AdminFounders       = lazy(() => import('./pages/admin/Founders'));
const AdminTeam           = lazy(() => import('./pages/admin/Team'));
const AdminGallery        = lazy(() => import('./pages/admin/Gallery'));
const AdminPackages       = lazy(() => import('./pages/admin/Packages'));
const AdminTestimonials   = lazy(() => import('./pages/admin/Testimonials'));
const AdminSettings       = lazy(() => import('./pages/admin/Settings'));
const AdminSeoSettings    = lazy(() => import('./pages/admin/SeoSettings'));
const AdminServices       = lazy(() => import('./pages/admin/Services'));
const AdminManagement     = lazy(() => import('./pages/admin/AdminManagement'));
const AuditLogs           = lazy(() => import('./pages/admin/AuditLogs'));
const Forbidden           = lazy(() => import('./pages/admin/Forbidden'));
const AdminAnalyticsPage  = lazy(() => import('./pages/admin/Analytics'));
const AdminBackup         = lazy(() => import('./pages/admin/Backup'));
const AdminSecurity       = lazy(() => import('./pages/admin/Security'));
const AdminBilling        = lazy(() => import('./pages/admin/Billing'));

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
            <Suspense fallback={null}>
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
                  <Route path="analytics" element={<AdminAnalyticsPage />} />
                  <Route path="backup" element={<AdminBackup />} />
                  <Route path="security" element={<AdminSecurity />} />
                  <Route path="billing" element={<AdminBilling />} />
                  <Route path="403" element={<Forbidden />} />
                </Route>
              </Routes>
            </Suspense>
          </LenisProvider>
        </BrowserRouter>
      </BookingProvider>
    </ThemeProvider>
  );
}

export default App;
