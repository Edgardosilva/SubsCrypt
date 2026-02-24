"use client";

import { useState, useEffect, useRef } from "react";
import { Bell } from "lucide-react";
import { useRouter } from "next/navigation";
import type { Notification } from "@/generated/prisma";

type NotificationData = Notification;

interface NotificationsResponse {
  notifications: NotificationData[];
  unreadCount: number;
}

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Fetch notificaciones
  const fetchNotifications = async (generate = false) => {
    try {
      setLoading(true);
      const url = `/api/notifications?${generate ? "generate=true" : ""}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Error al obtener notificaciones");
      const data: NotificationsResponse = await response.json();
      setNotifications(data.notifications);
      setUnreadCount(data.unreadCount);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };



  // Cargar notificaciones al montar y generar automáticamente
  useEffect(() => {
    fetchNotifications(true);
  }, []);

  // Al abrir la campana: marcar todas como leídas automáticamente
  useEffect(() => {
    if (isOpen && unreadCount > 0) {
      // Optimistic update inmediato
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
      // Persistir en BD en background
      fetch("/api/notifications", { method: "PATCH" }).catch(() => null);
    }
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  // Click outside para cerrar
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  // Estilos por prioridad
  const getPriorityStyles = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return "border-l-4 border-red-500 bg-red-500/5";
      case "MEDIUM":
        return "border-l-4 border-amber-500 bg-amber-500/5";
      default:
        return "border-l-4 border-blue-500 bg-blue-500/5";
    }
  };

  const getPriorityDot = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return "bg-red-500";
      case "MEDIUM":
        return "bg-amber-500";
      default:
        return "bg-blue-500";
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Botón de campana */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
        aria-label="Notificaciones"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white font-bold">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="fixed inset-x-2 top-16 z-50 overflow-hidden rounded-lg border border-white/10 bg-slate-900 shadow-xl sm:absolute sm:inset-x-auto sm:right-0 sm:top-auto sm:mt-2 sm:w-96">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
            <div>
              <h3 className="text-sm font-semibold text-white">
                Notificaciones
              </h3>
            </div>
          </div>

          {/* Lista de notificaciones */}
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="px-4 py-8 text-center text-white/50 text-sm">
                Cargando...
              </div>
            ) : notifications.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <Bell className="h-12 w-12 mx-auto mb-3 text-white/20" />
                <p className="text-sm text-white/50">
                  No tienes notificaciones
                </p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`relative px-4 py-3 border-b border-white/5 ${
                    getPriorityStyles(notification.priority)
                  } ${notification.read ? "opacity-60" : ""}`}
                >
                  <div className="flex items-start gap-2">
                    {/* Dot indicador de no leída */}
                    {!notification.read && (
                      <div
                        className={`h-2 w-2 rounded-full mt-1 shrink-0 ${getPriorityDot(
                          notification.priority
                        )}`}
                      />
                    )}

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">
                        {notification.title}
                      </p>
                      <p className="text-xs text-white/70 mt-0.5">
                        {notification.message}
                      </p>
                      <p className="text-xs text-white/40 mt-1">
                        {new Date(notification.createdAt).toLocaleDateString(
                          "es-ES",
                          {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-4 py-2 border-t border-white/10 text-center">
              <button
                onClick={() => {
                  setIsOpen(false);
                  router.push("/dashboard");
                }}
                className="text-xs text-indigo-400 hover:text-indigo-300"
              >
                Ver dashboard
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
