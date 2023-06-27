import { useEffect, useRef, useState } from "react";
import Konva from "konva";
import { Image, Layer, Stage, Transformer } from "react-konva";
import { Button } from "@mui/material";
import BackgroundShape from "./BackgroundShape";
import useImageInput from "../hooks/useImageInput";
import useKonvaAnimatedGIF from "../hooks/useKonvaAnimateGIF";

import { DEFAULT_STAGE_SIZE } from "../constants";

const useStickers = () => {
  const [stickers, setStickers] = useState<HTMLImageElement[]>([]);
  const { loadImage: loadStickers, image, resetImage } = useImageInput();

  useEffect(() => {
    if (image) {
      setStickers((stickers) => [...stickers, image]);
      resetImage();
    }
  }, [image, resetImage]);

  return { loadStickers, stickers };
};

type StickerImage = {
  isSelected: boolean;
};

const StickerImage: React.FC<
  React.ComponentProps<typeof Image> & StickerImage
> = (props) => {
  const stickerImgRef = useRef<Konva.Image>(null);
  const transformerRef = useRef<Konva.Transformer>(null);

  useKonvaAnimatedGIF(props.image as HTMLImageElement, stickerImgRef);

  useEffect(() => {
    if (props.isSelected) {
      transformerRef.current?.nodes([stickerImgRef.current as Konva.Image]);
      transformerRef.current?.getLayer()?.batchDraw();
    }
  }, [props.isSelected]);

  return (
    <>
      <Image
        {...props}
        ref={stickerImgRef}
        image={undefined}
        width={(props.image as HTMLImageElement).width ?? 0}
        height={(props.image as HTMLImageElement).height ?? 0}
        draggable
      />
      {props.isSelected ? (
        <Transformer
          ref={transformerRef}
          boundBoxFunc={(oldBox, newBox) => {
            // limit resize
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }
            return newBox;
          }}
        />
      ) : null}
    </>
  );
};

const KonvaStage: React.FC = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<Konva.Stage>(null);

  const { loadImage, resetImage, image } = useImageInput();
  const { loadStickers, stickers } = useStickers();

  const [selectedSticker, setSelectedSticker] = useState(-1);

  const deselect = () => {
    setSelectedSticker(-1);
  };

  useEffect(() => {
    const fitToParentContainer = () => {
      if (wrapperRef.current && stageRef.current) {
        const wrapperWidth = wrapperRef.current.offsetWidth;
        const scale = wrapperWidth / DEFAULT_STAGE_SIZE.width;

        stageRef.current.width(DEFAULT_STAGE_SIZE.width * scale);
        stageRef.current.height(DEFAULT_STAGE_SIZE.height * scale);
        stageRef.current.scale({ x: scale, y: scale });
      }
    };

    fitToParentContainer();
    window.addEventListener("resize", fitToParentContainer);

    return () => window.removeEventListener("resize", fitToParentContainer);
  }, []);
  return (
    <div
      ref={wrapperRef}
      className="wrapper"
      style={{
        position: "absolute",
        width: "75%",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }}
    >
      <Button
        variant="contained"
        sx={{ mb: 1 }}
        onClick={() => {
          loadImage();
        }}
      >
        Change Background
      </Button>
      <Button
        variant="contained"
        sx={{ mb: 1, ml: 1 }}
        onClick={() => {
          resetImage();
        }}
      >
        Delete Background
      </Button>
      <Button
        variant="contained"
        sx={{ mb: 1, ml: 1 }}
        onClick={() => {
          loadStickers();
        }}
      >
        Add Stickers/GIFs
      </Button>
      <Stage
        ref={stageRef}
        width={DEFAULT_STAGE_SIZE.width}
        height={DEFAULT_STAGE_SIZE.height}
      >
        <Layer onMouseDown={deselect} onTouchStart={deselect}>
          <BackgroundShape image={image} />
        </Layer>
        <Layer>
          {stickers.map((sticker, index) => (
            <StickerImage
              image={sticker}
              key={index}
              onClick={() => setSelectedSticker(index)}
              onTap={() => setSelectedSticker(index)}
              isSelected={index === selectedSticker}
            />
          ))}
          {/* <PlaceholderShape width={1000} height={1000} x={500} y={200} />
          <PlaceholderShape width={500} height={500} x={750} y={1400} />
          <PlaceholderShape width={1200} height={1800} x={2000} y={200} /> */}
        </Layer>
      </Stage>
    </div>
  );
};

export default KonvaStage;
