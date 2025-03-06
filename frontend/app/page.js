import HeroSection from "./_components/HomePageComponents/Hero";
import HomePageNavbar from "./_components/HomePageComponents/HomePageNavbar";
import JobCarousel from "./_components/HomePageComponents/JobCarousel";
import HomeJobs from "./_components/HomePageComponents/HomeJobs";

export default function Home() {
  return (
    <div>
      <HomePageNavbar />
      <HeroSection />
      <JobCarousel />
      <HomeJobs />
    </div>
  );
}
