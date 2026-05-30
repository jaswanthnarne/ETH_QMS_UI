import React from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import "swiper/css/effect-fade"
import "swiper/css/pagination"
import "swiper/css/navigation"
import { SparklesIcon, ArrowRight, CheckCircle2 } from "lucide-react"
import {
  Autoplay,
  EffectFade,
  Navigation,
  Pagination,
} from "swiper/modules"

import { Badge } from "@/components/ui/badge"

export const CardCarousel = ({
  depts,
  autoplayDelay = 5000,
}) => {
  const css = `
  .swiper {
    width: 100%;
    height: 100%;
  }
  
  .swiper-pagination-bullet {
    width: 30px;
    height: 4px;
    border-radius: 2px;
    background: #cbd5e1;
    opacity: 0.5;
    transition: all 0.3s ease;
  }

  .swiper-pagination-bullet-active {
    width: 50px;
    background: #004AAD;
    opacity: 1;
  }

  .dept-gradient {
    mask-image: linear-gradient(to bottom, black 50%, transparent 100%);
  }
  `

  return (
    <div className="w-full h-full min-h-[600px] bg-slate-50/50 rounded-[40px] overflow-hidden border border-slate-200/60 shadow-2xl relative group">
      <style>{css}</style>

      <Swiper
        modules={[EffectFade, Autoplay, Pagination, Navigation]}
        effect="fade"
        speed={1000}
        loop={true}
        autoplay={{
          delay: autoplayDelay,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          el: '.custom-pagination'
        }}
        className="size-full"
      >
        {depts.map((dept, index) => (
          <SwiperSlide key={index} className="size-full bg-white">
            <div className="relative size-full flex flex-col lg:flex-row">

              {/* Left Content Column */}
              <div className="flex-1 p-10 lg:p-20 flex flex-col justify-center relative z-10">
                <Badge
                  variant="outline"
                  className="w-fit mb-6 px-4 py-1.5 rounded-full border-slate-200 bg-white text-[10px] font-black uppercase tracking-[0.2em] text-[#004AAD] shadow-sm flex items-center gap-2"
                >
                  <SparklesIcon size={12} className="fill-blue-500" /> Professional Certification
                </Badge>

                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg"
                      style={{ backgroundColor: dept.color }}
                    >
                      {React.cloneElement(dept.icon, { size: 32 })}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-400 uppercase tracking-widest leading-none">{dept.dept}</p>
                      <h2 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight mt-1">{dept.fullName}</h2>
                    </div>
                  </div>

                  <p className="text-slate-500 text-lg leading-relaxed max-w-xl pt-4">
                    Elevate your career with our industry-validated {dept.fullName} curriculum, designed specifically for modern engineering standards.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 pt-8">
                    {dept.courses.slice(0, 6).map((course, i) => (
                      <div key={i} className="flex items-center gap-3 group/item">
                        <div className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500">
                          <CheckCircle2 size={12} />
                        </div>
                        <span className="text-sm font-bold text-slate-700">{course}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-12 flex flex-wrap gap-4">
                    <button
                      className="px-10 py-5 rounded-2xl text-white font-black uppercase tracking-widest text-xs shadow-2xl hover:scale-105 transition-all transform flex items-center gap-3 active:scale-95"
                      style={{ backgroundColor: dept.color }}
                    >
                      Explore Courses <ArrowRight size={16} />
                    </button>
                    <button className="px-10 py-5 rounded-2xl bg-white border border-slate-200 text-slate-900 font-bold text-xs uppercase tracking-widest hover:bg-slate-50 transition-all">
                      Download Brochure
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Visual Column */}
              <div className="hidden lg:flex w-[40%] bg-slate-100 relative items-center justify-center overflow-hidden">
                {/* Large Background Icon */}
                <div
                  className="absolute transform rotate-12 opacity-[0.03] scale-150 pointer-events-none"
                  style={{ color: dept.color }}
                >
                  {React.cloneElement(dept.icon, { size: 600 })}
                </div>

                {/* Floating Abstract Shapes */}
                <div className="relative z-10 w-full h-full flex items-center justify-center p-12">
                  <div
                    className="w-full aspect-square rounded-[60px] shadow-2xl overflow-hidden border-[12px] border-white transform -rotate-3 hover:rotate-0 transition-transform duration-700 relative"
                  >
                    <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors duration-500" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div
                        className="w-32 h-32 rounded-3xl flex items-center justify-center text-white shadow-2xl"
                        style={{ backgroundColor: dept.color }}
                      >
                        {React.cloneElement(dept.icon, { size: 64 })}
                      </div>
                    </div>
                    <div className="absolute top-0 left-0 w-full h-full opacity-20" style={{ background: `linear-gradient(135deg, ${dept.color} 0%, transparent 100%)` }} />
                  </div>
                </div>
              </div>

            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Modern Static Controls */}
      <div className="absolute bottom-10 left-10 lg:left-20 z-20 flex items-center gap-10">
        <div className="custom-pagination flex gap-2" />
      </div>

    </div>
  )
}
