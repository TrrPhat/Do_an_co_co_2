"use client";
import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Earth from "@/components/ui/globe";
import { SparklesCore } from "@/components/ui/sparkles";
import { Label } from "@/components/ui/label";
import { Check, Loader2 } from "lucide-react";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const formRef = useRef(null);
  const isInView = useInView(formRef, { once: true, amount: 0.3 });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // TODO: nối API backend khi có
      console.log("Form submitted:", { name, email, message });
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setName("");
      setEmail("");
      setMessage("");
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section 
      className="relative w-full overflow-hidden py-16 md:py-24"
      style={{
        background: 'linear-gradient(to top, #e6e9f0 0%, #eef1f5 100%)'
      }}
    >
      {/* Tông màu sáng blur effects */}
      <div
        className="absolute top-0 left-0 h-[500px] w-[500px] rounded-full opacity-10 blur-[120px]"
        style={{
          background: 'linear-gradient(135deg, rgba(230, 233, 240, 0.6) 0%, rgba(238, 241, 245, 0.4) 100%)',
        }}
      />
      <div
        className="absolute right-0 bottom-0 h-[300px] w-[300px] rounded-full opacity-10 blur-[100px]"
        style={{
          background: 'linear-gradient(135deg, rgba(238, 241, 245, 0.6) 0%, rgba(230, 233, 240, 0.4) 100%)',
        }}
      />
      <div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full opacity-8 blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(230, 233, 240, 0.4) 0%, rgba(238, 241, 245, 0.3) 100%)',
        }}
      />

      <div className="relative z-10 container mx-auto px-4 md:px-6">
        <div className="border-slate-200/50 bg-white/60 mx-auto max-w-5xl overflow-hidden rounded-[28px] border shadow-xl backdrop-blur-sm">
          <div className="grid md:grid-cols-2">
            <div className="relative p-6 md:p-10" ref={formRef}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={
                  isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                }
                transition={{ duration: 0.5, delay: 0.1 }}
                className="flex w-full gap-2">
                <h2 className="from-slate-900 to-slate-700 mb-2 bg-gradient-to-r bg-clip-text text-4xl font-bold tracking-tight text-transparent md:text-5xl">
                  Liên hệ
                </h2>
                <span className="text-blue-600 relative z-10 w-full text-4xl font-bold tracking-tight italic md:text-5xl">
                  ngay
                </span>
                <SparklesCore
                  id="tsparticles"
                  background="transparent"
                  minSize={0.6}
                  maxSize={1.4}
                  particleDensity={500}
                  className="absolute inset-0 top-0 h-24 w-full"
                  particleColor="#e60a64"
                />
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={
                  isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }
                }
                transition={{ duration: 0.45, delay: 0.2 }}
                className="text-slate-700 leading-relaxed">
                Nhận tư vấn khóa học lái xe B1/B2, lịch khai giảng và lộ trình
                luyện sa hình từ đội ngũ DrivePro Academy.
              </motion.p>

              <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={
                  isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                }
                transition={{ duration: 0.5, delay: 0.3 }}
                onSubmit={handleSubmit}
                className="mt-8 space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <motion.div
                    className="space-y-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}>
                    <Label htmlFor="name">Họ và tên</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Nhập họ tên"
                      required
                    />
                  </motion.div>

                  <motion.div
                    className="space-y-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Nhập email"
                      required
                    />
                  </motion.div>
                </div>

                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}>
                  <Label htmlFor="message">Nội dung cần tư vấn</Label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Mô tả nhu cầu hoặc lịch trống của bạn"
                    required
                    className="h-40 resize-none"
                  />
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-b from-rose-500 to-rose-700 text-white shadow-[0px_2px_0px_0px_rgba(255,255,255,0.3)_inset]">
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Đang gửi...
                      </span>
                    ) : isSubmitted ? (
                      <span className="flex items-center justify-center">
                        <Check className="mr-2 h-4 w-4" />
                        Đã gửi thành công!
                      </span>
                    ) : (
                      <span>Gửi tin nhắn</span>
                    )}
                  </Button>
                </motion.div>
              </motion.form>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="relative my-8 flex items-center justify-center overflow-hidden pr-8">
              <div className="flex flex-col items-center justify-center overflow-hidden">
                <article className="relative mx-auto h-[350px] min-h-60 max-w-[450px] overflow-hidden rounded-3xl border bg-gradient-to-b from-[#e60a64] to-[#e60a64]/5 p-6 text-3xl tracking-tight text-white md:h-[450px] md:min-h-80 md:p-8 md:text-4xl md:leading-[1.05] lg:text-5xl">
                  Đồng hành để bạn tự tin cầm lái.
                  <div className="absolute -right-20 -bottom-20 z-10 mx-auto flex h-full w-full max-w-[300px] items-center justify-center transition-all duration-700 hover:scale-105 md:-right-28 md:-bottom-28 md:max-w-[550px]">
                    <Earth
                      scale={1.1}
                      baseColor={[1, 0, 0.3]}
                      markerColor={[0, 0, 0]}
                      glowColor={[1, 0.3, 0.4]}
                    />
                  </div>
                </article>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}


