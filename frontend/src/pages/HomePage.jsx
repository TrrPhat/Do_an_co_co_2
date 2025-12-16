import LightRays from '../components/layout/LightRays';
import ModelViewer from '../components/models/ModelViewer';
import ScrollFloat from '../components/animations/ScrollFloat';
import ScrollFade from '../components/animations/ScrollFade';
import Reviews from '../components/sections/Reviews';
import ScrollStack, { ScrollStackItem } from '../components/animations/ScrollStack';
import backgroundVideo from '../assets/vdbackground.mp4';
import CountUp from '../components/animations/CountUp';
import { Users, Layers, Clock, Activity } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="relative w-full bg-white">
      {/* ===== HERO SECTION ===== */}
      <div className="relative w-full min-h-screen">
        {/* Fixed Background - Video */}
        <div className="fixed top-0 left-0 w-full h-screen z-0 overflow-hidden">
          {/* Video Background */}
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              filter: 'brightness(0.8)'
            }}
          >
            <source src={backgroundVideo} type="video/mp4" />
          </video>

          {/* Gradient Overlay - Premium Light */}
          <div
            className="absolute inset-0 w-full h-full"
            style={{
              background: 'linear-gradient(135deg, rgba(248, 250, 252, 0.3) 0%, rgba(226, 232, 240, 0.4) 100%)',
              mixBlendMode: 'overlay'
            }}
          />

          {/* Radial gradient for depth */}
          <div
            className="absolute inset-0 w-full h-full"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(255, 255, 255, 0.15) 0%, rgba(15, 23, 42, 0.25) 100%)'
            }}
          />

          <LightRays
            raysOrigin="top-center"
            raysColor="#01010155"
            raysSpeed={2}
            lightSpread={0.8}
            rayLength={1.9}
            followMouse={true}
            mouseInfluence={0.1}
            noiseAmount={0.05}
            distortion={0.05}
            className="custom-rays"
          />
        </div>

        {/* Content Overlay */}
        <div className="relative z-10">
          {/* Hero Content */}
          <div className="min-h-screen flex flex-col">
            <div className="flex-1 flex items-start justify-start px-4 pt-24 pb-8">
              <div className="max-w-6xl w-full ml-4 sm:ml-6 lg:ml-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                  {/* Left Content */}
                  <div className="space-y-6 text-left max-w-md">
                    <ScrollFloat
                      containerClassName="space-y-2"
                      textClassName="font-display font-bold text-4xl lg:text-5xl text-slate-950 leading-tight"
                      scrollStart="top bottom"
                      scrollEnd="center center"
                    >
                      Lái xe vững vàng.Tương lai rộng mở.
                    </ScrollFloat>

                    <ScrollFade
                      className="space-y-4"
                      scrollStart="top bottom-=20%"
                      scrollEnd="center center"
                      yOffset={20}
                    >
                      <p className="font-body text-base text-slate-900 leading-relaxed max-w-sm">
                        Đồng hành cùng bạn trên mọi cung đường...
                      </p>

                      <div className="flex flex-col sm:flex-row gap-3">
                        <button className="px-6 py-2 bg-slate-900 text-white font-heading rounded-lg">
                          Đăng Ký Ngay
                        </button>
                        <button className="px-6 py-2 border-2 border-slate-900 text-slate-900 font-heading rounded-lg">
                          Tìm Hiểu Thêm
                        </button>
                      </div>
                    </ScrollFade>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== FEATURES SECTION ===== */}
      <div className="relative w-full py-20 lg:py-32 bg-gradient-to-b from-white via-slate-50 to-white px-4">
        <div className="max-w-6xl mx-auto">
          <ScrollFloat
            containerClassName="text-center mb-16"
            textClassName="font-display text-4xl lg:text-5xl text-slate-900 drop-shadow-lg"
            scrollStart="top bottom"
            scrollEnd="center center"
          >
            Khóa Học Lái Xe B1/B2
          </ScrollFloat>

          <ScrollFade
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            scrollStart="top bottom-=20%"
            scrollEnd="center center"
            yOffset={40}
          >
            {/* Feature 1 */}
            <div className="p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-smooth border border-slate-100">
              <div className="w-12 h-12 bg-slate-900 rounded-lg mb-6 flex items-center justify-center">
                <span className="text-white font-bold text-xl">✓</span>
              </div>
              <h3 className="font-heading text-xl text-slate-900 mb-4">Giảng Viên Chuyên Nghiệp</h3>
              <p className="font-body text-slate-600 leading-relaxed">
                Đội ngũ giảng viên giàu kinh nghiệm, tận tâm với công việc đào tạo.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-smooth border border-slate-100">
              <div className="w-12 h-12 bg-slate-900 rounded-lg mb-6 flex items-center justify-center">
                <span className="text-white font-bold text-xl">✓</span>
              </div>
              <h3 className="font-heading text-xl text-slate-900 mb-4">Giáo Trình Cập Nhật</h3>
              <p className="font-body text-slate-600 leading-relaxed">
                Giáo trình bám sát đề thi và sát hình thực tế, luôn được cập nhật.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-smooth border border-slate-100">
              <div className="w-12 h-12 bg-slate-900 rounded-lg mb-6 flex items-center justify-center">
                <span className="text-white font-bold text-xl">✓</span>
              </div>
              <h3 className="font-heading text-xl text-slate-900 mb-4">Hỗ Trợ Tối Đa</h3>
              <p className="font-body text-slate-600 leading-relaxed">
                Hỗ trợ tối đa trong quá trình học tập và thi cử để đạt kết quả tốt nhất.
              </p>
            </div>
          </ScrollFade>
        </div>
      </div>

      {/* ===== REVIEWS SECTION ===== */}
      <div
        className="relative w-full py-20 lg:py-32 px-4"
        style={{
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
        }}
      >
        <div className="max-w-6xl mx-auto">
          <ScrollFloat
            containerClassName="text-center mb-16"
            textClassName="font-display text-4xl lg:text-5xl text-slate-900 drop-shadow-lg"
            scrollStart="top bottom"
            scrollEnd="center center"
          >
            Đánh Giá Từ Học Viên
          </ScrollFloat>

          <div className="relative z-10 w-full">
            <Reviews />
          </div>
        </div>
      </div>

      {/* ===== CTA SECTION ===== */}
      <div className="relative w-full py-20 lg:py-32 px-4 bg-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left: ScrollStack with animated stats */}
          <div className="order-2 lg:order-1">
            <ScrollStack
              className="lg:pr-8"
              innerClassName="pt-[0vh] px-0 pb-[20rem]"
              itemDistance={120}
              itemStackDistance={40}
              baseScale={0.85}
              itemScale={0.05}
              stackPosition="20%"
              scaleEndPosition="10%"
              rotationAmount={2}
              blurAmount={1}
              useWindowScroll={true}
            >
              {/* Card 1 - White with Blue text */}
              <ScrollStackItem itemClassName="bg-white border border-slate-200">
                <div className="flex items-start gap-4">
                  <Users className="w-10 h-10 text-blue-600" />
                  <div className="flex flex-col gap-2">
                    <h4 className="font-heading text-blue-700">Cộng đồng học viên</h4>
                    <div className="font-display text-4xl lg:text-5xl text-blue-800">
                      {/* <CountUp end={30000} duration={1800} suffix="+" /> */}
                    </div>
                    <p className="font-body text-blue-600">Học viên đã tham gia ôn luyện và thi đỗ.</p>
                  </div>
                </div>
              </ScrollStackItem>

              {/* Card 2 - Light Red with White text */}
              <ScrollStackItem itemClassName="bg-rose-400 text-white">
                <div className="flex items-start gap-4">
                  <Layers className="w-10 h-10 text-white" />
                  <div className="flex flex-col gap-2">
                    <h4 className="font-heading">Nội dung học</h4>
                    <div className="font-display text-4xl lg:text-5xl">
                      {/* <CountUp end={10} duration={1500} /> */}
                    </div>
                    <p className="font-body opacity-90">Bộ bài học, thi thử – sẽ được bổ sung liên tục.</p>
                  </div>
                </div>
              </ScrollStackItem>

              {/* Card 3 - Green with White text */}
              <ScrollStackItem itemClassName="bg-emerald-500 text-white">
                <div className="flex items-start gap-4">
                  <Clock className="w-10 h-10 text-white" />
                  <div className="flex flex-col gap-2">
                    <h4 className="font-heading">Thời lượng</h4>
                    <div className="font-display text-4xl lg:text-5xl">
                      {/* <CountUp end={578} duration={1500} /> */}
                    </div>
                    <p className="font-body opacity-90">Giờ học thực tiễn, luyện tập mọi lúc mọi nơi.</p>
                  </div>
                </div>
              </ScrollStackItem>

              {/* Card 4 - Yellow with White text */}
              <ScrollStackItem itemClassName="bg-amber-500 text-white">
                <div className="flex items-start gap-4">
                  <Activity className="w-10 h-10 text-white" />
                  <div className="flex flex-col gap-2">
                    <h4 className="font-heading">Tương tác mỗi ngày</h4>
                    <div className="font-display text-4xl lg:text-5xl">
                      {/* <CountUp end={10000} duration={1800} suffix="+" /> */}
                    </div>
                    <p className="font-body opacity-90">Lượt truy cập học tập hằng ngày trên hệ thống.</p>
                  </div>
                </div>
              </ScrollStackItem>
            </ScrollStack>
          </div>

          {/* Right: Model Viewer */}
          {/* <div className="order-1 lg:order-2 flex justify-center lg:justify-end min-h-[600px]">
          <ScrollFade
              className="w-full max-w-md"
              scrollStart="top bottom-=30%"
              scrollEnd="center center"
              yOffset={30}
            >
              <ModelViewer
                url="https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/main/2.0/ToyCar/glTF-Binary/ToyCar.glb"
                width={460}
                height={1000}
              />
            </ScrollFade>
          </div> */}
        </div>
      </div>
    </div>
  );
}

