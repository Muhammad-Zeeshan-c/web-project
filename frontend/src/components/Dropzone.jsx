import { Upload, FileText, AlertCircle } from 'lucide-react';
import { useState, useRef } from 'react';

// Dropzone component - lets users drag-and-drop or click to upload a resume file
// Props:
//   onFileSelected - function called when user picks a valid file
//   disabled - if true, the dropzone cannot be clicked
export const Dropzone = ({ onFileSelected, disabled = false }) => {
  // isDragging tracks whether user is currently dragging a file over the zone
  const [isDragging, setIsDragging] = useState(false);
  // validationError stores any error message (wrong file type, too large, etc.)
  const [validationError, setValidationError] = useState(null);
  // inputRef is a reference to the hidden <input type="file"> element
  const inputRef = useRef(null);

  // Check if the file is valid (correct type and size)
  const validateFile = (file) => {
    // Check file extension
    const validName = file.name.match(/\.(pdf|doc|docx)$/i);
    if (!validName) {
      return 'Please upload a PDF or Word document (.pdf, .doc, .docx)';
    }
    // Check file size (max 5MB = 5 * 1024 * 1024 bytes)
    if (file.size > 5 * 1024 * 1024) {
      return 'File size exceeds 5MB limit';
    }
    return null; // null means no error
  };

  // Handle a file that was dropped or selected
  const handleFile = (file) => {
    const error = validateFile(file);
    if (error) {
      setValidationError(error);
      return;
    }
    setValidationError(null);
    onFileSelected(file);
  };

  // When user drags a file over the zone
  const handleDragOver = (e) => {
    e.preventDefault(); // prevent browser from opening the file
    setIsDragging(true);
  };

  // When user drags a file away from the zone
  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  // When user drops a file onto the zone
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0]; // get the first dropped file
    if (file) handleFile(file);
  };

  // When user selects a file via the file picker dialog
  const handleInputChange = (e) => {
    const file = e.target.files[0];
    if (file) handleFile(file);
  };

  return (
    <div className="w-full">
      <div
        onDragOver={!disabled ? handleDragOver : undefined}
        onDragLeave={!disabled ? handleDragLeave : undefined}
        onDrop={!disabled ? handleDrop : undefined}
        onClick={!disabled ? () => inputRef.current?.click() : undefined}
        className={`relative border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-300 cursor-pointer select-none
          ${isDragging ? 'border-emerald-500 bg-emerald-50 scale-[1.01]' : 'border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-white'}
          ${disabled ? 'opacity-60 cursor-not-allowed pointer-events-none' : ''}
        `}
      >
        {/* Hidden file input - triggered when user clicks the dropzone */}
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleInputChange}
          className="hidden"
        />

        {/* Upload icon */}
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-colors ${isDragging ? 'bg-emerald-100' : 'bg-white border border-slate-200 shadow-sm'}`}>
          <Upload size={24} className={isDragging ? 'text-emerald-600' : 'text-slate-500'} />
        </div>

        {/* Title text - changes based on drag state */}
        <h3 className="text-base font-semibold text-slate-800 mb-1">
          {isDragging ? 'Drop your resume here' : 'Upload your resume'}
        </h3>
        <p className="text-sm text-slate-500 mb-4">
          Drag & drop or <span className="text-emerald-600 font-medium">browse files</span>
        </p>

        {/* Supported file type badges */}
        <div className="flex items-center justify-center gap-2">
          {[
            { ext: 'PDF', color: 'text-red-500' },
            { ext: 'DOC', color: 'text-blue-500' },
            { ext: 'DOCX', color: 'text-blue-600' },
          ].map(({ ext, color }) => (
            <span key={ext} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs text-slate-500 font-medium shadow-sm">
              <FileText size={12} className={color} /> {ext}
            </span>
          ))}
        </div>
        <p className="text-xs text-slate-400 mt-3">Maximum file size: 5MB</p>
      </div>

      {/* Validation error message */}
      {validationError && (
        <div className="flex items-center gap-2 mt-3 px-4 py-2.5 bg-red-50 border border-red-200 rounded-xl">
          <AlertCircle size={15} className="text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-700">{validationError}</p>
        </div>
      )}
    </div>
  );
};
