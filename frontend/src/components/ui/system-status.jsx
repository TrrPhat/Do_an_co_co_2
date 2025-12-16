"use client";
import { memo } from "react";
import { motion } from "framer-motion";
import { Shield, Database, Zap } from "lucide-react";

// items: [{ label, status, color, icon, percentage }]
export const SystemStatus = memo(({ items = [] }) => {
  const fallback = [
    { label: "Server Status", status: "Unknown", color: "text-gray-500", icon: Shield, percentage: 0 },
];
  const list = items.length > 0 ? items : fallback;

  return (
    <div className="border-border bg-card/40 rounded-xl border p-6">
      <h3 className="mb-4 text-xl font-semibold">System Status</h3>
      <div className="space-y-4">
        {list.map((item, index) => {
          const Icon = item.icon || Shield;
          const percent = Math.max(0, Math.min(100, Number(item.percentage ?? 0)));
          return (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="hover:bg-accent/50 flex cursor-pointer items-center justify-between rounded-lg p-3 transition-colors">
              <div className="flex items-center gap-3">
                <Icon className={`h-4 w-4 ${item.color || 'text-muted-foreground'}`} />
                <span className="text-sm font-medium">{item.label}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-muted h-2 w-16 overflow-hidden rounded-full">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percent}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                    className={`h-full rounded-full ${(item.color || 'text-muted-foreground').replace('text-', 'bg-')}`}
                  />
                </div>
                <span className={`text-sm font-medium ${item.color || 'text-muted-foreground'} min-w-[80px] text-right`}>
                  {item.status}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
});
SystemStatus.displayName = "SystemStatus";
