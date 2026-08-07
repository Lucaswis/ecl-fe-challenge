"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { Linkedin01Icon } from "@hugeicons/core-free-icons"

import { useTranslation } from "@/hooks/use-translation"

export function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="border-t border-border px-6 py-4 text-sm text-muted-foreground">
      <div className="flex items-center justify-center gap-1.5">
        <span>{t("footer.createdBy")}:</span>
        <a
          href="https://www.linkedin.com/in/lucas-wisgikl/"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 font-medium text-foreground hover:underline"
        >
          <HugeiconsIcon icon={Linkedin01Icon} strokeWidth={2} className="size-4" />
          Lucas Wisgikl
        </a>
      </div>
    </footer>
  )
}
