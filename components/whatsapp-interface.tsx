// "use client"

// import { useState, useEffect, useRef, type Key, type ReactNode } from "react"
// import { useRouter } from "next/navigation"
// import Link from "next/link"
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
//   DialogFooter,
// } from "@/components/ui/dialog"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Avatar, AvatarFallback } from "@/components/ui/avatar"
// import { Card, CardContent } from "@/components/ui/card"
// import { Search, MoreVertical, MessageCircle, Users, Settings, Plus, LogOut, PhoneOff, VideoOff } from "lucide-react"
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
// import axiosInstance from "@/axios/axios"

// interface Chat {
//   createdAt: ReactNode
//   _id: Key | null | undefined
//   username: any
//   id: string
//   name: string
//   lastMessage: string
//   timestamp: string
//   avatar: string
//   unreadCount: number
//   isOnline: boolean
// }

// export default function DashboardPage() {
//   const [user, setUser] = useState<string | null>(null)
//   const [chats, setChats] = useState<Chat[]>([])
//   const [searchQuery, setSearchQuery] = useState("")
//   const [chatUser, setChatUser] = useState<any>(null)
//   const [callState, setCallState] = useState({
//     isInCall: false,
//     isInitiating: false,
//     isReceiving: false,
//     callType: null as "audio" | "video" | null,
//     remoteUserId: null as string | null,
//   })

//   const localVideoRef = useRef<HTMLVideoElement>(null)
//   const remoteVideoRef = useRef<HTMLVideoElement>(null)
//   const router = useRouter()

//   useEffect(() => {
//     const savedUser = localStorage.getItem("chatAppUser")
//     if (!savedUser) {
//       router.push("/login")
//       return
//     }
//     setUser(savedUser)
//     fetchChats()
//   }, [router])

//   const fetchChats = async () => {
//     try {
//       const response = await axiosInstance.get("get-all-user")
//       setChats(response.data)
//     } catch (error) {
//       console.error("Failed to fetch chats:", error)
//       setChats([])
//     }
//   }

//   const handleLogout = () => {
//     localStorage.removeItem("chatAppUser")
//     router.push("/")
//   }

//   // Filter out the current logged-in user and apply search filter
//   const filteredChats = chats?.filter((chat) => {
//     // Filter out the current user from the chat list
//     const isNotCurrentUser = chat?.username?.toLowerCase() !== user?.toLowerCase()
//     // Apply search filter
//     const matchesSearch = chat?.username?.toLowerCase().includes(searchQuery.toLowerCase())

//     return isNotCurrentUser && matchesSearch
//   })

//   const onAcceptCall = () => {
//     setCallState((prev) => ({
//       ...prev,
//       isReceiving: false,
//       isInCall: true,
//     }))
//   }

//   const onRejectCall = () => {
//     setCallState({
//       isInCall: false,
//       isInitiating: false,
//       isReceiving: false,
//       callType: null,
//       remoteUserId: null,
//     })
//   }

//   const onEndCall = () => {
//     setCallState({
//       isInCall: false,
//       isInitiating: false,
//       isReceiving: false,
//       callType: null,
//       remoteUserId: null,
//     })
//   }

//   return (
//     <div className="min-h-screen bg-gray-100">
//       {/* Video Call Modal */}
//       <Dialog open={callState.isReceiving || callState.isInCall || callState.isInitiating}>
//         <DialogContent className="sm:max-w-[425px]">
//           <DialogHeader>
//             <DialogTitle>
//               {callState.isReceiving
//                 ? `Incoming ${callState.callType === "video" ? "Video" : "Audio"} Call`
//                 : callState.isInitiating
//                   ? `Calling ${chatUser?.username}...`
//                   : `In ${callState.callType === "video" ? "Video" : "Audio"} Call with ${chatUser?.username}`}
//             </DialogTitle>
//             <DialogDescription>
//               {callState.isReceiving
//                 ? `Accept or Reject the call from ${chatUser?.username}`
//                 : callState.isInitiating
//                   ? `Waiting for ${chatUser?.username} to answer...`
//                   : `Connected to ${chatUser?.username}`}
//             </DialogDescription>
//           </DialogHeader>

//           {callState.callType === "video" && (
//             <div className="relative w-full aspect-video">
//               <video ref={remoteVideoRef} autoPlay className="absolute top-0 left-0 w-full h-full object-cover" />
//               <video
//                 ref={localVideoRef}
//                 autoPlay
//                 muted
//                 className="absolute bottom-2 right-2 w-1/4 h-1/4 object-cover border border-white rounded-md"
//               />
//             </div>
//           )}

//           <DialogFooter>
//             {callState.isReceiving ? (
//               <>
//                 <Button variant="destructive" onClick={onRejectCall}>
//                   Reject
//                 </Button>
//                 <Button onClick={onAcceptCall}>Accept</Button>
//               </>
//             ) : (
//               <Button variant="destructive" onClick={onEndCall}>
//                 {callState.callType === "video" ? (
//                   <VideoOff className="w-4 h-4 mr-2" />
//                 ) : (
//                   <PhoneOff className="w-4 h-4 mr-2" />
//                 )}
//                 {callState.isInCall ? "End Call" : "Cancel"}
//               </Button>
//             )}
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Header */}
//       <header className="bg-green-600 text-white p-4">
//         <div className="max-w-7xl mx-auto flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <Link href="/profile">
//               <Avatar className="w-10 h-10 cursor-pointer">
//                 <AvatarFallback className="bg-green-700 text-white">{user?.charAt(0).toUpperCase()}</AvatarFallback>
//               </Avatar>
//             </Link>
//             <div>
//               <h1 className="text-xl font-medium">Chats</h1>
//               <p className="text-green-100 text-sm">Welcome back, {user}</p>
//             </div>
//           </div>
//           <div className="flex items-center gap-2">
//             <Button variant="ghost" size="sm" className="text-white hover:bg-green-700">
//               <Users className="w-5 h-5" />
//             </Button>
//             <Button variant="ghost" size="sm" className="text-white hover:bg-green-700">
//               <Plus className="w-5 h-5" />
//             </Button>
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button variant="ghost" size="sm" className="text-white hover:bg-green-700">
//                   <MoreVertical className="w-5 h-5" />
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent align="end">
//                 <DropdownMenuItem asChild>
//                   <Link href="/profile">
//                     <Settings className="w-4 h-4 mr-2" />
//                     Profile
//                   </Link>
//                 </DropdownMenuItem>
//                 <DropdownMenuItem asChild>
//                   <Link href="/settings">
//                     <Settings className="w-4 h-4 mr-2" />
//                     Settings
//                   </Link>
//                 </DropdownMenuItem>
//                 <DropdownMenuItem onClick={handleLogout}>
//                   <LogOut className="w-4 h-4 mr-2" />
//                   Logout
//                 </DropdownMenuItem>
//               </DropdownMenuContent>
//             </DropdownMenu>
//           </div>
//         </div>
//       </header>

//       {/* Body */}
//       <div className="max-w-7xl mx-auto p-4">
//         {/* Search */}
//         <div className="mb-6">
//           <div className="relative max-w-md">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//             <Input
//               placeholder="Search chats..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="pl-10"
//             />
//           </div>
//         </div>

//         {/* Chat List */}
//         <div className="grid gap-2">
//           {filteredChats?.map((chat) => (
//             <Link key={chat._id} href={`/chat/${chat._id}`}>
//               <Card className="hover:bg-gray-50 transition-colors cursor-pointer">
//                 <CardContent className="p-4">
//                   <div className="flex items-center gap-3">
//                     <div className="relative">
//                       <Avatar className="w-12 h-12">
//                         <AvatarFallback className="text-lg">
//                           {chat.username
//                             ?.split(" ")
//                             .map((word: any) => word[0])
//                             .slice(0, 2)
//                             .join("")
//                             .toUpperCase()}
//                         </AvatarFallback>
//                       </Avatar>
//                       {chat?.isOnline && (
//                         <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
//                       )}
//                     </div>

//                     <div className="flex-1 min-w-0">
//                       <div className="flex items-center justify-between mb-1">
//                         <h3 className="font-medium text-gray-900 truncate">{chat.username}</h3>
//                         <span className="text-xs text-gray-500">
//                           {new Date(chat.createdAt as string).toLocaleString()}
//                         </span>
//                       </div>
//                       <div className="flex items-center justify-between">
//                         <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
//                         {chat.unreadCount > 0 && (
//                           <span className="bg-green-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
//                             {chat.unreadCount}
//                           </span>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             </Link>
//           ))}
//         </div>

//         {filteredChats?.length === 0 && (
//           <div className="text-center py-12">
//             <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
//             <h3 className="text-lg font-medium text-gray-900 mb-2">
//               {searchQuery ? "No matching chats found" : "No chats found"}
//             </h3>
//             <p className="text-gray-500">
//               {searchQuery ? "Try adjusting your search terms" : "Start a new conversation to get started"}
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }




"use client"

import { useState, useEffect, useRef, type Key, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  MoreVertical,
  MessageCircle,
  Users,
  Settings,
  Plus,
  LogOut,
  PhoneOff,
  VideoOff,
  Phone,
  Video,
  Bell,
  Archive,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import axiosInstance from "@/axios/axios"

interface Chat {
  createdAt: ReactNode
  _id: Key | null | undefined
  username: any
  id: string
  name: string
  lastMessage: string
  timestamp: string
  avatar: string
  unreadCount: number
  isOnline: boolean
}

export default function DashboardPage() {
  const [user, setUser] = useState<string | null>(null)
  const [chats, setChats] = useState<Chat[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [chatUser, setChatUser] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<"chats" | "groups" | "calls">("chats")
  const [callState, setCallState] = useState({
    isInCall: false,
    isInitiating: false,
    isReceiving: false,
    callType: null as "audio" | "video" | null,
    remoteUserId: null as string | null,
  })

  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)
  const router = useRouter()

  useEffect(() => {
    const savedUser = localStorage.getItem("chatAppUser")
    if (!savedUser) {
      router.push("/login")
      return
    }
    setUser(savedUser)
    fetchChats()
  }, [router])

  const fetchChats = async () => {
    try {
      const response = await axiosInstance.get("get-all-user")
      setChats(response.data)
    } catch (error) {
      console.error("Failed to fetch chats:", error)
      setChats([])
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("chatAppUser")
    router.push("/")
  }

  // Filter out the current logged-in user and apply search filter
  const filteredChats = chats?.filter((chat) => {
    // Filter out the current user from the chat list
    const isNotCurrentUser = chat?.username?.toLowerCase() !== user?.toLowerCase()
    // Apply search filter
    const matchesSearch = chat?.username?.toLowerCase().includes(searchQuery.toLowerCase())

    return isNotCurrentUser && matchesSearch
  })

  const onAcceptCall = () => {
    setCallState((prev) => ({
      ...prev,
      isReceiving: false,
      isInCall: true,
    }))
  }

  const onRejectCall = () => {
    setCallState({
      isInCall: false,
      isInitiating: false,
      isReceiving: false,
      callType: null,
      remoteUserId: null,
    })
  }

  const onEndCall = () => {
    setCallState({
      isInCall: false,
      isInitiating: false,
      isReceiving: false,
      callType: null,
      remoteUserId: null,
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Video Call Modal */}
      <Dialog open={callState.isReceiving || callState.isInCall || callState.isInitiating}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {callState.callType === "video" ? (
                <Video className="h-5 w-5 text-green-600" />
              ) : (
                <Phone className="h-5 w-5 text-green-600" />
              )}
              {callState.isReceiving
                ? `Incoming ${callState.callType === "video" ? "Video" : "Audio"} Call`
                : callState.isInitiating
                  ? `Calling ${chatUser?.username}...`
                  : `In ${callState.callType === "video" ? "Video" : "Audio"} Call with ${chatUser?.username}`}
            </DialogTitle>
            <DialogDescription>
              {callState.isReceiving
                ? `Accept or Reject the call from ${chatUser?.username}`
                : callState.isInitiating
                  ? `Waiting for ${chatUser?.username} to answer...`
                  : `Connected to ${chatUser?.username}`}
            </DialogDescription>
          </DialogHeader>

          {callState.callType === "video" && (
            <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-gray-900">
              <video ref={remoteVideoRef} autoPlay className="absolute top-0 left-0 w-full h-full object-cover" />
              <video
                ref={localVideoRef}
                autoPlay
                muted
                className="absolute bottom-3 right-3 w-1/4 h-1/4 object-cover border-2 border-white rounded-lg shadow-lg"
              />
            </div>
          )}

          <DialogFooter className="gap-2">
            {callState.isReceiving ? (
              <>
                <Button variant="destructive" onClick={onRejectCall} className="flex-1">
                  <PhoneOff className="w-4 h-4 mr-2" />
                  Reject
                </Button>
                <Button onClick={onAcceptCall} className="flex-1 bg-green-600 hover:bg-green-700">
                  <Phone className="w-4 h-4 mr-2" />
                  Accept
                </Button>
              </>
            ) : (
              <Button variant="destructive" onClick={onEndCall} className="w-full">
                {callState.callType === "video" ? (
                  <VideoOff className="w-4 h-4 mr-2" />
                ) : (
                  <PhoneOff className="w-4 h-4 mr-2" />
                )}
                {callState.isInCall ? "End Call" : "Cancel"}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Header */}
      <header className="bg-gradient-to-r from-green-600 to-green-500 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/profile">
              <Avatar className="w-10 h-10 cursor-pointer border-2 border-white/30 hover:border-white transition-all">
                <AvatarFallback className="bg-green-700 text-white font-medium">
                  {user?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Link>
            <div>
              <h1 className="text-xl font-semibold">WhatsApp Clone</h1>
              <p className="text-green-100 text-sm">Welcome back, {user}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-white hover:bg-green-700/50 rounded-full">
              <Bell className="w-5 h-5" />
              <span className="sr-only">Notifications</span>
            </Button>
            <Button variant="ghost" size="icon" className="text-white hover:bg-green-700/50 rounded-full">
              <Plus className="w-5 h-5" />
              <span className="sr-only">New Chat</span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white hover:bg-green-700/50 rounded-full">
                  <MoreVertical className="w-5 h-5" />
                  <span className="sr-only">More Options</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link href="/profile" className="flex items-center">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarFallback className="bg-green-100 text-green-700">
                        {user?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-medium">{user}</span>
                      <span className="text-xs text-gray-500">View your profile</span>
                    </div>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link href="/settings" className="flex items-center">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          <Tabs defaultValue="chats" value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
            <TabsList className="w-full justify-start h-12 bg-transparent border-b border-transparent">
              <TabsTrigger
                value="chats"
                className="flex items-center gap-2 data-[state=active]:text-green-600 data-[state=active]:border-b-2 data-[state=active]:border-green-600 rounded-none px-6"
              >
                <MessageCircle className="h-4 w-4" />
                Chats
              </TabsTrigger>
              <TabsTrigger
                value="groups"
                className="flex items-center gap-2 data-[state=active]:text-green-600 data-[state=active]:border-b-2 data-[state=active]:border-green-600 rounded-none px-6"
              >
                <Users className="h-4 w-4" />
                Groups
              </TabsTrigger>
              <TabsTrigger
                value="calls"
                className="flex items-center gap-2 data-[state=active]:text-green-600 data-[state=active]:border-b-2 data-[state=active]:border-green-600 rounded-none px-6"
              >
                <Phone className="h-4 w-4" />
                Calls
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-7xl mx-auto p-4">
        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md mx-auto md:mx-0">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white border-gray-200 focus-visible:ring-green-500 rounded-full"
            />
          </div>
        </div>

        {/* Quick Actions */}
        {activeTab === "chats" && (
          <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:text-green-600 flex-shrink-0"
            >
              <Archive className="w-4 h-4 mr-2" />
              Archived
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:text-green-600 flex-shrink-0"
            >
              <Bell className="w-4 h-4 mr-2" />
              Muted
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:text-green-600 flex-shrink-0"
            >
              <Users className="w-4 h-4 mr-2" />
              Groups
            </Button>
          </div>
        )}

        {/* Chat List */}
        <div className="grid gap-2 max-w-3xl mx-auto md:mx-0">
          {filteredChats?.map((chat) => (
            <Link key={chat._id} href={`/chat/${chat._id}`}>
              <Card className="hover:bg-gray-50 transition-colors cursor-pointer border-gray-100 hover:border-gray-200 hover:shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="w-12 h-12 border border-gray-100">
                        <AvatarFallback className="bg-gradient-to-br from-green-100 to-green-200 text-green-700 font-medium text-lg">
                          {chat.username
                            ?.split(" ")
                            .map((word: any) => word[0])
                            .slice(0, 2)
                            .join("")
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      {chat?.isOnline && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-medium text-gray-900 truncate">{chat.username}</h3>
                        <span className="text-xs text-gray-500 flex items-center">
                          {new Date(chat.createdAt as string).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600 truncate">{chat.lastMessage || "Start a conversation"}</p>
                        <div className="flex items-center gap-1">
                          {chat.unreadCount > 0 && (
                            <span className="bg-green-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                              {chat.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {filteredChats?.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100 max-w-md mx-auto mt-8">
            <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery ? "No matching chats found" : "No chats found"}
            </h3>
            <p className="text-gray-500 mb-6 max-w-xs mx-auto">
              {searchQuery ? "Try adjusting your search terms" : "Start a new conversation to get started"}
            </p>
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="w-4 h-4 mr-2" />
              Start New Chat
            </Button>
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6">
        <Button size="lg" className="h-14 w-14 rounded-full bg-green-600 hover:bg-green-700 shadow-lg">
          <MessageCircle className="h-6 w-6" />
          <span className="sr-only">New Chat</span>
        </Button>
      </div>
    </div>
  )
}
