"use client";
import { memo } from "react";
import { motion } from "framer-motion";
import { User, Edit3, Trash2, Database, LogIn } from "lucide-react";

// Map backend action/resource to icons/colors
const getIconAndColor = (action = "", resource = "") => {
  const a = String(action || "").toLowerCase();
  const r = String(resource || "").toLowerCase();
  if (a.includes("login")) return { Icon: LogIn, color: "text-green-500" };
  if (a.includes("delete") || a.includes("remove")) return { Icon: Trash2, color: "text-red-500" };
  if (a.includes("update") || a.includes("edit")) return { Icon: Edit3, color: "text-orange-500" };
  if (r.includes("question") || r.includes("exam") || r.includes("course") || r.includes("material")) return { Icon: Database, color: "text-blue-500" };
  return { Icon: User, color: "text-purple-500" };
};

export const RecentActivity = memo(({ activities = [] }) => {
  return (
    <div className="border-border bg-card/40 rounded-xl border p-6">
      <h3 className="mb-4 text-xl font-semibold">Hoạt động gần đây</h3>
      <div className="space-y-3">
        {activities.length > 0 ? (
          activities.map((activity, index) => {
            const { Icon, color } = getIconAndColor(activity.action, activity.resource_type);
          return (
            <motion.div
                key={activity.id ?? index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              className="hover:bg-accent/50 flex items-center gap-3 rounded-lg p-2 transition-colors">
              <div className={`bg-accent/50 rounded-lg p-2`}>
                  <Icon className={`h-4 w-4 ${color}`} />
              </div>
              <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium">
                    {activity.action} {activity.resource_type ? `• ${activity.resource_type}` : ""}
                  </div>
                <div className="text-muted-foreground truncate text-xs">
                    {activity.username ?? (activity.admin_user_id ? `#${activity.admin_user_id}` : "")}
                </div>
              </div>
              <div className="text-muted-foreground text-xs">
                  {activity.created_at ? new Date(activity.created_at).toLocaleString('vi-VN') : ''}
              </div>
            </motion.div>
          );
          })
        ) : (
          <div className="text-muted-foreground text-sm">Chưa có hoạt động</div>
        )}
      </div>
    </div>
  );
});
RecentActivity.displayName = "RecentActivity";
