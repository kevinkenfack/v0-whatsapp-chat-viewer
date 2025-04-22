"use client"

import type React from "react"

import { Upload, X, FileText } from "lucide-react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"

interface FileUploaderProps {
  onFileLoaded: (file: File) => void
  isLoading: boolean
}

export function FileUploader({ onFileLoaded, isLoading }: FileUploaderProps) {
  const [dragActive, setDragActive] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      console.log("Fichier déposé:", file.name, file.type, file.size)

      if (file.name.endsWith(".zip")) {
        setSelectedFile(file)
        onFileLoaded(file)
      } else {
        alert("Veuillez sélectionner un fichier .zip (fichier déposé: " + file.type + ")")
      }
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()

    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      console.log("Fichier sélectionné:", file.name, file.type, file.size)

      if (file.name.endsWith(".zip")) {
        setSelectedFile(file)
        onFileLoaded(file)
      } else {
        alert("Veuillez sélectionner un fichier .zip (fichier sélectionné: " + file.type + ")")
      }
    }
  }

  const handleRemoveFile = () => {
    setSelectedFile(null)
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="w-full">
      {!selectedFile ? (
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center ${
            dragActive ? "border-emerald-500 bg-emerald-50" : "border-gray-300"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="bg-emerald-100 p-3 rounded-full">
              <Upload className="h-8 w-8 text-emerald-600" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Importez votre fichier WhatsApp</h3>
              <p className="text-sm text-gray-500 max-w-md mx-auto">
                Glissez-déposez votre fichier .zip exporté depuis WhatsApp ici, ou cliquez sur le bouton ci-dessous pour
                le sélectionner.
              </p>
              <Button onClick={handleButtonClick} className="mt-2">
                <FileText className="h-4 w-4 mr-2" />
                Parcourir les fichiers
              </Button>
              <input
                ref={fileInputRef}
                id="file-upload"
                name="file-upload"
                type="file"
                accept=".zip"
                className="sr-only"
                onChange={handleChange}
              />
            </div>
            <p className="text-xs text-gray-500">Seuls les fichiers .zip exportés depuis WhatsApp sont acceptés</p>
          </div>
        </div>
      ) : (
        <div className="border rounded-lg p-4 bg-white shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-emerald-100 rounded-md">
                <FileText className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="font-medium">{selectedFile.name}</p>
                <p className="text-sm text-gray-500">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
            <div className="flex space-x-2">
              {isLoading ? (
                <div className="animate-pulse px-4 py-2 rounded-md bg-emerald-100 text-emerald-700 flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-emerald-700"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Chargement...
                </div>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleRemoveFile}
                  className="text-gray-500 hover:text-red-500"
                >
                  <X className="h-5 w-5" />
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
