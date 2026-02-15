"use client";

import { Zap, Crown } from "lucide-react";

interface UsageStatsProps {
  messagesUsedToday: number;
  dailyLimit: number;
  hasPaidSubscription: boolean;
}

export function UsageStats({
  messagesUsedToday,
  dailyLimit,
  hasPaidSubscription,
}: UsageStatsProps) {
  const percentage = (messagesUsedToday / dailyLimit) * 100;
  const isNearLimit = percentage >= 80;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-600 flex items-center gap-1">
          <Zap className="h-4 w-4" />
          Daily Usage
        </span>
        <span className="font-medium text-gray-900">
          {messagesUsedToday}/{dailyLimit}
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${
            isNearLimit
              ? "bg-red-500"
              : hasPaidSubscription
              ? "bg-purple-500"
              : "bg-blue-500"
          }`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>

      {!hasPaidSubscription && (
        <a
          href="/pricing"
          className="flex items-center gap-2 text-xs text-gray-600 hover:text-gray-900 transition-colors"
        >
          <Crown className="h-3 w-3" />
          <span>Upgrade for {dailyLimit * 20}+ messages/day</span>
        </a>
      )}

      {isNearLimit && (
        <p className="text-xs text-red-600">
          {hasPaidSubscription
            ? "You're approaching your daily limit"
            : "Almost at your daily limit. Upgrade for more!"}
        </p>
      )}
    </div>
  );
}
