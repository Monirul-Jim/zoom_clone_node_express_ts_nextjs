// 'use client';
// import React, { useEffect, useRef } from 'react';

// export const VideoGrid = () => {
//   const localVideoRef = useRef<HTMLVideoElement>(null);

//   useEffect(() => {
//     navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
//       if (localVideoRef.current) localVideoRef.current.srcObject = stream;
//     });
//   }, []);

//   return (
//     <div className="grid grid-cols-2 gap-4 p-4 bg-black">
//       <video ref={localVideoRef} autoPlay muted className="rounded-2xl w-full h-auto shadow-lg" />
//       {/* More remote video tags via WebRTC */}
//     </div>
//   );
// };
'use client';
import React, { useEffect, useRef } from 'react';

export const VideoGrid = () => {
    const localVideoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
            (window as any).localStream = stream; // Make it globally accessible for controls
            if (localVideoRef.current) localVideoRef.current.srcObject = stream;
        }).catch(error => {
            console.error("Error accessing media devices:", error);
            // Handle the error appropriately (e.g., display a message to the user)
        });
    }, []);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
            <div className="relative rounded-2xl overflow-hidden shadow-lg bg-gray-800">
                <video ref={localVideoRef} autoPlay muted className="w-full h-full object-cover" />
                <div className="absolute bottom-2 left-2 bg-gray-600 bg-opacity-75 text-xs rounded-md p-1">You</div>
            </div>
            {/* More remote video slots will be added here */}
        </div>
    );
};
