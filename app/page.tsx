export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center flex-1 text-center px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <h1 className="text-5xl font-bold mb-4">Global Pay. No Borders.</h1>
        <p className="max-w-xl text-lg mb-6">
          Send and receive money instantly, anywhere in the world — powered by blockchain.
        </p>
        <button className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg shadow hover:bg-gray-100 transition">
          Connect Wallet
        </button>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 bg-white">
        <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">Why Saadabhejo?</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-gray-50 p-6 rounded-lg shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-2">⚡ Fast Transfers</h3>
            <p>Instant settlements with blockchain-powered infrastructure.</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-2">🔒 Secure</h3>
            <p>End-to-end encrypted transactions to keep your funds safe.</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-2">🌍 Global Reach</h3>
            <p>Send and receive from anywhere — no borders, no limits.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white text-center py-4">
        <p>© 2025 Saadabhejo. All rights reserved.</p>
      </footer>
    </div>
  );
}
