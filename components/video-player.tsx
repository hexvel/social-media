"use client";

import {
  Fullscreen,
  PauseIcon,
  PlayIcon,
  SkipBackIcon,
  SkipForward,
  Volume2,
  VolumeX,
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
  const [muted, setMuted] = useState<boolean>(false);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [showVolumeControl, setShowVolumeControl] = useState<boolean>(false);

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
      setMuted(newVolume === 0);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      const newMuted = !muted;
      videoRef.current.muted = newMuted;
      setMuted(newMuted);
      setVolume(newMuted ? 0 : videoRef.current.volume);
    }
  };

  const handlePlaybackRateChange = (rate: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
      setPlaybackRate(rate);
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

  useEffect(() => {
    const handleDoubleClick = () => {
      toggleFullscreen();
    };

    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.addEventListener("dblclick", handleDoubleClick);
    }

    return () => {
      if (videoElement) {
        videoElement.removeEventListener("dblclick", handleDoubleClick);
      }
    };
  }, []);

  return (
    <div
      className={`group relative h-full w-full ${fullscreen ? "fullscreen" : ""}`}
      onMouseMove={() => setShowControls(true)}
    >
      <video
        ref={videoRef}
        className="mx-auto max-h-[80vh] rounded-lg shadow-lg"
        src={src}
        onClick={handleVideoClick}
      />

      {!fullscreen && !playing && !showControls && (
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              videoHandler("play");
            }}
            className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white"
          >
            <PlayIcon className="size-4" />
          </button>
        </div>
      )}

      {(showControls || playing) && (
        <div className="absolute bottom-0 w-full bg-black bg-opacity-70 p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="mb-2 flex items-center justify-between">
            <button
              onClick={revert}
              className="flex items-center justify-center rounded-full bg-primary p-2 text-white"
            >
              <SkipBackIcon className="size-4" />
            </button>
            {playing ? (
              <button
                onClick={() => videoHandler("pause")}
                className="flex items-center justify-center rounded-full bg-primary p-2 text-white"
              >
                <PauseIcon className="size-4" />
              </button>
            ) : (
              <button
                onClick={() => videoHandler("play")}
                className="flex items-center justify-center rounded-full bg-primary p-2 text-white"
              >
                <PlayIcon className="size-4" />
              </button>
            )}
            <button
              onClick={fastForward}
              className="flex items-center justify-center rounded-full bg-primary p-2 text-white"
            >
              <SkipForward className="size-4" />
            </button>
            <button
              onClick={toggleFullscreen}
              className="flex items-center justify-center rounded-full bg-primary p-2 text-white"
            >
              <Fullscreen className="size-4" />
            </button>
            <div
              className="group relative flex items-center"
              onMouseEnter={() => setShowVolumeControl(true)}
              onMouseLeave={() => setShowVolumeControl(false)}
            >
              <button
                onClick={toggleMute}
                className="flex items-center justify-center rounded-full bg-primary p-2 text-white"
              >
                {muted ? (
                  <VolumeX className="size-4" />
                ) : (
                  <Volume2 className="size-4" />
                )}
              </button>
              {showVolumeControl && (
                <div className="absolute bottom-[76px] left-1/2 mt-2 flex w-28 -translate-x-1/2 -rotate-90 transform justify-center rounded-lg bg-card p-2 group-hover:visible">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-full accent-primary"
                  />
                </div>
              )}
            </div>
            <button
              onClick={() =>
                handlePlaybackRateChange(playbackRate === 1 ? 1.5 : 1)
              }
              className="flex items-center justify-center rounded-full p-2 text-white"
            >
              {playbackRate}x
            </button>
          </div>

          <div className="mb-2 flex items-center justify-between">
            <p className="text-white">
              {Math.floor(currentTime / 60)}:
              {("0" + Math.floor(currentTime % 60)).slice(-2)}
            </p>
            <div
              onClick={handleProgressClick}
              className="relative mx-4 h-2 w-3/4 cursor-pointer rounded-full bg-gray-600"
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
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
