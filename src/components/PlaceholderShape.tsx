import Konva from "konva";
import { useRef } from "react";
import useImageInput from "../hooks/useImageInput";
import useKonvaAnimatedGIF from "../hooks/useKonvaAnimateGIF";
import { Image, Rect } from "react-konva";

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

export default PlaceholderShape;
