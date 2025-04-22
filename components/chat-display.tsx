"use client"

import { useState, useRef, useEffect } from "react"
import type { WhatsAppMessage } from "./whatsapp-viewer"
import { MessageBubble } from "./message-bubble"
import { Button } from "@/components/ui/button"
import { Search, ChevronDown, X, Download, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface ChatDisplayProps {
  messages: WhatsAppMessage[]
}

export function ChatDisplay({ messages }: ChatDisplayProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredMessages, setFilteredMessages] = useState<WhatsAppMessage[]>(messages)
  const [showSearch, setShowSearch] = useState(false)
  const [currentUser, setCurrentUser] = useState<string>("")
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [availableDates, setAvailableDates] = useState<string[]>([])
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Get unique senders
  const senders = Array.from(new Set(messages.map((msg) => msg.sender)))

  // Get unique dates
  useEffect(() => {
    const dates = Array.from(new Set(messages.map((msg) => msg.date)))
    setAvailableDates(dates.sort())
  }, [messages])

  useEffect(() => {
    // Guess the current user (usually the second most frequent sender)
    const senderCounts = messages.reduce(
      (acc, msg) => {
        acc[msg.sender] = (acc[msg.sender] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const sortedSenders = Object.entries(senderCounts).sort((a, b) => b[1] - a[1])

    // If there are at least 2 senders, assume the user is the second most frequent
    if (sortedSenders.length >= 2) {
      setCurrentUser(sortedSenders[1][0])
    } else if (sortedSenders.length === 1) {
      setCurrentUser(sortedSenders[0][0])
    }
  }, [messages])

  useEffect(() => {
    // Filter messages based on search term and selected date
    let filtered = messages

    if (searchTerm) {
      filtered = filtered.filter(
        (msg) =>
          msg.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
          msg.sender.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (selectedDate) {
      filtered = filtered.filter((msg) => msg.date === selectedDate)
    }

    setFilteredMessages(filtered)
  }, [searchTerm, selectedDate, messages])

  useEffect(() => {
    // Scroll to bottom on initial load
    if (chatContainerRef.current && !searchTerm && !selectedDate) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [searchTerm, selectedDate])

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }

  const handleSearchToggle = () => {
    setShowSearch(!showSearch)
    if (!showSearch) {
      setTimeout(() => {
        searchInputRef.current?.focus()
      }, 100)
    } else {
      setSearchTerm("")
    }
  }

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedDate(null)
  }

  // Fonction pour exporter la conversation
  const exportChat = () => {
    let content = "Conversation WhatsApp\n\n"

    filteredMessages.forEach((msg) => {
      content += `[${msg.date}, ${msg.time}] - ${msg.sender}: ${msg.content}\n`
    })

    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "conversation-whatsapp.txt"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="bg-white rounded-lg overflow-hidden border shadow-lg">
      {/* Chat header */}
      <div className="bg-emerald-600 text-white p-3 flex justify-between items-center">
        <h2 className="font-semibold">Conversation WhatsApp</h2>
        <div className="flex space-x-1">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white hover:bg-emerald-700 h-8 w-8">
                <Filter className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-0 max-h-64 overflow-y-auto">
              <div className="p-2 bg-emerald-50 border-b">
                <h3 className="font-medium text-sm">Filtrer par date</h3>
              </div>
              <div className="p-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`w-full justify-start text-sm mb-1 ${!selectedDate ? "bg-emerald-100" : ""}`}
                  onClick={() => setSelectedDate(null)}
                >
                  Toutes les dates
                </Button>
                {availableDates.map((date) => (
                  <Button
                    key={date}
                    variant="ghost"
                    size="sm"
                    className={`w-full justify-start text-sm mb-1 ${selectedDate === date ? "bg-emerald-100" : ""}`}
                    onClick={() => setSelectedDate(date)}
                  >
                    {date}
                  </Button>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleSearchToggle}
            className="text-white hover:bg-emerald-700 h-8 w-8"
          >
            <Search className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={exportChat}
            className="text-white hover:bg-emerald-700 h-8 w-8"
            title="Exporter la conversation"
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Search bar */}
      {showSearch && (
        <div className="p-2 bg-white">
          <div className="relative">
            <Input
              ref={searchInputRef}
              type="text"
              placeholder="Rechercher dans la conversation..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-8"
            />
            {searchTerm && (
              <button
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={() => setSearchTerm("")}
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          {(searchTerm || selectedDate) && (
            <div className="flex justify-between items-center mt-2 text-xs">
              <div>
                <span className="font-medium">{filteredMessages.length}</span> message
                {filteredMessages.length > 1 ? "s" : ""} trouvé
                {filteredMessages.length > 1 ? "s" : ""}
                {selectedDate && (
                  <span>
                    {" "}
                    pour le <span className="font-medium">{selectedDate}</span>
                  </span>
                )}
                {searchTerm && (
                  <span>
                    {" "}
                    contenant "<span className="font-medium">{searchTerm}</span>"
                  </span>
                )}
              </div>
              <Button variant="ghost" size="sm" onClick={clearFilters} className="h-6 text-xs">
                Effacer les filtres
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Chat messages */}
      <div
        ref={chatContainerRef}
        className="p-4 overflow-y-auto h-[60vh] md:h-[70vh]"
        style={{
          backgroundColor: "#E5DED8",
          backgroundImage: "radial-gradient(circle, rgba(0,0,0,0.05) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      >
        <div className="space-y-2">
          {filteredMessages.map((message, index) => (
            <MessageBubble
              key={index}
              message={message}
              isCurrentUser={message.sender === currentUser}
              previousSender={index > 0 ? filteredMessages[index - 1].sender : ""}
            />
          ))}
        </div>
      </div>

      {/* Scroll to bottom button */}
      <div className="p-2 bg-white flex justify-center">
        <Button variant="outline" size="sm" onClick={scrollToBottom} className="text-emerald-600 hover:bg-emerald-50">
          <ChevronDown className="h-4 w-4 mr-1" />
          Aller en bas
        </Button>
      </div>
    </div>
  )
}
