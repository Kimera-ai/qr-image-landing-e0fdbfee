import { useState } from "react";
import DisplaySection from "@/components/DisplaySection";
import { supabase } from "@/integrations/supabase/client";
import { useSearchParams, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const requestId = searchParams.get('requestid');

  return (
    <div
      className="h-screen w-full bg-cover bg-center bg-no-repeat flex flex-col items-center p-2 md:p-4 overflow-hidden"
      style={{
        backgroundImage: 'url("/lovable-uploads/3990cb78-4cc6-42f4-896e-a2c145303f41.png")',
      }}
    >
      <div className="w-full max-w-4xl flex flex-col h-full">
        <div className="flex-shrink-0 mb-1 md:mb-2">
          <svg version="1.0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900.000000 261.000000" className="w-[200px] h-[55px] md:w-[280px] md:h-[77px] mx-auto">
            <g transform="translate(0.000000,261.000000) scale(0.100000,-0.100000)" fill="#cf353f" stroke="none">
              <path d="M0 1343 l0 -1223 4464 0 c4061 0 4464 1 4470 16 3 9 6 558 6 1220 0 956 -3 1204 -12 1204 -7 0 -2019 1 -4470 3 l-4458 2 0 -1222z m2329 912 c57 -29 55 -58 -18 -203 -65 -130 -122 -248 -236 -487 -42 -88 -82 -171 -89 -185 -18 -32 -36 -69 -76 -150 -35 -72 -52 -90 -87 -90 -30 0 -73 42 -73 72 0 12 25 74 56 138 31 63 87 178 124 255 37 77 102 211 144 297 42 87 76 161 76 164 0 4 6 15 13 23 7 9 21 36 31 61 32 79 40 91 66 105 32 18 35 18 69 0z m-1509 -15 c24 -24 26 -67 4 -98 -12 -17 -25 -22 -62 -22 -52 0 -78 -12 -67 -29 11 -18 5 -635 -6 -698 -28 -148 -167 -261 -324 -262 -75 0 -106 21 -108 75 -1 49 28 70 110 77 81 6 137 41 164 101 17 38 18 73 19 387 l2 344 -60 3 c-44 2 -64 8 -78 23 -25 28 -22 78 5 101 21 16 43 18 202 18 166 0 180 -1 199 -20z m565 8 c25 -7 45 -16 45 -20 0 -4 7 -8 15 -8 24 0 92 -68 114 -113 67 -144 41 -302 -67 -404 -25 -24 -51 -43 -57 -43 -7 0 -23 -8 -35 -18 -20 -16 -21 -19 -6 -31 9 -7 16 -17 16 -22 0 -4 47 -86 105 -182 105 -175 119 -212 90 -240 -22 -23 -73 -31 -92 -15 -17 14 -91 125 -131 198 -14 25 -49 82 -78 127 -30 45 -54 86 -54 91 0 5 -9 21 -21 36 -18 22 -28 26 -75 26 l-54 0 0 -210 c0 -227 -5 -252 -53 -276 -26 -14 -31 -13 -60 3 l-32 19 -3 530 -2 529 21 18 c18 15 44 17 195 17 104 0 192 -5 219 -12z m1625 -16 c93 -49 141 -114 174 -238 25 -94 23 -505 -3 -594 -29 -100 -46 -132 -93 -175 -55 -51 -72 -60 -146 -79 -77 -20 -345 -22 -380 -3 -52 29 -52 32 -52 557 0 507 1 525 42 552 7 4 103 7 213 6 187 -3 203 -4 245 -26z m403 17 c12 -7 25 -17 29 -23 4 -6 8 -193 8 -416 0 -376 2 -408 19 -447 11 -23 31 -49 45 -58 39 -26 146 -31 200 -11 86 33 80 3 86 485 3 234 9 434 14 444 19 41 86 48 121 12 l25 -24 0 -420 c0 -403 -1 -421 -21 -474 -28 -74 -100 -150 -161 -172 -64 -22 -227 -22 -297 0 -61 20 -125 80 -155 145 -20 44 -21 59 -21 488 l0 444 24 19 c27 22 53 24 84 8z m1297 -11 c27 -29 26 -79 -1 -104 -18 -16 -40 -20 -135 -22 l-114 -4 0 -449 c0 -382 -2 -454 -15 -479 -28 -54 -76 -65 -119 -25 l-26 24 0 464 0 465 -118 3 c-139 5 -152 11 -152 75 0 74 -1 74 352 74 303 0 307 0 328 -22z m170 0 c11 -12 72 -127 136 -256 64 -129 119 -230 123 -226 4 5 22 45 40 89 19 44 44 103 57 132 13 28 24 57 24 63 0 12 33 91 55 132 8 14 15 31 15 38 0 20 44 49 74 50 36 0 76 -35 76 -66 0 -21 -17 -68 -41 -116 -5 -10 -9 -23 -9 -28 0 -12 -33 -91 -55 -132 -8 -14 -15 -33 -15 -41 0 -8 -7 -20 -15 -27 -8 -7 -15 -23 -15 -36 0 -12 -4 -26 -10 -29 -5 -3 -10 -14 -10 -23 -1 -9 -9 -35 -20 -57 -11 -22 -19 -44 -20 -48 0 -4 -13 -35 -30 -69 -16 -33 -30 -66 -30 -74 0 -8 -4 -22 -9 -32 -6 -9 -33 -73 -61 -142 -28 -69 -58 -136 -65 -150 -39 -74 -217 -81 -255 -11 -27 52 12 111 74 111 41 0 66 8 66 22 0 6 6 24 14 41 39 86 76 184 76 200 0 14 -107 241 -157 332 -6 11 -38 75 -72 143 -69 138 -78 189 -39 216 32 23 74 20 98 -6z m1455 16 c8 -4 22 -19 31 -35 13 -26 13 -33 -1 -63 -21 -44 -36 -47 -275 -46 -107 0 -201 1 -207 0 -10 0 -13 -39 -13 -160 l0 -160 186 0 c111 0 193 -4 205 -11 26 -13 41 -55 34 -90 -11 -51 -53 -61 -248 -58 l-172 3 -3 -226 -2 -226 -27 -26 c-31 -31 -61 -33 -97 -5 l-26 20 0 529 0 529 28 15 c22 12 77 15 299 16 149 0 279 -3 288 -6z m585 -8 c83 -31 110 -48 149 -93 22 -26 41 -55 41 -63 0 -9 5 -21 12 -28 8 -8 12 -47 12 -109 0 -85 -4 -105 -27 -153 -32 -67 -82 -120 -136 -145 -23 -10 -41 -22 -41 -26 0 -4 27 -53 60 -107 33 -55 60 -103 60 -107 0 -5 10 -22 23 -39 50 -66 87 -138 87 -165 0 -30 -47 -81 -75 -81 -23 0 -71 56 -120 138 -25 42 -50 84 -55 92 -5 8 -35 58 -66 110 -93 156 -97 160 -153 160 -48 0 -48 0 -55 -37 -3 -21 -6 -123 -6 -227 0 -181 -1 -191 -22 -213 -27 -28 -67 -30 -96 -3 l-22 21 0 529 0 529 22 15 c30 21 354 23 408 2z m970 4 c24 -13 35 -64 20 -100 -15 -37 -33 -40 -275 -40 l-203 0 2 -157 1 -158 191 -5 c171 -4 194 -7 213 -24 29 -26 29 -86 0 -112 -19 -17 -40 -19 -213 -20 l-191 -2 0 -168 0 -169 230 -2 c220 -3 231 -4 248 -24 9 -12 17 -34 17 -49 0 -85 -18 -90 -318 -90 -257 0 -304 6 -322 40 -6 12 -10 218 -10 538 l0 520 23 15 c19 14 64 16 295 16 163 1 281 -3 292 -9z m759 0 c27 -14 45 -64 32 -87 -29 -50 -17 -48 -258 -53 l-228 -5 0 -155 0 -155 193 -5 194 -5 24 -28 c30 -35 30 -54 0 -92 l-24 -30 -184 -2 c-100 -1 -189 -2 -195 -2 -10 -1 -13 -39 -13 -155 0 -85 3 -161 6 -170 5 -14 35 -16 234 -16 216 0 228 -1 245 -20 26 -29 25 -85 -3 -113 -22 -21 -29 -22 -289 -25 -189 -2 -275 0 -295 9 -58 24 -58 22 -58 559 0 521 2 541 47 553 36 9 555 7 572 -3z"/>
              <path d="M1105 2111 c-6 -6 -8 -76 -5 -173 l5 -163 104 2 c165 4 196 18 226 102 18 53 19 84 2 132 -17 50 -32 66 -85 89 -34 15 -66 20 -141 20 -53 0 -101 -4 -106 -9z"/>
              <path d="M2669 2106 c-10 -11 -13 -774 -3 -800 5 -13 25 -16 114 -16 119 0 176 16 216 61 45 51 49 80 49 344 0 214 -3 257 -18 298 -18 51 -59 97 -86 97 -10 0 -21 4 -26 9 -13 13 -234 19 -246 7z"/>
              <path d="M6640 1946 c0 -122 3 -165 13 -168 6 -2 53 -3 102 -3 177 3 219 35 220 167 0 62 -4 82 -21 104 -35 48 -90 64 -217 64 l-97 0 0 -164z"/>
              <path d="M7884 771 c-23 -18 -29 -67 -26 -186 2 -45 5 -53 33 -69 69 -41 109 9 109 134 0 77 -2 83 -29 111 -34 33 -57 36 -87 10z"/>
              <path d="M898 658 c-3 -18 -7 -40 -9 -48 -3 -11 5 -16 29 -18 27 -3 32 0 32 18 0 23 -29 80 -41 80 -4 0 -9 -15 -11 -32z"/>
              <path d="M3548 783 c-38 -4 -38 -5 -38 -49 l0 -45 62 3 c57 3 62 5 69 29 3 15 4 31 0 36 -6 10 -47 34 -53 31 -2 -1 -20 -3 -40 -5z"/>
              <path d="M5641 649 c-17 -49 -14 -59 17 -59 39 0 41 5 27 48 -17 47 -30 51 -44 11z"/>
              <path d="M6176 764 c-9 -24 -7 -59 4 -70 17 -17 101 -1 116 21 12 18 11 24 -2 43 -12 18 -25 22 -63 22 -35 0 -51 -4 -55 -16z"/>
              <path d="M6773 783 c-22 -4 -23 -8 -24 -129 -1 -68 -2 -130 -3 -136 -1 -9 14 -12 48 -11 70 2 87 23 94 111 6 93 -10 139 -54 158 -18 8 -35 13 -36 13 -2 -1 -13 -4 -25 -6z"/>
            </g>
          </svg>
          <h1 className="text-xl md:text-2xl font-bold text-center text-black mt-0.5 md:mt-1">
            PERFECT HAIR CARE
          </h1>
        </div>
        
        <div className="flex-grow flex flex-col justify-center gap-2 md:gap-4 relative">
          <DisplaySection
            title="Random Image"
            queryKey="random-image"
            fetchFn={() => fetchImage(requestId)}
            refetchInterval={2000}
            className="max-h-[80vh]"
          />
          <DisplaySection
            title="QR Code"
            queryKey="qr-code"
            fetchFn={() => fetchQRCode(requestId)}
            className="absolute bottom-4 left-4 z-10 scale-50 transform origin-bottom-left"
          />
        </div>

        <div className="flex-shrink-0 mt-2 md:mt-4">
          <Button 
            onClick={() => navigate('/thank-you')}
            className="w-full max-w-lg mx-auto bg-[#ea384c] hover:bg-[#ea384c]/90 text-white rounded-full flex items-center justify-center gap-4 text-3xl md:text-4xl py-8 md:py-10" 
            size="lg"
          >
            <ArrowLeft className="h-32 w-32 md:h-40 md:w-40" />
            סיום
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;