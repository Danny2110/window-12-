#!/usr/bin/env python3
import os
import shutil
import subprocess
import tarfile
import zipfile
import tkinter as tk
from tkinter import filedialog, messagebox, ttk

SUPPORTED = [".zip", ".rar", ".7z", ".tar", ".tar.gz", ".tgz", ".tar.bz2", ".tbz2", ".tar.xz", ".txz"]


def detect_kind(path: str) -> str:
    p = path.lower()
    if p.endswith(".tar.gz") or p.endswith(".tgz"):
        return "tar.gz"
    if p.endswith(".tar.bz2") or p.endswith(".tbz2"):
        return "tar.bz2"
    if p.endswith(".tar.xz") or p.endswith(".txz"):
        return "tar.xz"
    if p.endswith(".tar"):
        return "tar"
    if p.endswith(".zip"):
        return "zip"
    if p.endswith(".rar"):
        return "rar"
    if p.endswith(".7z"):
        return "7z"
    return "unknown"


def command_exists(cmd: str) -> bool:
    return shutil.which(cmd) is not None


def extract_native(path: str, destination: str, kind: str) -> None:
    if kind == "zip":
        with zipfile.ZipFile(path, "r") as zf:
            zf.extractall(destination)
        return
    if kind in {"tar", "tar.gz", "tar.bz2", "tar.xz"}:
        with tarfile.open(path, "r:*") as tf:
            tf.extractall(destination)
        return
    raise RuntimeError("No native extractor for this format")


def extract_external(path: str, destination: str, kind: str) -> None:
    candidates = []
    if kind in {"rar", "7z"}:
        candidates = [
            ["7z", "x", "-y", f"-o{destination}", path],
            ["unar", "-o", destination, path],
            ["unrar", "x", "-o+", path, destination],
            ["bsdtar", "-xf", path, "-C", destination],
        ]
    else:
        candidates = [["bsdtar", "-xf", path, "-C", destination]]

    last_error = ""
    for cmd in candidates:
        if command_exists(cmd[0]):
            proc = subprocess.run(cmd, capture_output=True, text=True)
            if proc.returncode == 0:
                return
            last_error = proc.stderr.strip() or proc.stdout.strip() or f"{cmd[0]} failed"

    raise RuntimeError(last_error or "No supported extractor found (install 7z/unar/unrar/bsdtar)")


def extract_archive(path: str, destination: str) -> None:
    kind = detect_kind(path)
    if kind == "unknown":
        raise RuntimeError("Unsupported archive format")

    os.makedirs(destination, exist_ok=True)

    if kind in {"zip", "tar", "tar.gz", "tar.bz2", "tar.xz"}:
        extract_native(path, destination, kind)
    else:
        extract_external(path, destination, kind)


class ExtractXApp:
    def __init__(self, root: tk.Tk):
        self.root = root
        self.root.title("ExtractX")
        self.root.geometry("900x560")
        self.root.minsize(760, 500)

        self.archive_path = tk.StringVar()
        self.output_dir = tk.StringVar(value=os.path.expanduser("~/Downloads"))
        self.status = tk.StringVar(value="Ready")

        self._theme()
        self._layout()

    def _theme(self) -> None:
        self.root.configure(bg="#0d1320")
        style = ttk.Style()
        style.theme_use("clam")
        style.configure("Card.TFrame", background="#122036")
        style.configure("Title.TLabel", background="#122036", foreground="#f4f8ff", font=("Avenir Next", 24, "bold"))
        style.configure("Body.TLabel", background="#122036", foreground="#d8e7ff", font=("Avenir Next", 12))
        style.configure("Glass.TButton", background="#2e6cff", foreground="#ffffff", borderwidth=0, padding=8)
        style.map("Glass.TButton", background=[("active", "#4f84ff")])
        style.configure("Input.TEntry", fieldbackground="#0f1a2a", foreground="#f4f8ff")

    def _layout(self) -> None:
        container = ttk.Frame(self.root, style="Card.TFrame", padding=24)
        container.pack(fill="both", expand=True, padx=22, pady=22)

        ttk.Label(container, text="ExtractX", style="Title.TLabel").pack(anchor="w")
        ttk.Label(
            container,
            text="Modern archive extraction for .zip, .rar, .7z, .tar* with automatic engine fallback.",
            style="Body.TLabel",
        ).pack(anchor="w", pady=(4, 18))

        self._row(container, "Archive", self.archive_path, self.pick_archive)
        self._row(container, "Destination", self.output_dir, self.pick_output)

        features = tk.Text(
            container,
            height=7,
            bg="#0f1a2a",
            fg="#d8e7ff",
            relief="flat",
            padx=12,
            pady=12,
            font=("Menlo", 11),
        )
        features.insert(
            "1.0",
            "• Smart format detection\n"
            "• Native extract path for ZIP/TAR\n"
            "• External fallback: 7z / unar / unrar / bsdtar\n"
            "• Safe destination creation\n"
            "• Useful failure diagnostics",
        )
        features.configure(state="disabled")
        features.pack(fill="x", pady=14)

        button_row = ttk.Frame(container, style="Card.TFrame")
        button_row.pack(fill="x")
        ttk.Button(button_row, text="Extract Now", style="Glass.TButton", command=self.extract).pack(side="left")
        ttk.Button(button_row, text="Clear", command=self.clear).pack(side="left", padx=10)

        ttk.Label(container, textvariable=self.status, style="Body.TLabel").pack(anchor="w", pady=(16, 0))

    def _row(self, parent: ttk.Frame, label: str, variable: tk.StringVar, chooser) -> None:
        frame = ttk.Frame(parent, style="Card.TFrame")
        frame.pack(fill="x", pady=8)
        ttk.Label(frame, text=label, style="Body.TLabel", width=11).pack(side="left")
        entry = ttk.Entry(frame, textvariable=variable, style="Input.TEntry")
        entry.pack(side="left", fill="x", expand=True)
        ttk.Button(frame, text="Browse", command=chooser).pack(side="left", padx=10)

    def pick_archive(self) -> None:
        path = filedialog.askopenfilename(
            title="Select Archive",
            filetypes=[("Archives", "*.zip *.rar *.7z *.tar *.tgz *.tar.gz *.tar.bz2 *.tar.xz")],
        )
        if path:
            self.archive_path.set(path)

    def pick_output(self) -> None:
        path = filedialog.askdirectory(title="Select Extraction Folder")
        if path:
            self.output_dir.set(path)

    def clear(self) -> None:
        self.archive_path.set("")
        self.status.set("Ready")

    def extract(self) -> None:
        archive = self.archive_path.get().strip()
        output = self.output_dir.get().strip()

        if not archive:
            messagebox.showerror("ExtractX", "Choose an archive file first.")
            return

        if not os.path.exists(archive):
            messagebox.showerror("ExtractX", "Archive path does not exist.")
            return

        try:
            self.status.set("Extracting...")
            self.root.update_idletasks()
            extract_archive(archive, output)
            self.status.set("Extraction complete")
            messagebox.showinfo("ExtractX", "Archive extracted successfully.")
        except Exception as exc:
            self.status.set("Failed")
            messagebox.showerror("ExtractX", f"Extraction failed:\n{exc}")


def main() -> None:
    root = tk.Tk()
    app = ExtractXApp(root)
    root.mainloop()


if __name__ == "__main__":
    main()
