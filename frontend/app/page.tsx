import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'QANI - AI-Powered Recruitment Screening',
  description: 'Intelligent candidate qualification engine',
};

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            QANI Platform
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            AI-Powered Recruitment Screening
          </p>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Streamline your hiring process with conversational AI screening
          </p>
        </div>

        {/* Status */}
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8 mb-12">
          <div className="space-y-6">
            {/* API Status */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-semibold text-gray-900">API Status</h3>
                <p className="text-sm text-gray-600">Backend server connection</p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-600 font-medium">Connected</span>
              </div>
            </div>

            {/* Database Status */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-semibold text-gray-900">Database</h3>
                <p className="text-sm text-gray-600">PostgreSQL connection</p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-600 font-medium">Connected</span>
              </div>
            </div>

            {/* OpenAI Status */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-semibold text-gray-900">OpenAI API</h3>
                <p className="text-sm text-gray-600">AI integration status</p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-600 font-medium">Ready</span>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {/* Feature 1 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">🤖</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              AI Screening
            </h3>
            <p className="text-gray-600">
              Conversational AI that engages candidates naturally while gathering operational information
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">⚙️</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Rules Engine
            </h3>
            <p className="text-gray-600">
              Structured qualification rules with mandatory criteria and weighted scoring
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Dashboard
            </h3>
            <p className="text-gray-600">
              Real-time insights into candidate progress and qualification outcomes
            </p>
          </div>
        </div>

        {/* Quick Links */}
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Get Started</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/auth/login"
              className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
            >
              Login
            </a>
            <a
              href="/auth/register"
              className="px-8 py-3 bg-white text-indigo-600 border-2 border-indigo-600 rounded-lg font-semibold hover:bg-indigo-50 transition"
            >
              Register
            </a>
          </div>
        </div>

        {/* Development Info */}
        <div className="mt-16 max-w-2xl mx-auto bg-blue-50 border border-blue-200 rounded-lg p-6">
          <p className="text-sm text-blue-900">
            <strong>Development Status:</strong> Sprint 1 - Foundation phase. Database schema created, API structure in place. Ready for implementation.
          </p>
        </div>
      </div>
    </main>
  );
}
