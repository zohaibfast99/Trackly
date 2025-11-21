"use client";

import React from "react";
import { motion } from "framer-motion";

export const DashboardSkeleton = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-background"
    >
      {/* Header */}
      <div className="h-16 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="flex items-center justify-between h-full px-6">
          <div className="flex items-center gap-4">
            <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
            <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <div className="w-64 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
          <div className="space-y-4">
            <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            <div className="space-y-2">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-2">
                  <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
            
            <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
              <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-3"></div>
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3 p-2">
                    <div className="h-6 w-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 bg-gray-50 dark:bg-gray-950">
          {/* Page Header */}
          <div className="mb-6">
            <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
            <div className="h-4 w-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-800">
                <div className="flex items-center justify-between mb-2">
                  <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                </div>
                <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-1"></div>
                <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              </div>
            ))}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-800">
              <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4"></div>
              <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-800">
              <div className="h-6 w-28 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4"></div>
              <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
          </div>

          {/* Table Section */}
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
            <div className="p-6 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <div className="h-6 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center gap-4 p-3 border border-gray-200 dark:border-gray-800 rounded">
                    <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                    <div className="flex-1">
                      <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-1"></div>
                      <div className="h-3 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    </div>
                    <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Loading Text */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="flex items-center gap-3 bg-white dark:bg-gray-900 px-4 py-2 rounded-full border border-gray-200 dark:border-gray-800 shadow-lg">
          <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-700 dark:text-gray-300 text-sm font-medium">Setting up your workspace...</p>
        </div>
      </div>
    </motion.div>
  );
};