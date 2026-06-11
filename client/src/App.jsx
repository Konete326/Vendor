function App() {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-slate-800 rounded-2xl shadow-xl p-8 text-center border border-slate-700">
        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent mb-4">
          Vendor Application
        </h1>
        <p className="text-slate-400 mb-6">
          Vite + React client setup completed successfully with Tailwind CSS v4!
        </p>
        <div className="inline-block px-4 py-2 bg-slate-700 hover:bg-slate-650 transition rounded-lg text-sm text-teal-300 font-mono">
          src/App.jsx is ready for editing
        </div>
      </div>
    </div>
  )
}

export default App
