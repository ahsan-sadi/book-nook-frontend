"use client";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Spinner as SpinnerIcon } from "@/components/ui/spinner";

export default function ConfirmModal({ open, title, message, confirmLabel, busy, onConfirm, onCancel }) {
    return (
        <Dialog open={open} onOpenChange={(next) => { if (!next) onCancel(); }}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <span className="eyebrow text-destructive before:bg-destructive">Careful</span>
                    <DialogTitle className="display mt-1 text-xl">{title}</DialogTitle>
                    <DialogDescription className="leading-relaxed">{message}</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={onCancel} disabled={busy}>Keep it</Button>
                    <Button variant="destructive" onClick={onConfirm} disabled={busy}>
                        {busy && <SpinnerIcon />}{confirmLabel}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
