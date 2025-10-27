'use client'

import React, { useState, useEffect } from 'react'
import Image, { type ImageProps } from 'next/image'

// Bạn có thể giữ fallback SVG của mình
const ERROR_IMG_SRC = 'data:image/svg+xml;base64,...'

/**
 * Xác định kiểu props:
 * Chúng ta lấy tất cả các props từ `next/image` (ImageProps)
 * nhưng loại bỏ 'src' và 'alt' để định nghĩa lại chúng.
 */
type ImageWithFallbackProps = Omit<ImageProps, 'src' | 'alt'> & {
  /** Nguồn ảnh chính. Có thể là null hoặc undefined. */
  src: string | undefined | null
  /** Văn bản thay thế (alt text) bắt buộc. */
  alt: string
  /** (Tùy chọn) Cung cấp một nguồn ảnh dự phòng tùy chỉnh. */
  fallbackSrc?: string
  className?: string
}

/**
 * Một component `next/image` được bọc lại để hiển thị
 * một ảnh dự phòng (fallback) khi ảnh chính bị lỗi.
 */
export function ImageWithFallback(props: ImageWithFallbackProps) {
  const {
    src,
    alt,
    fallbackSrc = ERROR_IMG_SRC,
    onError,
    ...rest
  } = props

  // State để theo dõi nguồn ảnh (src) hiện tại sẽ được render
  // Khởi tạo bằng src từ props, hoặc fallback nếu src không tồn tại
  const [currentSrc, setCurrentSrc] = useState(src || fallbackSrc)
  // State để theo dõi trạng thái lỗi
  const [hasError, setHasError] = useState(!src)

  /**
   * Sử dụng useEffect để cập nhật `currentSrc` khi `props.src` thay đổi.
   * Điều này rất quan trọng để component có thể tái sử dụng
   * (ví dụ: trong một danh sách) và hiển thị ảnh mới khi props thay đổi.
   */
  useEffect(() => {
    if (src) {
      setCurrentSrc(src)
      setHasError(false) // Reset trạng thái lỗi khi có src mới
    } else {
      // Nếu src mới là null/undefined, chuyển sang fallback
      setCurrentSrc(fallbackSrc)
      setHasError(true)
    }
  }, [src, fallbackSrc])

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    // Khi xảy ra lỗi, đặt nguồn ảnh là fallback
    setCurrentSrc(fallbackSrc)
    setHasError(true)
    
    // Gọi thêm hàm onError gốc (nếu có) được truyền từ props
    if (onError) {
      onError(e)
    }
  }

  return (
    <Image
      src={currentSrc}
      alt={hasError ? 'Error loading image' : alt}
      onError={handleError}
      {...rest} // Truyền tất cả các props còn lại của next/image (như fill, width, height, priority, sizes, className, style, v.v.)
    />
  )
}