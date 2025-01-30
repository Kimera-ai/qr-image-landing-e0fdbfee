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
    const { data: { secret }, error } = await supabase
      .from('secrets')
      .select('value')
      .eq('name', 'KIMERA_API_KEY')
      .single();
    
    if (error) throw error;

    const pipelineId = "v2_dF4XFBDoIH";
    
    const response = await fetch(`https://api.kimera.ai/v1/pipeline/run/${pipelineId}`, {
      headers: {
        'x-api-key': secret.value,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch image from Kimera AI');
    }

    return response.url;
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
