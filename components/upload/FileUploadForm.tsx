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
    <form onSubmit={handleSubmit} className="space-y-6" aria-labelledby="upload-form-title">
      <h2 id="upload-form-title" className="sr-only">Upload Document</h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="file-upload" className="block text-sm font-medium mb-2 text-gray-700">Choose file</label>
          <Input
            id="file-upload"
            type="file"
            accept=".pdf,image/*"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFile(e.target.files?.[0] || null)}
            required
            aria-describedby="file-help"
            className="w-full"
          />
          <p id="file-help" className="text-xs text-gray-500 mt-1">Select a PDF or image file to upload.</p>
        </div>
        <div>
          <label htmlFor="doc-name" className="block text-sm font-medium mb-2 text-gray-700">Document name</label>
          <Input
            id="doc-name"
            type="text"
            placeholder="Document name"
            value={docName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDocName(e.target.value)}
            required
            aria-describedby="name-help"
            className="w-full"
          />
          <p id="name-help" className="text-xs text-gray-500 mt-1">Enter a name for your document.</p>
        </div>
        <div>
          <label htmlFor="doc-type" className="block text-sm font-medium mb-2 text-gray-700">Document type</label>
          <select
            id="doc-type"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={docType}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setDocType(e.target.value)}
            aria-describedby="type-help"
          >
            <option value="pdf">PDF</option>
            <option value="image">Image(s)</option>
          </select>
          <p id="type-help" className="text-xs text-gray-500 mt-1">Choose the type of document.</p>
        </div>
      </div>
      <Button type="submit" disabled={loading} aria-describedby="submit-help" className="w-full">
        {loading ? "Uploading..." : "Upload"}
      </Button>
      <p id="submit-help" className="sr-only">Click to upload the document and proceed to analysis.</p>
    </form>
  );
}
