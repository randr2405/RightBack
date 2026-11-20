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
      className="group block overflow-hidden rounded-3xl bg-[#1A1A1A] shadow-2xl md:flex md:h-[400px]"
    >
      <div className="flex items-center justify-center bg-black/30 md:w-[58%] md:shrink-0">
        <img
          src={image}
          alt={title}
          loading="lazy"
          decoding="async"
          className="h-auto max-h-[58svh] w-full object-contain transition-transform duration-700 group-hover:scale-[1.02] md:h-full md:max-h-full md:p-4"
        />
      </div>

      <div className="flex items-center justify-between gap-4 p-5 text-white md:flex-1 md:flex-col md:items-start md:justify-center md:p-12">
        <h3 className="text-xl font-bold leading-tight md:text-3xl">{title}</h3>
        <p className="mt-4 hidden text-base text-white/70 md:block md:text-lg">{description}</p>
        <span className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full border border-red px-4 py-2 text-sm font-medium text-white transition-colors duration-300 group-hover:bg-red md:mt-8 md:px-5">
          Explore →
        </span>
      </div>
    </Link>
  );
}