import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-r from-teal-600 to-purple-600 text-white py-20">
      <div className="max-w-5xl mx-auto text-center px-6">
        {/* Heading */}
        <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
          Find, Apply & <br />
          <span className="text-yellow-300">Build Your Career</span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-gray-200 mb-8">
          Discover job opportunities tailored to your skills and career goals.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <Link href="/jobs">
            <button className="bg-white text-teal-600 px-6 py-3 rounded-full font-medium hover:bg-gray-200 transition">
              Browse Jobs
            </button>
          </Link>
          <Link href="/signup?role=recruiter">
            <button className="border border-white px-6 py-3 rounded-full font-medium hover:bg-white hover:text-purple-600 transition">
              Recruit Talent
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
