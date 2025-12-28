import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import ProgramsSection from '@/components/ProgramsSection';
import GallerySection from '@/components/GallerySection';
import PricingSection from '@/components/PricingSection';
import ReviewsSection from '@/components/ReviewsSection';
import EnrollmentSection from '@/components/EnrollmentSection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <AboutSection />
        <ProgramsSection />
        <GallerySection />
        <PricingSection />
        <ReviewsSection />
        <EnrollmentSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
