import Link from "next/link";

const values = [
  {
    title: "Pure Quality",
    description:
      "We source our spices directly from the finest growing regions of Pakistan. Every batch is tested for purity, ensuring you receive only the best.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    title: "Authentic Origin",
    description:
      "Our red chili comes from Kunri, Sindh — the chili capital of Pakistan. This region produces some of the most flavorful chilies in the world.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: "Traditional Methods",
    description:
      "We combine traditional sun-drying and stone-grinding techniques with modern hygiene standards to preserve the natural aroma and flavor of every spice.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
  },
  {
    title: "Customer Trust",
    description:
      "Our growing family of satisfied customers across Pakistan is a testament to our commitment to quality, consistency, and service.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
];

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-gray-950 via-black to-gray-900 text-white py-20 sm:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/products/hero-spices.jpg')] bg-cover bg-center opacity-10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold">
            About <span className="text-gold">Aura Foods</span>
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto">
            From the heart of Sindh to kitchens across Pakistan — our journey is
            rooted in a passion for pure, authentic spices.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gold">
                Our Story
              </h2>
              <div className="mt-6 space-y-4 text-gray-400 leading-relaxed">
                <p>
                  Aura Foods was born from a simple belief: that the best spices
                  come from the earth, cultivated with care, and delivered with
                  integrity. Our journey begins in the fertile fields of Sindh,
                  home to Kunri — widely celebrated as the chili capital of
                  Pakistan.
                </p>
                <p>
                  For generations, the farmers of Kunri have perfected the art of
                  growing chilies that are unrivaled in color, heat, and aroma.
                  At Aura Foods, we partner directly with these farmers,
                  ensuring fair practices and the highest quality standards from
                  farm to table.
                </p>
                <p>
                  But our passion extends beyond chili. We scour the length and
                  breadth of Pakistan to source the finest turmeric, coriander,
                  cumin, and other premium spices. Each spice is carefully
                  cleaned, sun-dried, and ground using traditional methods that
                  preserve its natural essence.
                </p>
                <p>
                  Today, Aura Foods is proud to be a trusted name in households
                  across Pakistan, bringing the authentic taste of our homeland
                  to every meal.
                </p>
              </div>
            </div>
            <div className="rounded-xl overflow-hidden shadow-lg">
              <img
                src="/images/products/story-en.jpg"
                alt="Aura Foods story - premium spices from Pakistan"
                className="w-full h-full object-cover aspect-[4/3]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-16 sm:py-20 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gold">
              Our Mission & Values
            </h2>
            <p className="mt-3 text-gray-400 max-w-2xl mx-auto">
              Every spice we offer is a reflection of our dedication to purity,
              authenticity, and excellence.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {values.map((value) => (
              <div
                key={value.title}
                className="bg-gray-900 rounded-xl border border-gray-800 p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gold/20 text-gold mb-4">
                  {value.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-100 mb-2">
                  {value.title}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quality Section */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative bg-gray-950 rounded-2xl p-8 sm:p-12 text-white border border-gray-800 overflow-hidden">
            <div className="absolute inset-0 bg-[url('/images/products/quality-story.jpg')] bg-cover bg-center opacity-10" />
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-gold">
                Our Commitment to Quality
              </h2>
              <p className="mt-4 text-gray-400 leading-relaxed">
                At Aura Foods, quality is not just a word — it is the foundation
                of everything we do. From sourcing and processing to packaging
                and delivery, every step is guided by rigorous quality controls.
                Our spices are:
              </p>
              <ul className="mt-6 space-y-3 text-left max-w-lg mx-auto">
                {[
                  "Sourced directly from trusted farming communities",
                  "Sun-dried naturally to retain maximum flavor and nutrition",
                  "Stone-ground using traditional techniques",
                  "Tested for purity and free from adulteration",
                  "Hygienically packed in food-grade packaging",
                  "Delivered fresh to your doorstep",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-gold shrink-0 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gold">
            Experience the Aura Foods Difference
          </h2>
          <p className="mt-3 text-gray-400 max-w-xl mx-auto">
            Discover our full range of premium spices and bring authentic flavor
            to your kitchen.
          </p>
          <Link
            href="/products"
            className="mt-8 inline-flex items-center gap-2 bg-gold hover:bg-gold-light text-black px-10 py-4 rounded-lg font-semibold text-lg transition-all hover:scale-105"
          >
            Browse Products
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
}
