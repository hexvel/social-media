"use client";

import {
  Fullscreen,
  PauseIcon,
  PlayIcon,
  SkipBackIcon,
  SkipForward,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface VideoPlayerProps {
  src: string;
}

const VideoPlayer = ({ src }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [playing, setPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [videoTime, setVideoTime] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [fullscreen, setFullscreen] = useState<boolean>(false);
  const [showControls, setShowControls] = useState<boolean>(false);
  const [controlTimeout, setControlTimeout] = useState<NodeJS.Timeout | null>(
    null,
  );
  const [volume, setVolume] = useState<number>(1); // Volume range [0, 1]

  const videoHandler = (control: "play" | "pause") => {
    if (videoRef.current) {
      if (control === "play") {
        videoRef.current.play();
        setPlaying(true);
        setVideoTime(videoRef.current.duration);
      } else if (control === "pause") {
        videoRef.current.pause();
        setPlaying(false);
      }
    }
  };

  const fastForward = () => {
    if (videoRef.current) videoRef.current.currentTime += 5;
  };

  const revert = () => {
    if (videoRef.current) videoRef.current.currentTime -= 5;
  };

  const jumpForward = () => {
    if (videoRef.current) videoRef.current.currentTime += 10;
  };

  const jumpBackward = () => {
    if (videoRef.current) videoRef.current.currentTime -= 10;
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoRef.current?.requestFullscreen();
      setFullscreen(true);
    } else {
      document.exitFullscreen();
      setFullscreen(false);
    }
  };

  const handleVideoClick = () => {
    if (playing) {
      videoHandler("pause");
    } else {
      videoHandler("play");
    }
  };

  const handleProgressClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    if (videoRef.current) {
      const boundingRect = event.currentTarget.getBoundingClientRect();
      const clickX = event.clientX - boundingRect.left;
      const clickPercentage = clickX / boundingRect.width;
      videoRef.current.currentTime =
        clickPercentage * videoRef.current.duration;
      setProgress(clickPercentage * 100);
    }
  };

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(event.target.value);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setVolume(newVolume);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (videoRef.current) {
        setCurrentTime(videoRef.current.currentTime);
        setProgress((videoRef.current.currentTime / videoTime) * 100);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [videoTime]);

  useEffect(() => {
    const handleMouseMove = () => {
      if (!fullscreen) {
        setShowControls(true);
        if (controlTimeout) clearTimeout(controlTimeout);
        setControlTimeout(setTimeout(() => setShowControls(false), 3000));
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      if (controlTimeout) clearTimeout(controlTimeout);
    };
  }, [fullscreen, controlTimeout]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case "ArrowRight":
          jumpForward();
          break;
        case "ArrowLeft":
          jumpBackward();
          break;
        default:
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div
      className={`group relative h-full w-full ${fullscreen ? "fullscreen" : ""}`}
    >
      <video
        ref={videoRef}
        className="mx-auto size-fit max-h-[30rem] rounded-2xl"
        src={src}
        onClick={handleVideoClick}
      />

      {!fullscreen && !playing && !showControls && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              videoHandler("play");
            }}
            className="flex h-16 w-16 items-center justify-center rounded-full bg-primary"
          >
            <PlayIcon />
          </button>
        </div>
      )}

      {(showControls || playing) && (
        <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-70 p-4 transition-all duration-300 group-hover:bottom-0 group-hover:opacity-100 sm:p-6 sm:opacity-0">
          <div className="mb-2 flex items-center justify-between">
            <button
              onClick={revert}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-primary"
            >
              <SkipBackIcon className="fill-white text-white" />
            </button>
            {playing ? (
              <button
                onClick={() => videoHandler("pause")}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-primary"
              >
                <PauseIcon className="fill-white text-white" />
              </button>
            ) : (
              <button
                onClick={() => videoHandler("play")}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-primary"
              >
                <PlayIcon className="fill-white text-white" />
              </button>
            )}
            <button
              onClick={fastForward}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-primary"
            >
              <SkipForward className="fill-white text-white" />
            </button>
            <button
              onClick={toggleFullscreen}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-primary"
            >
              <Fullscreen className="fill-white text-white" />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-white">
              {Math.floor(currentTime / 60)}:
              {("0" + Math.floor(currentTime % 60)).slice(-2)}
            </p>
            <div
              onClick={handleProgressClick}
              className="relative mx-4 h-1 w-3/4 cursor-pointer rounded-full bg-gray-600"
            >
              <div
                style={{ width: `${progress}%` }}
                className="h-full rounded-full bg-primary"
              />
            </div>
            <p className="text-white">
              {Math.floor(videoTime / 60)}:
              {("0" + Math.floor(videoTime % 60)).slice(-2)}
            </p>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="mx-2 w-24 accent-primary"
          />
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
