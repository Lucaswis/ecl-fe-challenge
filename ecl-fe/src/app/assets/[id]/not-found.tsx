import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-32 text-center motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-95">
      <h2 className="text-lg font-semibold text-foreground">No encontramos este asset</h2>
      <p className="max-w-md text-sm text-muted-foreground">
        Puede que el id no exista o haya sido eliminado.
      </p>
      <Link href="/" className={buttonVariants({ variant: "outline" })}>
        Volver al listado
      </Link>
    </div>
  )
}
