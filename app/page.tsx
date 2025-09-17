import FileUploadForm from "@/components/upload/FileUploadForm";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Upload a Legal Document</h1>
        <FileUploadForm />
      </div>
    </main>
  );
}
