import { GithubIcon, LinkedinIcon, TwitterIcon, Star } from 'lucide-react';
import ScrollFloat from '../animations/ScrollFloat';
import ScrollFade from '../animations/ScrollFade';
import { cn } from '../../lib/utils';

// Default reviews data về thi trắc nghiệm lái xe
const defaultReviews = [
  {
    name: 'Nguyễn Văn An',
    role: 'Học viên B2',
    review: 'Trang web giúp mình ôn thi rất hiệu quả! Đề thi sát với thực tế, giao diện dễ sử dụng. Mình đã đỗ ngay lần đầu nhờ luyện tập trên đây.',
    rating: 5,
    imageUrl: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=300&h=300&auto=format&fit=crop',
    location: 'Hà Nội',
    socialLinks: [
      { platform: 'linkedin', url: 'https://linkedin.com' },
    ],
  },
  {
    name: 'Trần Thị Bình',
    role: 'Học viên B1',
    review: 'Mình rất thích phần thi thử lý thuyết, có thể làm đi làm lại nhiều lần. Video hướng dẫn sa hình rất chi tiết và dễ hiểu. Cảm ơn đội ngũ đã tạo ra trang web hữu ích này!',
    rating: 5,
    imageUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=300&h=300&auto=format&fit=crop',
    location: 'TP. Hồ Chí Minh',
    socialLinks: [
      { platform: 'linkedin', url: 'https://linkedin.com' },
    ],
  },
  {
    name: 'Lê Minh Cường',
    role: 'Học viên B2',
    review: 'Đã từng thi trượt 2 lần, nhưng sau khi luyện tập trên trang web này mình đã đỗ. Đề thi đa dạng, có giải thích rõ ràng từng câu. Rất đáng để thử!',
    rating: 5,
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&h=300&auto=format&fit=crop',
    location: 'Đà Nẵng',
    socialLinks: [
      { platform: 'linkedin', url: 'https://linkedin.com' },
    ],
  },
  {
    name: 'Phạm Thị Dung',
    role: 'Học viên B1',
    review: 'Giao diện đẹp, dễ sử dụng. Mình thích nhất là phần tài liệu học tập, rất đầy đủ và có hình ảnh minh họa. Đã giới thiệu cho nhiều bạn bè cùng học.',
    rating: 5,
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&h=300&auto=format&fit=crop',
    location: 'Cần Thơ',
    socialLinks: [
      { platform: 'linkedin', url: 'https://linkedin.com' },
    ],
  },
  {
    name: 'Hoàng Văn Em',
    role: 'Học viên B2',
    review: 'Trang web này thực sự giúp mình tự tin hơn khi đi thi. Phần thi thử có tính giờ như thi thật, giúp mình làm quen với áp lực. Đã đỗ với số điểm cao!',
    rating: 5,
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&h=300&auto=format&fit=crop',
    location: 'Hải Phòng',
    socialLinks: [
      { platform: 'linkedin', url: 'https://linkedin.com' },
    ],
  },
];

export default function Reviews({
  title = 'Đánh Giá Từ Học Viên',
  subtitle = 'Hàng nghìn học viên đã tin tưởng và đạt kết quả tốt với chương trình học của chúng tôi.',
  reviews = defaultReviews,
  className,
}) {
  return (
    <section className={cn('relative mx-auto max-w-7xl py-16 md:py-24 px-4 md:px-6', className)}>
      {/* Tông màu sáng - accent blurs */}
      <div 
        className="absolute top-0 left-0 h-96 w-96 rounded-full blur-3xl opacity-15"
        style={{
          background: 'linear-gradient(135deg, rgba(230, 233, 240, 0.6) 0%, rgba(238, 241, 245, 0.4) 100%)'
        }}
      />
      <div 
        className="absolute top-0 right-0 h-96 w-96 rounded-full blur-3xl opacity-15"
        style={{
          background: 'linear-gradient(135deg, rgba(238, 241, 245, 0.6) 0%, rgba(230, 233, 240, 0.5) 100%)'
        }}
      />
      <div 
        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-64 w-full max-w-2xl rounded-full blur-3xl opacity-10"
        style={{
          background: 'linear-gradient(90deg, rgba(230, 233, 240, 0.4) 0%, rgba(238, 241, 245, 0.3) 100%)'
        }}
      />

      <div className="relative z-10">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <ScrollFloat
            containerClassName="text-center mb-4"
            textClassName="text-slate-900 font-bold"
            scrollStart="top bottom-=30%"
            scrollEnd="top center"
          >
            {title}
          </ScrollFloat>

          <ScrollFade
            className="text-slate-700 mx-auto max-w-2xl md:text-lg"
            scrollStart="top bottom-=20%"
            scrollEnd="top center+=10%"
            yOffset={30}
          >
            <p>{subtitle}</p>
          </ScrollFade>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-8">
          {reviews.map((review, index) => (
            <ScrollFade
              key={review.name}
              className="w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.5rem)]"
              scrollStart="top bottom-=20%"
              scrollEnd="top center"
              yOffset={50}
            >
              <ReviewCard member={review} />
            </ScrollFade>
          ))}
        </div>
      </div>
    </section>
  );
}

// Review card component
function ReviewCard({ member }) {
  return (
    <div className="group bg-white/80 backdrop-blur-sm h-auto w-full overflow-hidden rounded-xl opacity-100 shadow-lg border border-slate-200/50 transition-all hover:opacity-95 hover:shadow-xl hover:border-slate-300">
      <div className="flex flex-col p-5">
        <div className="flex items-center gap-4 mb-4">
          <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-full border-2 border-blue-500/50">
            <img
              src={member.imageUrl}
              alt={member.name}
              className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-lg font-bold text-slate-900">{member.name}</h3>
              <div className="flex items-center gap-1">
                {[...Array(member.rating)].map((_, i) => (
                  <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
            </div>
            <p className="text-blue-600 text-sm font-medium mb-1">{member.role}</p>
            {member.location && (
              <div className="text-slate-500 flex items-center text-xs">
                <div className="bg-blue-500 mr-1.5 h-1.5 w-1.5 rounded-full" />
                {member.location}
              </div>
            )}
          </div>
        </div>

        <div className="mb-4">
          <p className="text-slate-700 text-sm leading-relaxed">{member.review}</p>
        </div>

        <div className="mt-auto">
          {member.socialLinks && (
            <div className="flex space-x-3">
              {member.socialLinks.map((link) => (
                <a
                  key={link.platform}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-slate-100 text-slate-600 hover:bg-blue-500 hover:text-white flex h-8 w-8 items-center justify-center rounded-full transition-all"
                >
                  {link.platform === 'github' && <GithubIcon className="h-4 w-4" />}
                  {link.platform === 'twitter' && <TwitterIcon className="h-4 w-4" />}
                  {link.platform === 'linkedin' && <LinkedinIcon className="h-4 w-4" />}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

