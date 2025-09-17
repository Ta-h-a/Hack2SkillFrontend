"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { uploadDocument } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function FileUploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [docName, setDocName] = useState("");
  const [docType, setDocType] = useState("pdf");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !docName) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("doc_name", docName);
    formData.append("doc_type", docType);
    try {
      const { uid } = await uploadDocument(formData);
      router.push(`/result/${uid}`);
    } catch (err) {
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="file"
        accept=".pdf,image/*"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFile(e.target.files?.[0] || null)}
        required
      />
      <Input
        type="text"
        placeholder="Document name"
        value={docName}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDocName(e.target.value)}
        required
      />
      <select
        className="border rounded px-2 py-1"
        value={docType}
        onChange={e => setDocType(e.target.value)}
      >
        <option value="pdf">PDF</option>
        <option value="image">Image(s)</option>
      </select>
      <Button type="submit" disabled={loading}>
        {loading ? "Uploading..." : "Upload"}
      </Button>
    </form>
  );
}
