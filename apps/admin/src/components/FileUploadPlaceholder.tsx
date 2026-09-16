import { FileCheck2, UploadCloud } from "lucide-react";
import { useRef, useState } from "react";

type FileUploadPlaceholderProps = {
  label?: string;
  accept?: string;
  acceptTypes?: string;
  multiple?: boolean;
  inputId?: string;
  onFilesSelected?: (files: File[]) => void;
};

export function FileUploadPlaceholder({
  label = "Upload file",
  accept = "Images or documents",
  acceptTypes = "image/jpeg,image/png,image/webp,application/pdf",
  multiple = false,
  inputId,
  onFilesSelected,
}: FileUploadPlaceholderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileNames, setFileNames] = useState<string[]>([]);

  function select(files: FileList | null) {
    const next = Array.from(files ?? []);
    setFileNames(next.map((file) => file.name));
    onFilesSelected?.(next);
  }

  return <div>
    <input ref={inputRef} id={inputId} type="file" accept={acceptTypes} multiple={multiple} className="sr-only" onChange={(event) => select(event.target.files)}/>
    <button type="button" onClick={() => inputRef.current?.click()} className="grid min-h-28 w-full place-items-center rounded-lg border border-dashed border-border bg-snow p-4 text-center hover:border-river hover:bg-mist">
      <span>{fileNames.length ? <FileCheck2 className="mx-auto text-pine" size={22}/> : <UploadCloud className="mx-auto text-river" size={22}/>}<strong className="mt-2 block text-sm text-charcoal">{fileNames.length ? `${fileNames.length} file${fileNames.length === 1 ? "" : "s"} selected` : label}</strong><small className="mt-1 block break-all text-xs leading-5 text-stone">{fileNames.length ? fileNames.join(", ") : `${accept} · Stored in this session only`}</small></span>
    </button>
  </div>;
}
