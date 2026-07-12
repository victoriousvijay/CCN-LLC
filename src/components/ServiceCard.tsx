import React from 'react';

interface ServiceCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export default function ServiceCard({ title, description, icon }: ServiceCardProps) {
  return (
    <div className="group cursor-pointer transform transition-all duration-500 hover:scale-105 hover:-rotate-1 w-full max-w-[350px] justify-self-center">
      <div className="text-white rounded-3xl border border-white/10 bg-gradient-to-br from-[#1389bc] via-[#3165a0] to-[#2d688a] shadow-2xl duration-700 z-10 relative backdrop-blur-xl hover:border-white/25 overflow-hidden hover:shadow-white/5 hover:shadow-3xl w-full">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-white/10 opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
          <div style={{animationDelay: '0.5s'}} className="absolute -bottom-20 -left-20 w-48 h-48 rounded-full bg-gradient-to-tr from-white/10 to-transparent blur-3xl opacity-30 group-hover:opacity-50 transform group-hover:scale-110 transition-all duration-700 animate-bounce" />
          <div className="absolute top-10 left-10 w-16 h-16 rounded-full bg-white/5 blur-xl animate-ping" />
          <div style={{animationDelay: '1s'}} className="absolute bottom-16 right-16 w-12 h-12 rounded-full bg-white/5 blur-lg animate-ping" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000" />
        </div>
        <div className="p-8 relative z-10">
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-6">
              <div className="absolute inset-0 rounded-full border-2 border-white/20 animate-ping" />
              <div style={{animationDelay: '0.5s'}} className="absolute inset-0 rounded-full border border-white/10 animate-pulse" />
              <div className="p-6 rounded-full backdrop-blur-lg border border-white/20 bg-gradient-to-br from-blue-500/80 to-white/60 shadow-2xl transform group-hover:rotate-12 group-hover:scale-110 transition-all duration-500 hover:shadow-white/20">
                <div className="transform group-hover:rotate-180 transition-transform duration-700 w-8 h-8 flex items-center justify-center">
                  {icon}
                </div>
              </div>
            </div>
            <div className="mb-4 transform group-hover:scale-105 transition-transform duration-300">
              <p className="text-2xl font-bold bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent">
                {title}
              </p>
            </div>
            <div className="space-y-1 max-w-sm">
              <p className="text-gray-200 text-sm leading-relaxed transform group-hover:text-white transition-colors duration-300">
                {description}
              </p>
            </div>
            <div className="mt-6 w-1/3 h-0.5 bg-gradient-to-r from-transparent via-white to-transparent rounded-full transform group-hover:w-1/2 group-hover:h-1 transition-all duration-500" />
            <div className="flex space-x-2 mt-4 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
              <div className="w-2 h-2 bg-white rounded-full animate-bounce" />
              <div style={{animationDelay: '0.1s'}} className="w-2 h-2 bg-white rounded-full animate-bounce" />
              <div style={{animationDelay: '0.2s'}} className="w-2 h-2 bg-white rounded-full animate-bounce" />
            </div>
          </div>
        </div>
        <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-white/10 to-transparent rounded-br-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl from-white/10 to-transparent rounded-tl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
    </div>
  );
}
