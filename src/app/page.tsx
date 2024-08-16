"use client";
import { useEffect, useState } from "react";
import { ConnectButton } from "thirdweb/react";
import { client } from "./client";

export default function Home() {
  const [isConnected, setIsConnected] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFile(event.target.files?.[0] || null);
  };

  const uploadFile = async () => {
    if (!file) {
      alert('Please select a file first.');
      return;
    }

    setIsUploading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('https://api.akord.com/files', {
        method: 'POST',
        headers: {
          'Accept': '*/*',
          'Api-Key': `${process.env.NEXT_PUBLIC_ARWEAVE_API_KEY}` || '',
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('File upload failed');
      }

      const result = await response.json();
      alert('File uploaded successfully');
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file');
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    const checkConnectionStatus = () => {
      const connectedWallets = localStorage.getItem("thirdweb:active-chain");
      console.log(connectedWallets);
      if (connectedWallets) {
        setIsConnected(true);
      } else {
        setIsConnected(false);
      }
    };

    checkConnectionStatus();

    // Optional: Set up an interval to periodically check the connection status
    const interval = setInterval(checkConnectionStatus, 5000); // Check every 5 seconds

    // Cleanup the interval when the component unmounts
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="p-4 pb-10 min-h-[100vh] flex items-center justify-center container max-w-screen-lg mx-auto">
      <div className="py-20">
        <div className="flex flex-col items-center justify-center mb-20">
          <ConnectButton
            client={client}
            appMetadata={{
              name: "Example App",
              url: "https://example.com",
            }}
          />
          {!isConnected ? (
            <></>
          ) : (
            <>
              <input
                type="file"
                onChange={handleFileChange}
                className="mt-4 p-5 cursor-pointer"
              />
              <button
                onClick={uploadFile}
                className={`mt-4 px-4 py-2 bg-blue-500 text-white rounded ${isUploading ? 'opacity-50' : ''}`}
                disabled={isUploading}
              >
                {isUploading ? 'Uploading...' : 'Upload File'}
              </button>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
