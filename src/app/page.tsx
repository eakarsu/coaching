import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import Testimonials from "@/components/Testimonials";
import Booking from "@/components/Booking";
import Blog from "@/components/Blog";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import {
  getStats,
  getFeaturedServices,
  getAdditionalServices,
  getFeaturedTestimonials,
  getCompanies,
  getFeaturedBlogPosts,
  getFeaturedResources,
} from "@/lib/data";

// Force dynamic rendering to prevent build-time database calls
export const dynamic = 'force-dynamic';

export default async function Home() {
  // Fetch all data in parallel
  const [
    stats,
    services,
    additionalServices,
    testimonials,
    companies,
    blogPosts,
    resources,
  ] = await Promise.all([
    getStats(),
    getFeaturedServices(3),
    getAdditionalServices(),
    getFeaturedTestimonials(6),
    getCompanies(),
    getFeaturedBlogPosts(4),
    getFeaturedResources(3),
  ]);

  return (
    <main>
      <Navigation />
      <Hero stats={stats} />
      <About />
      <Services services={services} additionalServices={additionalServices} />
      <Testimonials testimonials={testimonials} companies={companies} />
      <Booking />
      <Blog blogPosts={blogPosts} resources={resources} />
      <Contact />
      <Footer />
    </main>
  );
}
