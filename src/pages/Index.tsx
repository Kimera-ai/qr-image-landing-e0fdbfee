import { useState } from "react";
import DisplaySection from "@/components/DisplaySection";
import { supabase } from "@/integrations/supabase/client";
import { useSearchParams } from "react-router-dom";

const fetchQRCode = async (requestId: string | null) => {
  if (!requestId) {
    throw new Error('No request ID provided in URL');
  }
  const response = await fetch(`https://hjnujgq4z4.execute-api.us-east-1.amazonaws.com/public/request/qr?request_id=${requestId}`);
  const data = await response.json();
  return data.qr_code;
};

const fetchImage = async (requestId: string | null) => {
  try {
    const apiKey = "3ecd71abae01f7c37625ca53c1d4e41387c3a1c438aa6608cc0dba7d34767f45";
    
    if (!requestId) {
      throw new Error('No request ID provided in URL');
    }
    
    console.log('Making request to Kimera API...');
    const response = await fetch(`https://api.kimera.ai/v1/pipeline/run/${requestId}`, {
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
      throw new Error('Still processing...');
    }

    const responseData = await response.json();
    console.log('Kimera API response:', responseData);
    
    if (responseData.status !== "Completed") {
      console.log('Status not completed, throwing error to trigger retry');
      throw new Error('Still processing...');
    }

    if (!responseData.result) {
      console.log('Full response data:', responseData);
      throw new Error('Still processing...');
    }

    return responseData.result;
  } catch (error) {
    console.error('Error in fetchImage:', error);
    throw error;
  }
};

const Index = () => {
  const [searchParams] = useSearchParams();
  const requestId = searchParams.get('requestid');

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
        <div className="flex flex-col space-y-8">
          <DisplaySection
            title="Random Image"
            queryKey="random-image"
            fetchFn={() => fetchImage(requestId)}
            refetchInterval={2000}
          />
          <DisplaySection
            title="QR Code"
            queryKey="qr-code"
            fetchFn={() => fetchQRCode(requestId)}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;