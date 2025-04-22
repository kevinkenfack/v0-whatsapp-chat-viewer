import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronRight, MessageSquare, Shield, Smartphone, Upload, Zap } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <MessageSquare className="h-6 w-6 text-emerald-600" />
            <span className="font-bold text-xl">WhatsApp Viewer</span>
          </div>
          <Link href="/app" passHref>
            <Button>Essayer</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-emerald-50 to-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="md:w-1/2 space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                Visualisez vos conversations WhatsApp <span className="text-emerald-600">facilement</span>
              </h1>
              <p className="text-lg text-gray-600">
                Importez votre fichier .zip exporté depuis WhatsApp et visualisez vos conversations dans une interface
                moderne et intuitive, sans avoir à utiliser WhatsApp.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/app" passHref>
                  <Button size="lg" className="gap-2">
                    Commencer maintenant
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
                <a href="#how-it-works">
                  <Button variant="outline" size="lg">
                    Comment ça marche
                  </Button>
                </a>
              </div>
            </div>
            <div className="md:w-1/2 relative">
              <div className="bg-white p-6 rounded-xl shadow-xl border border-gray-100 max-w-md mx-auto">
                <div className="bg-emerald-600 text-white p-3 rounded-t-lg flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  <span className="font-medium">Conversation WhatsApp</span>
                </div>
                <div className="bg-[#e5ded8] p-4 h-64 overflow-hidden">
                  <div className="flex justify-start mb-3">
                    <div className="bg-white rounded-lg px-3 py-2 shadow rounded-tl-none max-w-[75%]">
                      <div className="text-sm font-medium text-emerald-600 mb-1">Alice</div>
                      <div>Bonjour ! Comment vas-tu aujourd'hui ?</div>
                      <div className="text-right text-xs text-gray-500 mt-1">10:30</div>
                    </div>
                  </div>
                  <div className="flex justify-end mb-3">
                    <div className="bg-[#dcf8c6] rounded-lg px-3 py-2 shadow rounded-tr-none max-w-[75%]">
                      <div>Salut ! Ça va bien, merci ! Et toi ?</div>
                      <div className="text-right text-xs text-gray-500 mt-1">10:32</div>
                    </div>
                  </div>
                  <div className="flex justify-start mb-3">
                    <div className="bg-white rounded-lg px-3 py-2 shadow rounded-tl-none max-w-[75%]">
                      <div className="text-sm font-medium text-emerald-600 mb-1">Alice</div>
                      <div>Très bien ! Tu as vu les photos que j'ai envoyées hier ?</div>
                      <div className="text-right text-xs text-gray-500 mt-1">10:35</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -z-10 -bottom-4 -right-4 h-64 w-64 bg-emerald-100 rounded-full opacity-50"></div>
              <div className="absolute -z-10 -top-4 -left-4 h-32 w-32 bg-emerald-200 rounded-full opacity-30"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white" id="features">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Fonctionnalités principales</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-emerald-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Upload className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Import facile</h3>
              <p className="text-gray-600">
                Importez simplement votre fichier .zip exporté depuis WhatsApp par glisser-déposer ou en cliquant sur le
                bouton.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-emerald-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Smartphone className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Interface moderne</h3>
              <p className="text-gray-600">
                Profitez d'une interface similaire à WhatsApp avec des bulles de chat et la prise en charge des médias.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-emerald-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Confidentialité</h3>
              <p className="text-gray-600">
                Toutes les données restent sur votre appareil. Aucune information n'est envoyée à nos serveurs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 bg-gray-50" id="how-it-works">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Comment ça marche</h2>
          <div className="max-w-3xl mx-auto">
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="bg-emerald-100 rounded-full w-8 h-8 flex items-center justify-center mt-1 flex-shrink-0">
                  <span className="font-bold text-emerald-700">1</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Exportez votre conversation WhatsApp</h3>
                  <p className="text-gray-600 mb-3">
                    Ouvrez WhatsApp, accédez à la conversation que vous souhaitez visualiser, appuyez sur les trois
                    points en haut à droite, puis sélectionnez "Plus" &gt; "Exporter la discussion".
                  </p>
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <ol className="list-decimal ml-5 text-sm text-gray-700">
                      <li>Ouvrez la conversation dans WhatsApp</li>
                      <li>Appuyez sur les trois points (menu) en haut à droite</li>
                      <li>Sélectionnez "Plus" puis "Exporter la discussion"</li>
                      <li>Choisissez "Inclure les médias" ou non</li>
                      <li>Sélectionnez une application pour partager le fichier .zip</li>
                      <li>Téléchargez le fichier .zip</li>
                    </ol>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-emerald-100 rounded-full w-8 h-8 flex items-center justify-center mt-1 flex-shrink-0">
                  <span className="font-bold text-emerald-700">2</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Importez le fichier dans l'application</h3>
                  <p className="text-gray-600">
                    Ouvrez notre application et importez le fichier .zip que vous avez exporté. Vous pouvez le faire par
                    glisser-déposer ou en cliquant sur le bouton pour sélectionner le fichier.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-emerald-100 rounded-full w-8 h-8 flex items-center justify-center mt-1 flex-shrink-0">
                  <span className="font-bold text-emerald-700">3</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Visualisez votre conversation</h3>
                  <p className="text-gray-600">
                    L'application analysera automatiquement le fichier et affichera votre conversation dans une
                    interface similaire à WhatsApp. Vous pourrez voir les messages, les images, les vidéos et les
                    fichiers audio.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-12 text-center">
              <Link href="/app" passHref>
                <Button size="lg" className="gap-2">
                  <Zap className="h-5 w-5" />
                  Essayer maintenant
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-auto">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <MessageSquare className="h-5 w-5 text-emerald-400" />
              <span className="font-bold">WhatsApp Viewer</span>
            </div>
            <div className="text-gray-400 text-sm">
              © {new Date().getFullYear()} WhatsApp Viewer. Cet outil n'est pas affilié à WhatsApp Inc.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
