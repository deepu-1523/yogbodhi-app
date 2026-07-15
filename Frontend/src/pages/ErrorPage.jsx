import React from 'react';
import { useRouteError, useNavigate, Link } from 'react-router-dom';
import { AlertCircle, ArrowLeft, Home, RefreshCw } from 'lucide-react';

const ErrorPage = () => {
  const error = useRouteError();
  const navigate = useNavigate();
  
  const is404 = error?.status === 404;

  return (
    <div className="min-h-screen bg-[#f8faff] bg-line-grid font-poppins flex items-center justify-center p-6">
      <div className="max-w-xl w-full text-center">
        {/* Brand Icon */}
        <div className="mb-8 flex justify-center">
          <div className="w-24 h-24 rounded-[32px] bg-white border border-gray-100 flex items-center justify-center shadow-2xl shadow-blue-900/5 relative group">
             <div className="absolute inset-0 bg-yellow-50 rounded-[32px] scale-0 group-hover:scale-100 transition-transform duration-500 opacity-50" />
             <AlertCircle size={48} className="text-[#ba9d25] relative z-10" />
          </div>
        </div>

        {/* Error Info */}
        <div className="space-y-4 mb-12">
          <div className="flex items-center justify-center gap-2 mb-2">
             <div className="w-2 h-2 rounded-full bg-[#ba9d25]" />
             <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">
               {is404 ? 'Resource Not Found' : 'Application Error'}
             </p>
          </div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight leading-none">
            {is404 ? '404' : 'Oops! Something broke.'}
          </h1>
          <p className="text-[13px] font-bold text-gray-400 uppercase tracking-tight max-w-sm mx-auto leading-relaxed">
            {is404 
              ? "The section you're looking for doesn't exist or has been moved to a different sector."
              : "We've encountered a technical anomaly in the portal. Our system is monitoring the event."}
          </p>
          {error?.statusText || error?.message ? (
             <div className="mt-4 px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl inline-block">
                <p className="text-[10px] font-mono text-gray-400 uppercase">{error.statusText || error.message}</p>
             </div>
          ) : null}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#0a1628] text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-[#0078FF] transition-all shadow-lg shadow-gray-200"
          >
            <ArrowLeft size={16} /> Go Back
          </button>
          <Link 
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-white border border-gray-100 text-gray-900 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-gray-50 transition-all shadow-xl shadow-blue-900/5"
          >
            <Home size={16} /> Dashboard
          </Link>
          {!is404 && (
            <button 
              onClick={() => window.location.reload()}
              className="p-4 text-gray-400 hover:text-[#0078FF] transition-colors"
              title="Refresh Portal"
            >
              <RefreshCw size={18} />
            </button>
          )}
        </div>

        {/* Footer Brand */}
        <div className="mt-16 pt-8 border-t border-gray-50 flex items-center justify-center gap-3">
           <img src="/logo.svg" alt="Roots" className="h-5 w-auto grayscale opacity-30" />
           <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.4em]">Roots Systems</p>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
