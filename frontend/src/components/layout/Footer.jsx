import React from 'react';
import { Instagram, Linkedin, Twitter, Youtube } from "lucide-react";

const footerColumns = [
  {
    title: "Dịch vụ",
    links: [
      "Học lái xe B1/B2",
      "Ôn thi lý thuyết",
      "Thuê xe thực hành",
      "Lộ trình trọn gói",
      "Hỗ trợ thủ tục",
    ],
  },
  {
    title: "Tài nguyên",
    links: [
      "Lịch khai giảng",
      "Câu hỏi thường gặp",
      "Video hướng dẫn",
      "Blog kinh nghiệm",
      "Diễn đàn học viên",
    ],
  },
  {
    title: "Liên hệ",
    links: ["Về chúng tôi", "Tuyển dụng", "Kết nối đối tác", "Hotline 24/7"],
  },
];

const legalLinks = [
  "Điều khoản sử dụng",
  "Chính sách bảo mật",
  "Cài đặt cookie",
  "Hỗ trợ tiếp cận",
];

const socialIcons = [
  { icon: Instagram, href: "#" },
  { icon: Twitter, href: "#" },
  { icon: Linkedin, href: "#" },
  { icon: Youtube, href: "#" },
];

export default function Footer() {
  return (
    <footer 
      className="relative w-full min-h-screen text-slate-800 flex flex-col"
      style={{
        background: 'linear-gradient(to top, #e6e9f0 0%, #eef1f5 100%)'
      }}
    >
      {/* Background Effects với tông màu sáng */}
      <div className="pointer-events-none absolute top-0 left-0 z-0 h-full w-full overflow-hidden">
        {/* Accent blurs */}
        <div 
          className="absolute top-1/4 left-1/4 h-[500px] w-[500px] rounded-full blur-3xl opacity-10"
          style={{
            background: 'linear-gradient(135deg, rgba(230, 233, 240, 0.6) 0%, rgba(238, 241, 245, 0.4) 100%)'
          }}
        />
        <div 
          className="absolute right-1/4 bottom-1/4 h-[600px] w-[600px] rounded-full blur-3xl opacity-10"
          style={{
            background: 'linear-gradient(135deg, rgba(238, 241, 245, 0.6) 0%, rgba(230, 233, 240, 0.4) 100%)'
          }}
        />
        <div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full blur-3xl opacity-8"
          style={{
            background: 'radial-gradient(circle, rgba(230, 233, 240, 0.4) 0%, rgba(238, 241, 245, 0.3) 100%)'
          }}
        />
      </div>

      <div className="relative z-10 flex-1 flex flex-col mx-auto w-full max-w-[1400px] px-8 lg:px-12 xl:px-16">
        {/* Newsletter Section */}
        <div className="flex-1 flex items-center border-b border-slate-800/50">
          <div className="w-full py-16 lg:py-20">
              <div className="rounded-3xl bg-white/60 backdrop-blur-xl p-10 lg:p-16 xl:p-20 border border-slate-200/50 shadow-2xl">
              <div className="grid items-center gap-12 lg:gap-16 xl:gap-20 lg:grid-cols-2">
                <div>
                  <h3 className="mb-6 lg:mb-8 text-4xl lg:text-5xl xl:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent leading-tight">
                    Lái vững vàng, tương lai rộng mở
                  </h3>
                  <p className="text-slate-700 mb-8 lg:mb-10 text-lg lg:text-xl xl:text-2xl leading-relaxed">
                    Nhận lịch khai giảng, mẹo vượt sa hình và tài liệu ôn thi mới nhất dành cho học viên B1/B2.
                  </p>
                  <div className="flex flex-col gap-4 sm:flex-row">
                    <input
                      type="email"
                      placeholder="Nhập email của bạn"
                      className="flex-1 rounded-xl border border-slate-300 bg-white/80 px-6 lg:px-8 py-4 lg:py-5 text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base lg:text-lg"
                    />
                    <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl px-8 lg:px-10 py-4 lg:py-5 font-semibold text-base lg:text-lg shadow-lg hover:shadow-blue-500/50 transition-all hover:scale-105 whitespace-nowrap">
                      Đăng ký ngay
                    </button>
                  </div>
                </div>
                <div className="hidden lg:flex justify-end">
                  <div className="relative w-full max-w-lg">
                    <div className="absolute inset-0 rotate-6 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20" />
                    <img
                      src="https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=900&q=80"
                      alt="Học lái xe an toàn"
                      className="relative w-full h-80 xl:h-96 rounded-2xl object-cover shadow-2xl"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Links Section */}
        <div className="flex-1 flex items-center py-16 lg:py-20 xl:py-24">
          <div className="w-full grid grid-cols-2 gap-12 lg:gap-16 xl:gap-20 lg:grid-cols-5">
            <div className="col-span-2 lg:col-span-2">
              <div className="mb-8 flex items-center space-x-4">
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 flex h-14 w-14 lg:h-16 lg:w-16 items-center justify-center rounded-full shadow-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-white h-8 w-8 lg:h-9 lg:w-9"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <span className="text-3xl lg:text-4xl font-bold text-slate-900">DrivePro Academy</span>
              </div>
              <p className="text-slate-700 mb-10 text-lg lg:text-xl xl:text-2xl max-w-md leading-relaxed">
                Học lái xe thực chiến với giảng viên giàu kinh nghiệm, giáo trình bám sát đề thi và sa hình.
              </p>
              <div className="flex space-x-5">
                {socialIcons.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <a
                      key={i}
                      href={item.href}
                      className="flex h-14 w-14 lg:h-16 lg:w-16 items-center justify-center rounded-full bg-white/60 backdrop-blur-sm border border-slate-300/50 hover:bg-blue-500/20 hover:border-blue-500/50 transition-all hover:scale-110">
                      <Icon className="h-6 w-6 lg:h-7 lg:w-7 text-slate-700" />
                    </a>
                  );
                })}
              </div>
            </div>
            
            {footerColumns.map((col) => (
              <div key={col.title}>
                <h4 className="mb-6 lg:mb-8 text-xl lg:text-2xl font-semibold text-slate-900">{col.title}</h4>
                <ul className="space-y-4 lg:space-y-5">
                  {col.links.map((text) => (
                    <li key={text}>
                      <a
                        href="#"
                        className="text-slate-600 hover:text-blue-600 transition-colors text-base lg:text-lg xl:text-xl">
                        {text}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col items-center justify-between border-t border-slate-300/50 py-8 lg:py-10 md:flex-row">
          <p className="text-slate-600 mb-4 text-base lg:text-lg md:mb-0">
            © 2024 Acme Inc. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-8 lg:gap-10">
            {legalLinks.map((text) => (
              <a
                key={text}
                href="#"
                className="text-slate-600 hover:text-slate-900 text-base lg:text-lg transition-colors">
                {text}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

