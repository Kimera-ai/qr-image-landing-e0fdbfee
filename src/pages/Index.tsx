import { useState } from "react";
import DisplaySection from "@/components/DisplaySection";
import { supabase } from "@/integrations/supabase/client";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

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
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat flex flex-col items-center justify-between p-4 md:p-6"
      style={{
        backgroundImage: 'url("/lovable-uploads/3990cb78-4cc6-42f4-896e-a2c145303f41.png")',
      }}
    >
      <div className="w-full max-w-4xl flex flex-col h-screen">
        <div className="flex-shrink-0 mb-4">
          <svg version="1.2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2835 777" className="w-[280px] h-[77px] md:w-[400px] md:h-[110px] mx-auto">
            <title>LOGO DUTY FREE _RED background</title>
            <defs>
              <clipPath clipPathUnits="userSpaceOnUse" id="cp1">
                <path d="m0 0h2835v777h-2835z"/>
              </clipPath>
            </defs>
            <style>
              {`.s0 { fill: #fa2c2e } 
                .s1 { fill: #ffffff }`}
            </style>
            <g id="Page 1" clipPath="url(#cp1)">
              <path id="Path 1" className="s0" d="m0 777h2834.6v-776.7h-2834.6z"/>
              <path id="Path 3" fillRule="evenodd" className="s1" d="m135.2 121.9c0-9.6 8-17.3 17.8-17.3h97.2c10.1 0 17.9 7.8 17.9 17.8 0 9.7-7.6 17.3-17.4 17.3h-30.3v213.1c0 46.5-32.8 96.5-104.8 96.5h-6.6c-9.7 0-17.7-8-17.7-17.8 0-9.6 8-17.5 17.7-17.5h6.6c45.7 0 69.7-30.7 69.7-61.2v-213.1h-32.3c-9.8 0-17.8-8-17.8-17.8zm377.3 308.3l-0.5 4.3c-1.1 4.4-3.8 7.9-7.5 10.3-4 2.4-8.7 3.2-13.3 2.1-4.5-1.1-8.6-4.1-11.1-8.1l-87.6-145.1h-46.8v136.4c0 9.6-8 17.3-17.8 17.3-10.2 0-17.8-7.5-17.8-17.3v-307.7c0-10 7.8-17.8 17.8-17.8h79c60.9 0 97.4 34.6 97.4 92.6 0 50.5-25.5 84.5-69.9 93.6l-2.3 0.5 77.8 129.6c1.7 2.7 2.6 5.9 2.6 9.3zm-104.2-171.8c52.4 0 60.3-38.4 60.3-61.2 0-25.8-10.7-56.6-61.7-56.6h-60.8v117.8zm330.2-154.1c4.8 2.2 8.6 6.1 10.3 10.7 1.4 4.2 1.2 8.7-0.7 12.7-0.1 0-150.2 309.1-150.2 309.1-4.2 8.7-14.1 12.2-23.2 8.5-4.4-1.9-7.9-5.7-9.7-10.4q-1.1-3-1.1-6c0-2.3 0.6-4.8 1.7-6.9 0-0.1 149.5-308.3 149.7-308.7 4.4-8.7 14.5-12.7 23.2-9zm272.1 233.1c-5.4 74-38.4 110-100.9 110h-84.9c-10.7 0-18.8-8.1-18.8-18.7v-305.3c0-10.5 8.3-18.8 18.8-18.8h84c62.8 0 97.1 37.2 101.8 110.5 2.6 44.5 2.6 87.9 0 122.3zm-35-66.2c0-24.8-0.8-47.6-2.5-62.5-4.9-45.5-25.3-66.5-64.3-66.5h-65.2v267.6h66.1c37.5 0 60.7-23.8 63.4-65.4 1.7-21.9 2.5-48.4 2.5-73.2zm256.4-166.6c10.6 0 18.8 8.3 18.8 18.8v227.8c0 69.2-30.4 100-98.6 100-68.2 0-98.6-30.8-98.6-100v-227.8c0-10.7 7.9-18.8 18.4-18.8 10.4 0 19.2 8.6 19.2 18.8v234.7c0 38.7 18.8 56 61 56 42.2 0 61-17.3 61-56v-234.7c0-10.2 8.7-18.8 18.8-18.8zm245.3 0c10.2 0 18.3 8.1 18.3 18.4 0 10.5-8.2 19.2-18.3 19.2h-69.9v288.3c0 10.3-8.1 18.3-18.3 18.3-10.7 0-19.3-8-19.3-18.3v-288.3h-69.4c-10.5 0-19.3-8.9-19.3-19.2 0-10.1 8.5-18.4 18.8-18.4zm59-0.7c4.9 1.4 9.1 5 11.8 10.1 0 0 75 150.5 81.1 162.7 13.1-31.7 67.2-162.5 67.2-162.5 1.9-4.7 5.1-8 9.4-9.6 4.7-1.9 10.5-1.4 15.7 1.3 10 4.6 11.9 16.2 8.7 24.8l-123.7 299.8c-7.2 17-20.3 17-29 16.9h-27.4c-10.3 0-18.7-8.2-18.7-18.3 0-10.1 8.6-18.7 18.7-18.7h23c1.7-3.9 36-85.8 37.3-88.5-8.3-16.6-95.4-190.8-95.4-190.8-2.3-4.1-2.9-9-1.6-13.7 1.4-5 4.8-9.3 9.4-11.9 4.2-2.3 8.9-2.9 13.5-1.6zm460.1 0.7c10.3 0 18.4 8.1 18.4 18.4 0 10.7-8.1 19.2-18.4 19.2h-141.3v111.3h118c10.3 0 18.3 8.1 18.3 18.3 0 10.7-8.3 19.3-18.3 19.3h-118v139.4c0 9.8-9 18.3-19.2 18.3-10.7 0-18.8-8-18.8-18.8v-307.6c0-7.1 7.8-17.8 18.8-17.8zm267.2 326.1c0 6.1-3 12-8.6 15.3-4.1 2.6-9.1 3.4-13.9 2.3-4.9-1.2-9.1-4.3-11.7-8.5 0 0-85.3-141.3-87.2-144.5h-45.2v135.2c0 10.1-8.4 18.3-18.8 18.3-10.7 0-18.7-7.8-18.7-18.3v-307.1c0-10.5 8.2-18.8 18.7-18.8h78.9c61.5 0 98.2 35 98.2 93.4 0 51.1-26.7 85.9-71.4 94.7 13.1 21.8 77 128.1 77 128.1 1.8 3.1 2.7 6.5 2.7 9.9zm-105-172.5c51.4 0 59.1-37.7 59.1-60.2 0-25.2-10.6-55.3-60.6-55.3h-59.6v115.5zm326.6-153.6c10.3 0 18.3 8.1 18.3 18.4 0 10.7-8 19.2-18.3 19.2h-137.1v111.9h118.5c10.3 0 18.7 8.1 18.7 18.2 0 10.2-8.6 18.8-18.7 18.8h-118.5v118.7h141.4c10 0 18.3 8.5 18.3 18.9 0 10.7-8 18.7-18.3 18.7h-160.7c-10.7 0-18.7-8-18.7-18.7v-305.3c0-10.5 8.2-18.8 18.7-18.8zm240.7 0c10.2 0 18.3 8.1 18.3 18.4 0 10.7-8.1 19.2-18.3 19.2h-137.2v111.9h118.5c10.3 0 18.7 8.1 18.7 18.2 0 10.2-8.6 18.8-18.7 18.8h-118.5v118.7h141.3c10.1 0 18.3 8.5 18.3 18.9 0 10.7-7.9 18.7-18.3 18.7h-160.6c-10.7 0-18.7-8-18.7-18.7v-305.3c0-10.5 8.2-18.8 18.7-18.8z"/>
            </g>
          </svg>
          <h1 className="text-2xl md:text-4xl font-bold text-center text-black mt-2">
            PERFECT HAIR CARE
          </h1>
        </div>
        
        <div className="flex-grow flex flex-col justify-center space-y-4">
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

        <div className="flex-shrink-0 mt-4">
          <a href="https://dutyfree.netlify.app/" className="block w-full max-w-xs mx-auto">
            <Button 
              className="w-full bg-[#ea384c] hover:bg-[#ea384c]/90 text-white rounded-full flex items-center justify-center gap-2 text-lg py-4" 
              size="lg"
            >
              <ArrowLeft className="h-5 w-5" />
              סיום
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Index;