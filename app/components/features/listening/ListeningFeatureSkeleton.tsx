export default function ListeningFeatureSkeleton() {
  return (
    <div className="min-h-screen bg-[#0f172a] p-4 md:p-8 font-sans">
      <div className="container mx-auto">
        {/* Header Skeleton */}
        <div className="mb-8">
          {/* Breadcrumbs */}
          <div className="mb-6 bg-[#1e293b] border border-slate-700/50 rounded-xl px-6 py-4 h-14 animate-pulse" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-3">
              <div className="h-10 w-80 md:w-96 bg-slate-700/50 rounded-lg animate-pulse" />
              <div className="h-5 w-48 bg-slate-800 rounded animate-pulse" />
            </div>
            {/* Back Button */}
            <div className="w-40 h-9 bg-slate-800 rounded-lg animate-pulse border border-slate-700/50 shadow-lg" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT COLUMN SKELETON */}
          <div className="lg:col-span-7 space-y-6">
            {/* Shortcuts Bar Skeleton */}
            <div className="h-10 bg-slate-800/50 rounded-lg w-full border border-slate-700/50 animate-pulse flex items-center px-3 gap-3">
              <div className="h-3 w-16 bg-slate-700 rounded" />
              <div className="h-3 w-20 bg-slate-700 rounded" />
              <div className="h-3 w-20 bg-slate-700 rounded" />
            </div>

            {/* Progress Badge */}
            <div className="h-5 w-20 bg-blue-600/50 rounded-full animate-pulse" />

            {/* Audio Player Skeleton */}
            <div className="bg-[#1e293b] rounded-2xl h-28 w-full border border-slate-700/50 p-6 flex items-center gap-5 animate-pulse relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-slate-700/30" />

              {/* Play Button Circle */}
              <div className="w-10 h-10 bg-slate-700 rounded-full shrink-0 border border-slate-600" />

              {/* Progress Bar & Time */}
              <div className="flex-1 space-y-2">
                <div className="flex justify-between">
                  <div className="h-2.5 w-8 bg-slate-800 rounded" />
                  <div className="h-2.5 w-8 bg-slate-800 rounded" />
                </div>
                <div className="h-1.5 w-full bg-slate-700 rounded-full" />
              </div>

              {/* Controls */}
              <div className="flex gap-2">
                <div className="w-7 h-7 bg-slate-700 rounded shrink-0" />
                <div className="w-10 h-7 bg-slate-700 rounded shrink-0" />
              </div>
            </div>

            {/* Input Area Skeleton */}
            <div className="space-y-4 animate-pulse">
              <div className="flex items-center gap-2">
                <div className="w-1 h-5 bg-blue-600/50 rounded-full" />
                <div className="h-5 w-32 bg-slate-700 rounded" />
              </div>

              {/* Textarea */}
              <div className="h-28 bg-[#1e293b] rounded-xl border border-slate-700/50 w-full p-4">
                <div className="h-3 w-3/4 bg-slate-800 rounded mb-2" />
                <div className="h-3 w-1/2 bg-slate-800 rounded" />
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <div className="h-10 w-28 bg-emerald-900/20 border border-emerald-500/20 rounded-lg" />
                <div className="h-10 w-28 bg-slate-800/50 border border-slate-700/50 rounded-lg" />
              </div>
            </div>

            {/* Result Box Skeleton */}
            <div className="h-24 bg-[#1e293b] rounded-2xl border border-slate-700/50 border-dashed w-full animate-pulse flex items-center justify-center">
              <div className="h-4 w-1/2 bg-slate-800/50 rounded" />
            </div>
          </div>

          {/* RIGHT COLUMN SKELETON - TRANSCRIPT */}
          <div className="lg:col-span-5 hidden lg:block h-[calc(100vh-8rem)] sticky top-4">
            <div className="bg-[#1e293b] rounded-2xl border border-slate-700/50 h-full flex flex-col overflow-hidden animate-pulse">
              {/* Panel Header */}
              <div className="p-4 border-b border-slate-700/50 flex justify-between items-center bg-[#1e293b]">
                <div className="h-6 w-24 bg-slate-700 rounded" />
                <div className="flex gap-2">
                  <div className="h-7 w-20 bg-slate-800 rounded-full" />
                  <div className="h-7 w-16 bg-slate-800 rounded-full" />
                </div>
              </div>
              {/* List Items */}
              <div className="p-4 space-y-3 flex-1 overflow-hidden">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="h-28 bg-slate-800/20 rounded-xl w-full border border-slate-700/30 flex flex-col justify-center p-4 space-y-3"
                  >
                    <div className="h-3 w-full bg-slate-700/30 rounded" />
                    <div className="h-3 w-5/6 bg-slate-700/30 rounded" />
                    <div className="w-full border-t border-slate-700/30 my-2" />
                    <div className="h-3 w-3/4 bg-slate-700/20 rounded" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
