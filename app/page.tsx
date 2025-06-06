// "use client"

// import { useState, useEffect } from "react"
// import { LoginForm } from "@/components/login-form"
// import { SignupForm } from "@/components/signup-form"
// import { useRouter } from "next/navigation"
// import { MessageCircle, Shield, Smartphone } from "lucide-react"

// export default function Home() {
//   const [user, setUser] = useState<string | null>(null)
//   const [currentView, setCurrentView] = useState<"login" | "signup">("login")
//   const router = useRouter()

//   useEffect(() => {
//     const savedUser = localStorage.getItem("chatAppUser")
//     if (savedUser) {
//       setUser(savedUser)
//       router.push("/chat")
//     }
//   }, [router])

//   const handleLogin = (username: string) => {
//     localStorage.setItem("chatAppUser", username)
//     router.push("/chat")
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <style jsx>{`
//         .left-bg {
//           background: linear-gradient(135deg, #128C7E 0%, #25D366 100%);
//           position: relative;
//           overflow: hidden;
//         }
//         .blur-circle {
//           position: absolute;
//           border-radius: 9999px;
//           filter: blur(24px);
//           opacity: 0.5;
//           z-index: 0;
//         }
//         .crown {
//           position: absolute;
//           top: 18px;
//           left: 18px;
//           z-index: 2;
//           background: rgba(255,255,255,0.7);
//           border-radius: 9999px;
//           padding: 6px;
//           box-shadow: 0 2px 8px 0 rgba(0,0,0,0.08);
//         }
//       `}</style>
//       <div className="w-full max-w-4xl flex rounded-3xl overflow-hidden shadow-2xl">
//         {/* Left Side */}
//         <div className="relative w-1/2 min-h-[540px] left-bg flex flex-col justify-center items-center">
//           {/* Blurred Circles */}
//           <span className="blur-circle" style={{ width: 180, height: 180, top: 40, left: 30, background: "#075E54" }} />
//           <span
//             className="blur-circle"
//             style={{ width: 120, height: 120, bottom: 60, left: 60, background: "#128C7E" }}
//           />
//           <span
//             className="blur-circle"
//             style={{ width: 100, height: 100, top: 200, right: 40, background: "#34B7F1" }}
//           />
//           {/* Crown Icon */}
//           <span className="crown">
//             <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
//               <circle cx="12" cy="12" r="12" fill="#fff" />
//               <path d="M6 16L7.5 8L12 13L16.5 8L18 16H6Z" fill="#25D366" />
//               <circle cx="7.5" cy="7.5" r="1.5" fill="#128C7E" />
//               <circle cx="16.5" cy="7.5" r="1.5" fill="#128C7E" />
//               <circle cx="12" cy="5" r="1.5" fill="#128C7E" />
//             </svg>
//           </span>
//           {/* Welcome Text */}
//           <div className="relative z-10 px-8 text-center">
//             <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-4 drop-shadow">
//               Welcome to WhatsApp Clone
//             </h1>
//             <p className="text-white/90 text-base md:text-lg mb-6">
//               Chat instantly with friends and AI.
//               <br />
//               Enjoy a modern, secure, and fun chat experience.
//             </p>

//             {/* Feature Icons */}
//             <div className="flex justify-center gap-8 mt-8">
//               <div className="flex flex-col items-center">
//                 <div className="bg-white/20 p-3 rounded-full mb-2">
//                   <MessageCircle className="h-6 w-6 text-white" />
//                 </div>
//                 <span className="text-white text-sm">Messaging</span>
//               </div>
//               <div className="flex flex-col items-center">
//                 <div className="bg-white/20 p-3 rounded-full mb-2">
//                   <Smartphone className="h-6 w-6 text-white" />
//                 </div>
//                 <span className="text-white text-sm">Mobile Ready</span>
//               </div>
//               <div className="flex flex-col items-center">
//                 <div className="bg-white/20 p-3 rounded-full mb-2">
//                   <Shield className="h-6 w-6 text-white" />
//                 </div>
//                 <span className="text-white text-sm">Secure</span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Right Side */}
//         <div className="w-1/2 bg-white flex flex-col justify-center px-10 py-12 relative overflow-hidden">
//           {/* Decorative Dots */}
//           <span className="absolute w-3 h-3 bg-green-300 rounded-full left-2 top-8"></span>
//           <span className="absolute w-2 h-2 bg-green-200 rounded-full right-8 top-4"></span>
//           <span className="absolute w-2 h-2 bg-green-200 rounded-full left-10 bottom-10"></span>
//           <span className="absolute w-2 h-2 bg-green-200 rounded-full right-8 bottom-8"></span>
//           <span className="absolute w-2 h-2 bg-green-400 rounded-full left-1/2 top-1/4"></span>
//           {/* Tabs */}
//           <div className="mb-8 text-center flex flex-col items-center">
//             <div className="flex gap-8 mb-2">
//               <button
//                 className={`text-lg font-semibold pb-1 transition-all ${
//                   currentView === "login"
//                     ? "text-green-600 border-b-2 border-green-500"
//                     : "text-gray-400 border-b-2 border-transparent"
//                 }`}
//                 onClick={() => setCurrentView("login")}
//               >
//                 Log in
//               </button>
//               <button
//                 className={`text-lg font-semibold pb-1 transition-all ${
//                   currentView === "signup"
//                     ? "text-green-600 border-b-2 border-green-500"
//                     : "text-gray-400 border-b-2 border-transparent"
//                 }`}
//                 onClick={() => setCurrentView("signup")}
//               >
//                 Sign Up
//               </button>
//             </div>
//           </div>
//           {/* Form */}
//           <div>
//             {currentView === "login" ? (
//               <LoginForm
//                 onLogin={handleLogin}
//               />
//             ) : (
//               <SignupForm
//                 onSignup={handleLogin}
//               />
//             )}
//           </div>
//           {/* Footer */}
//           <div className="text-center text-sm text-gray-400 mt-8">
//             {currentView === "login" ? (
//               <>
//                 Don't have any account?{" "}
//                 <button
//                   className="text-green-600 font-semibold hover:underline"
//                   onClick={() => setCurrentView("signup")}
//                 >
//                   Sign Up
//                 </button>
//               </>
//             ) : (
//               <>
//                 Already have an account?{" "}
//                 <button
//                   className="text-green-600 font-semibold hover:underline"
//                   onClick={() => setCurrentView("login")}
//                 >
//                   Log in
//                 </button>
//               </>
//             )}
//           </div>

//           {/* Terms */}
//           <p className="text-xs text-gray-400 text-center mt-6">
//             By continuing, you agree to our Terms of Service and Privacy Policy
//           </p>
//         </div>
//       </div>
//     </div>
//   )
// }







"use client"

import { useState, useEffect } from "react"
import { LoginForm } from "@/components/login-form"
import { SignupForm } from "@/components/signup-form"
import { useRouter } from "next/navigation"
import { MessageCircle, Shield, Smartphone } from "lucide-react"

export default function Home() {
  const [user, setUser] = useState<string | null>(null)
  const [currentView, setCurrentView] = useState<"login" | "signup">("login")
  const router = useRouter()

  useEffect(() => {
    const savedUser = localStorage.getItem("chatAppUser")
    if (savedUser) {
      setUser(savedUser)
      router.push("/chat")
    }
  }, [router])

  const handleLogin = (username: string) => {
    localStorage.setItem("chatAppUser", username)
    router.push("/chat")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-4xl flex rounded-3xl overflow-hidden shadow-2xl">
        {/* Left Side */}
        <div className="relative w-1/2 min-h-[540px] bg-gradient-to-br from-green-600 to-green-500 flex flex-col justify-center items-center">
          {/* Blurred Circles */}
          <div className="absolute w-45 h-45 bg-green-700/30 rounded-full blur-2xl top-10 left-8" />
          <div className="absolute w-30 h-30 bg-green-800/30 rounded-full blur-2xl bottom-15 left-15" />
          <div className="absolute w-25 h-25 bg-blue-400/30 rounded-full blur-2xl top-50 right-10" />

          {/* Crown Icon */}
          <div className="absolute top-5 left-5 bg-white/20 p-2 rounded-full">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="12" fill="#fff" />
              <path d="M6 16L7.5 8L12 13L16.5 8L18 16H6Z" fill="#25D366" />
              <circle cx="7.5" cy="7.5" r="1.5" fill="#128C7E" />
              <circle cx="16.5" cy="7.5" r="1.5" fill="#128C7E" />
              <circle cx="12" cy="5" r="1.5" fill="#128C7E" />
            </svg>
          </div>

          {/* Welcome Text */}
          <div className="relative z-10 px-8 text-center">
            <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-4 drop-shadow">
              Welcome to WhatsApp Clone
            </h1>
            <p className="text-white/90 text-base md:text-lg mb-6">
              Chat instantly with friends and AI.
              <br />
              Enjoy a modern, secure, and fun chat experience.
            </p>

            {/* Feature Icons */}
            <div className="flex justify-center gap-8 mt-8">
              <div className="flex flex-col items-center">
                <div className="bg-white/20 p-3 rounded-full mb-2">
                  <MessageCircle className="h-6 w-6 text-white" />
                </div>
                <span className="text-white text-sm">Messaging</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-white/20 p-3 rounded-full mb-2">
                  <Smartphone className="h-6 w-6 text-white" />
                </div>
                <span className="text-white text-sm">Mobile Ready</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-white/20 p-3 rounded-full mb-2">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <span className="text-white text-sm">Secure</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="w-1/2 bg-white flex flex-col justify-center px-10 py-12 relative overflow-hidden">
          {/* Decorative Dots */}
          <span className="absolute w-3 h-3 bg-green-300 rounded-full left-2 top-8"></span>
          <span className="absolute w-2 h-2 bg-green-200 rounded-full right-8 top-4"></span>
          <span className="absolute w-2 h-2 bg-green-200 rounded-full left-10 bottom-10"></span>
          <span className="absolute w-2 h-2 bg-green-200 rounded-full right-8 bottom-8"></span>
          <span className="absolute w-2 h-2 bg-green-400 rounded-full left-1/2 top-1/4"></span>

          {/* Tabs */}
          <div className="mb-8 text-center flex flex-col items-center">
            <div className="flex gap-8 mb-2">
              <button
                className={`text-lg font-semibold pb-1 transition-all ${
                  currentView === "login"
                    ? "text-green-600 border-b-2 border-green-500"
                    : "text-gray-400 border-b-2 border-transparent"
                }`}
                onClick={() => setCurrentView("login")}
              >
                Log in
              </button>
              <button
                className={`text-lg font-semibold pb-1 transition-all ${
                  currentView === "signup"
                    ? "text-green-600 border-b-2 border-green-500"
                    : "text-gray-400 border-b-2 border-transparent"
                }`}
                onClick={() => setCurrentView("signup")}
              >
                Sign Up
              </button>
            </div>
          </div>

          {/* Form */}
          <div>
            {currentView === "login" ? <LoginForm onLogin={handleLogin} /> : <SignupForm onSignup={handleLogin} />}
          </div>

          {/* Footer */}
          <div className="text-center text-sm text-gray-400 mt-8">
            {currentView === "login" ? (
              <>
                Don't have any account?{" "}
                <button
                  className="text-green-600 font-semibold hover:underline"
                  onClick={() => setCurrentView("signup")}
                >
                  Sign Up
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  className="text-green-600 font-semibold hover:underline"
                  onClick={() => setCurrentView("login")}
                >
                  Log in
                </button>
              </>
            )}
          </div>

          {/* Terms */}
          <p className="text-xs text-gray-400 text-center mt-6">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  )
}
