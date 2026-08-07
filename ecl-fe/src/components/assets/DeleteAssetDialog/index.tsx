"use client"

import { useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Delete02Icon } from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useTranslation } from "@/hooks/use-translation"

interface DeleteAssetDialogProps {
  assetName: string
  onConfirm: () => void
}

export function DeleteAssetDialog({ assetName, onConfirm }: DeleteAssetDialogProps) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={t("table.actions.deleteAsset", { name: assetName })}
          />
        }
      >
        <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("deleteAssetDialog.title")}</DialogTitle>
          <DialogDescription>
            {t("deleteAssetDialog.description", { name: assetName })}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" size="sm" />}>
            {t("deleteAssetDialog.cancel")}
          </DialogClose>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              onConfirm()
              setOpen(false)
            }}
          >
            {t("deleteAssetDialog.confirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
