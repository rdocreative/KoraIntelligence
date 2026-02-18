"use client";

import { useState, useCallback } from "react";
import { getRandomProgressMessage } from "@/components/ui/toast-progress";

export const useProgressToast = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState("");

  const showProgressToast = useCallback(() => {
    setMessage(getRandomProgressMessage());
    setIsVisible(true);
  }, []);

  const hideProgressToast = useCallback(() => {
    setIsVisible(false);
  }, []);

  return {
    isVisible,
    message,
    showProgressToast,
    hideProgressToast
  };
};