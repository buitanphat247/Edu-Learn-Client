import { useEffect, useState, useCallback, useRef } from "react";
import { App } from "antd";

export interface Violation {
  id: string;
  type: string;
  message: string;
  timestamp: string;
}

interface UseAntiCheatProps {
  onViolation?: (type: string, message: string) => void;
  enable?: boolean;
  initialViolationsCount?: number;
}

export const useAntiCheat = ({ onViolation, enable = true, initialViolationsCount = 0 }: UseAntiCheatProps = {}) => {
  const { modal, message } = App.useApp();
  const [violations, setViolations] = useState<Violation[]>([]);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  
  // Pause detection state (for when modals are open)
  const [paused, setPaused] = useState(false);
  const lastViolationTimeRef = useRef<number>(0);
  const fullscreenExitCountRef = useRef<number>(0);

  const enterFullScreenRef = useRef<() => void>(() => {});
  const onViolationRef = useRef(onViolation);

  useEffect(() => {
    onViolationRef.current = onViolation;
  }, [onViolation]);

  // Handle Initial Count
  useEffect(() => {
      if (initialViolationsCount !== undefined && initialViolationsCount > 0) {
          fullscreenExitCountRef.current = initialViolationsCount;
          // Pre-fill violation state with placeholders if they are generic
          const initialLogs: Violation[] = Array.from({ length: initialViolationsCount }, (_, i) => ({
             id: `init-${i}`,
             type: "resumed_violation",
             message: `Cảnh báo vi phạm lần ${i + 1}`,
             timestamp: "Trước đó"
          }));
          setViolations(initialLogs);
      }
  }, [initialViolationsCount]);
  
  // Helper to record violation
  const recordViolation = useCallback((type: string, message: string) => {
    const now = Date.now();
    // If paused, overlay is already showing, OR a violation was recorded < 1 second ago, ignore.
    if (paused || overlayRef.current || (now - lastViolationTimeRef.current < 1000)) return; 

    lastViolationTimeRef.current = now;
    const newViolation: Violation = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      message,
      timestamp: new Date().toLocaleTimeString('vi-VN')
    };
    setViolations(prev => [newViolation, ...prev]);
    if (onViolationRef.current) onViolationRef.current(type, message);
  }, [paused]);

  // Overlay Logic
  const toggleBlockingOverlaySecure = useCallback((show: boolean, msg: string = "Cảnh báo gian lận") => {
      if (paused && show) return; 

      if (show) {
          if (!overlayRef.current) {
            const div = document.createElement("div");
            div.style.cssText = "position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.95);z-index:2147483647;display:flex;flex-direction:column;align-items:center;justify-content:center;color:white;font-size:24px;text-align:center;backdrop-filter:blur(10px);";
            const upperMsg = msg.toUpperCase();
            const isLocked = upperMsg.includes("BỊ KHÓA");
            const isInfo = upperMsg.includes("HẾT LƯỢT");
            const isError = upperMsg.includes("KHÔNG THỂ");
            const isHardBlock = isLocked || isInfo || isError;
            
            let title = "CẢNH BÁO VI PHẠM";
            let icon = "⚠️";
            let btnText = "Quay lại Chế độ Toàn màn hình";
            let titleColor = "#ff4d4f"; // Default Red

            if (isInfo) {
                title = "THÔNG BÁO HỆ THỐNG";
                icon = "ℹ️";
                btnText = "Quay về lớp học";
                titleColor = "#4f46e5"; // Indigo for Info
            } else if (isLocked) {
                title = "BÀI THI ĐÃ BỊ KHÓA";
                icon = "🚫";
                btnText = "Quay lại";
            } else if (isError) {
                title = "KHÔNG THỂ BẮT ĐẦU";
                icon = "🚫";
                btnText = "Quay lại";
            }

            div.innerHTML = `
              <div style="font-size: 60px; margin-bottom: 20px;">${icon}</div>
              <h2 style="color: ${titleColor}; font-weight: bold; font-size: 32px; margin-bottom: 15px;">${title}</h2>
              <p id="overlay-msg" style="margin: 10px 0; font-size: 20px; line-height: 1.6;">${msg}</p>
              <button id="resume-btn" style="margin-top: 40px; padding: 14px 50px; font-size: 18px; background: linear-gradient(135deg, ${isInfo ? '#6366f1 0%, #4f46e5 100%' : '#4f46e5 0%, #7c3aed 100%'}); color: white; border: none; border-radius: 12px; cursor: pointer; font-weight: bold; box-shadow: 0 4px 15px rgba(79, 70, 229, 0.4); transition: transform 0.2s;">
                ${btnText}
              </button>
            `;
            document.body.appendChild(div);
            overlayRef.current = div;
            
            div.querySelector("#resume-btn")?.addEventListener("click", () => {
                if (isHardBlock) {
                    window.dispatchEvent(new CustomEvent("exam_locked_exit"));
                } else {
                    enterFullScreenRef.current();
                }
            });
          } else {
             const p = overlayRef.current.querySelector("#overlay-msg") as HTMLElement;
             if (p) p.innerHTML = msg;
          }
      } else {
          if (overlayRef.current && document.body.contains(overlayRef.current)) {
              document.body.removeChild(overlayRef.current);
          }
          overlayRef.current = null;
      }
  }, [paused]);

  const enterFullScreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        // @ts-ignore
        await document.documentElement.requestFullscreen({ navigationUI: "hide" });
      }
      if ('keyboard' in navigator && 'lock' in (navigator as any).keyboard) {
          try { await (navigator as any).keyboard.lock(['Escape']); } catch (e) { console.error(e); }
      }
      toggleBlockingOverlaySecure(false);
    } catch (err) {
      console.error("Error attempting to enable full-screen mode:", err);
    }
  }, [toggleBlockingOverlaySecure]);

  useEffect(() => {
      enterFullScreenRef.current = enterFullScreen;
  }, [enterFullScreen]);

  const exitFullScreen = useCallback(async () => {
    try {
      if ('keyboard' in navigator && 'unlock' in (navigator as any).keyboard) {
          (navigator as any).keyboard.unlock();
      }
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      }
      toggleBlockingOverlaySecure(false);
    } catch (err) {
      console.error("Error attempting to exit full-screen mode:", err);
    }
  }, [toggleBlockingOverlaySecure]);

  // 0. Prevent Reload/Close (IMPORTANT: BeforeUnload)
  useEffect(() => {
    if (!enable) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // Standard way to trigger browser confirmation dialog
      e.preventDefault();
      e.returnValue = '';
      return '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [enable]);


  // 1. Monitor DevTools (Relaxed Threshold)
  useEffect(() => {
    if (!enable || paused) return;
    const checkDevTools = () => {
        if (paused) return; // Add check inside interval as well
        const threshold = 200; // Increased to reduce false positives
        const widthThreshold = window.outerWidth - window.innerWidth > threshold;
        const heightThreshold = window.outerHeight - window.innerHeight > threshold;
        
        if (widthThreshold || heightThreshold) {
            const msg = "Phát hiện hành vi gian lận!";
            recordViolation("devtools_open", msg);
            toggleBlockingOverlaySecure(true, msg);
        }
    };
    const interval = setInterval(checkDevTools, 2000);
    window.addEventListener('resize', checkDevTools);
    return () => { clearInterval(interval); window.removeEventListener('resize', checkDevTools); };
  }, [enable, recordViolation, toggleBlockingOverlaySecure, paused]);

  // 2. Incident Monitor (Shared for Fullscreen & Focus Loss)
  const lastIncidentTimeRef = useRef<number>(0);
  const wasFullScreenRef = useRef<boolean>(!!document.fullscreenElement);

  const handleOutIncident = useCallback((type: "exit_fullscreen" | "focus_loss", customMsg?: string) => {
    // 0. If overlay is ALREADY showing, do not count further incidents
    if (overlayRef.current) return;

    const now = Date.now();
    // Protect against rapid firing
    if (now - lastIncidentTimeRef.current < 1000) return;
    lastIncidentTimeRef.current = now;

    // 1. Increment incident counter
    fullscreenExitCountRef.current += 1;
    const currentCount = fullscreenExitCountRef.current;

    // 2. Record formal violation EVERY incident (User wants 5 total = lock)
    recordViolation(type, `Cảnh báo vi phạm lần ${currentCount}`);

    // 3. Show overlay immediately
    let displayMsg = "";
    if (currentCount < 5) {
        displayMsg = `Vui lòng QUAY LẠI bài thi ngay!<br/>
                      <span style="font-size:18px; color:#ff4d4f; margin-top:20px; display:block; font-weight:bold;">
                        CẢNH BÁO VI PHẠM LẦN: ${currentCount}/5
                      </span>
                      <p style="font-size:14px; color:#888; margin-top:10px;">(Hệ thống sẽ TỰ ĐỘNG KHÓA bài thi nếu bạn vi phạm đủ 5 lần)</p>`;
    } else {
        displayMsg = `<span style="color:#ff4d4f; font-weight:bold;">BẠN ĐÃ VI PHẠM QUY CHẾ THI ĐỦ 5 LẦN.</span><br/>
                      Bài thi đã bị BỊ KHÓA vĩnh viễn và hệ thống đã tự động nộp bài làm của bạn.`;
    }
    toggleBlockingOverlaySecure(true, displayMsg);
  }, [recordViolation, toggleBlockingOverlaySecure]);

  useEffect(() => {
    if (!enable || paused) return;

    const handleFullScreenChange = () => {
      if (paused) return;
      const isFull = !!document.fullscreenElement;
      const previouslyFull = wasFullScreenRef.current;
      wasFullScreenRef.current = isFull;
      
      setIsFullScreen(isFull);
      
      if (!isFull && previouslyFull && enable) {
        handleOutIncident("exit_fullscreen");
      } else if (isFull) {
        toggleBlockingOverlaySecure(false);
      }
    };
    
    document.addEventListener("fullscreenchange", handleFullScreenChange);
    return () => { 
        document.removeEventListener("fullscreenchange", handleFullScreenChange); 
    };
  }, [enable, handleOutIncident, toggleBlockingOverlaySecure, paused]);

  // 3. Block Keys (Aggressive intercept)
  useEffect(() => {
    if (!enable) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const isCtrlOrCmd = e.ctrlKey || e.metaKey;
      const isAlt = e.altKey;
      const key = e.key.toLowerCase();

      // 1. SILENTLY BLOCK ALL COMBINATIONS (Ctrl/Cmd/Alt + any key)
      // Per user request: This is for prevention, not recorded as violation
      if (isCtrlOrCmd || isAlt) {
        e.preventDefault();
        e.stopImmediatePropagation();
        return false;
      }

      // 2. SILENTLY BLOCK SPECIFIC SINGLE KEYS
      const forbiddenSingleKeys = ["f1", "f2", "f3", "f4", "f5", "f6", "f7", "f8", "f9", "f10", "f11", "f12", "escape"];
      if (forbiddenSingleKeys.includes(key)) {
        e.preventDefault();
        e.stopImmediatePropagation();
        return false;
      }
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      e.stopImmediatePropagation();
      return false;
    };

    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault();
      }
    };

    const handleGesture = (e: any) => {
      e.preventDefault();
    };

    // Use capture phase (true) to intercept events before they reach other handlers
    window.addEventListener("keydown", handleKeyDown, true);
    window.addEventListener("contextmenu", handleContextMenu, true);
    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("gesturestart", handleGesture);
    
    return () => {
        window.removeEventListener("keydown", handleKeyDown, true);
        window.removeEventListener("contextmenu", handleContextMenu, true);
        window.removeEventListener("wheel", handleWheel);
        window.removeEventListener("gesturestart", handleGesture);
    };
  }, [enable]);

  // 4. Visibility & Blur (Strict Alt+Tab Detection)
  useEffect(() => {
    if (!enable || paused) return;

    // Detect Tab Switch / Minimize
    const handleVisibilityChange = () => {
      if (paused) return; 
      if (document.hidden) {
         handleOutIncident("focus_loss");
         document.title = "⚠️ VI PHẠM ⚠️";
      } else {
         document.title = "Làm bài thi";
      }
    };

    // Detect Loss of Focus (Alt+Tab, Click other Window)
    const handleBlur = () => {
        if (paused) return; 
        handleOutIncident("focus_loss");
    };

    window.addEventListener("blur", handleBlur);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("blur", handleBlur);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [enable, handleOutIncident, paused]);

  // FINAL CLEANUP: Ensure overlay is removed when component unmounts
  useEffect(() => {
    return () => {
        if (overlayRef.current && document.body.contains(overlayRef.current)) {
            document.body.removeChild(overlayRef.current);
        }
    };
  }, []);

  return {
    violations,
    isFullScreen,
    enterFullScreen,
    exitFullScreen,
    setPaused,
    toggleBlockingOverlaySecure
  };
};
