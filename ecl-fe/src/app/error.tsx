"use client"

import { useEffect } from "react"

import { Button } from "@/components/ui/button"

interface ErrorProps {
  error: Error & { digest?: string }
  retry: () => void
}

export default function Error({ error, retry }: ErrorProps) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-32 text-center motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-95">
      <h2 className="text-lg font-semibold text-foreground">
        No pudimos conectar con el backend
      </h2>
      <p className="max-w-md text-sm text-muted-foreground">
        ¿Está levantado{" "}
        <code className="rounded bg-muted px-1 py-0.5 text-xs">docker compose up -d</code>?
      </p>
      <Button onClick={() => retry()}>Reintentar</Button>
    </div>
  )
}
