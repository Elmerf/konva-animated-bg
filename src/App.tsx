/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import Konva from "konva";
import { Image, Layer, Rect, Stage } from "react-konva";
import "gifler";

import "./App.css";

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
  const canvasRef = useRef<HTMLCanvasElement>();

  useEffect(() => {
    // Set the Background Image
    if (props.image?.src.split(",")[0].includes("gif")) {
      canvasRef.current = document.createElement("canvas");
      canvasRef.current.width = props.image.width;
      canvasRef.current.height = props.image.height;
      const ctx = canvasRef.current.getContext("2d");

      if (ctx === null) throw new Error("Cannot initialize canvas context");
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, props.image.width, props.image.height);

      (window as any).gifler(props.image.src).get((a: any) => {
        const anim = a;

        anim.animateInCanvas(canvasRef.current);
        anim.onDrawFrame = (ctx: any, frame: any) => {
          ctx.drawImage(frame.buffer, frame.x, frame.y);
          imageRef.current?.getLayer()?.draw();
        };
      });

      imageRef.current?.setAttr("image", canvasRef.current);
    } else {
      imageRef.current?.setAttr("image", props.image);
    }

    // Scale image to canvas, emulate css object-fit: cover
    if (imageRef.current) {
      const imageWidth = props.image?.width ?? 0;
      const imageHeight = props.image?.height ?? 0;

      const aspectRatio = imageRef.current.width() / imageRef.current.height();
      const imageRatio = imageWidth / imageHeight;

      let newWidth;
      let newHeight;

      if (aspectRatio >= imageRatio) {
        newWidth = imageWidth;
        newHeight = imageWidth / aspectRatio;
      } else {
        newWidth = imageHeight * aspectRatio;
        newHeight = imageHeight;
      }

      const x = (imageWidth - newWidth) / 2;
      const y = (imageHeight - newHeight) / 2;

      // console.log({
      //   cropX: x,
      //   cropY: y,
      //   cropWidth: newWidth,
      //   cropHeight: newHeight,
      // });

      imageRef.current.setAttrs({
        cropX: x,
        cropY: y,
        cropWidth: newWidth,
        cropHeight: newHeight,
      });
    }
  }, [props.image]);

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

function App() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const stageRef = useRef<Konva.Stage>(null);

  const [bgImage, setBgImage] = useState<HTMLImageElement | undefined>(
    undefined
  );

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();

      reader.readAsDataURL(file);

      reader.onload = () => {
        const img = new window.Image();
        img.src = reader.result as string;
        setBgImage(img);
      };
    }
  };

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
          if (inputRef.current) {
            inputRef.current.click();
          }
        }}
      >
        Change Background
      </button>
      <input
        ref={inputRef}
        type="file"
        style={{ display: "none" }}
        accept=".png, .jpg, .gif"
        onChange={handleImageChange}
      />
      <p>*only accept .png, .jpg, and .gif format</p>
      <Stage ref={stageRef} width={STAGE_SIZE.width} height={STAGE_SIZE.height}>
        <Layer>
          <BackgroundShape image={bgImage} />
        </Layer>
      </Stage>
    </div>
  );
}

export default App;
