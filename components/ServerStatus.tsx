"use client"

import { useEffect, useState } from "react"
import { API_BASE_URL } from "@/lib/api"

type Status = "checking" | "online" | "offline"

export default function ServerStatus() {
  const [status, setStatus] = useState<Status>("checking")
  const [lastChecked, setLastChecked] = useState<string>("")

  const checkStatus = async () => {
    try {
      // Ping the root of the server (strip /api/v1 path)
      const baseUrl = API_BASE_URL.replace(/\/api\/v1$/, "")
      const response = await fetch(baseUrl, {
        method: "GET",
        signal: AbortSignal.timeout(5000),
      })
      setStatus(response.ok ? "online" : "offline")
    } catch {
      setStatus("offline")
    }
    setLastChecked(new Date().toLocaleTimeString())
  }

  useEffect(() => {
    checkStatus()
    const interval = setInterval(checkStatus, 30000)
    return () => clearInterval(interval)
  }, [])

  const dotColor =
    status === "online"
      ? "bg-green-500"
      : status === "offline"
      ? "bg-red-500"
      : "bg-yellow-400"

  const label =
    status === "online"
      ? "Server online"
      : status === "offline"
      ? "Server offline"
      : "Checking server…"

  return (
    <div className="fixed bottom-4 right-4 z-50 group flex items-center gap-2">
      {/* Tooltip */}
      <div className="hidden group-hover:flex flex-col items-end">
        <div className="bg-gray-900 text-white text-xs rounded-md px-3 py-2 shadow-lg whitespace-nowrap">
          <span className="font-medium">{label}</span>
          {lastChecked && (
            <span className="block text-gray-400 mt-0.5">
              Last checked {lastChecked}
            </span>
          )}
        </div>
        <div className="w-2 h-2 bg-gray-900 rotate-45 -mt-1 mr-2" />
      </div>

      {/* Dot */}
      <button
        onClick={checkStatus}
        title={label}
        className="relative flex items-center justify-center w-4 h-4 cursor-pointer"
      >
        {status === "online" && (
          <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping" />
        )}
        <span className={`relative inline-flex rounded-full h-3 w-3 ${dotColor}`} />
      </button>
    </div>
  )
}
