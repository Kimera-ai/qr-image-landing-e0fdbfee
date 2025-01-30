import { useState, useEffect } from "react";
import DisplaySection from "@/components/DisplaySection";
import { supabase } from "@/integrations/supabase/client";
import { useSearchParams } from "react-router-dom";

const fetchQRCode = async () => {
  const response = await fetch(
    "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://lovable.dev"
  );
  return response.url;
};

const fetchImage = async () => {
  try {
    const apiKey = "3ecd71abae01f7c37625ca53c1d4e41387c3a1c438aa6608cc0dba7d34767f45";
    const pipelineId = "v2_1xgbbA4_BH";
    const [searchParams] = useSearchParams();
    const requestId = searchParams.get('id');
    
    if (!requestId) {
      throw new Error('No request ID provided in URL');
    }
    
    console.log('Making request to Kimera API...');
    const response = await fetch(`https://api.kimera.ai/v1/pipeline/${requestId}/result`, {
      method: 'GET',
      headers: {
        'x-api-key': apiKey,
      }
    });

    if (!response.ok) {
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      const errorText = await response.text();
      console.log('Error response:', errorText);
      throw new Error(`Failed to fetch image from Kimera AI: ${response.status}`);
    }

    const responseData = await response.json();
    console.log('Kimera API response:', responseData);
    
    if (!responseData.result) {
      console.log('Full response data:', responseData);
      throw new Error('No result URL in response');
    }

    return responseData.result;
  } catch (error) {
    console.error('Error in fetchImage:', error);
    throw error;
  }
};

const Index = () => {
  return (
    <div
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat p-6 flex flex-col items-center justify-center"
      style={{
        backgroundImage: 'url("/lovable-uploads/3990cb78-4cc6-42f4-896e-a2c145303f41.png")',
      }}
    >
      <div className="max-w-4xl w-full space-y-8">
        <h1 className="text-4xl font-bold text-center text-white/90 mb-12">
          Welcome
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <DisplaySection
            title="Random Image"
            queryKey="random-image"
            fetchFn={fetchImage}
          />
          <DisplaySection
            title="QR Code"
            queryKey="qr-code"
            fetchFn={fetchQRCode}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;