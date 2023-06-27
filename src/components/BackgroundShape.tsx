import { useRef } from "react";
import { Image, Rect } from "react-konva";
import Konva from "konva";
import useKonvaAnimatedGIF from "../hooks/useKonvaAnimateGIF";
import { DEFAULT_STAGE_SIZE } from "../constants";

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
        width={DEFAULT_STAGE_SIZE.width}
        height={DEFAULT_STAGE_SIZE.height}
      />
    );
  } else {
    return (
      <Rect
        ref={rectRef}
        width={DEFAULT_STAGE_SIZE.width}
        height={DEFAULT_STAGE_SIZE.height}
        fill="white"
      />
    );
  }
};

export default BackgroundShape;
