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
        <div className="flex flex-col items-center space-y-4">
          <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
            width="300.000000pt" height="87.000000pt" viewBox="0 0 900.000000 261.000000"
            preserveAspectRatio="xMidYMid meet">
            <metadata>
              Created by potrace 1.10, written by Peter Selinger 2001-2011
            </metadata>
            <g transform="translate(0.000000,261.000000) scale(0.100000,-0.100000)"
              fill="#cf353f" stroke="none">
              <path d="M0 1343 l0 -1223 4464 0 c4061 0 4464 1 4470 16 3 9 6 558 6 1220 0 956 -3 1204 -12 1204 -7 0 -2019 1 -4470 3 l-4458 2 0 -1222z m2329 912 c57 -29 55 -58 -18 -203 -65 -130 -122 -248 -236 -487 -42 -88 -82 -171 -89 -185 -18 -32 -36 -69 -76 -150 -35 -72 -52 -90 -87 -90 -30 0 -73 42 -73 72 0 12 25 74 56 138 31 63 87 178 124 255 37 77 102 211 144 297 42 87 76 161 76 164 0 4 6 15 13 23 7 9 21 36 31 61 32 79 40 91 66 105 32 18 35 18 69 0z m-1509 -15 c24 -24 26 -67 4 -98 -12 -17 -25 -22 -62 -22 -52 0 -78 -12 -67 -29 11 -18 5 -635 -6 -698 -28 -148 -167 -261 -324 -262 -75 0 -106 21 -108 75 -1 49 28 70 110 77 81 6 137 41 164 101 17 38 18 73 19 387 l2 344 -60 3 c-44 2 -64 8 -78 23 -25 28 -22 78 5 101 21 16 43 18 202 18 166 0 180 -1 199 -20z m565 8 c25 -7 45 -16 45 -20 0 -4 7 -8 15 -8 24 0 92 -68 114 -113 67 -144 41 -302 -67 -404 -25 -24 -51 -43 -57 -43 -7 0 -23 -8 -35 -18 -20 -16 -21 -19 -6 -31 9 -7 16 -17 16 -22 0 -4 47 -86 105 -182 105 -175 119 -212 90 -240 -22 -23 -73 -31 -92 -15 -17 14 -91 125 -131 198 -14 25 -49 82 -78 127 -30 45 -54 86 -54 91 0 5 -9 21 -21 36 -18 22 -28 26 -75 26 l-54 0 0 -210 c0 -227 -5 -252 -53 -276 -26 -14 -31 -13 -60 3 l-32 19 -3 530 -2 529 21 18 c18 15 44 17 195 17 104 0 192 -5 219 -12z m1625 -16 c93 -49 141 -114 174 -238 25 -94 23 -505 -3 -594 -29 -100 -46 -132 -93 -175 -55 -51 -72 -60 -146 -79 -77 -20 -345 -22 -380 -3 -52 29 -52 32 -52 557 0 507 1 525 42 552 7 4 103 7 213 6 187 -3 203 -4 245 -26z" />
              <path d="M1105 2111 c-6 -6 -8 -76 -5 -173 l5 -163 104 2 c165 4 196 18 226 102 18 53 19 84 2 132 -17 50 -32 66 -85 89 -34 15 -66 20 -141 20 -53 0 -101 -4 -106 -9z" />
              <path d="M2669 2106 c-10 -11 -13 -774 -3 -800 5 -13 25 -16 114 -16 119 0 176 16 216 61 45 51 49 80 49 344 0 214 -3 257 -18 298 -18 51 -59 97 -86 97 -10 0 -21 4 -26 9 -13 13 -234 19 -246 7z" />
              <path d="M6640 1946 c0 -122 3 -165 13 -168 6 -2 53 -3 102 -3 177 3 219 35 220 167 0 62 -4 82 -21 104 -35 48 -90 64 -217 64 l-97 0 0 -164z" />
              <path d="M7884 771 c-23 -18 -29 -67 -26 -186 2 -45 5 -53 33 -69 69 -41 109 9 109 134 0 77 -2 83 -29 111 -34 33 -57 36 -87 10z" />
              <path d="M898 658 c-3 -18 -7 -40 -9 -48 -3 -11 5 -16 29 -18 27 -3 32 0 32 18 0 23 -29 80 -41 80 -4 0 -9 -15 -11 -32z" />
              <path d="M3548 783 c-38 -4 -38 -5 -38 -49 l0 -45 62 3 c57 3 62 5 69 29 3 15 4 31 0 36 -6 10 -47 34 -53 31 -2 -1 -20 -3 -40 -5z" />
              <path d="M5641 649 c-17 -49 -14 -59 17 -59 39 0 41 5 27 48 -17 47 -30 51 -44 11z" />
              <path d="M6176 764 c-9 -24 -7 -59 4 -70 17 -17 101 -1 116 21 12 18 11 24 -2 43 -12 18 -25 22 -63 22 -35 0 -51 -4 -55 -16z" />
              <path d="M6773 783 c-22 -4 -23 -8 -24 -129 -1 -68 -2 -130 -3 -136 -1 -9 14 -12 48 -11 70 2 87 23 94 111 6 93 -10 139 -54 158 -18 8 -35 13 -36 13 -2 -1 -13 -4 -25 -6z" />
            </g>
          </svg>
          <h1 className="text-4xl font-bold text-center text-black mb-12">
            PERFECT HAIR CARE
          </h1>
        </div>
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
