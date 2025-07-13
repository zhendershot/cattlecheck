import Link from 'next/link'
import { Navbar } from '@/components/Navbar'
import { Map as MapIcon, Star, Users, Camera } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Welcome to <span className="text-green-600">CattleCheck</span>! 🐄
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              The ultimate community for rating, reviewing, and discovering the most epic cattle guards across the land! 
              Join fellow enthusiasts in documenting these unsung heroes of rural infrastructure.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                href="/map" 
                className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-green-600 hover:to-blue-600 transition-all transform hover:scale-105 shadow-lg"
              >
                🗺️ Explore the Map
              </Link>
              <Link 
                href="/cattle-guards" 
                className="border-2 border-green-500 text-green-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-500 hover:text-white transition-all"
              >
                ⭐ Browse All Guards
              </Link>
            </div>
          </div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 text-6xl animate-bounce">🐄</div>
        <div className="absolute top-40 right-20 text-4xl animate-pulse">⭐</div>
        <div className="absolute bottom-20 left-20 text-5xl animate-bounce delay-100">🛣️</div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-16">
            Why CattleCheck is Absolutely Moo-velous! 🎉
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 rounded-lg bg-gradient-to-br from-blue-50 to-purple-50 hover:shadow-lg transition-shadow">
              <MapIcon className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Interactive Mapping</h3>
              <p className="text-gray-600">
                Discover cattle guards near you and explore new territories! Every crossing is an adventure waiting to happen.
              </p>
            </div>
            
            <div className="text-center p-6 rounded-lg bg-gradient-to-br from-green-50 to-blue-50 hover:shadow-lg transition-shadow">
              <Star className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Epic Rating System</h3>
              <p className="text-gray-600">
                Rate smoothness, scenic views, upkeep, accessibility, and that special coolness factor that makes each guard unique!
              </p>
            </div>
            
            <div className="text-center p-6 rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 hover:shadow-lg transition-shadow">
              <Users className="w-12 h-12 text-purple-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Community Driven</h3>
              <p className="text-gray-600">
                Wikipedia-style editing and community management. Everyone can contribute to building the ultimate cattle guard database!
              </p>
            </div>
            
            <div className="text-center p-6 rounded-lg bg-gradient-to-br from-orange-50 to-red-50 hover:shadow-lg transition-shadow">
              <Camera className="w-12 h-12 text-orange-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Photo Sharing</h3>
              <p className="text-gray-600">
                Upload stunning photos of cattle guards and share the beauty of rural infrastructure with the world!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Join the Cattle Guard Revolution? 🚀
          </h2>
          <p className="text-xl mb-8">
            Whether you&apos;re a seasoned cattle guard connoisseur or just discovering the joy of rural infrastructure, 
            there&apos;s a place for you in our community!
          </p>
          <Link 
            href="/map" 
            className="inline-block bg-white text-green-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-50 transition-all transform hover:scale-105 shadow-lg"
          >
            🎯 Start Your Adventure Now!
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <h3 className="text-2xl font-bold mb-2">🐄 CattleCheck</h3>
            <p className="text-gray-400">
              Connecting cattle guard enthusiasts one crossing at a time
            </p>
          </div>
          
          <div className="border-t border-gray-800 pt-8">
            <p className="text-gray-400">
              © 2024 CattleCheck. Made with ❤️ for the cattle guard community. 
              No cattle were harmed in the making of this app.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
