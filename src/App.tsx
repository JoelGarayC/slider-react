import { ChangeEvent, useEffect, useRef, useState } from 'react'
import './App.css'

interface Image {
  id: `${string}-${string}-${string}-${string}-${string}`
  src: string
  alt: string
}

const INITIAL_VALUES: Image[] = [
  {
    id: crypto.randomUUID(),
    src: 'https://picsum.photos/800/600/?image=101',
    alt: 'Image 4 from Picsum'
  },
  {
    id: crypto.randomUUID(),
    src: 'https://picsum.photos/800/600/?image=102',
    alt: 'Image 5 from Picsum'
  },
  {
    id: crypto.randomUUID(),
    src: 'https://picsum.photos/800/600/?image=103',
    alt: 'Image 6 from Picsum'
  },
  {
    id: crypto.randomUUID(),
    src: 'https://picsum.photos/800/600/?image=104',
    alt: 'Image 7 from Picsum'
  },
  {
    id: crypto.randomUUID(),
    src: 'https://picsum.photos/800/600/?image=106',
    alt: 'Image 8 from Picsum'
  }
]

function App() {
  const [images] = useState<Image[]>(INITIAL_VALUES)
  const [currentIndex, setCurrentIndex] = useState(0)
  // const [isReversing, setIsReversing] = useState(false)
  const carrousel = useRef<HTMLDivElement>(null)
  const interval = useRef<number>()

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    setCurrentIndex(Number(e.currentTarget.value))
  }

  useEffect(() => {
    if (carrousel.current === null) return
    const carrouselCurrent = carrousel.current

    const childNode = carrouselCurrent.children[currentIndex]
    if (childNode) {
      childNode.scrollIntoView({ behavior: 'smooth' })
    }
  }, [currentIndex])

  useEffect(() => {
    if (carrousel.current === null) return
    const carrouselCurrent = carrousel.current

    const handleScroll = () => {
      // Calcula la imagen actual basada en el desplazamiento del carrusel
      const scrollPosition = carrouselCurrent.scrollLeft
      const imageWidth = carrouselCurrent.clientWidth
      const newCurrentImage = Math.round(scrollPosition / imageWidth)

      setCurrentIndex(newCurrentImage)
    }

    carrouselCurrent.addEventListener('scrollend', handleScroll)
    return () => {
      carrouselCurrent.removeEventListener('scrollend', handleScroll)
    }
  }, [])

  // useEffect(() => {
  //   const isLastElement = currentIndex === images.length - 1
  //   const isFirstElement = currentIndex === 0

  //   if (isLastElement) {
  //     setIsReversing(true)
  //   } else if (isFirstElement) {
  //     setIsReversing(false)
  //   }
  // }, [currentIndex, images])

  useEffect(() => {
    if (carrousel.current === null) return
    const carrouselCurrent = carrousel.current

    const handleInterval = () => {
      interval.current = setInterval(() => {
        setCurrentIndex((prev) => {
          // return isReversing ? prev - 1 : prev + 1
          const isLastChild = prev === images.length - 1
          return isLastChild ? 0 : prev + 1
        })
      }, 3000)
    }

    const handleClearInterval = () => {
      clearInterval(interval.current)
    }

    handleInterval()
    carrouselCurrent.addEventListener('mouseenter', handleClearInterval)
    carrouselCurrent.addEventListener('mouseleave', handleInterval)

    carrouselCurrent.addEventListener('touchstart', handleClearInterval)
    carrouselCurrent.addEventListener('touchend', handleInterval)

    return () => {
      handleClearInterval()
      carrouselCurrent.removeEventListener('mouseenter', handleClearInterval)
      carrouselCurrent.removeEventListener('mouseleave', handleInterval)

      carrouselCurrent.removeEventListener('touchstart', handleClearInterval)
      carrouselCurrent.removeEventListener('touchend', handleInterval)
    }
  }, [images.length])

  useEffect(() => {
    if (carrousel.current === null) return
    const carrouselCurrent = carrousel.current

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()

      // const delta = e.deltaY || e.detail || e.wheelDelta
      const delta = e.deltaY || e.detail

      carrouselCurrent.scrollLeft += delta * 4
    }

    carrouselCurrent.addEventListener('wheel', (e) => handleWheel(e))
    return () => {
      carrouselCurrent.removeEventListener('wheel', (e) => handleWheel(e))
    }
  }, [])

  return (
    <>
      <div className='App'>
        <h1>Image Scroller</h1>
        <br />
        <section className='container'>
          <section className='carrusel-container'>
            <div className='carrusel' ref={carrousel}>
              {images.map((image) => (
                <img
                  key={image.id}
                  src={image.src}
                  alt={image.alt}
                  className='image'
                />
              ))}
            </div>
          </section>

          <section className='icons'>
            {images.map((item, index) => (
              <input
                key={item.id}
                type='radio'
                value={index}
                onChange={handleInput}
                checked={index === currentIndex}
              />
            ))}
          </section>
        </section>
      </div>
    </>
  )
}

export default App
