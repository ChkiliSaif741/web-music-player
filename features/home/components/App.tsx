'use client';

import React, { useState, useRef, useEffect } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, Volume1, VolumeX, ListMusic, Plus, X, GripVertical, Music, Clock, Shuffle, Repeat } from "lucide-react";

const mockSongs = [
  { id: 1, title: "Quantum Echoes", artist: "Stellardrone", album: "Cosmic Waves", duration: 245, source: "#" },
  { id: 2, title: "Midnight City", artist: "M83", album: "Hurry Up, We're Dreaming", duration: 243, source: "#" },
  { id: 3, title: "Solar Sailer", artist: "Daft Punk", album: "TRON: Legacy", duration: 164, source: "#" },
  { id: 4, title: "Strobe", artist: "deadmau5", album: "For Lack of a Better Name", duration: 637, source: "#" },
  { id: 5, title: "Genesis", artist: "Justice", album: "Cross", duration: 234, source: "#" },
  { id: 6, title: "Aurora", artist: "Tycho", album: "Awake", duration: 340, source: "#" },
  { id: 7, title: "Cerulean", artist: "Madeon", album: "Adventure", duration: 231, source: "#" },
  { id: 8, title: "Shelter", artist: "Porter Robinson & Madeon", album: "Shelter", duration: 219, source: "#" },
  { id: 9, title: "Innerbloom", artist: "RÜFÜS DU SOL", album: "Bloom", duration: 578, source: "#" },
  { id: 10, title: "Hyperparadise", artist: "Hermitude", album: "Hyperparadise", duration: 213, source: "#" },
  { id: 11, title: "Tessellate", artist: "alt-J", album: "An Awesome Wave", duration: 182, source: "#" },
];

export default function App() {
  const [songs] = useState(mockSongs);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [queue, setQueue] = useState([mockSongs[2], mockSongs[4], mockSongs[6]]);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(75);
  const [currentTime, setCurrentTime] = useState(0);
  const dragItem = useRef(null);
  const dragOverItem = useRef(null);

  const currentSong = songs[currentSongIndex];
  const duration = currentSong.duration;

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prevTime) => {
          if (prevTime < duration) {
            const newTime = prevTime + 1;
            setProgress((newTime / duration) * 100);
            return newTime;
          } else {
            handleNext();
            return 0;
          }
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, duration]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const playSong = (index) => {
    setCurrentSongIndex(index);
    setCurrentTime(0);
    setProgress(0);
    setIsPlaying(true);
  };

  const handleNext = () => {
    if (queue.length > 0) {
      const nextSongInQueue = queue[0];
      const songIndexInPlaylist = songs.findIndex(s => s.id === nextSongInQueue.id);
      setQueue(prevQueue => prevQueue.slice(1));
      if (songIndexInPlaylist !== -1) {
        playSong(songIndexInPlaylist);
      }
    } else {
      const nextIndex = (currentSongIndex + 1) % songs.length;
      playSong(nextIndex);
    }
  };

  const handlePrev = () => {
    const prevIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    playSong(prevIndex);
  };

  const handleAddToQueue = (song) => {
    if (!queue.find(s => s.id === song.id)) {
        setQueue([...queue, song]);
    }
  };
  
  const handleRemoveFromQueue = (songId) => {
    setQueue(queue.filter(s => s.id !== songId));
  };

  const handleProgressClick = (e) => {
    const progressBar = e.currentTarget;
    const clickPosition = e.clientX - progressBar.getBoundingClientRect().left;
    const newProgress = (clickPosition / progressBar.offsetWidth) * 100;
    const newTime = (newProgress / 100) * duration;
    setProgress(newProgress);
    setCurrentTime(newTime);
  };
  
  const handleVolumeChange = (e) => {
    const volumeBar = e.currentTarget;
    const clickPosition = e.clientX - volumeBar.getBoundingClientRect().left;
    const newVolume = Math.max(0, Math.min(100, (clickPosition / volumeBar.offsetWidth) * 100));
    setVolume(newVolume);
  };

  const handleDragStart = (e, position) => {
    dragItem.current = position;
  };

  const handleDragEnter = (e, position) => {
    dragOverItem.current = position;
  };
  
  const handleDrop = () => {
    const newQueue = [...queue];
    const dragItemContent = newQueue[dragItem.current];
    newQueue.splice(dragItem.current, 1);
    newQueue.splice(dragOverItem.current, 0, dragItemContent);
    dragItem.current = null;
    dragOverItem.current = null;
    setQueue(newQueue);
  };

  const VolumeIcon = () => {
    if (volume === 0) return <VolumeX className="w-5 h-5 text-gray-400" />;
    if (volume < 50) return <Volume1 className="w-5 h-5 text-gray-400" />;
    return <Volume2 className="w-5 h-5 text-gray-400" />;
  };

  return (
    <div className="min-h-screen w-full max-w-[100vw] overflow-x-hidden bg-gray-950 text-white flex flex-col font-sans">
      <main className="flex-1 flex flex-col md:flex-row gap-6 p-4 md:p-6 lg:p-8 pb-32">
        <div className="flex-1 lg:flex-[2] min-w-0">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold tracking-tight">Playlist</h1>
            <div className="flex items-center gap-2">
                <button className="p-2 rounded-full hover:bg-white/10 transition-colors">
                    <Shuffle className="w-5 h-5 text-gray-300"/>
                </button>
                 <button className="p-2 rounded-full hover:bg-white/10 transition-colors">
                    <Repeat className="w-5 h-5 text-gray-300"/>
                </button>
            </div>
          </div>
          <div className="space-y-2 pr-2 overflow-y-auto h-[calc(100vh-180px)] md:h-[calc(100vh-160px)]">
            {songs.map((song, index) => (
              <div
                key={song.id}
                className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-all duration-300 group ${currentSong.id === song.id ? 'bg-cyan-500/10' : 'hover:bg-white/[0.05]'}`}
                onClick={() => playSong(index)}
              >
                <div className="relative w-12 h-12 shrink-0">
                   <div className={`w-12 h-12 rounded-md flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-800 ring-1 ring-white/10`}>
                       <Music className={`w-6 h-6 ${currentSong.id === song.id ? 'text-cyan-400' : 'text-gray-400'}`}/>
                   </div>
                   {currentSong.id === song.id && isPlaying && (
                       <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-md">
                           <div className="flex gap-0.5">
                               <span className="w-1 h-4 bg-cyan-400 rounded-full animate-[bounce_0.8s_ease-in-out_infinite]"/>
                               <span className="w-1 h-4 bg-cyan-400 rounded-full animate-[bounce_1s_ease-in-out_infinite]"/>
                               <span className="w-1 h-4 bg-cyan-400 rounded-full animate-[bounce_0.9s_ease-in-out_infinite]"/>
                           </div>
                       </div>
                   )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-medium truncate ${currentSong.id === song.id ? 'text-cyan-300' : 'text-gray-100'}`}>{song.title}</p>
                  <p className="text-sm text-gray-400 truncate">{song.artist}</p>
                </div>
                <p className="text-sm text-gray-400 hidden sm:block">{formatTime(song.duration)}</p>
                <button
                  onClick={(e) => { e.stopPropagation(); handleAddToQueue(song); }}
                  className="p-2 rounded-full opacity-0 group-hover:opacity-100 hover:bg-white/10 transition-opacity"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1 lg:flex-[1.5] min-w-0 bg-gray-900/40 rounded-2xl border border-white/[0.06] p-4 flex flex-col">
          <h2 className="text-xl font-semibold mb-4 shrink-0">Up Next</h2>
          <div className="space-y-2 overflow-y-auto flex-1">
            {queue.length > 0 ? queue.map((song, index) => (
              <div
                key={`${song.id}-${index}`}
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/[0.05] group"
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragEnter={(e) => handleDragEnter(e, index)}
                onDragEnd={handleDrop}
                onDragOver={(e) => e.preventDefault()}
              >
                <GripVertical className="w-5 h-5 text-gray-500 cursor-grab shrink-0"/>
                <div className="w-10 h-10 rounded-md flex items-center justify-center bg-gray-700 shrink-0">
                    <ListMusic className="w-5 h-5 text-gray-400"/>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-200 truncate">{song.title}</p>
                  <p className="text-sm text-gray-400 truncate">{song.artist}</p>
                </div>
                <button onClick={() => handleRemoveFromQueue(song.id)} className="p-2 rounded-full opacity-0 group-hover:opacity-100 hover:bg-white/10 transition-opacity">
                  <X className="w-5 h-5" />
                </button>
              </div>
            )) : (
                <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                    <ListMusic className="w-12 h-12 mb-4"/>
                    <p className="font-medium">Queue is empty</p>
                    <p className="text-sm">Add songs from the playlist.</p>
                </div>
            )}
          </div>
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 z-10">
        <div className="bg-gray-900/50 backdrop-blur-xl border-t border-white/[0.06] px-4 sm:px-6 py-3">
          <div className="w-full flex items-center gap-4">
            <div className="w-14 h-14 rounded-md bg-gradient-to-br from-cyan-800 to-violet-800 flex items-center justify-center ring-1 ring-white/10 shrink-0">
                <Music className="w-7 h-7 text-cyan-200"/>
            </div>
            <div className="hidden md:block min-w-0">
              <p className="font-bold truncate">{currentSong.title}</p>
              <p className="text-sm text-gray-400 truncate">{currentSong.artist}</p>
            </div>
            
            <div className="flex-1 flex items-center justify-center gap-2 md:gap-4">
              <button onClick={handlePrev} className="p-2 rounded-full hover:bg-white/10 transition-colors">
                <SkipBack className="w-5 h-5" />
              </button>
              <button onClick={handlePlayPause} className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-violet-500 text-white shadow-lg shadow-cyan-500/20 hover:from-cyan-400 hover:to-violet-400 active:scale-95 transition-all">
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              </button>
              <button onClick={handleNext} className="p-2 rounded-full hover:bg-white/10 transition-colors">
                <SkipForward className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 hidden lg:flex items-center gap-3">
                <span className="text-xs text-gray-400 w-10 text-right">{formatTime(currentTime)}</span>
                 <div onClick={handleProgressClick} className="w-full h-1.5 bg-white/10 rounded-full cursor-pointer group">
                    <div className="h-full bg-gradient-to-r from-cyan-400 to-violet-400 rounded-full relative" style={{ width: `${progress}%` }}>
                       <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                </div>
                <span className="text-xs text-gray-400 w-10">{formatTime(duration)}</span>
            </div>

            <div className="hidden md:flex items-center gap-2 w-32">
              <VolumeIcon />
              <div onClick={handleVolumeChange} className="w-full h-1.5 bg-white/10 rounded-full cursor-pointer group">
                  <div className="h-full bg-white rounded-full relative" style={{ width: `${volume}%` }}>
                     <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
              </div>
            </div>
          </div>
           <div className="lg:hidden flex items-center gap-2 mt-2">
                <span className="text-xs text-gray-400 w-10 text-right">{formatTime(currentTime)}</span>
                 <div onClick={handleProgressClick} className="w-full h-1.5 bg-white/10 rounded-full cursor-pointer group">
                    <div className="h-full bg-gradient-to-r from-cyan-400 to-violet-400 rounded-full" style={{ width: `${progress}%` }}></div>
                </div>
                <span className="text-xs text-gray-400 w-10">{formatTime(duration)}</span>
            </div>
        </div>
      </footer>
    </div>
  );
}