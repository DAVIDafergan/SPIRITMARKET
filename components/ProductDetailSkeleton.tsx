import React from 'react';

const Shimmer: React.FC = () => (
  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-charcoal-800/50 to-transparent animate-shimmer"></div>
);

const ProductDetailSkeleton: React.FC = () => {
  return (
    <div className="bg-charcoal-950">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: Image Skeleton */}
          <div className="space-y-4">
            <div className="aspect-[3/4] bg-charcoal-900 rounded-2xl relative overflow-hidden border border-gold-900/20">
              <Shimmer />
            </div>
          </div>

          {/* Right: Info Skeleton */}
          <div className="space-y-8">
            <div>
              <div className="h-4 w-24 bg-charcoal-800 rounded-md relative overflow-hidden mb-3"><Shimmer /></div>
              <div className="h-10 w-3/4 bg-charcoal-800 rounded-lg relative overflow-hidden mb-4"><Shimmer /></div>
              <div className="h-5 w-1/2 bg-charcoal-800 rounded-md relative overflow-hidden mb-4"><Shimmer /></div>
              <div className="h-5 w-1/3 bg-charcoal-800 rounded-md relative overflow-hidden"><Shimmer /></div>
            </div>

            <div className="border-t border-b border-gold-900/20 py-6 space-y-4">
              <div className="h-10 w-40 bg-charcoal-800 rounded-lg relative overflow-hidden mb-4"><Shimmer /></div>
              <div className="space-y-2">
                <div className="h-4 bg-charcoal-800 rounded-md relative overflow-hidden"><Shimmer /></div>
                <div className="h-4 w-5/6 bg-charcoal-800 rounded-md relative overflow-hidden"><Shimmer /></div>
                <div className="h-4 w-3/4 bg-charcoal-800 rounded-md relative overflow-hidden"><Shimmer /></div>
              </div>
            </div>

            <div className="bg-charcoal-900 p-6 rounded-2xl border border-gold-900/20 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-charcoal-800 rounded-full relative overflow-hidden"><Shimmer /></div>
                <div className="flex-1 space-y-2">
                  <div className="h-5 w-1/2 bg-charcoal-800 rounded-md relative overflow-hidden"><Shimmer /></div>
                  <div className="h-4 w-1/3 bg-charcoal-800 rounded-md relative overflow-hidden"><Shimmer /></div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <div className="flex-1 h-14 bg-charcoal-800 rounded-xl relative overflow-hidden"><Shimmer /></div>
                <div className="flex-1 h-14 bg-charcoal-800 rounded-xl relative overflow-hidden"><Shimmer /></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailSkeleton;
