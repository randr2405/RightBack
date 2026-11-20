import Link from "next/link";

type WhatWeDoCardProps = {
  title: string;
  description: string;
  image: string;
  href: string;
};

export default function WhatWeDoCard({ title, description, image, href }: WhatWeDoCardProps) {
  return (
    <Link
      href={href}
      className="group relative block h-[480px] overflow-hidden rounded-3xl bg-[#1A1A1A] shadow-2xl sm:h-[440px] md:flex md:h-[400px]"
    >
      <div className="absolute inset-0 md:static md:w-[58%] md:shrink-0">
        <img
          src={image}
          alt={title}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>

      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent px-6 pb-6 pt-28 text-white md:static md:flex md:flex-1 md:flex-col md:justify-center md:bg-none md:p-12">
        <h3 className="text-2xl font-bold leading-tight md:text-3xl">{title}</h3>
        <p className="mt-4 hidden text-base text-white/70 md:block md:text-lg">{description}</p>
        <span className="mt-4 inline-flex w-fit items-center gap-2 rounded-full border border-red px-5 py-2 text-sm font-medium text-white transition-colors duration-300 group-hover:bg-red md:mt-8">
          Explore →
        </span>
      </div>
    </Link>
  );
}