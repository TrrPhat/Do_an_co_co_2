import LightRays from '../components/layout/LightRays';
import ScrollFloat from '../components/animations/ScrollFloat';
import ScrollFade from '../components/animations/ScrollFade';
import Reviews from '../components/sections/Reviews';
import backgroundVideo from '../assets/vdbackground.mp4';
import { useLayoutEffect, useRef } from 'react';
import '../styles/slider.css';
import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import DecryptedText from '../components/effects/DecryptedText';
import TextType from '../components/effects/TextType';

export default function HomePage() {
  const ctaRef = useRef(null);

  useLayoutEffect(() => {
    gsap.registerPlugin(Draggable, ScrollTrigger);
    ScrollTrigger.defaults({ anticipatePin: 1 });

    const offFns = [];
    const ctx = gsap.context(() => {
      function initSlider(off = []) {
        const wrapper = document.querySelector('[data-slider="list"]');
        const slides = gsap.utils.toArray('[data-slider="slide"]');

        if (!wrapper || !slides.length) return;

        const nextButton = document.querySelector('[data-slider="button-next"]');
        const prevButton = document.querySelector('[data-slider="button-prev"]');

        const totalElement = document.querySelector('[data-slide-count="total"]');
        const stepElement = document.querySelector('[data-slide-count="step"]');
        const stepsParent = stepElement?.parentElement;

        let activeElement;
        const totalSlides = slides.length;

        // Update total slides text, prepend 0 if less than 10
        if (totalElement) totalElement.textContent = totalSlides < 10 ? `0${totalSlides}` : String(totalSlides);

        // Create step elements dynamically
        if (stepsParent && stepElement) {
          stepsParent.innerHTML = '';
          slides.forEach((_, index) => {
            const stepClone = stepElement.cloneNode(true);
            stepClone.textContent = index + 1 < 10 ? `0${index + 1}` : String(index + 1);
            stepsParent.appendChild(stepClone);
          });
        }

        const allSteps = stepsParent?.querySelectorAll('[data-slide-count="step"]');

        const loop = horizontalLoop(slides, {
          paused: true,
          draggable: true,
          center: false,
          onChange: (element, index) => {
            // Design offset: make the element to the RIGHT the active one
            activeElement && activeElement.classList.remove('active');
            const nextSibling = element.nextElementSibling || slides[0];
            nextSibling.classList.add('active');
            activeElement = nextSibling;

            // Move the number to the correct spot (based on the logical index)
            if (allSteps) gsap.to(allSteps, { y: `${-100 * index}%`, ease: 'power3', duration: 0.45 });
          }
        });

        slides.forEach((slide, i) => {
          const handler = () => loop.toIndex(i, { ease: 'power3', duration: 0.725 });
          slide.addEventListener('click', handler);
          off.push(() => slide.removeEventListener('click', handler));
        });

        if (nextButton) {
          const h = () => loop.next({ ease: 'power3', duration: 0.725 });
          nextButton.addEventListener('click', h);
          off.push(() => nextButton.removeEventListener('click', h));
        }
        if (prevButton) {
          const h = () => loop.previous({ ease: 'power3', duration: 0.725 });
          prevButton.addEventListener('click', h);
          off.push(() => prevButton.removeEventListener('click', h));
        }

        // Smooth continuous scroll control over the loop timeline
        const setLoopTime = gsap.quickTo(loop, 'time', { duration: 0.35, ease: 'power2.out' });
        const totalDur = () => loop.duration();
        const st = ScrollTrigger.create({
          trigger: '.cta-slider-section',
          start: 'top top',
          end: () => '+=' + Math.round(window.innerHeight * Math.max(totalSlides, 3)),
          scrub: 0.9,
          pin: true,
          pinSpacing: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            setLoopTime(self.progress * totalDur());
          }
        });
        off.push(() => st.kill());
      }

      initSlider(offFns);
      // ensure measurements after first paint
      requestAnimationFrame(() => ScrollTrigger.refresh());
    }, ctaRef);

    return () => {
      offFns.forEach((f) => {
        try { f(); } catch {}
      });
      ctx.revert();
    };
  }, []);

  function horizontalLoop(items, config) {
      let timeline;
      items = gsap.utils.toArray(items);
      config = config || {};
      gsap.context(() => {
        let onChange = config.onChange,
          lastIndex = 0,
          tl = gsap.timeline({
            repeat: config.repeat,
            onUpdate: onChange && function () {
              let i = tl.closestIndex();
              if (lastIndex !== i) {
                lastIndex = i;
                onChange(items[i], i);
              }
            },
            paused: config.paused,
            defaults: { ease: 'none' },
            onReverseComplete: () => tl.totalTime(tl.rawTime() + tl.duration() * 100)
          }),
          length = items.length,
          startX = items[0].offsetLeft,
          times = [],
          widths = [],
          spaceBefore = [],
          xPercents = [],
          curIndex = 0,
          indexIsDirty = false,
          center = config.center,
          pixelsPerSecond = (config.speed || 1) * 100,
          snap = config.snap === false ? v => v : gsap.utils.snap(config.snap || 1),
          timeOffset = 0,
          container = center === true ? items[0].parentNode : gsap.utils.toArray(center)[0] || items[0].parentNode,
          totalWidth,
          getTotalWidth = () => items[length - 1].offsetLeft + (xPercents[length - 1] / 100) * widths[length - 1] - startX + spaceBefore[0] + items[length - 1].offsetWidth * gsap.getProperty(items[length - 1], 'scaleX') + (parseFloat(config.paddingRight) || 0),
          populateWidths = () => {
            let b1 = container.getBoundingClientRect(), b2;
            items.forEach((el, i) => {
              widths[i] = parseFloat(gsap.getProperty(el, 'width', 'px'));
              xPercents[i] = snap((parseFloat(gsap.getProperty(el, 'x', 'px')) / widths[i]) * 100 + gsap.getProperty(el, 'xPercent'));
              b2 = el.getBoundingClientRect();
              spaceBefore[i] = b2.left - (i ? b1.right : b1.left);
              b1 = b2;
            });
            gsap.set(items, { xPercent: i => xPercents[i] });
            totalWidth = getTotalWidth();
          },
          timeWrap,
          populateOffsets = () => {
            timeOffset = center ? (tl.duration() * (container.offsetWidth / 2)) / totalWidth : 0;
            center && times.forEach((_, i) => {
              times[i] = timeWrap(tl.labels['label' + i] + (tl.duration() * widths[i]) / 2 / totalWidth - timeOffset);
            });
          },
          getClosest = (values, value, wrap) => {
            let i = values.length,
              closest = 1e10,
              index = 0, d;
            while (i--) {
              d = Math.abs(values[i] - value);
              if (d > wrap / 2) d = wrap - d;
              if (d < closest) {
                closest = d;
                index = i;
              }
            }
            return index;
          },
          populateTimeline = () => {
            let i, item, curX, distanceToStart, distanceToLoop;
            tl.clear();
            for (i = 0; i < length; i++) {
              item = items[i];
              curX = (xPercents[i] / 100) * widths[i];
              distanceToStart = item.offsetLeft + curX - startX + spaceBefore[0];
              distanceToLoop = distanceToStart + widths[i] * gsap.getProperty(item, 'scaleX');
              tl.to(item, { xPercent: snap(((curX - distanceToLoop) / widths[i]) * 100), duration: distanceToLoop / pixelsPerSecond }, 0)
                .fromTo(item, { xPercent: snap(((curX - distanceToLoop + totalWidth) / widths[i]) * 100) }, { xPercent: xPercents[i], duration: ((curX - distanceToLoop + totalWidth - curX) / pixelsPerSecond), immediateRender: false }, distanceToLoop / pixelsPerSecond)
                .add('label' + i, distanceToStart / pixelsPerSecond);
              times[i] = distanceToStart / pixelsPerSecond;
            }
            timeWrap = gsap.utils.wrap(0, tl.duration());
          },
          refresh = (deep) => {
            let progress = tl.progress();
            tl.progress(0, true);
            populateWidths();
            deep && populateTimeline();
            populateOffsets();
            deep && tl.draggable ? tl.time(times[curIndex], true) : tl.progress(progress, true);
          },
          onResize = () => refresh(true),
          proxy;
        gsap.set(items, { x: 0 });
        populateWidths();
        populateTimeline();
        populateOffsets();
        window.addEventListener('resize', onResize);
        function toIndex(index, vars) {
          vars = vars || {};
          (Math.abs(index - curIndex) > length / 2) && (index += index > curIndex ? -length : length);
          let newIndex = gsap.utils.wrap(0, length, index),
            time = times[newIndex];
          if ((time > tl.time()) !== (index > curIndex) && index !== curIndex) {
            time += tl.duration() * (index > curIndex ? 1 : -1);
          }
          if (time < 0 || time > tl.duration()) {
            vars.modifiers = { time: timeWrap };
          }
          curIndex = newIndex;
          vars.overwrite = true;
          gsap.killTweensOf(proxy);
          return vars.duration === 0 ? tl.time(timeWrap(time)) : tl.tweenTo(time, vars);
        }
        tl.toIndex = (index, vars) => toIndex(index, vars);
        tl.closestIndex = setCurrent => {
          let index = getClosest(times, tl.time(), tl.duration());
          if (setCurrent) {
            curIndex = index;
            indexIsDirty = false;
          }
          return index;
        };
        tl.current = () => (indexIsDirty ? tl.closestIndex(true) : curIndex);
        tl.next = vars => toIndex(tl.current() + 1, vars);
        tl.previous = vars => toIndex(tl.current() - 1, vars);
        tl.times = times;
        tl.progress(1, true).progress(0, true);
        if (config.reversed) {
          tl.vars.onReverseComplete();
          tl.reverse();
        }
        if (config.draggable) {
          const proxyEl = document.createElement('div');
          let wrap = gsap.utils.wrap(0, 1),
            ratio, startProgress, draggable, lastSnap, initChangeX, wasPlaying,
            align = () => tl.progress(wrap(startProgress + (draggable.startX - draggable.x) * ratio)),
            syncIndex = () => tl.closestIndex(true);

          draggable = Draggable.create(proxyEl, {
            trigger: items[0].parentNode,
            type: 'x',
            onPressInit() {
              let x = this.x;
              gsap.killTweensOf(tl);
              wasPlaying = !tl.paused();
              tl.pause();
              startProgress = tl.progress();
              refresh();
              ratio = 1 / totalWidth;
              initChangeX = startProgress / -ratio - x;
              gsap.set(proxyEl, { x: startProgress / -ratio });
            },
            onDrag: align,
            onThrowUpdate: align,
            overshootTolerance: 0,
            inertia: false,
            snap(value) {
              if (Math.abs(startProgress / -ratio - this.x) < 10) return lastSnap + initChangeX;
              let time = -(value * ratio) * tl.duration(),
                wrappedTime = timeWrap(time),
                snapTime = times[getClosest(times, wrappedTime, tl.duration())],
                dif = snapTime - wrappedTime;
              Math.abs(dif) > tl.duration() / 2 && (dif += dif < 0 ? tl.duration() : -tl.duration());
              lastSnap = (time + dif) / tl.duration() / -ratio;
              return lastSnap;
            },
            onRelease() {
              syncIndex();
              draggable.isThrowing && (indexIsDirty = true);
            },
            onThrowComplete: () => {
              syncIndex();
              wasPlaying && tl.play();
            }
          })[0];
          tl.draggable = draggable;
        }
        tl.closestIndex(true);
        lastIndex = curIndex;
        onChange && onChange(items[curIndex], curIndex);
        timeline = tl;
        return () => window.removeEventListener('resize', onResize);
      });
      return timeline;
    }

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

      {/* ===== CTA SECTION - SLIDER ===== */}
      <div className="relative w-full bg-slate-950 text-white cta-slider-section" ref={ctaRef}>
        <section className="cloneable">
          <div className="overlay">
            <div className="overlay-inner">
              <div className="overlay-count-row">
                <div className="count-column">
                  <h2 data-slide-count="step" className="count-heading">01</h2>
                </div>
                <div className="count-row-divider"></div>
                <div className="count-column">
                  <h2 data-slide-count="total" className="count-heading">04</h2>
                </div>
              </div>
              <div className="overlay-nav-row">
                <button aria-label="previous slide" data-slider="button-prev" className="button">
                  <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 17 12" fill="none" className="button-arrow">
                    <path d="M6.28871 12L7.53907 10.9111L3.48697 6.77778H16.5V5.22222H3.48697L7.53907 1.08889L6.28871 0L0.5 6L6.28871 12Z" fill="currentColor"></path>
                  </svg>
                  <div className="button-overlay">
                    <div className="overlay-corner"></div>
                    <div className="overlay-corner top-right"></div>
                    <div className="overlay-corner bottom-left"></div>
                    <div className="overlay-corner bottom-right"></div>
                  </div>
                </button>
                <button aria-label="next slide" data-slider="button-next" className="button">
                  <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 17 12" fill="none" className="button-arrow next">
                    <path d="M6.28871 12L7.53907 10.9111L3.48697 6.77778H16.5V5.22222H3.48697L7.53907 1.08889L6.28871 0L0.5 6L6.28871 12Z" fill="currentColor"></path>
                  </svg>
                  <div className="button-overlay">
                    <div className="overlay-corner"></div>
                    <div className="overlay-corner top-right"></div>
                    <div className="overlay-corner bottom-left"></div>
                    <div className="overlay-corner bottom-right"></div>
                  </div>
                </button>
              </div>
            </div>
          </div>
          <div className="main">
            <div className="slider-wrap">
              <div data-slider="list" className="slider-list">
                <div data-slider="slide" className="slider-slide">
                  <div className="slide-inner text-slide">
                    <div className="text-wrap">
                      <DecryptedText
                      text="HIỆU QUẢ HỌC TẬP"
                      animateOn="view"
                      sequential={true}
                      revealDirection="start"
                      speed={35}
                      parentClassName="text-heading"
                      className="text-heading"
                      encryptedClassName="text-heading opacity-70"
                    />
                      <TextType
                      as="p"
                      className="text-paragraph"
                      text={`Lộ trình được thiết kế tinh gọn và có chủ đích. Mỗi buổi học đều có mục tiêu rõ ràng, ví dụ minh họa thực tế, bài tập ứng dụng và kiểm tra nhanh. Bạn theo dõi tiến độ từng tuần, biết chính xác mình đang ở đâu và cần cải thiện điều gì.`}
                      typingSpeed={32}
                      initialDelay={150}
                      startOnVisible={true}
                      showCursor={false}
                      variableSpeed={{ min: 22, max: 48 }}
                    />
                      <a className="text-cta" href="#">Khám phá chương trình</a>
                    </div>
                  </div>
                </div>
                <div data-slider="slide" className="slider-slide active">
                  <div className="slide-inner text-slide">
                    <div className="text-wrap">
                      <DecryptedText
                      text="THỰC HÀNH THỰC TẾ"
                      animateOn="view"
                      sequential={true}
                      revealDirection="start"
                      speed={35}
                      parentClassName="text-heading"
                      className="text-heading"
                      encryptedClassName="text-heading opacity-70"
                    />
                      <TextType
                      as="p"
                      className="text-paragraph"
                      text={`Học song hành với thực hành: sa hình, tình huống giao thông, thói quen xử lý an toàn. Bạn được thực hành thường xuyên, nhận góp ý chi tiết từ giảng viên để tiến bộ nhanh và tự tin khi tham gia giao thông.`}
                      typingSpeed={32}
                      initialDelay={150}
                      startOnVisible={true}
                      showCursor={false}
                      variableSpeed={{ min: 22, max: 48 }}
                    />
                      <a className="text-cta" href="#">Xem lịch học</a>
                    </div>
                  </div>
                </div>
                <div data-slider="slide" className="slider-slide">
                  <div className="slide-inner text-slide">
                    <div className="text-wrap">
                      <DecryptedText
                      text="LỘ TRÌNH RÕ RÀNG"
                      animateOn="view"
                      sequential={true}
                      revealDirection="start"
                      speed={35}
                      parentClassName="text-heading"
                      className="text-heading"
                      encryptedClassName="text-heading opacity-70"
                    />
                      <TextType
                      as="p"
                      className="text-paragraph"
                      text={`Từ lý thuyết nền tảng đến luyện đề, mô phỏng và sát hạch. Mỗi giai đoạn có tài liệu, video hướng dẫn và checklist riêng để bạn không bị bỏ sót nội dung nào trong quá trình chuẩn bị cho kỳ thi.`}
                      typingSpeed={32}
                      initialDelay={150}
                      startOnVisible={true}
                      showCursor={false}
                      variableSpeed={{ min: 22, max: 48 }}
                    />
                      <a className="text-cta" href="#">Tải giáo trình</a>
                    </div>
                  </div>
                </div>
                <div data-slider="slide" className="slider-slide">
                  <div className="slide-inner text-slide">
                    <div className="text-wrap">
                      <DecryptedText
                      text="HỖ TRỢ TOÀN DIỆN"
                      animateOn="view"
                      sequential={true}
                      revealDirection="start"
                      speed={35}
                      parentClassName="text-heading"
                      className="text-heading"
                      encryptedClassName="text-heading opacity-70"
                    />
                      <TextType
                      as="p"
                      className="text-paragraph"
                      text={`Đội ngũ hỗ trợ đồng hành 24/7: giải đáp thắc mắc, sắp xếp lịch học linh hoạt, nhắc nhở tiến độ và chia sẻ mẹo làm bài hiệu quả. Bạn tập trung vào mục tiêu, phần còn lại để chúng tôi lo.`}
                      typingSpeed={32}
                      initialDelay={150}
                      startOnVisible={true}
                      showCursor={false}
                      variableSpeed={{ min: 22, max: 48 }}
                    />
                      <a className="text-cta" href="#">Liên hệ tư vấn</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

