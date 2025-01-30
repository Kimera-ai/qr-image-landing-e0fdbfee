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
          <svg
            version="1.0"
            xmlns="http://www.w3.org/2000/svg"
            width="200pt"
            height="261.000000pt"
            viewBox="0 0 900.000000 261.000000"
            preserveAspectRatio="xMidYMid meet"
            className="mb-6"
          >
            <g
              transform="translate(0.000000,261.000000) scale(0.100000,-0.100000)"
              fill="#cf353f"
              stroke="none"
            >
              <path d="M0 1343 l0 -1223 4464 0 c4061 0 4464 1 4470 16 3 9 6 558 6 1220 0 956 -3 1204 -12 1204 -7 0 -2019 1 -4470 3 l-4458 2 0 -1222z m2329 912 c57 -29 55 -58 -18 -203 -65 -130 -122 -248 -236 -487 -42 -88 -82 -171 -89 -185 -18 -32 -36 -69 -76 -150 -35 -72 -52 -90 -87 -90 -30 0 -73 42 -73 72 0 12 25 74 56 138 31 63 87 178 124 255 37 77 102 211 144 297 42 87 76 161 76 164 0 4 6 15 13 23 7 9 21 36 31 61 32 79 40 91 66 105 32 18 35 18 69 0z m-1509 -15 c24 -24 26 -67 4 -98 -12 -17 -25 -22 -62 -22 -52 0 -78 -12 -67 -29 11 -18 5 -635 -6 -698 -28 -148 -167 -261 -324 -262 -75 0 -106 21 -108 75 -1 49 28 70 110 77 81 6 137 41 164 101 17 38 18 73 19 387 l2 344 -60 3 c-44 2 -64 8 -78 23 -25 28 -22 78 5 101 21 16 43 18 202 18 166 0 180 -1 199 -20z m565 8 c25 -7 45 -16 45 -20 0 -4 7 -8 15 -8 24 0 92 -68 114 -113 67 -144 41 -302 -67 -404 -25 -24 -51 -43 -57 -43 -7 0 -23 -8 -35 -18 -20 -16 -21 -19 -6 -31 9 -7 16 -17 16 -22 0 -4 47 -86 105 -182 105 -175 119 -212 90 -240 -22 -23 -73 -31 -92 -15 -17 14 -91 125 -131 198 -14 25 -49 82 -78 127 -30 45 -54 86 -54 91 0 5 -9 21 -21 36 -18 22 -28 26 -75 26 l-54 0 0 -210 c0 -227 -5 -252 -53 -276 -26 -14 -31 -13 -60 3 l-32 19 -3 530 -2 529 21 18 c18 15 44 17 195 17 104 0 192 -5 219 -12z m1625 -16 c93 -49 141 -114 174 -238 25 -94 23 -505 -3 -594 -29 -100 -46 -132 -93 -175 -55 -51 -72 -60 -146 -79 -77 -20 -345 -22 -380 -3 -52 29 -52 32 -52 557 0 507 1 525 42 552 7 4 103 7 213 6 187 -3 203 -4 245 -26z m403 17 c12 -7 25 -17 29 -23 4 -6 8 -193 8 -416 0 -376 2 -408 19 -447 11 -23 31 -49 45 -58 39 -26 146 -31 200 -11 86 33 80 3 86 485 3 234 9 434 14 444 19 41 86 48 121 12 l25 -24 0 -420 c0 -403 -1 -421 -21 -474 -28 -74 -100 -150 -161 -172 -64 -22 -227 -22 -297 0 -61 20 -125 80 -155 145 -20 44 -21 59 -21 488 l0 444 24 19 c27 22 53 24 84 8z m1297 -11 c27 -29 26 -79 -1 -104 -18 -16 -40 -20 -135 -22 l-114 -4 0 -449 c0 -382 -2 -454 -15 -479 -28 -54 -76 -65 -119 -25 l-26 24 0 464 0 465 -118 3 c-139 5 -152 11 -152 75 0 74 -1 74 352 74 303 0 307 0 328 -22z m170 0 c11 -12 72 -127 136 -256 64 -129 119 -230 123 -226 4 5 22 45 40 89 19 44 44 103 57 132 13 28 24 57 24 63 0 12 33 91 55 132 8 14 15 31 15 38 0 20 44 49 74 50 36 0 76 -35 76 -66 0 -21 -17 -68 -41 -116 -5 -10 -9 -23 -9 -28 0 -12 -33 -91 -55 -132 -8 -14 -15 -33 -15 -41 0 -8 -7 -20 -15 -27 -8 -7 -15 -23 -15 -36 0 -12 -4 -26 -10 -29 -5 -3 -10 -14 -10 -23 -1 -9 -9 -35 -20 -57 -11 -22 -19 -44 -20 -48 0 -4 -13 -35 -30 -69 -16 -33 -30 -66 -30 -74 0 -8 -4 -22 -9 -32 -6 -9 -33 -73 -61 -142 -28 -69 -58 -136 -65 -150 -39 -74 -217 -81 -255 -11 -27 52 12 111 74 111 41 0 66 8 66 22 0 6 6 24 14 41 39 86 76 184 76 200 0 14 -107 241 -157 332 -6 11 -38 75 -72 143 -69 138 -78 189 -39 216 32 23 74 20 98 -6z m1455 16 c8 -4 22 -19 31 -35 13 -26 13 -33 -1 -63 -21 -44 -36 -47 -275 -46 -107 0 -201 1 -207 0 -10 0 -13 -39 -13 -160 l0 -160 186 0 c111 0 193 -4 205 -11 26 -13 41 -55 34 -90 -11 -51 -53 -61 -248 -58 l-172 3 -3 -226 -2 -226 -27 -26 c-31 -31 -61 -33 -97 -5 l-26 20 0 529 0 529 28 15 c22 12 77 15 299 16 149 0 279 -3 288 -6z m585 -8 c83 -31 110 -48 149 -93 22 -26 41 -55 41 -63 0 -9 5 -21 12 -28 8 -8 12 -47 12 -109 0 -85 -4 -105 -27 -153 -32 -67 -82 -120 -136 -145 -23 -10 -41 -22 -41 -26 0 -4 27 -53 60 -107 33 -55 60 -103 60 -107 0 -5 10 -22 23 -39 50 -66 87 -138 87 -165 0 -30 -47 -81 -75 -81 -23 0 -71 56 -120 138 -25 42 -50 84 -55 92 -5 8 -35 58 -66 110 -93 156 -97 160 -153 160 -48 0 -48 0 -55 -37 -3 -21 -6 -123 -6 -227 0 -181 -1 -191 -22 -213 -27 -28 -67 -30 -96 -3 l-22 21 0 529 0 529 22 15 c30 21 354 23 408 2z m970 4 c24 -13 35 -64 20 -100 -15 -37 -33 -40 -275 -40 l-203 0 2 -157 1 -158 191 -5 c171 -4 194 -7 213 -24 29 -26 29 -86 0 -112 -19 -17 -40 -19 -213 -20 l-191 -2 0 -168 0 -169 230 -2 c220 -3 231 -4 248 -24 9 -12 17 -34 17 -49 0 -85 -18 -90 -318 -90 -257 0 -304 6 -322 40 -6 12 -10 218 -10 538 l0 520 23 15 c19 14 64 16 295 16 163 1 281 -3 292 -9z m759 0 c27 -14 45 -64 32 -87 -29 -50 -17 -48 -258 -53 l-228 -5 0 -155 0 -155 193 -5 194 -5 24 -28 c30 -35 30 -54 0 -92 l-24 -30 -184 -2 c-100 -1 -189 -2 -195 -2 -10 -1 -13 -39 -13 -155 0 -85 3 -161 6 -170 5 -14 35 -16 234 -16 216 0 228 -1 245 -20 26 -29 25 -85 -3 -113 -22 -21 -29 -22 -289 -25 -189 -2 -275 0 -295 9 -58 24 -58 22 -58 559 0 521 2 541 47 553 36 9 555 7 572 -3z m-5910 -1382 c61 -14 86 -37 77 -71 -8 -32 -40 -40 -84 -21 -47 19 -68 18 -92 -6 -17 -17 -19 -24 -9 -43 17 -31 28 -37 72 -37 152 0 201 -192 66 -260 -73 -38 -204 -20 -248 34 -10 12 -8 20 10 45 27 37 28 37 76 11 68 -36 133 -20 133 35 0 18 -9 26 -47 38 -27 8 -61 18 -78 21 -70 15 -107 86 -85 165 12 47 36 69 92 86 55 17 56 17 117 3z m1833 -5 c42 -8 100 -79 96 -118 -3 -26 -7 -30 -36 -33 -29 -3 -40 3 -71 37 -43 47 -57 50 -95 20 -25 -20 -26 -24 -26 -123 0 -89 3 -105 20 -124 35 -38 81 -25 110 29 8 14 21 19 49 19 50 0 65 -17 46 -54 -40 -76 -85 -106 -162 -106 -57 0 -96 21 -133 72 -29 40 -30 44 -30 158 0 123 9 158 51 196 25 23 96 44 128 38 13 -3 36 -8 53 -11z m2863 2 c66 -20 82 -36 67 -70 -9 -20 -19 -25 -46 -25 -19 0 -38 5 -41 10 -10 16 -67 12 -87 -7 -42 -38 -14 -73 68 -84 74 -10 120 -45 129 -99 19 -110 -46 -180 -166 -180 -67 0 -144 29 -151 57 -13 49 37 90 71 59 10 -9 40 -19 67 -22 41 -5 52 -3 67 14 10 11 17 30 15 43 -3 19 -14 25 -83 41 -106 25 -135 54 -135 133 0 46 5 60 29 87 26 30 81 54 124 57 11 1 43 -6 72 -14z m535 2 c63 -17 86 -36 111 -92 18 -41 21 -61 17 -149 -6 -126 -23 -162 -95 -200 -50 -25 -121 -21 -171 11 -23 15 -42 32 -42 37 0 5 -8 18 -17 29 -15 15 -18 39 -18 135 0 155 22 198 115 228 46 16 48 16 100 1z m-7462 -6 c11 -6 13 -44 10 -178 -3 -161 -4 -171 -28 -205 -30 -45 -77 -68 -136 -68 -91 0 -138 57 -79 96 22 14 30 15 50 4 13 -7 35 -10 48 -6 39 9 49 56 46 209 -2 73 1 138 5 145 8 14 64 16 84 3z m454 -13 c7 -13 18 -39 24 -58 7 -19 22 -60 34 -90 12 -30 25 -67 27 -83 3 -15 9 -30 14 -33 5 -3 9 -12 9 -20 0 -8 9 -36 21 -61 28 -61 20 -93 -24 -93 -42 0 -54 9 -63 45 -10 41 -19 45 -97 44 -64 -1 -68 -3 -73 -28 -10 -41 -34 -61 -71 -61 -29 0 -33 3 -33 28 0 15 18 77 39 137 103 291 105 295 152 295 19 0 33 -8 41 -22z m514 -93 c31 -63 58 -115 60 -115 3 0 25 48 56 120 24 58 43 95 53 102 16 12 70 9 83 -4 15 -15 17 -384 2 -422 -13 -36 -63 -36 -86 -1 -13 20 -15 38 -9 94 9 88 -5 98 -36 26 -24 -54 -25 -55 -67 -55 -32 0 -44 4 -49 18 -15 47 -38 92 -45 92 -4 0 -8 -37 -8 -82 0 -88 -14 -118 -55 -118 -42 0 -45 13 -45 235 0 117 3 215 7 218 3 4 23 7 44 7 l38 0 57 -115z m822 78 c4 -43 -15 -51 -113 -50 l-80 1 -3 -46 -3 -47 83 -3 83 -3 3 -36 c4 -43 -8 -49 -104 -49 l-62 0 -4 -42 c-3 -24 -3 -46 -1 -50 2 -5 49 -8 104 -8 l100 0 -3 -42 -3 -43 -134 -3 c-90 -2 -138 1 -147 9 -11 9 -14 55 -14 224 0 116 3 215 7 219 4 3 70 5 147 4 l141 -3 3 -32z m1409 -8 c28 -33 33 -46 33 -89 0 -52 -19 -93 -54 -119 -15 -11 -13 -19 24 -93 48 -97 46 -116 -12 -112 -39 3 -41 5 -82 83 -45 88 -51 95 -83 95 -25 0 -26 -2 -23 -73 1 -26 -1 -61 -5 -77 -6 -26 -11 -30 -39 -30 -18 0 -37 5 -44 12 -14 14 -18 429 -4 442 4 5 63 6 131 4 l124 -4 34 -39z m368 36 c8 -14 13 -390 5 -421 -4 -18 -14 -26 -34 -28 -54 -7 -56 1 -56 233 0 116 3 215 7 218 10 10 71 8 78 -2z m933 -84 l3 -88 67 3 67 3 3 75 c4 100 5 102 49 98 l38 -3 0 -225 0 -225 -31 -3 c-17 -2 -36 3 -42 11 -6 7 -12 49 -14 93 l-3 79 -67 3 -68 3 0 -84 c0 -51 -5 -88 -12 -95 -15 -15 -61 -15 -76 0 -13 13 -18 429 -5 442 4 4 25 6 48 4 l40 -3 3 -88z m692 78 c26 -31 155 -409 147 -429 -7 -18 -49 -21 -77 -6 -10 5 -21 23 -25 39 -7 33 -26 41 -103 41 -48 0 -53 -2 -63 -27 -21 -53 -26 -58 -62 -61 -28 -3 -37 1 -42 17 -7 25 -5 36 42 161 76 203 83 224 83 241 0 36 75 54 100 24z m654 -14 c14 -13 31 -42 39 -65 19 -57 0 -124 -43 -150 l-31 -18 19 -31 c49 -82 74 -137 69 -151 -4 -11 -19 -16 -46 -16 -45 0 -47 2 -103 110 -27 54 -37 65 -58 65 -24 0 -25 -2 -28 -75 -3 -85 -13 -102 -56 -98 l-31 3 -3 229 -2 228 124 -4 c114 -4 127 -6 150 -27z m582 -13 c43 -48 57 -103 52 -209 -3 -73 -8 -92 -33 -132 -21 -33 -41 -50 -70 -61 -50 -19 -205 -22 -223 -4 -14 14 -18 429 -4 442 4 5 60 6 126 4 l119 -4 33 -36z m1500 34 c6 -4 20 -23 30 -42 24 -43 56 -93 65 -100 4 -3 17 -24 29 -47 12 -24 26 -43 31 -43 4 0 10 53 11 118 l3 117 33 3 c61 6 62 1 62 -224 0 -171 -2 -205 -16 -218 -16 -17 -52 -21 -69 -8 -11 7 -58 77 -119 175 -20 32 -41 55 -46 52 -6 -3 -10 -49 -10 -101 0 -111 -9 -134 -51 -134 -22 0 -32 6 -39 26 -15 38 -13 407 2 422 13 13 66 16 84 4z"/>
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