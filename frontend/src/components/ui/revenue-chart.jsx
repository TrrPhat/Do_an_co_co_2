"use client";
import { memo } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { BarChart3, Calendar } from "lucide-react";

// Dynamic chart using real exam stats from backend
export const RevenueChart = memo(({ stats, examStats }) => {
  const byLicense = examStats?.by_license_type || [];
  const maxCount = Math.max(1, ...byLicense.map((i) => Number(i.count) || 0));

  return (
    <div className="border-border bg-card/40 rounded-xl border p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="flex items-center gap-2 text-lg font-semibold">
            <BarChart3 className="h-5 w-5 text-green-500" />
            Thống kê kỳ thi
          </h3>
          <p className="text-muted-foreground text-sm">
            Theo hạng giấy phép và tổng quan toàn hệ thống
          </p>
        </div>
        <Button variant="outline" size="sm" disabled>
          <Calendar className="mr-2 h-4 w-4" />
          Realtime
        </Button>
      </div>

      <div className="relative mb-4 h-64 rounded-lg p-4">
        <div className="flex h-full items-end justify-between gap-3">
          {byLicense.length > 0 ? (
            byLicense.map((item, index) => (
              <div key={item.name || index} className="group flex flex-1 flex-col items-center">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${((Number(item.count) || 0) / maxCount) * 180}px` }}
                  transition={{ duration: 0.8, delay: index * 0.05 }}
                  className={`w-full bg-blue-500 relative min-h-[20px] cursor-pointer rounded-t-lg transition-opacity hover:opacity-80`}>
                  <div className="border-border bg-popover absolute -top-14 left-1/2 z-10 -translate-x-1/2 transform rounded-lg border px-3 py-1.5 text-sm whitespace-nowrap opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                    <div className="font-medium">{item.name || "N/A"}</div>
                    <div className="text-xs text-muted-foreground">{Number(item.count) || 0} bài</div>
                  </div>
                </motion.div>
                <div className="text-muted-foreground mt-2 text-center text-xs font-medium">
                  {item.name || "N/A"}
                </div>
              </div>
            ))
          ) : (
            <div className="text-muted-foreground mx-auto text-sm">Chưa có dữ liệu kỳ thi</div>
          )}
        </div>
      </div>

      <div className="border-border/50 grid grid-cols-2 gap-4 border-t pt-4 sm:grid-cols-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{examStats?.total_exams ?? 0}</div>
          <div className="text-muted-foreground text-xs">Tổng bài thi</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{(stats?.pass_rate ?? 0)}%</div>
          <div className="text-muted-foreground text-xs">Tỷ lệ đạt</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">{examStats?.average_score ?? 0}</div>
          <div className="text-muted-foreground text-xs">Điểm trung bình</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600">{examStats?.average_time_spent ?? 0}</div>
          <div className="text-muted-foreground text-xs">Thời gian TB (phút)</div>
        </div>
      </div>
    </div>
  );
});
RevenueChart.displayName = "RevenueChart";
