import Banner from "@/app/components/home/Banner";
import Events from "@/app/components/home/Events";
import Features from "@/app/components/home/Features";
import News from "@/app/components/home/News";

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

