import { Button } from "@/components/ui/button";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";

interface DialogFooterActionsProps {
  onCancel?: () => void;
  onConfirm: () => void;
  cancelLabel?: string;
  confirmLabel: string;
  loadingLabel?: string;
  isLoading?: boolean;
  disabled?: boolean;
}

export function DialogFooterActions({
  onCancel,
  onConfirm,
  cancelLabel = "Cancelar",
  confirmLabel,
  loadingLabel,
  isLoading = false,
  disabled = false,
}: DialogFooterActionsProps) {
  return (
    <DialogFooter>
      <DialogClose asChild>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          {cancelLabel}
        </Button>
      </DialogClose>
      <Button
        onClick={onConfirm}
        disabled={isLoading || disabled}
        className="bg-primary hover:bg-primary/90 text-white"
      >
        {isLoading && loadingLabel ? loadingLabel : confirmLabel}
      </Button>
    </DialogFooter>
  );
}
