import Banner from "@/app/components/home_components/Banner";
import Events from "@/app/components/home_components/Events";
import Features from "@/app/components/home_components/Features";
import News from "@/app/components/home_components/News";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Banner />
      <div className="border-b border-gray-300">
        <Features />
      </div>
      <div className="border-b border-gray-300">
        <Events />
      </div>
      <div className="border-b border-gray-300">
        <News />
      </div>
    </div>
  );
}

