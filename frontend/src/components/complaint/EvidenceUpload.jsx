
import { useRef, useState } from "react";
import { UploadCloud, X, FileText } from "lucide-react";

const MAX_FILES = 5;
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "application/pdf"];

const EvidenceUpload = ({ onFilesChange }) => {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  const updateFiles = (nextFiles) => {
    setFiles(nextFiles);
    onFilesChange?.(nextFiles);
  };

  const handleChange = (event) => {
    const selected = Array.from(event.target.files || []);
    event.target.value = "";
    setError("");

    const invalidType = selected.find((file) => !ALLOWED_TYPES.includes(file.type));
    if (invalidType) {
      setError("Only JPG, PNG, WEBP images and PDF files are allowed.");
      return;
    }

    const oversized = selected.find((file) => file.size > MAX_FILE_SIZE);
    if (oversized) {
      setError(`${oversized.name} exceeds the 10 MB per-file limit.`);
      return;
    }

    const existingKeys = new Set(files.map((file) => `${file.name}:${file.size}:${file.lastModified}`));
    const uniqueSelected = selected.filter(
      (file) => !existingKeys.has(`${file.name}:${file.size}:${file.lastModified}`)
    );

    if (files.length + uniqueSelected.length > MAX_FILES) {
      setError(`You can attach up to ${MAX_FILES} files.`);
      return;
    }

    updateFiles([...files, ...uniqueSelected]);
  };

  const removeFile = (index) => {
    setError("");
    updateFiles(files.filter((_, fileIndex) => fileIndex !== index));
  };

  return (
    <div>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="flex w-full flex-col items-center justify-center rounded-xl border border-dashed border-teal-300 bg-white p-6 text-center transition hover:bg-teal-50"
      >
        <UploadCloud size={32} className="text-teal-600" />
        <span className="mt-3 text-sm font-semibold text-slate-700">
          Choose evidence files
        </span>
        <span className="mt-1 text-xs text-slate-400">
          JPG, PNG, WEBP or PDF · Up to 5 files · 10 MB each
        </span>
      </button>

      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp,application/pdf"
        onChange={handleChange}
        className="hidden"
      />

      {error && (
        <p role="alert" className="mt-3 rounded-lg bg-rose-50 p-3 text-xs text-rose-700">
          {error}
        </p>
      )}

      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map((file, index) => (
            <div
              key={`${file.name}-${file.lastModified}-${index}`}
              className="flex items-center justify-between gap-3 rounded-xl bg-white p-3 shadow-sm"
            >
              <div className="flex min-w-0 items-center gap-3">
                <FileText size={18} className="shrink-0 text-teal-600" />
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold text-slate-700">{file.name}</p>
                  <p className="text-[10px] text-slate-400">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button
                type="button"
                aria-label={`Remove ${file.name}`}
                onClick={() => removeFile(index)}
                className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EvidenceUpload;
