/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef } from "react";
import Konva from "konva";
import { Image, Layer, Rect, Stage } from "react-konva";
import "gifler";

import useImageInput from "./hooks/useImageInput";

import "./App.css";
import useKonvaAnimatedGIF from "./hooks/useKonvaAnimateGIF";

const STAGE_SIZE = {
  width: 3840,
  height: 2160,
};

type BackgroundShape = {
  image?: HTMLImageElement;
};

const BackgroundShape: React.FC<BackgroundShape> = (props) => {
  const rectRef = useRef<Konva.Rect>(null);
  const imageRef = useRef<Konva.Image>(null);

  useKonvaAnimatedGIF(props.image, imageRef);

  if (props.image) {
    return (
      <Image
        ref={imageRef}
        image={undefined}
        width={STAGE_SIZE.width}
        height={STAGE_SIZE.height}
      />
    );
  } else {
    return (
      <Rect
        ref={rectRef}
        width={STAGE_SIZE.width}
        height={STAGE_SIZE.height}
        fill="white"
      />
    );
  }
};

type PlaceholderShape = {
  width?: number;
  height?: number;
  x?: number;
  y?: number;
};

const PlaceholderShape: React.FC<PlaceholderShape> = (props) => {
  const rectRef = useRef<Konva.Rect>(null);
  const imgRef = useRef<Konva.Image>(null);

  const { loadImage, image } = useImageInput();

  useKonvaAnimatedGIF(image, imgRef);

  if (image) {
    return (
      <Image
        ref={imgRef}
        onMouseEnter={() => {
          if (imgRef.current)
            (
              imgRef.current.getStage() as Konva.Stage
            ).container().style.cursor = "pointer";
        }}
        onMouseLeave={() => {
          if (imgRef.current)
            (
              imgRef.current.getStage() as Konva.Stage
            ).container().style.cursor = "default";
        }}
        onMouseDown={() => {
          loadImage();
        }}
        onTouchStart={() => {
          loadImage();
        }}
        image={undefined}
        width={props.width}
        height={props.height}
        x={props.x}
        y={props.y}
      />
    );
  } else {
    return (
      <Rect
        ref={rectRef}
        onMouseEnter={() => {
          if (rectRef.current)
            (
              rectRef.current.getStage() as Konva.Stage
            ).container().style.cursor = "pointer";
        }}
        onMouseLeave={() => {
          if (rectRef.current)
            (
              rectRef.current.getStage() as Konva.Stage
            ).container().style.cursor = "default";
        }}
        onMouseDown={() => {
          loadImage();
        }}
        onTouchStart={() => {
          loadImage();
        }}
        onTo
        width={props.width}
        height={props.height}
        x={props.x}
        y={props.y}
        fill="grey"
      />
    );
  }
};

PlaceholderShape.defaultProps = {
  width: 50,
  height: 50,
  x: 0,
  y: 0,
};

function App() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<Konva.Stage>(null);

  const { loadImage, image } = useImageInput();

  useEffect(() => {
    const fitToParentContainer = () => {
      if (wrapperRef.current && stageRef.current) {
        const wrapperWidth = wrapperRef.current.offsetWidth;
        const scale = wrapperWidth / STAGE_SIZE.width;

        stageRef.current.width(STAGE_SIZE.width * scale);
        stageRef.current.height(STAGE_SIZE.height * scale);
        stageRef.current.scale({ x: scale, y: scale });
      }
    };

    fitToParentContainer();
    window.addEventListener("resize", fitToParentContainer);

    return () => window.removeEventListener("resize", fitToParentContainer);
  }, []);

  return (
    <div ref={wrapperRef} className="wrapper" style={{ width: "70vw" }}>
      <button
        role="button"
        onClick={() => {
          loadImage();
        }}
      >
        Change Background
      </button>
      <p>*only accept .png, .jpg, and .gif format</p>
      <Stage ref={stageRef} width={STAGE_SIZE.width} height={STAGE_SIZE.height}>
        <Layer>
          <BackgroundShape image={image} />
        </Layer>
        <Layer>
          <PlaceholderShape width={1000} height={1000} x={500} y={200} />
          <PlaceholderShape width={500} height={500} x={750} y={1400} />
          <PlaceholderShape width={1200} height={1800} x={2000} y={200} />
        </Layer>
      </Stage>
    </div>
  );
}

export default App;
