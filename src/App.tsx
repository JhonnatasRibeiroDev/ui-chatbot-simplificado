import { useState, useEffect } from "react"
import { ThemeProvider } from "@/contexts/ThemeContext"
import { ChatInterface } from "@/components/ChatInterface"
import { LoadingScreen } from "@/components/LoadingScreen"

function App() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <ThemeProvider>
      {isLoading ? <LoadingScreen /> : <ChatInterface />}
    </ThemeProvider>
  )
}

export default App
