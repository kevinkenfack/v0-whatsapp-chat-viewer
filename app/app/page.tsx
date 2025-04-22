"use client"

import { useState } from "react"
import Link from "next/link"
import { WhatsAppViewer } from "@/components/whatsapp-viewer"
import { Button } from "@/components/ui/button"
import { ChevronLeft, HelpCircle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function AppPage() {
  const [showHelp, setShowHelp] = useState(false)

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="flex items-center mr-4">
              <ChevronLeft className="h-5 w-5 mr-1" />
              <span className="text-sm font-medium hidden sm:inline">Retour</span>
            </Link>
            <h1 className="font-bold text-xl">WhatsApp Viewer</h1>
          </div>
          <Dialog open={showHelp} onOpenChange={setShowHelp}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <HelpCircle className="h-5 w-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Comment utiliser WhatsApp Viewer</DialogTitle>
                <DialogDescription>Suivez ces étapes pour visualiser vos conversations WhatsApp</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <h3 className="font-medium mb-1">1. Exportez votre conversation depuis WhatsApp</h3>
                  <ol className="list-decimal ml-5 text-sm text-gray-600">
                    <li>Ouvrez la conversation dans WhatsApp</li>
                    <li>Appuyez sur les trois points (menu) en haut à droite</li>
                    <li>Sélectionnez "Plus" puis "Exporter la discussion"</li>
                    <li>Choisissez "Inclure les médias" ou non</li>
                    <li>Sélectionnez une application pour partager le fichier .zip</li>
                    <li>Téléchargez le fichier .zip</li>
                  </ol>
                </div>
                <div>
                  <h3 className="font-medium mb-1">2. Importez le fichier dans l'application</h3>
                  <p className="text-sm text-gray-600">
                    Glissez-déposez le fichier .zip dans la zone prévue ou cliquez sur "Parcourir les fichiers" pour le
                    sélectionner.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium mb-1">3. Explorez votre conversation</h3>
                  <p className="text-sm text-gray-600">
                    Utilisez les outils de recherche et de filtrage pour naviguer dans votre conversation. Vous pouvez
                    également télécharger les médias.
                  </p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-6 md:py-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-center mb-2 text-emerald-600">
            Visualiseur de conversations WhatsApp
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Importez votre fichier .zip exporté depuis WhatsApp pour visualiser votre conversation
          </p>

          <WhatsAppViewer />
        </div>
      </main>

      <footer className="bg-white border-t py-4 mt-auto">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} WhatsApp Viewer. Cet outil n'est pas affilié à WhatsApp Inc.
        </div>
      </footer>
    </div>
  )
}
