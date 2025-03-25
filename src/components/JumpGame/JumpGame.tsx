"use client"

import { useEffect, useState, useRef } from "react"

type GameObjectType = {
  x: number
  y: number
  width: number
  height: number
}

type CloudType = {
  x: number
  y: number
  width: number
  speed: number
}

type GameStateType = {
  dino: GameObjectType
  obstacles: GameObjectType[]
  clouds: CloudType[]
  ground: number
  score: number
  highScore: number
  speed: number
  gameOver: boolean
  jumping: boolean
  jumpHeight: number
  jumpSpeed: number
}

export default function DinoGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [gameState, setGameState] = useState<GameStateType>({
    dino: { x: 50, y: 0, width: 44, height: 47 },
    obstacles: [],
    clouds: [],
    ground: 0,
    score: 0,
    highScore: 0,
    speed: 5,
    gameOver: false,
    jumping: false,
    jumpHeight: 0,
    jumpSpeed: 6,
  })
  const [isStarted, setIsStarted] = useState(false)
  const [imagesLoaded, setImagesLoaded] = useState(false)
  const animationFrameRef = useRef<number>(0)
  const lastObstacleTimeRef = useRef<number>(0)
  const lastCloudTimeRef = useRef<number>(0)

  // Initialize image refs
  const dinoImg = useRef<HTMLImageElement | null>(null)
  const cactusImg = useRef<HTMLImageElement | null>(null)
  const groundImg = useRef<HTMLImageElement | null>(null)
  const cloudImg = useRef<HTMLImageElement | null>(null)
  const gameOverImg = useRef<HTMLImageElement | null>(null)

  // Add a new state variable to track the last score
  const [lastScore, setLastScore] = useState<number | null>(null)

  // Load images
  useEffect(() => {
    let loadedCount = 0
    const totalImages = 5

    const checkAllLoaded = () => {
      loadedCount++
      if (loadedCount === totalImages) {
        setImagesLoaded(true)
      }
    }

    // Create and load images
    dinoImg.current = new Image()
    dinoImg.current.onload = checkAllLoaded
    dinoImg.current.onerror = (e) => {
      console.error("Failed to load dino image", e)
      checkAllLoaded() // Continue even if image fails to load
    }
    dinoImg.current.src = "/public/dino.png"

    cactusImg.current = new Image()
    cactusImg.current.onload = checkAllLoaded
    cactusImg.current.onerror = (e) => {
      console.error("Failed to load cactus image", e)
      checkAllLoaded()
    }
    cactusImg.current.src = "/public/cactus.png"

    groundImg.current = new Image()
    groundImg.current.onload = checkAllLoaded
    groundImg.current.onerror = (e) => {
      console.error("Failed to load ground image", e)
      checkAllLoaded()
    }
    groundImg.current.src = "/public/ground.png"

    cloudImg.current = new Image()
    cloudImg.current.onload = checkAllLoaded
    cloudImg.current.onerror = (e) => {
      console.error("Failed to load cloud image", e)
      checkAllLoaded()
    }
    cloudImg.current.src = "/public/cloud.png"

    gameOverImg.current = new Image()
    gameOverImg.current.onload = checkAllLoaded
    gameOverImg.current.onerror = (e) => {
      console.error("Failed to load game over image", e)
      checkAllLoaded()
    }
    gameOverImg.current.src = "/public/game-over.png"

    return () => {
      // Clean up image onload handlers
      if (dinoImg.current) dinoImg.current.onload = null
      if (cactusImg.current) cactusImg.current.onload = null
      if (groundImg.current) groundImg.current.onload = null
      if (cloudImg.current) cloudImg.current.onload = null
      if (gameOverImg.current) gameOverImg.current.onload = null
    }
  }, [])

  // Initialize game after images are loaded
  useEffect(() => {
    // Set ground position based on canvas height
    const canvas = canvasRef.current
    if (canvas) {
      const ground = canvas.height - 20
      setGameState((prev) => ({
        ...prev,
        ground,
        dino: { ...prev.dino, y: ground - prev.dino.height },
      }))

      // Draw initial background and start message
      const ctx = canvas.getContext("2d")
      if (ctx) {
        drawBackground(ctx, canvas)
        drawStartMessage(ctx, canvas)
      }
    }

    // Load high score from localStorage
    const savedHighScore = localStorage.getItem("dinoHighScore")
    if (savedHighScore) {
      setGameState((prev) => ({ ...prev, highScore: Number.parseInt(savedHighScore) }))
    }

    // Event listeners for controls
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.code === "Space" || e.code === "ArrowUp") && !gameState.jumping && !gameState.gameOver) {
        if (!isStarted) {
          setIsStarted(true)
        } else {
          jump()
        }
      } else if (e.code === "Enter") {
        if (gameState.gameOver) {
          restartGame()
        } else if (!isStarted) {
          setIsStarted(true)
        }
      } else if (e.code === "Escape") {
        window.location.href = "/"
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    // Touch event for mobile
    const handleTouch = () => {
      if (!gameState.jumping && !gameState.gameOver) {
        if (!isStarted) {
          setIsStarted(true)
        } else {
          jump()
        }
      } else if (gameState.gameOver) {
        restartGame()
      }
    }

    canvas?.addEventListener("touchstart", handleTouch)
    canvas?.addEventListener("click", handleTouch)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      canvas?.removeEventListener("touchstart", handleTouch)
      canvas?.removeEventListener("click", handleTouch)
      cancelAnimationFrame(animationFrameRef.current)
    }
  }, [gameState.jumping, gameState.gameOver, isStarted])

  // Game loop
  useEffect(() => {
    if (isStarted && !gameState.gameOver) {
      animationFrameRef.current = requestAnimationFrame(gameLoop)
    }
    return () => cancelAnimationFrame(animationFrameRef.current)
  }, [isStarted, gameState])

  const jump = () => {
    if (!gameState.jumping) {
      setGameState((prev) => ({ ...prev, jumping: true, jumpHeight: 0 }))
    }
  }

  const restartGame = () => {
    setGameState((prev) => ({
      ...prev,
      obstacles: [],
      clouds: [],
      score: 0,
      speed: 5,
      gameOver: false,
      jumping: false,
      jumpHeight: 0,
    }))
    setIsStarted(false) // Change to false to show start screen again
  }

  const drawBackground = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    // Create gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
    gradient.addColorStop(0, "#3b82f6") // blue-500
    gradient.addColorStop(1, "#06b6d4") // cyan-500

    // Fill background
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }

  const drawStartMessage = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    // Draw title
    ctx.font = "bold 24px 'Press Start 2P', monospace"
    ctx.fillStyle = "white"
    ctx.textAlign = "center"
    ctx.fillText("DINO RUNNER", canvas.width / 2, canvas.height / 2 - 40)

    // Draw start message
    ctx.font = "16px 'Press Start 2P', monospace"
    ctx.fillStyle = "white"
    ctx.textAlign = "center"
    ctx.fillText("Press ENTER to start", canvas.width / 2, canvas.height / 2)

    // Draw last score if available
    if (lastScore !== null) {
      ctx.font = "14px 'Press Start 2P', monospace"
      ctx.fillStyle = "white"
      ctx.textAlign = "center"
      ctx.fillText(`Your last score: ${lastScore}`, canvas.width / 2, canvas.height / 2 + 30)
    }

    // Draw instructions
    ctx.font = "12px 'Press Start 2P', monospace"
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)"
    ctx.fillText("SPACE or UP to jump", canvas.width / 2, canvas.height / 2 + (lastScore !== null ? 60 : 40))
  }

  const gameLoop = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas and draw background
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    drawBackground(ctx, canvas)

    // Update game state
    setGameState((prev) => {
      const newState = { ...prev }

      // Handle jumping
      if (prev.jumping) {
        newState.jumpHeight += prev.jumpSpeed
        if (newState.jumpHeight > 100) {
          newState.jumpSpeed = -prev.jumpSpeed
        }
        if (newState.jumpHeight <= 0) {
          newState.jumping = false
          newState.jumpHeight = 0
          newState.jumpSpeed = Math.abs(prev.jumpSpeed)
        }
        newState.dino.y = prev.ground - prev.dino.height - newState.jumpHeight
      }

      // Generate obstacles
      const now = Date.now()
      if (now - lastObstacleTimeRef.current > 1500 + Math.random() * 1000) {
        const cactusHeight = 40 + Math.random() * 20
        newState.obstacles.push({
          x: canvas.width,
          y: prev.ground - cactusHeight,
          width: 25,
          height: cactusHeight,
        })
        lastObstacleTimeRef.current = now
      }

      // Generate clouds
      if (now - lastCloudTimeRef.current > 3000 + Math.random() * 5000) {
        const cloudY = 20 + Math.random() * 100
        const cloudWidth = 70 + Math.random() * 30
        const cloudSpeed = 1 + Math.random() * 1.5

        newState.clouds.push({
          x: canvas.width,
          y: cloudY,
          width: cloudWidth,
          speed: cloudSpeed,
        })
        lastCloudTimeRef.current = now
      }

      // Move obstacles
      newState.obstacles = prev.obstacles
        .map((obstacle) => ({
          ...obstacle,
          x: obstacle.x - prev.speed,
        }))
        .filter((obstacle) => obstacle.x > -obstacle.width)

      // Move clouds
      newState.clouds = prev.clouds
        .map((cloud) => ({
          ...cloud,
          x: cloud.x - cloud.speed,
        }))
        .filter((cloud) => cloud.x > -cloud.width)

      // Check collisions
      const dino = {
        x: prev.dino.x + 10,
        y: prev.dino.y + 10,
        width: prev.dino.width - 20,
        height: prev.dino.height - 10,
      }

      for (const obstacle of newState.obstacles) {
        const obstacleHitbox = {
          x: obstacle.x + 5,
          y: obstacle.y,
          width: obstacle.width - 10,
          height: obstacle.height,
        }

        if (
          dino.x < obstacleHitbox.x + obstacleHitbox.width &&
          dino.x + dino.width > obstacleHitbox.x &&
          dino.y < obstacleHitbox.y + obstacleHitbox.height &&
          dino.y + dino.height > obstacleHitbox.y
        ) {
          newState.gameOver = true
          setLastScore(Math.floor(prev.score / 10)) // Add this line to save the score
          if (prev.score > prev.highScore) {
            newState.highScore = prev.score
            localStorage.setItem("dinoHighScore", prev.score.toString())
          }
        }
      }

      // Update score
      if (!prev.gameOver) {
        newState.score = prev.score + 1
        // Increase speed gradually
        if (newState.score % 500 === 0) {
          newState.speed = Math.min(prev.speed + 0.5, 15)
        }
      }

      return newState
    })

    // Draw game
    drawGame(ctx, canvas)

    if (!gameState.gameOver) {
      animationFrameRef.current = requestAnimationFrame(gameLoop)
    }
  }

  const drawGame = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    try {
      // Draw clouds
      gameState.clouds.forEach((cloud) => {
        if (imagesLoaded && cloudImg.current) {
          // Draw cloud image if available
          const cloudHeight = cloud.width * 0.5 // Maintain aspect ratio
          ctx.drawImage(cloudImg.current, cloud.x, cloud.y, cloud.width, cloudHeight)
        } else {
          // Fallback cloud drawing
          ctx.fillStyle = "rgba(255, 255, 255, 0.8)"
          ctx.beginPath()
          ctx.arc(cloud.x + cloud.width * 0.3, cloud.y + 15, 15, 0, Math.PI * 2)
          ctx.arc(cloud.x + cloud.width * 0.5, cloud.y + 10, 20, 0, Math.PI * 2)
          ctx.arc(cloud.x + cloud.width * 0.7, cloud.y + 15, 15, 0, Math.PI * 2)
          ctx.fill()
        }
      })

      // Try to draw with images first
      if (imagesLoaded && dinoImg.current && cactusImg.current && groundImg.current && gameOverImg.current) {
        // Draw ground
        ctx.drawImage(groundImg.current, 0, gameState.ground, canvas.width, 20)

        // Draw dino
        ctx.drawImage(dinoImg.current, gameState.dino.x, gameState.dino.y, gameState.dino.width, gameState.dino.height)

        // Draw obstacles
        gameState.obstacles.forEach((obstacle) => {
          if (cactusImg.current) {
            ctx.drawImage(cactusImg.current, obstacle.x, obstacle.y, obstacle.width, obstacle.height)
          }
        })
      } else {
        // Fallback to drawing shapes if images fail to load
        // Draw ground
        ctx.beginPath()
        ctx.moveTo(0, gameState.ground)
        ctx.lineTo(canvas.width, gameState.ground)
        ctx.strokeStyle = "white"
        ctx.lineWidth = 2
        ctx.stroke()

        // Draw dashed line above ground
        ctx.beginPath()
        ctx.setLineDash([4, 4])
        ctx.moveTo(0, gameState.ground - 5)
        ctx.lineTo(canvas.width, gameState.ground - 5)
        ctx.strokeStyle = "rgba(255, 255, 255, 0.7)"
        ctx.lineWidth = 1
        ctx.stroke()
        ctx.setLineDash([])

        // Draw dino (T-Rex)
        ctx.fillStyle = "white"
        ctx.fillRect(gameState.dino.x, gameState.dino.y, gameState.dino.width, gameState.dino.height)

        // Draw dino eye
        ctx.fillStyle = "#3b82f6"
        ctx.beginPath()
        ctx.arc(gameState.dino.x + gameState.dino.width - 10, gameState.dino.y + 15, 3, 0, Math.PI * 2)
        ctx.fill()

        // Draw obstacles (cacti)
        gameState.obstacles.forEach((obstacle) => {
          ctx.fillStyle = "white"

          // Draw cactus stem
          ctx.fillRect(obstacle.x + obstacle.width / 3, obstacle.y, obstacle.width / 3, obstacle.height)

          // Draw cactus arms
          ctx.fillRect(obstacle.x, obstacle.y + obstacle.height / 3, obstacle.width, obstacle.height / 5)

          ctx.fillRect(obstacle.x, obstacle.y + (obstacle.height * 2) / 3, obstacle.width, obstacle.height / 5)
        })
      }

      // Draw score
      ctx.font = "16px 'Press Start 2P', monospace"
      ctx.fillStyle = "white"
      ctx.textAlign = "right"
      ctx.fillText(`Score: ${Math.floor(gameState.score / 10)}`, canvas.width - 20, 30)
      ctx.fillText(`High Score: ${Math.floor(gameState.highScore / 10)}`, canvas.width - 20, 60)

      // Draw game over
      if (gameState.gameOver) {
        if (imagesLoaded && gameOverImg.current) {
          // Draw game over image if available
          const gameOverWidth = 200
          const gameOverHeight = 15
          ctx.drawImage(
            gameOverImg.current,
            canvas.width / 2 - gameOverWidth / 2,
            canvas.height / 2 - gameOverHeight,
            gameOverWidth,
            gameOverHeight,
          )
        } else {
          // Fallback text
          ctx.font = "bold 24px 'Press Start 2P', monospace"
          ctx.fillStyle = "white"
          ctx.textAlign = "center"
          ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2 - 10)
        }

        ctx.font = "14px 'Press Start 2P', monospace"
        ctx.fillStyle = "white"
        ctx.textAlign = "center"
        ctx.fillText("Press ENTER to restart", canvas.width / 2, canvas.height / 2 + 30)
      }

      // Draw start message
      if (!isStarted) {
        drawStartMessage(ctx, canvas)
      }
    } catch (error) {
      console.error("Error drawing game:", error)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-500 to-cyan-500">
      <div className="relative border border-white/20 rounded-lg overflow-hidden shadow-xl">
        {!imagesLoaded && !isStarted && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-blue-500 to-cyan-500">
            <p className="text-white">Loading game...</p>
          </div>
        )}
        <canvas ref={canvasRef} width={800} height={300} className="w-full h-full max-w-[800px] max-h-[300px]" />
      </div>

      <div className="mt-6 text-sm text-white">
        <p>Press ENTER to start • SPACE to jump • ESC to exit</p>
      </div>
    </div>
  )
}

