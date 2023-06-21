import React, { useEffect, useRef } from "react";
import Konva from "konva";
import "gifler";

const useKonvaAnimatedGIF = (
  image: HTMLImageElement | undefined,
  konvaImgRef: React.RefObject<Konva.Image>
) => {
  const canvasRef = useRef<HTMLCanvasElement>();

  useEffect(() => {
    if (konvaImgRef.current && image) {
      // Set the Background Image
      if (image.src.split(",")[0].includes("gif")) {
        canvasRef.current = document.createElement("canvas");
        canvasRef.current.width = image.width;
        canvasRef.current.height = image.height;
        const ctx = canvasRef.current.getContext("2d");

        if (ctx === null) throw new Error("Cannot initialize canvas context");
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, image.width, image.height);

        (window as any).gifler(image.src).get((a: any) => {
          const anim = a;

          anim.animateInCanvas(canvasRef.current);
          anim.onDrawFrame = (ctx: any, frame: any) => {
            ctx.drawImage(frame.buffer, frame.x, frame.y);
            konvaImgRef.current?.getLayer()?.draw();
          };
        });

        konvaImgRef.current.setAttr("image", canvasRef.current);
      } else {
        konvaImgRef.current.setAttr("image", image);
      }

      // Scale image to canvas, emulate css object-fit: cover
      const imageWidth = image.width;
      const imageHeight = image.height;

      const aspectRatio =
        konvaImgRef.current.width() / konvaImgRef.current.height();
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

      konvaImgRef.current.setAttrs({
        cropX: x,
        cropY: y,
        cropWidth: newWidth,
        cropHeight: newHeight,
      });
    }
  }, [image, konvaImgRef]);
};

export default useKonvaAnimatedGIF;
