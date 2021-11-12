import { useState } from "react";
import { Logger, ConsoleLogger } from "react-console-logger";

import {
  createGuid,
  convertEnumSdpTypes,
  convertEnumSdpTypesToNumbers,
} from "../../lib/func";

const MainScreen = () => {
  const [id, setId] = useState(createGuid());
  const baseUrl = "http://84.201.188.97:1443/";
  //const baseUrl = "http://localhost:5000/";
  const getOfferUrl = `${baseUrl}api/webrtc/getoffer?id=${id}`;
  const setAnswerUrl = `${baseUrl}api/webrtc/setanswer?id=${id}`;
  const setIceCandidateUrl = `${baseUrl}api/webrtc/addicecandidate?id=${id}`;
  const myLogger = new Logger();

  let pc;

  const start = async () => {
    closePeer();

    let videoControl = document.querySelector("#videoCtl");

    const localStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    videoControl.srcObject = localStream;

    pc = new RTCPeerConnection(null);

    localStream.getTracks().forEach((track) => {
      myLogger.log("add local track " + track.kind + " to peer connection.");
      console.log("add local track " + track.kind + " to peer connection.");
      myLogger.log(track);
      console.log(track);
      pc.addTrack(track, localStream);
    });

    pc.onicegatheringstatechange = () =>
      myLogger.log("onicegatheringstatechange: " + pc.iceGatheringState);

    pc.oniceconnectionstatechange = () =>
      myLogger.log("oniceconnectionstatechange: " + pc.iceConnectionState);

    pc.onsignalingstatechange = () =>
      myLogger.log("onsignalingstatechange: " + pc.signalingState);

    pc.onicecandidate = async function (event) {
      if (event.candidate) {
        myLogger.log("new-ice-candidate:");
        myLogger.log(event.candidate.candidate);
        myLogger.log(event.candidate);

        await fetch(setIceCandidateUrl, {
          method: "POST",
          body: JSON.stringify(event.candidate),
          headers: { "Content-Type": "application/json" },
        });
      }
    };

    let offerResponse = await fetch(getOfferUrl);
    let offer = await offerResponse.json();
    myLogger.log("got offer: " + offer.type + " " + offer.sdp + ".");
    console.log("got offer: " + offer.type + " " + offer.sdp + ".");
    await pc.setRemoteDescription(offer);

    pc.createAnswer()
      .then((answer) => {
        myLogger.log("cAnswer:", answer);
        return pc.setLocalDescription(answer);
      })
      .then(async () => {
        myLogger.log("Sending answer SDP.-->," + pc.localDescription["type"]);
        console.log("Sending answer SDP.-->," + pc.localDescription["type"]);
        myLogger.log("SDP: " + pc.localDescription.sdp);
        console.log("SDP: " + pc.localDescription.sdp);
        await fetch(setAnswerUrl, {
          method: "POST",
          body: JSON.stringify(pc.localDescription),
          headers: { "Content-Type": "application/json" },
        });
      });
  };

  const closePeer = () => {
    if (pc != null) {
      myLogger.log("close peer");
      console.log("close peer");
      pc.close();
    }
  };
  return (
    <>
      <header>
        <nav className="navbar navbar-expand-sm navbar-toggleable-sm navbar-light bg-white border-bottom box-shadow mb-3">
          <div className="container">
            <a className="navbar-brand" href="">
              ProgressTerra
            </a>
            <button
              className="navbar-toggler"
              type="button"
              data-toggle="collapse"
              data-target=".navbar-collapse"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="navbar-collapse collapse d-sm-inline-flex flex-sm-row-reverse">
              <ul className="navbar-nav flex-grow-1">
                <li className="nav-item"></li>
              </ul>
            </div>
          </div>
        </nav>
      </header>
      <div className="container">
        <main role="main" className="pb-3">
          <div className="text-center">
            <h1 className="display-4">SmartVS</h1>
          </div>

          <video controls id="videoCtl" autoPlay={true}>
            lala
          </video>
          <br />

          <div>
            <button
              type="button"
              className="btn btn-success"
              onClick={() => start()}
            >
              Start
            </button>
            <span> </span>
            <button
              type="button"
              className="btn btn-success"
              onClick={() => closePeer()}
            >
              Close
            </button>
          </div>
          <div>
            <br />
            <ConsoleLogger logger={myLogger} />
            <br />
          </div>
        </main>
      </div>

      {/* <footer className="border-top footer text-muted">
        <div className="container">© 2021 - ProgressTerra -</div>
      </footer> */}
    </>
  );
};

export default MainScreen;
