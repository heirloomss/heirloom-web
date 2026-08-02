'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { X } from 'lucide-react';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
} from 'react';
import { cn } from '@/utils/cn';

/**
 * Dialog — a paper sheet explaining itself over the page.
 * Fully accessible: focus trap, Escape to close, aria-labelled.
 */

interface DialogContextValue {
  open: boolean;
  onClose: () => void;
  titleId: string;
}

const DialogContext = createContext<DialogContextValue | null>(null);

export function useDialog() {
  const ctx = useContext(DialogContext);
  if (!ctx) throw new Error('Dialog.* components must be used inside <Dialog>');
  return ctx;
}

export function Dialog({
  open,
  onClose,
  title,
  description,
  children,
  size = 'md',
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  size?: 'md' | 'lg';
}) {
  const titleId = useRef(`dialog-${Math.random().toString(36).slice(2, 9)}`).current;
  const reduceMotion = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onClose();
        return;
      }
      if (event.key !== 'Tab' || !panelRef.current) return;

      // Minimal focus trap within the sheet.
      const focusables = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    },
    [onClose],
  );

  useEffect(() => {
    if (!open) return;
    previouslyFocused.current = document.activeElement as HTMLElement | null;
    document.addEventListener('keydown', handleKeyDown, true);
    document.body.style.overflow = 'hidden';
    // Move focus into the sheet.
    const t = window.setTimeout(() => {
      const target =
        panelRef.current?.querySelector<HTMLElement>('input, select, textarea, button') ??
        panelRef.current;
      target?.focus();
    }, 80);
    return () => {
      document.removeEventListener('keydown', handleKeyDown, true);
      document.body.style.overflow = '';
      window.clearTimeout(t);
      previouslyFocused.current?.focus?.();
    };
  }, [open, handleKeyDown]);

  return (
    <DialogContext.Provider value={{ open, onClose, titleId }}>
      <AnimatePresence>
        {open ? (
          <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center sm:p-8">
            {/* Backdrop — dimmed museum light */}
            <motion.button
              aria-label="Close dialog"
              onClick={onClose}
              className="absolute inset-0 cursor-default bg-ink/35 backdrop-blur-[1px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            />
            <motion.div
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              tabIndex={-1}
              className={cn(
                'relative max-h-[88vh] w-full overflow-y-auto rounded-dialog border border-ink/[0.08] bg-cotton p-7 shadow-paper-3 sm:p-9',
                size === 'md' ? 'max-w-lg' : 'max-w-2xl',
              )}
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 26, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.99 }}
              transition={{ duration: 0.4, ease: [0.22, 0.61, 0.36, 1] }}
            >
              <button
                onClick={onClose}
                aria-label="Close"
                className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-linen/70 hover:text-ink"
              >
                <X className="h-5 w-5" aria-hidden />
              </button>
              <h2 id={titleId} className="pr-10 font-display text-3xl">
                {title}
              </h2>
              {description ? (
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{description}</p>
              ) : null}
              <div className="mt-7">{children}</div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
    </DialogContext.Provider>
  );
}

export function DialogActions({ children }: { children: ReactNode }) {
  return <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">{children}</div>;
}
