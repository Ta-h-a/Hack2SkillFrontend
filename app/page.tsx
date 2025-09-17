import FileUploadForm from "@/components/upload/FileUploadForm";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50">
      {/* Navigation Bar */}
      <nav className="border-b border-slate-200 bg-white">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                </svg>
              </div>
              <h1 className="text-xl font-semibold text-slate-900">LegalSimplifier</h1>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-slate-100 text-slate-700 text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
              Document Analysis Platform
            </div>
            <h1 className="text-5xl font-bold text-slate-900 mb-6 tracking-tight">
              Simplify Complex 
              <span className="text-slate-600"> Legal Documents</span>
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Upload contracts, agreements, and legal documents to receive instant AI-powered analysis 
              with plain-English explanations and risk assessments.
            </p>
          </div>

          {/* Main Upload Section */}
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Upload Form */}
            <div className="order-2 lg:order-1">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                <div className="mb-6">
                  <h2 className="text-2xl font-semibold text-slate-900 mb-2">Upload Document</h2>
                  <p className="text-slate-600">Select your legal document for analysis</p>
                </div>
                <FileUploadForm />
              </div>
            </div>

            {/* Benefits Preview */}
            <div className="order-1 lg:order-2 space-y-6">
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">Instant Analysis</h3>
                    <p className="text-slate-600 text-sm">Receive comprehensive document analysis within seconds</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">Risk Assessment</h3>
                    <p className="text-slate-600 text-sm">Identify potential risks and unfavorable terms automatically</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-violet-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">Secure Processing</h3>
                    <p className="text-slate-600 text-sm">Enterprise-grade security with zero data retention</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-900 mb-1">500+</div>
                  <div className="text-sm text-slate-600">Documents analyzed today</div>
                </div>
              </div>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="mt-20 text-center">
            <p className="text-sm text-slate-500 mb-6">Trusted by legal professionals and businesses worldwide</p>
            <div className="flex justify-center items-center space-x-8 opacity-60">
              <div className="h-8 w-24 bg-slate-300 rounded"></div>
              <div className="h-8 w-20 bg-slate-300 rounded"></div>
              <div className="h-8 w-28 bg-slate-300 rounded"></div>
              <div className="h-8 w-16 bg-slate-300 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
