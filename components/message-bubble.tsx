"use client"

import type { WhatsAppMessage } from "./whatsapp-viewer"
import { useState, useRef, useEffect } from "react"
import { Play, Pause, Download, AlertCircle, Headphones } from "lucide-react"

interface MessageBubbleProps {
  message: WhatsAppMessage
  isCurrentUser: boolean
  previousSender: string
}

export function MessageBubble({ message, isCurrentUser, previousSender }: MessageBubbleProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null)
  const [audioDuration, setAudioDuration] = useState<number | null>(null)
  const [audioProgress, setAudioProgress] = useState<number>(0)
  const [audioError, setAudioError] = useState<boolean>(false)
  const progressRef = useRef<HTMLDivElement>(null)

  const showSender = message.sender !== previousSender

  // Fonction pour formater la durée en mm:ss
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  // Vérifier si le fichier est un .opus
  const isOpusFile = message.mediaFile?.toLowerCase().endsWith(".opus") || false

  // Gestion de l'audio
  useEffect(() => {
    if (message.mediaType === "audio" && message.mediaData && !audioElement) {
      const audio = new Audio(message.mediaData)

      audio.onloadedmetadata = () => {
        setAudioDuration(audio.duration)
      }

      audio.onended = () => {
        setIsPlaying(false)
        setAudioProgress(0)
      }

      audio.ontimeupdate = () => {
        setAudioProgress((audio.currentTime / audio.duration) * 100)
      }

      audio.onerror = (e) => {
        console.error("Erreur de lecture audio:", e)
        setAudioError(true)
      }

      setAudioElement(audio)
    }

    return () => {
      if (audioElement) {
        audioElement.pause()
        audioElement.src = ""
      }
    }
  }, [message.mediaData, message.mediaType, audioElement])

  const handleAudioToggle = () => {
    if (audioElement) {
      if (isPlaying) {
        audioElement.pause()
        setIsPlaying(false)
      } else {
        audioElement.play().catch((err) => {
          console.error("Erreur de lecture audio:", err)
          setAudioError(true)
        })
        setIsPlaying(true)
      }
    }
  }

  // Fonction pour télécharger le média
  const handleDownload = () => {
    if (message.mediaData) {
      const a = document.createElement("a")
      a.href = message.mediaData
      a.download = message.mediaFile || "media-file"
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    }
  }

  // Détection des liens dans le message
  const renderMessageContent = (content: string) => {
    // Regex pour détecter les URLs
    const urlRegex = /(https?:\/\/[^\s]+)/g

    // Diviser le contenu en segments (texte et liens)
    const segments = content.split(urlRegex)

    return segments.map((segment, index) => {
      // Si le segment correspond à une URL
      if (segment.match(urlRegex)) {
        return (
          <a key={index} href={segment} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
            {segment}
          </a>
        )
      }
      // Sinon, c'est du texte normal
      return <span key={index}>{segment}</span>
    })
  }

  // Nettoyer le contenu du message pour les messages avec médias
  const cleanContent = () => {
    if (!message.mediaFile) return message.content

    let content = message.content

    // Supprimer les références aux fichiers joints
    content = content
      .replace(new RegExp(`\\s*${message.mediaFile}\\s*`, "gi"), "")
      .replace(/$$fichier joint$$/g, "")
      .replace(/<fichier joint>/g, "")
      .replace(/fichier multimédia omis/g, "")
      .replace(/media omitted/g, "")
      .replace(/pièce jointe omise/g, "")
      .replace(/<Media omitted>/g, "")
      .trim()

    return content
  }

  const cleanedContent = cleanContent()

  return (
    <div className={`flex ${isCurrentUser ? "justify-end" : "justify-start"} mb-3`}>
      <div
        className={`max-w-[75%] rounded-lg px-3 py-2 shadow ${
          isCurrentUser ? "bg-[#dcf8c6] rounded-tr-none" : "bg-white rounded-tl-none"
        }`}
      >
        {showSender && !isCurrentUser && (
          <div className="text-sm font-medium text-emerald-600 mb-1">{message.sender}</div>
        )}

        {message.mediaType === "image" && message.mediaData && (
          <div className="mb-2 relative group">
            <img
              src={message.mediaData || "/placeholder.svg"}
              alt="Image"
              className="rounded-md max-w-full max-h-60 object-contain cursor-pointer"
              onClick={() => window.open(message.mediaData, "_blank")}
            />
            <button
              onClick={handleDownload}
              className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              title="Télécharger"
            >
              <Download className="h-4 w-4" />
            </button>
          </div>
        )}

        {message.mediaType === "video" && message.mediaData && (
          <div className="mb-2 relative group">
            <video src={message.mediaData} controls className="rounded-md max-w-full max-h-60" />
            <button
              onClick={handleDownload}
              className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              title="Télécharger"
            >
              <Download className="h-4 w-4" />
            </button>
          </div>
        )}

        {message.mediaType === "audio" && message.mediaData && (
          <div className="mb-2 flex items-center space-x-2 bg-gray-100 p-2 rounded-md">
            {isOpusFile && (
              <div className="w-full">
                <div className="flex items-center mb-1">
                  <Headphones className="h-4 w-4 text-amber-500 mr-1" />
                  <span className="text-xs text-amber-700">Message vocal</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600 truncate max-w-[180px]">{message.mediaFile}</span>
                  <button
                    onClick={handleDownload}
                    className="p-1.5 text-gray-500 hover:text-emerald-600 transition-colors"
                    title="Télécharger"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {!isOpusFile && !audioError && (
              <>
                <button
                  onClick={handleAudioToggle}
                  className="p-2 bg-emerald-100 rounded-full hover:bg-emerald-200 transition-colors"
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </button>

                <div className="flex-grow">
                  <div className="bg-gray-300 h-1.5 rounded-full w-full overflow-hidden" ref={progressRef}>
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${audioProgress}%` }}></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>{audioDuration ? formatTime(audioDuration * (audioProgress / 100)) : "0:00"}</span>
                    <span>{audioDuration ? formatTime(audioDuration) : "--:--"}</span>
                  </div>
                </div>

                <button
                  onClick={handleDownload}
                  className="p-1.5 text-gray-500 hover:text-emerald-600 transition-colors"
                  title="Télécharger"
                >
                  <Download className="h-4 w-4" />
                </button>
              </>
            )}

            {!isOpusFile && audioError && (
              <div className="w-full">
                <div className="flex items-center mb-1">
                  <AlertCircle className="h-4 w-4 text-red-500 mr-1" />
                  <span className="text-xs text-red-700">Impossible de lire ce fichier audio</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600 truncate max-w-[180px]">{message.mediaFile}</span>
                  <button
                    onClick={handleDownload}
                    className="p-1.5 text-gray-500 hover:text-emerald-600 transition-colors"
                    title="Télécharger"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {cleanedContent && (
          <div className="whitespace-pre-wrap break-words">{renderMessageContent(cleanedContent)}</div>
        )}

        <div className="text-right text-xs text-gray-500 mt-1 flex justify-end items-center space-x-1">
          <span>{message.time}</span>
          <span className="text-[10px] text-gray-400">•</span>
          <span className="text-[10px] text-gray-400">{message.date}</span>
        </div>
      </div>
    </div>
  )
}
