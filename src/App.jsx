import logo from './logo.svg';
import * as faceapi from "face-api.js"
import './App.css';
import {useEffect, useRef} from "react";

function App() {
    const imgRef = useRef()
    const canvasRef = useRef()

    const handleImage = async()=>{
        // Creates an array with available detections on our current image
        const detections = await faceapi.detectAllFaces(imgRef.current, new faceapi.TinyFaceDetectorOptions()
        ).withFaceLandmarks()
            .withFaceExpressions()

        canvasRef.current.innerHtml = faceapi.createCanvasFromMedia(imgRef.current);
        faceapi.matchDimensions(canvasRef.current,{
            width: 900,
            height: 550
        })

        // Resizing the results and adjusting them accoridng to our image size
        const resizedVersion = faceapi.resizeResults(detections,{
            width: 900,
            height: 550
        })

        // All combined, comment out for single view
        faceapi.draw.drawDetections(canvasRef.current,resizedVersion)
        faceapi.draw.drawFaceExpressions(canvasRef.current,resizedVersion)
        faceapi.draw.drawFaceLandmarks(canvasRef.current,resizedVersion)

    }

    useEffect(()=>{
        const loadModels = ()=>{
            // The faceapi models we want to use, check face-api.js documentation for full models list
            Promise.all([
                faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
                faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
                faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
                faceapi.nets.faceExpressionNet.loadFromUri("/models")
            ]).then(handleImage)
                .catch((e)=>{console.log(e)})
        }

        imgRef.current && loadModels()
    },[])
  return (
    <div className="App">
        <canvas ref={canvasRef} width="900" height="550"/>
      <img crossOrigin="anonymous" ref={imgRef} src="https://n-cdn.serienjunkies.de/hq/106927.jpg" alt="" width={"900"} height={"550"}/>
    </div>
  );
}

export default App;
