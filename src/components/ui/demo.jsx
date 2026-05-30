import { Card, CardContent } from '@/components/ui/card';
import { Marquee } from '@/components/ui/3d-testimonails';

// Testimonials data focused specifically on Ethnotech Academy, with no image assets
const testimonials = [
  {
    name: 'Karthik Rao',
    username: '@karthik.rao',
    body: "Ethnotech Academy's hands-on internship and corporate training programs successfully bridged the gap between our college syllabus and actual industry standards.",
    college: 'MIT Mysore 🎓',
  },
  {
    name: 'Priya Anand',
    username: '@priya.anand',
    body: 'The advanced technology upskilling workshops conducted by Ethnotech prepared me completely for my high-stakes technical interviews. Truly excellent mentors!',
    college: 'Parul University 🎓',
  },
  {
    name: 'Sanjay Gowda',
    username: '@sanjay.gowda',
    body: "Ethnotech's expert placement guidance, industry connections, and mock training sessions gave me the confidence and tools needed to secure a top corporate job.",
    college: 'TCE Gadag 🎓',
  },
  {
    name: 'Adithya Nair',
    username: '@adithya.nair',
    body: "I attended Ethnotech Academy's advanced engineering bootcamps. The syllabus was extremely relevant, practical, and aligned with current global tech demands.",
    college: 'FISAT 🎓',
  },
  {
    name: 'Meera Krishnan',
    username: '@meera.k',
    body: 'Ethnotech Academy provided phenomenal career support and helped connect our batch to premier placement opportunities at reputable multi-nationals.',
    college: 'PSG Tech 🎓',
  },
  {
    name: 'Rahul Menon',
    username: '@rahul.menon',
    body: 'The real-world project experiences and mentorship during my Ethnotech Academy training program helped my profile stand out in our campus hiring drives.',
    college: 'FISAT 🎓',
  },
];

function TestimonialCard({ name, username, body, college }) {
  return (
    <Card className="w-64 border-slate-200/80 shadow-md bg-white hover:shadow-lg transition-all duration-300">
      <CardContent className="p-5">
        <div className="flex flex-col">
          <figcaption className="text-sm font-bold text-slate-800">
            {name}
          </figcaption>
          <p className="text-[10px] font-medium text-slate-400 mt-0.5">{username}</p>
        </div>
        <blockquote className="mt-3 text-xs text-slate-600 leading-relaxed font-normal">
          "{body}"
        </blockquote>
        <div className="mt-4 pt-3 border-t border-slate-100">
          <span className="text-[10px] font-bold text-[#004AAD] bg-blue-50 px-2.5 py-0.5 rounded-full">{college}</span>
        </div>
      </CardContent>
    </Card>
  );
}

export default function DemoOne() {
  return (
    <div className="relative flex h-[500px] w-full max-w-7xl flex-row items-center justify-center overflow-hidden gap-2 [perspective:600px]">
      <div
        className="flex flex-row items-center gap-6"
        style={{
          transform:
            'translateX(-80px) translateY(0px) translateZ(-40px) rotateX(15deg) rotateY(-8deg) rotateZ(12deg)',
        }}
      >
        {/* Column 1 (downwards) */}
        <Marquee vertical pauseOnHover repeat={4} className="[--duration:28s]">
          {testimonials.map((review) => (
            <TestimonialCard key={`marquee-1-${review.username}`} {...review} />
          ))}
        </Marquee>
        {/* Column 2 (upwards) */}
        <Marquee vertical pauseOnHover reverse repeat={4} className="[--duration:32s]">
          {testimonials.map((review) => (
            <TestimonialCard key={`marquee-2-${review.username}`} {...review} />
          ))}
        </Marquee>
        {/* Column 3 (downwards) */}
        <Marquee vertical pauseOnHover repeat={4} className="[--duration:30s]">
          {testimonials.map((review) => (
            <TestimonialCard key={`marquee-3-${review.username}`} {...review} />
          ))}
        </Marquee>
        {/* Column 4 (upwards) */}
        <Marquee vertical pauseOnHover reverse repeat={4} className="[--duration:34s]">
          {testimonials.map((review) => (
            <TestimonialCard key={`marquee-4-${review.username}`} {...review} />
          ))}
        </Marquee>
      </div>

      {/* Modern Soft Gradients blending seamlessly into the slate-50 background */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-slate-50 via-slate-50/80 to-transparent"></div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-slate-50 via-slate-50/80 to-transparent"></div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-slate-50 via-slate-50/80 to-transparent"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-slate-50 via-slate-50/80 to-transparent"></div>
    </div>
  );
}
