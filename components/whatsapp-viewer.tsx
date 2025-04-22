"use client"

import { useState } from "react"
import { FileUploader } from "./file-uploader"
import { ChatDisplay } from "./chat-display"
import JSZip from "jszip"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export interface WhatsAppMessage {
  date: string
  time: string
  sender: string
  content: string
  mediaFile?: string
  mediaType?: "image" | "video" | "audio"
  mediaData?: string
}

export function WhatsAppViewer() {
  const [messages, setMessages] = useState<WhatsAppMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [mediaFiles, setMediaFiles] = useState<Record<string, string>>({})
  const [chatInfo, setChatInfo] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [opusFilesCount, setOpusFilesCount] = useState(0)

  const handleFileLoaded = async (file: File) => {
    setIsLoading(true)
    setError(null)
    setOpusFilesCount(0)
    try {
      console.log("Chargement du fichier:", file.name, file.size)

      const zip = new JSZip()
      const contents = await zip.loadAsync(file)
      console.log("Fichier ZIP chargé, contenu:", Object.keys(contents.files))

      // Find the chat file with various possible names
      let chatFile = null
      let chatFileName = ""

      for (const filename in contents.files) {
        const lowerFileName = filename.toLowerCase()
        // Check for various possible chat file patterns
        if (
          lowerFileName.endsWith("_chat.txt") ||
          lowerFileName.includes("discussion") ||
          lowerFileName.includes("whatsapp") ||
          (lowerFileName.includes("chat") && lowerFileName.endsWith(".txt"))
        ) {
          chatFile = contents.files[filename]
          chatFileName = filename
          console.log("Fichier chat trouvé:", filename)
          break
        }
      }

      if (!chatFile) {
        // If no chat file found, try to find any .txt file
        for (const filename in contents.files) {
          if (filename.endsWith(".txt") && !contents.files[filename].dir) {
            chatFile = contents.files[filename]
            chatFileName = filename
            console.log("Fichier texte trouvé (fallback):", filename)
            break
          }
        }
      }

      if (!chatFile) {
        throw new Error("Aucun fichier de discussion trouvé dans l'archive")
      }

      // Extract chat content
      const chatContent = await chatFile.async("string")
      console.log("Contenu du chat extrait, longueur:", chatContent.length)

      // Set chat info
      setChatInfo(chatFileName.split("/").pop() || chatFileName)

      // Parse messages
      const parsedMessages = parseWhatsAppChat(chatContent)
      console.log("Messages analysés:", parsedMessages.length)

      if (parsedMessages.length === 0) {
        throw new Error("Aucun message n'a pu être extrait du fichier. Format non reconnu.")
      }

      // Extract media files
      const media: Record<string, string> = {}
      let opusCount = 0
      const supportedExtensions = [
        "jpg",
        "jpeg",
        "png",
        "gif",
        "mp4",
        "mp3",
        "ogg",
        "opus",
        "webp",
        "webm",
        "3gp",
        "m4a",
      ]

      // First, extract all media files
      for (const filename in contents.files) {
        const file = contents.files[filename]
        if (!file.dir) {
          const extension = filename.split(".").pop()?.toLowerCase()
          if (extension && supportedExtensions.includes(extension)) {
            try {
              const blob = await file.async("blob")

              // Get just the filename without path
              const baseFilename = filename.split("/").pop() || filename
              media[baseFilename] = URL.createObjectURL(blob)

              if (extension === "opus") {
                opusCount++
              }

              console.log("Média extrait:", baseFilename, extension)
            } catch (mediaError) {
              console.error("Erreur lors de l'extraction du média:", filename, mediaError)
            }
          }
        }
      }

      setOpusFilesCount(opusCount)
      console.log("Nombre de fichiers opus trouvés:", opusCount)
      console.log("Tous les médias extraits:", Object.keys(media))

      // Now, match media files with messages
      for (let i = 0; i < parsedMessages.length; i++) {
        const msg = parsedMessages[i]

        // Check for audio file patterns in the message content
        const opusMatch = msg.content.match(/([^/\s]+\.opus)(\s*$$fichier joint$$)?/i)
        const pttMatch = msg.content.match(/(PTT-[^/\s]+\.opus)(\s*$$fichier joint$$)?/i)
        const audioMatch = msg.content.match(/([^/\s]+\.(mp3|ogg|m4a))(\s*$$fichier joint$$)?/i)

        // Check for image file patterns
        const imageMatch = msg.content.match(/([^/\s]+\.(jpg|jpeg|png|gif|webp))(\s*$$fichier joint$$)?/i)

        // Check for video file patterns
        const videoMatch = msg.content.match(/([^/\s]+\.(mp4|webm|3gp))(\s*$$fichier joint$$)?/i)

        // Check for generic file attachment patterns
        const fileJointMatch =
          msg.content.includes("(fichier joint)") ||
          msg.content.includes("<fichier joint>") ||
          msg.content.includes("fichier multimédia") ||
          msg.content.includes("media omitted") ||
          msg.content.includes("pièce jointe") ||
          msg.content.includes("<Media omitted>")

        // First, try to match specific file patterns
        let mediaFile = null
        let mediaType = null

        if (opusMatch || pttMatch) {
          mediaFile = (opusMatch && opusMatch[1]) || (pttMatch && pttMatch[1])
          mediaType = "audio"
        } else if (audioMatch) {
          mediaFile = audioMatch[1]
          mediaType = "audio"
        } else if (imageMatch) {
          mediaFile = imageMatch[1]
          mediaType = "image"
        } else if (videoMatch) {
          mediaFile = videoMatch[1]
          mediaType = "video"
        }

        // If we found a specific file reference
        if (mediaFile) {
          console.log(`Message ${i} contient une référence à un fichier: ${mediaFile}`)

          // Try to find the exact file
          if (media[mediaFile]) {
            parsedMessages[i].mediaFile = mediaFile
            parsedMessages[i].mediaType = mediaType as "image" | "video" | "audio"
            parsedMessages[i].mediaData = media[mediaFile]
            console.log(`Fichier trouvé et associé: ${mediaFile}`)
            continue
          }

          // If exact file not found, try to find a file with similar name
          const similarFiles = Object.keys(media).filter(
            (name) =>
              name.toLowerCase().includes(mediaFile!.toLowerCase()) ||
              mediaFile!.toLowerCase().includes(name.toLowerCase()),
          )

          if (similarFiles.length > 0) {
            const bestMatch = similarFiles[0]
            parsedMessages[i].mediaFile = bestMatch
            parsedMessages[i].mediaType = mediaType as "image" | "video" | "audio"
            parsedMessages[i].mediaData = media[bestMatch]
            console.log(`Fichier similaire trouvé et associé: ${bestMatch} pour ${mediaFile}`)
            continue
          }
        }

        // If no specific file found but message indicates an attachment
        if (fileJointMatch) {
          console.log(`Message ${i} indique un fichier joint sans nom spécifique`)

          // Try to guess the file type from the message content
          let possibleType = null
          if (
            msg.content.toLowerCase().includes("audio") ||
            msg.content.toLowerCase().includes("son") ||
            msg.content.toLowerCase().includes("vocal")
          ) {
            possibleType = "audio"
          } else if (
            msg.content.toLowerCase().includes("image") ||
            msg.content.toLowerCase().includes("photo") ||
            msg.content.toLowerCase().includes("picture")
          ) {
            possibleType = "image"
          } else if (msg.content.toLowerCase().includes("video") || msg.content.toLowerCase().includes("vidéo")) {
            possibleType = "video"
          }

          // Look for unassigned media files of the guessed type
          const remainingFiles = Object.keys(media).filter((name) => {
            const ext = name.split(".").pop()?.toLowerCase()
            if (!possibleType) return true

            if (possibleType === "audio" && ["mp3", "ogg", "opus", "m4a"].includes(ext || "")) return true
            if (possibleType === "image" && ["jpg", "jpeg", "png", "gif", "webp"].includes(ext || "")) return true
            if (possibleType === "video" && ["mp4", "webm", "3gp"].includes(ext || "")) return true

            return false
          })

          if (remainingFiles.length > 0) {
            const fileToUse = remainingFiles[0]
            const extension = fileToUse.split(".").pop()?.toLowerCase() || ""

            let mediaType: "image" | "video" | "audio"
            if (["jpg", "jpeg", "png", "gif", "webp"].includes(extension)) {
              mediaType = "image"
            } else if (["mp4", "webm", "3gp"].includes(extension)) {
              mediaType = "video"
            } else {
              mediaType = "audio"
            }

            parsedMessages[i].mediaFile = fileToUse
            parsedMessages[i].mediaType = mediaType
            parsedMessages[i].mediaData = media[fileToUse]
            console.log(`Fichier associé par déduction: ${fileToUse}`)

            // Remove this file from media to avoid duplicate assignments
            delete media[fileToUse]
          }
        }
      }

      setMediaFiles(media)
      setMessages(parsedMessages)
      console.log("Traitement terminé avec succès")
    } catch (error) {
      console.error("Erreur lors du traitement du fichier:", error)
      setError(
        `Erreur lors du traitement du fichier: ${error instanceof Error ? error.message : "Erreur inconnue"}. Vérifiez que c'est un export WhatsApp valide.`,
      )
    } finally {
      setIsLoading(false)
    }
  }

  const parseWhatsAppChat = (chatContent: string): WhatsAppMessage[] => {
    console.log("Début de l'analyse du chat")
    const lines = chatContent.split("\n")
    console.log("Nombre de lignes:", lines.length)

    const messages: WhatsAppMessage[] = []
    let currentMessage: Partial<WhatsAppMessage> | null = null

    // Different regex patterns to handle various WhatsApp export formats
    const messageRegexPatterns = [
      // Format standard international: [31/01/2023, 14:30:45] - John Doe: Hello
      /^\[?(\d{1,2}[/.]\d{1,2}[/.]\d{2,4})[,\s]+(\d{1,2}:\d{1,2}(?::\d{1,2})?(?:\s*[APMapm]{2})?)\]?\s+-\s+([^:]+):\s+(.*)$/,

      // Format français: 31/01/2023, 14:30 - John Doe : Hello
      /^(\d{1,2}[/.]\d{1,2}[/.]\d{2,4})[,\s]+(\d{1,2}:\d{1,2}(?::\d{1,2})?(?:\s*[APMapm]{2})?)\s+-\s+([^:]+)\s?:\s+(.*)$/,

      // Format sans crochets: 31/01/2023 14:30:45 - John Doe: Hello
      /^(\d{1,2}[/.]\d{1,2}[/.]\d{2,4})\s+(\d{1,2}:\d{1,2}(?::\d{1,2})?(?:\s*[APMapm]{2})?)\s+-\s+([^:]+):\s+(.*)$/,

      // Format avec tirets: 31-01-2023, 14:30 - John Doe: Hello
      /^(\d{1,2}[-/.]\d{1,2}[-/.]\d{2,4})[,\s]+(\d{1,2}:\d{1,2}(?::\d{1,2})?(?:\s*[APMapm]{2})?)\s+-\s+([^:]+):\s+(.*)$/,

      // Format avec jour de la semaine: [lun. 31/01/2023, 14:30:45] - John Doe: Hello
      /^\[?(?:[a-zA-Z]+[.,]?\s+)?(\d{1,2}[/.]\d{1,2}[/.]\d{2,4})[,\s]+(\d{1,2}:\d{1,2}(?::\d{1,2})?(?:\s*[APMapm]{2})?)\]?\s+-\s+([^:]+):\s+(.*)$/,
    ]

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      if (!line.trim()) continue // Skip empty lines

      let matched = false

      // Try each regex pattern
      for (const regex of messageRegexPatterns) {
        const match = line.match(regex)
        if (match) {
          // If we have a current message, push it before starting a new one
          if (currentMessage && currentMessage.sender && currentMessage.content) {
            messages.push(currentMessage as WhatsAppMessage)
          }

          // Start a new message
          currentMessage = {
            date: match[1],
            time: match[2],
            sender: match[3].trim(),
            content: match[4],
          }

          matched = true
          break
        }
      }

      if (!matched && currentMessage) {
        // This line is a continuation of the current message
        currentMessage.content += "\n" + line
      }
    }

    // Don't forget to add the last message
    if (currentMessage && currentMessage.sender && currentMessage.content) {
      messages.push(currentMessage as WhatsAppMessage)
    }

    console.log("Analyse terminée, messages trouvés:", messages.length)
    return messages
  }

  return (
    <div className="space-y-6">
      <FileUploader onFileLoaded={handleFileLoaded} isLoading={isLoading} />

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {chatInfo && messages.length > 0 && (
        <div className="bg-white p-3 rounded-lg shadow-sm border border-emerald-100">
          <p className="text-sm text-emerald-700 font-medium">
            <span className="font-bold">Fichier chargé :</span> {chatInfo}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">{messages.length}</span> messages trouvés
            {Object.keys(mediaFiles).length > 0 && (
              <span>
                {" "}
                • <span className="font-medium">{Object.keys(mediaFiles).length}</span> fichiers média
              </span>
            )}
            {opusFilesCount > 0 && (
              <span>
                {" "}
                • <span className="font-medium">{opusFilesCount}</span> fichiers audio .opus
              </span>
            )}
          </p>
          {opusFilesCount > 0 && (
            <p className="text-xs text-amber-600 mt-1">
              <AlertCircle className="h-3 w-3 inline-block mr-1" />
              Les fichiers audio .opus ne peuvent pas être lus directement dans le navigateur, mais vous pouvez les
              télécharger.
            </p>
          )}
        </div>
      )}

      {messages.length > 0 && <ChatDisplay messages={messages} />}

      {isLoading && (
        <div className="text-center p-8">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-emerald-500 border-r-transparent"></div>
          <p className="mt-2 text-gray-600">Traitement du fichier en cours...</p>
        </div>
      )}

      {!isLoading && messages.length === 0 && !error && (
        <div className="text-center p-8 bg-white rounded-lg border">
          <p className="text-gray-600">
            Importez un fichier .zip exporté depuis WhatsApp pour visualiser votre conversation
          </p>
        </div>
      )}
    </div>
  )
}
