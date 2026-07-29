import { useState, useRef } from "react";
import { UploadCloud, Image as ImageIcon, Trash2, Loader2, Link as LinkIcon, CheckCircle2 } from "lucide-react";
import api from "@/src/api";
import { toast } from "react-toastify";

export default function ImageUpload({ value, onChange, label = "Image Upload", placeholder = "Drop image here or paste URL..." }) {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [mode, setMode] = useState("upload"); // 'upload' or 'url'
  const fileInputRef = useRef(null);

  const handleUploadFile = async (file) => {
    if (!file) return;

    // Validate image mime type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file (PNG, JPG, WEBP, GIF, SVG).");
      return;
    }

    // Validate size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image size must be less than 10MB.");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await api.post("/upload", formData);

      if (res.data && res.data.url) {
        onChange(res.data.url);
        toast.success("✅ Image uploaded to Cloudinary successfully!");
      }
    } catch (error) {
      console.error("Upload error:", error);
      const errMsg = error.response?.data?.message || error.message || "Upload failed";
      
      if (error.response?.status === 401) {
        toast.error("🔒 Session expired. Please log in again to upload files.");
      } else {
        toast.error(`❌ Failed to upload image: ${errMsg}`);
      }
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUploadFile(e.dataTransfer.files[0]);
    }
  };

  const handleChangeFile = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleUploadFile(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
          <ImageIcon size={15} className="text-primary" /> {label}
        </label>
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-border/80 text-xs font-bold">
          <button
            type="button"
            onClick={() => setMode("upload")}
            className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
              mode === "upload"
                ? "bg-primary text-white shadow-sm"
                : "text-slate-500 hover:text-foreground"
            }`}
          >
            Drag & Drop
          </button>
          <button
            type="button"
            onClick={() => setMode("url")}
            className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
              mode === "url"
                ? "bg-primary text-white shadow-sm"
                : "text-slate-500 hover:text-foreground"
            }`}
          >
            Paste URL
          </button>
        </div>
      </div>

      {mode === "upload" ? (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => !uploading && fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center min-h-[140px] bg-slate-100/50 dark:bg-slate-950/50 ${
            dragActive
              ? "border-primary bg-primary/10 scale-[1.01]"
              : value
              ? "border-emerald-500/40 hover:border-primary/60"
              : "border-border/80 hover:border-primary/50 hover:bg-slate-100/80 dark:hover:bg-slate-900/60"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleChangeFile}
            className="hidden"
          />

          {uploading ? (
            <div className="flex flex-col items-center gap-2 py-3">
              <Loader2 className="animate-spin text-primary" size={32} />
              <p className="text-xs font-bold text-primary">Uploading to Cloudinary...</p>
            </div>
          ) : value ? (
            <div className="flex items-center gap-4 w-full justify-between px-2">
              <div className="flex items-center gap-3 overflow-hidden">
                <img
                  src={value}
                  alt="Preview"
                  className="w-16 h-16 rounded-xl object-cover border-2 border-emerald-500/50 shadow-md shrink-0 bg-slate-900"
                />
                <div className="text-left overflow-hidden">
                  <span className="text-xs font-bold text-emerald-500 flex items-center gap-1">
                    <CheckCircle2 size={13} /> Image Uploaded
                  </span>
                  <p className="text-[11px] text-muted-foreground truncate max-w-[220px] font-mono mt-0.5">
                    {value}
                  </p>
                  <p className="text-[10px] text-primary font-bold mt-1 hover:underline">
                    Click or Drop to replace image
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onChange("");
                }}
                className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 transition-colors shrink-0"
                title="Remove image"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 py-3 text-slate-500 dark:text-slate-400">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-primary mb-1">
                <UploadCloud size={24} />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">
                  Drag & Drop image here, or <span className="text-primary hover:underline">Browse</span>
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Supports PNG, JPG, WEBP, GIF up to 10MB
                </p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          <div className="relative">
            <LinkIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <input
              type="text"
              value={value || ""}
              onChange={(e) => onChange(e.target.value)}
              className="w-full bg-slate-100/70 dark:bg-slate-950/70 border border-border/80 rounded-xl pl-10 pr-10 py-3 outline-none focus:border-primary transition-colors text-foreground text-sm font-medium"
              placeholder={placeholder}
            />
            {value && (
              <button
                type="button"
                onClick={() => onChange("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500 hover:text-red-600 p-1"
              >
                <Trash2 size={15} />
              </button>
            )}
          </div>
          {value && (
            <div className="flex items-center gap-3 p-2 bg-slate-100/80 dark:bg-slate-900/80 border border-border/80 rounded-xl">
              <img src={value} alt="Preview" className="w-10 h-10 rounded-lg object-cover border border-border bg-slate-900" />
              <span className="text-xs text-muted-foreground font-mono truncate">{value}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
