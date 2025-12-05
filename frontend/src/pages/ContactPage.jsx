import ContactForm from '../components/sections/ContactForm';
import ScrollFloat from '../components/animations/ScrollFloat';
import ScrollFade from '../components/animations/ScrollFade';

export default function ContactPage() {
  return (
    <div className="w-full min-h-screen bg-slate-950 text-slate-100">
      <main className="pt-20">
        <div className="container mx-auto px-4 py-12">
          <ScrollFloat
            containerClassName="text-center mb-8"
            textClassName="text-white font-bold"
            scrollStart="top bottom-=30%"
            scrollEnd="top center"
          >
            Liên Hệ Với Chúng Tôi
          </ScrollFloat>

          <ScrollFade
            className="text-center mb-12"
            scrollStart="top bottom-=20%"
            scrollEnd="top center+=10%"
            yOffset={30}
          >
            <p className="text-slate-300 text-lg max-w-2xl mx-auto">
              Nhận tư vấn khóa học lái xe B1/B2, lịch khai giảng và lộ trình luyện sa hình 
              từ đội ngũ DrivePro Academy. Chúng tôi luôn sẵn sàng hỗ trợ bạn!
            </p>
          </ScrollFade>

          <ScrollFade
            scrollStart="top bottom-=10%"
            scrollEnd="top center"
            yOffset={50}
          >
            <ContactForm />
          </ScrollFade>
        </div>
      </main>
    </div>
  );
}

