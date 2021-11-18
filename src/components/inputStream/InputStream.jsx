import { useState } from "react";
import { Logger, ConsoleLogger } from "react-console-logger";
import { useHistory } from "react-router";

import {
  createGuid,
  convertEnumSdpTypes,
  convertEnumSdpTypesToNumbers,
} from "../../lib/func";

const InputStream = () => {
  const [id, setId] = useState(createGuid());
  const STUN_URL = "stun:stun.sipsorcery.com";
  const WEBSOCKET_URL = "ws://127.0.0.1:8081/";
  const baseUrl = "http://84.201.188.97:1443/";
  //const baseUrl = "http://localhost:5000/";
  const getOfferUrl = `${baseUrl}api/webrtc/getoffer?id=${id}`;
  const setAnswerUrl = `${baseUrl}api/webrtc/setanswer?id=${id}`;
  const setIceCandidateUrl = `${baseUrl}api/webrtc/addicecandidate?id=${id}`;

  const myLogger = new Logger();
  const history = useHistory();

  let pc, ws;

  async function start() {
    pc = new RTCPeerConnection({ iceServers: [{ urls: STUN_URL }] });

    pc.ontrack = (evt) =>
      (document.querySelector("#videoCtl").srcObject = evt.streams[0]);
    pc.onicecandidate = (evt) =>
      evt.candidate && ws.send(JSON.stringify(evt.candidate));

    // Diagnostics.
    pc.onicegatheringstatechange = () =>
      console.log("onicegatheringstatechange: " + pc.iceGatheringState);
    pc.oniceconnectionstatechange = () =>
      console.log("oniceconnectionstatechange: " + pc.iceConnectionState);
    pc.onsignalingstatechange = () =>
      console.log("onsignalingstatechange: " + pc.signalingState);
    pc.onconnectionstatechange = () =>
      console.log("onconnectionstatechange: " + pc.connectionState);

    ws = new WebSocket(WEBSOCKET_URL, []);
    ws.onmessage = async function (evt) {
      if (/^[\{"'\s]*candidate/.test(evt.data)) {
        pc.addIceCandidate(JSON.parse(evt.data));
      } else {
        await pc.setRemoteDescription(
          new RTCSessionDescription(JSON.parse(evt.data))
        );
        pc.createAnswer()
          .then((answer) => pc.setLocalDescription(answer))
          .then(() => ws.send(JSON.stringify(pc.localDescription)));
      }
    };
  }

  async function closePeer() {
    if (pc != null) {
      await pc.close();
      await ws.close();
    }
  }

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
            <h1 className="display-4">SmartVS - InputStream</h1>
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
            <span> </span>
            <button
              type="button"
              className="btn btn-success"
              onClick={() => history.push("/")}
            >
              OutputStream
            </button>
          </div>
          <div>
            <br />
            {/* <ConsoleLogger logger={myLogger} /> */}
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

export default InputStream;
