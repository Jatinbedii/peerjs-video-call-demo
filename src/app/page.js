"use client";
import Peer from "peerjs";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const vdref = useRef(null);
  const rmref = useRef(null);
  const [peer, setPeer] = useState(null);
  const [id, setId] = useState("");

  useEffect(() => {
    const peerInstance = new Peer();
    setPeer(peerInstance);
    peerInstance.on("open", (id) => {
      console.log("My peer ID is: " + id);
    });

    peerInstance.on("call", (call) => {
      if (typeof navigator !== "undefined" && navigator.mediaDevices) {
        navigator.mediaDevices
          .getUserMedia({ video: true, audio: true })
          .then((stream) => {
            vdref.current.srcObject = stream;
            call.answer(stream); // Answer the call with an A/V stream.
            call.on("stream", (remoteStream) => {
              rmref.current.srcObject = remoteStream;
            });
          })
          .catch((err) => {
            console.error("Failed to get local stream", err);
          });
      }
    });

    return () => {
      peerInstance.destroy(); // Clean up Peer instance when component unmounts
    };
  }, []);

  function callHandler() {
    if (peer) {
      if (typeof navigator !== "undefined" && navigator.mediaDevices) {
        navigator.mediaDevices
          .getUserMedia({ audio: true, video: true })
          .then((stream) => {
            vdref.current.srcObject = stream;
            const call = peer.call(id, stream);
            call.on("stream", (remoteStream) => {
              rmref.current.srcObject = remoteStream;
            });
          })
          .catch((err) => {
            console.error("Failed to get local stream", err);
          });
      }
    }
  }

  return (
    <main>
      <input
        value={id}
        onChange={(e) => setId(e.target.value)}
        placeholder="Enter Peer ID"
      />
      <button onClick={callHandler}>Call</button>
      <video
        ref={vdref}
        className="mx-auto mt-3 rounded-lg border-white border-2 max-w-full"
        autoPlay
        playsInline
        height={400}
        width={400}
      />
      <video
        ref={rmref}
        className="mx-auto mt-3 rounded-lg border-white border-2 max-w-full"
        autoPlay
        playsInline
        height={400}
        width={400}
      />
    </main>
  );
}
