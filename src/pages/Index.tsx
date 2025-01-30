import { useState, useEffect } from "react";
import DisplaySection from "@/components/DisplaySection";
import { supabase } from "@/integrations/supabase/client";

// Mock API call for QR code (keep this as is)
const fetchQRCode = async () => {
  const response = await fetch(
    "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://lovable.dev"
  );
  return response.url;
};

// Updated function to use Kimera AI API with correct pipeline ID
const fetchImage = async () => {
  try {
    const { data, error } = await supabase
      .from('secrets')
      .select('value')
      .eq('name', 'KIMERA_API_KEY')
      .maybeSingle();
    
    if (error) throw error;
    if (!data) throw new Error('API key not found in database');

    const pipelineId = "v2_1xgbbA4_BH";
    
    const response = await fetch(`https://api.kimera.ai/v1/pipeline/run/${pipelineId}`, {
      headers: {
        'x-api-key': data.value,
      },
    });

    if (!response.ok) {
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      const errorText = await response.text();
      console.log('Error response:', errorText);
      throw new Error('Failed to fetch image from Kimera AI');
    }

    const responseData = await response.json();
    console.log('Kimera API response:', responseData);
    
    // Check if the response contains an image URL
    if (!responseData.output?.image_url) {
      console.log('Full response data:', responseData);
      throw new Error('No image URL in response');
    }

    return responseData.output.image_url;
  } catch (error) {
    console.error('Error fetching image:', error);
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