'use client';

import { useState } from 'react';

export default function TestUploadPage() {
  const [file, setFile] = useState(null as File | null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null as {success?: boolean; filePath?: string; error?: string} | null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };
  
  const handleUpload = async () => {
    if (!file) return;
    
    setUploading(true);
    setUploadResult(null);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      const result = await response.json();
      setUploadResult(result);
      
      if (result.success) {
        // Now let's test creating a workspace with this file
        const workspaceData = {
          name: 'Test Workspace',
          description: 'Created with test upload page',
          figma_link: 'https://figma.com/test-link',
          brand_voice_file_path: result.filePath,
          tone: '60',
          style: '40',
          voice: '50',
          persona_description: 'A test persona description'
        };
        
        const workspaceResponse = await fetch('/api/workspaces', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(workspaceData)
        });
        
        const workspaceResult = await workspaceResponse.json();
        console.log('Workspace creation result:', workspaceResult);
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadResult({ error: 'Failed to upload file' });
    } finally {
      setUploading(false);
    }
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Test File Upload and Workspace Creation</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Brand Voice Document
          </label>
          <input
            type="file"
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx,.txt"
            className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-semibold
                      file:bg-primary file:text-white
                      hover:file:bg-primary-dark"
          />
        </div>
        
        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className={`py-2 px-4 rounded-md text-white font-medium
                    ${!file || uploading 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-primary hover:bg-primary-dark'}`}
        >
          {uploading ? 'Uploading...' : 'Upload & Create Workspace'}
        </button>
        
        {uploadResult && (
          <div className={`mt-4 p-4 rounded-md ${uploadResult.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {uploadResult.success ? (
              <>
                <p className="font-medium">File uploaded successfully!</p>
                <p className="text-sm">File path: {uploadResult.filePath}</p>
              </>
            ) : (
              <p className="font-medium">Error: {uploadResult.error}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 