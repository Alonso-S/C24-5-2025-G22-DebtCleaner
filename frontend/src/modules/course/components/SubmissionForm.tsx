import React, { useState } from 'react';
import { FaUpload, FaGitAlt, FaCheckCircle, FaTimesCircle, FaSpinner } from 'react-icons/fa';

interface SubmissionFormProps {
  onFileUpload: (file: File) => void;
  onGitLink: (url: string) => void;
  isUploading: boolean;
  isLinkingGit: boolean;
  gitLinkSuccess: boolean | null;
  uploadSuccess: boolean | null;
}

const SubmissionForm: React.FC<SubmissionFormProps> = ({
  onFileUpload,
  onGitLink,
  isUploading,
  isLinkingGit,
  gitLinkSuccess,
  uploadSuccess,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [gitUrl, setGitUrl] = useState<string>('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleFileUpload = () => {
    if (selectedFile) {
      onFileUpload(selectedFile);
    }
  };

  const handleGitLink = () => {
    if (gitUrl) {
      onGitLink(gitUrl);
    }
  };

  return (
    <div className="space-y-6">
      {/* File Upload Section */}
      <div className="p-4 border rounded-lg shadow-sm bg-white">
        <h3 className="text-lg font-semibold mb-3">Subir Archivo</h3>
        <input
          type="file"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
        />
        <button
          onClick={handleFileUpload}
          disabled={!selectedFile || isUploading}
          className={`mt-3 px-4 py-2 rounded-md text-white flex items-center justify-center
            ${!selectedFile || isUploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {isUploading ? <FaSpinner className="animate-spin mr-2" /> : <FaUpload className="mr-2" />}
          {isUploading ? 'Subiendo...' : 'Subir Entrega'}
        </button>
        {uploadSuccess === true && <p className="text-green-600 mt-2 flex items-center"><FaCheckCircle className="mr-1" /> Archivo subido con éxito.</p>}
        {uploadSuccess === false && <p className="text-red-600 mt-2 flex items-center"><FaTimesCircle className="mr-1" /> Error al subir el archivo.</p>}
      </div>

      {/* Git Link Section */}
      <div className="p-4 border rounded-lg shadow-sm bg-white">
        <h3 className="text-lg font-semibold mb-3">Vincular Repositorio Git</h3>
        <input
          type="text"
          value={gitUrl}
          onChange={(e) => setGitUrl(e.target.value)}
          placeholder="URL del repositorio Git"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleGitLink}
          disabled={!gitUrl || isLinkingGit}
          className={`mt-3 px-4 py-2 rounded-md text-white flex items-center justify-center
            ${!gitUrl || isLinkingGit ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
        >
          {isLinkingGit ? <FaSpinner className="animate-spin mr-2" /> : <FaGitAlt className="mr-2" />}
          {isLinkingGit ? 'Vinculando...' : 'Vincular Git'}
        </button>
        {gitLinkSuccess === true && <p className="text-green-600 mt-2 flex items-center"><FaCheckCircle className="mr-1" /> Repositorio Git vinculado con éxito.</p>}
        {gitLinkSuccess === false && <p className="text-red-600 mt-2 flex items-center"><FaTimesCircle className="mr-1" /> Error al vincular el repositorio Git.</p>}
      </div>
    </div>
  );
};

export default SubmissionForm;