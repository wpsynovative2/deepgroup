"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { LoaderCircle, Maximize2, Minimize2, Pause, Play, Rotate3d, ZoomIn, ZoomOut } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  /** Desktop-size equirectangular image (2:1). */
  src: string;
  /** 4096px copy for phones and GPUs with a 4096 texture limit. */
  srcSmall: string;
  poster: string;
  alt: string;
  /** Opening view, in degrees. */
  yaw?: number;
  pitch?: number;
};

/**
 * Click-to-load 360° viewer. Until the visitor asks for it, only a flat poster is shown, so the
 * 1–2 MB panorama never competes with the page's LCP. The viewer itself is a single WebGL quad
 * whose fragment shader maps each pixel's view ray to the equirectangular image, so no 3D
 * library is needed.
 */
export function PanoramaViewer({ src, srcSmall, poster, alt, yaw = 0, pitch = -20 }: Props) {
  const [active, setActive] = useState(false);

  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-brand-900 sm:aspect-[16/9]" data-reveal>
      {active ? (
        <Viewer src={src} srcSmall={srcSmall} poster={poster} alt={alt} yaw={yaw} pitch={pitch} />
      ) : (
        <button type="button" onClick={() => setActive(true)} className="group absolute inset-0 size-full" aria-label={`Open 360° view: ${alt}`}>
          <Image src={poster} alt={alt} fill sizes="(min-width: 1024px) 760px, 100vw" className="object-cover transition-transform duration-[1.2s] group-hover:scale-105" />
          <span className="absolute inset-0 bg-gradient-to-t from-brand-900/70 via-brand-900/10 to-transparent" />
          <span className="absolute top-1/2 left-1/2 grid -translate-x-1/2 -translate-y-1/2 place-items-center">
            <span className="absolute size-24 animate-ping rounded-full bg-white/25" />
            <span className="relative grid size-20 place-items-center rounded-full bg-white/90 text-brand-700 shadow-xl backdrop-blur transition group-hover:scale-110">
              <Rotate3d className="size-9" strokeWidth={1.5} aria-hidden />
            </span>
          </span>
          <span className="absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium whitespace-nowrap text-brand-700 shadow-lg transition group-hover:bg-brand-700 group-hover:text-white">
            Explore the 360° view
          </span>
        </button>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------------------------

const DEG = Math.PI / 180;
const FOV_MIN = 30 * DEG;
const FOV_MAX = 100 * DEG;
const FOV_DEFAULT = 70 * DEG;
const PITCH_LIMIT = 85 * DEG;
const AUTO_SPEED = 0.05; // rad/s

const VERT = `attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}`;
const FRAG = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform sampler2D t;
uniform vec2 r;
uniform float yaw, pitch, f;
const float PI = 3.141592653589793;
void main() {
  vec3 d = normalize(vec3((2. * gl_FragCoord.xy - r) / r.y * f, -1.));
  float c = cos(pitch), s = sin(pitch);
  d = vec3(d.x, d.y * c - d.z * s, d.y * s + d.z * c);
  float lon = atan(d.x, -d.z) + yaw;
  float lat = asin(clamp(d.y, -1., 1.));
  gl_FragColor = texture2D(t, vec2(fract(lon / (2. * PI) + .5), .5 - lat / PI));
}`;

type Cam = { yaw: number; pitch: number; fov: number };

function Viewer({ src, srcSmall, poster, alt, yaw, pitch }: Required<Props>) {
  const boxRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cam = useRef<Cam>({ yaw: yaw * DEG, pitch: pitch * DEG, fov: FOV_DEFAULT });
  const dirty = useRef(true);
  const autoRef = useRef(false);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [progress, setProgress] = useState(0);
  const [auto, setAuto] = useState(false);
  const [touched, setTouched] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [cssExpanded, setCssExpanded] = useState(false);

  const setAutoRotate = useCallback((on: boolean) => {
    autoRef.current = on;
    setAuto(on);
  }, []);

  const interact = useCallback(() => {
    setTouched(true);
    setAutoRotate(false);
  }, [setAutoRotate]);

  const zoom = useCallback((factor: number) => {
    const c = cam.current;
    c.fov = Math.min(FOV_MAX, Math.max(FOV_MIN, c.fov * factor));
    dirty.current = true;
  }, []);

  // ---- WebGL setup, image loading and the render loop ----
  useEffect(() => {
    const canvas = canvasRef.current!;
    const box = boxRef.current!;
    const gl = canvas.getContext("webgl", { antialias: false, alpha: false, preserveDrawingBuffer: false });
    if (!gl) {
      setStatus("error");
      return;
    }

    const compile = (type: number, source: string) => {
      const sh = gl.createShader(type)!;
      gl.shaderSource(sh, source);
      gl.compileShader(sh);
      return sh;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      setStatus("error");
      return;
    }
    gl.useProgram(prog);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const u = {
      r: gl.getUniformLocation(prog, "r"),
      yaw: gl.getUniformLocation(prog, "yaw"),
      pitch: gl.getUniformLocation(prog, "pitch"),
      f: gl.getUniformLocation(prog, "f"),
    };

    // Pick the image the GPU (and the connection, on phones) can handle.
    const maxTex = gl.getParameter(gl.MAX_TEXTURE_SIZE) as number;
    const large = maxTex >= 6144 && Math.min(window.screen.width, window.screen.height) >= 700;
    const url = large ? src : srcSmall;
    if (maxTex < 4096) {
      setStatus("error");
      return;
    }

    let disposed = false;
    let hasTexture = false;
    let texture: WebGLTexture | null = null;
    const abort = new AbortController();

    (async () => {
      try {
        const res = await fetch(url, { signal: abort.signal });
        if (!res.ok || !res.body) throw new Error(String(res.status));
        const total = Number(res.headers.get("content-length")) || 0;
        const reader = res.body.getReader();
        const chunks: Uint8Array[] = [];
        let got = 0;
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          chunks.push(value);
          got += value.length;
          if (total) setProgress(Math.min(99, Math.round((got / total) * 100)));
        }
        const blob = new Blob(chunks as BlobPart[], { type: "image/jpeg" });
        let source: TexImageSource;
        if (typeof window.createImageBitmap === "function") {
          source = await createImageBitmap(blob);
        } else {
          const img = document.createElement("img");
          img.src = URL.createObjectURL(blob);
          await img.decode();
          URL.revokeObjectURL(img.src);
          source = img;
        }
        if (disposed) return;
        texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, source);
        if ("close" in source) source.close();
        hasTexture = true;
        dirty.current = true;
        setProgress(100);
        setStatus("ready");
        if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) setAutoRotate(true);
      } catch (e) {
        if (!disposed && (e as Error).name !== "AbortError") setStatus("error");
      }
    })();

    // Size the drawing buffer to the box.
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(box.clientWidth * dpr);
      canvas.height = Math.round(box.clientHeight * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
      dirty.current = true;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(box);

    // Only animate while on screen.
    let visible = true;
    const io = new IntersectionObserver(([e]) => {
      visible = Boolean(e?.isIntersecting);
      if (visible) start();
    });
    io.observe(box);

    let raf = 0;
    let last = 0;
    const frame = (t: number) => {
      raf = 0;
      if (disposed || !visible || document.hidden) return;
      const dt = last ? Math.min(t - last, 100) / 1000 : 0;
      last = t;
      const c = cam.current;
      if (autoRef.current && hasTexture) {
        c.yaw += AUTO_SPEED * dt;
        dirty.current = true;
      }
      if (dirty.current && hasTexture) {
        dirty.current = false;
        c.pitch = Math.max(-PITCH_LIMIT, Math.min(PITCH_LIMIT, c.pitch));
        gl.uniform2f(u.r, canvas.width, canvas.height);
        gl.uniform1f(u.yaw, c.yaw);
        gl.uniform1f(u.pitch, c.pitch);
        gl.uniform1f(u.f, Math.tan(c.fov / 2));
        gl.drawArrays(gl.TRIANGLES, 0, 3);
      }
      raf = requestAnimationFrame(frame);
    };
    function start() {
      if (!raf) {
        last = 0;
        raf = requestAnimationFrame(frame);
      }
    }
    const onVisibility = () => !document.hidden && start();
    document.addEventListener("visibilitychange", onVisibility);
    const onLost = (e: Event) => {
      e.preventDefault();
      setStatus("error");
    };
    canvas.addEventListener("webglcontextlost", onLost);
    start();

    return () => {
      disposed = true;
      abort.abort();
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      canvas.removeEventListener("webglcontextlost", onLost);
      // Free GPU memory but keep the context: the canvas (and so the context) survives a re-run of this effect.
      if (texture) gl.deleteTexture(texture);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(prog);
    };
  }, [src, srcSmall, setAutoRotate]);

  // ---- Pointer: drag to look, pinch to zoom ----
  useEffect(() => {
    const canvas = canvasRef.current!;
    const pts = new Map<number, { x: number; y: number }>();
    let pinch = 0;
    const dist = () => {
      const [a, b] = [...pts.values()];
      return a && b ? Math.hypot(a.x - b.x, a.y - b.y) : 0;
    };

    const down = (e: PointerEvent) => {
      canvas.setPointerCapture(e.pointerId);
      pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pts.size === 2) pinch = dist();
      interact();
    };
    const move = (e: PointerEvent) => {
      const prev = pts.get(e.pointerId);
      if (!prev) return;
      const c = cam.current;
      if (pts.size === 1) {
        const k = c.fov / canvas.clientHeight;
        c.yaw -= (e.clientX - prev.x) * k;
        c.pitch += (e.clientY - prev.y) * k;
        dirty.current = true;
      }
      pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pts.size === 2) {
        const d = dist();
        if (pinch && d) zoom(pinch / d);
        pinch = d;
      }
    };
    const up = (e: PointerEvent) => {
      pts.delete(e.pointerId);
      pinch = 0;
    };
    // Wheel zooms only in the expanded view, so scrolling the page past the viewer still works.
    const wheel = (e: WheelEvent) => {
      if (!document.fullscreenElement && !canvas.closest("[data-pano-expanded]")) return;
      e.preventDefault();
      zoom(Math.exp(e.deltaY * 0.001));
      interact();
    };

    canvas.addEventListener("pointerdown", down);
    canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerup", up);
    canvas.addEventListener("pointercancel", up);
    canvas.addEventListener("wheel", wheel, { passive: false });
    return () => {
      canvas.removeEventListener("pointerdown", down);
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerup", up);
      canvas.removeEventListener("pointercancel", up);
      canvas.removeEventListener("wheel", wheel);
    };
  }, [interact, zoom]);

  // ---- Expanded view: real fullscreen where supported, a fixed overlay otherwise (iPhone) ----
  useEffect(() => {
    const onChange = () => setExpanded(document.fullscreenElement === boxRef.current);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  useEffect(() => {
    if (!cssExpanded) return;
    const root = document.documentElement;
    const before = root.style.overflow;
    root.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setCssExpanded(false);
    window.addEventListener("keydown", onKey);
    return () => {
      root.style.overflow = before;
      window.removeEventListener("keydown", onKey);
    };
  }, [cssExpanded]);

  const isExpanded = expanded || cssExpanded;
  const toggleExpanded = () => {
    const box = boxRef.current!;
    if (document.fullscreenElement) void document.exitFullscreen();
    else if (cssExpanded) setCssExpanded(false);
    else if (document.fullscreenEnabled && box.requestFullscreen) box.requestFullscreen().catch(() => setCssExpanded(true));
    else setCssExpanded(true);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const c = cam.current;
    const step = 5 * DEG;
    const map: Record<string, () => void> = {
      ArrowLeft: () => (c.yaw -= step),
      ArrowRight: () => (c.yaw += step),
      ArrowUp: () => (c.pitch += step),
      ArrowDown: () => (c.pitch -= step),
      "+": () => zoom(0.9),
      "=": () => zoom(0.9),
      "-": () => zoom(1.1),
    };
    const fn = map[e.key];
    if (!fn) return;
    e.preventDefault();
    fn();
    dirty.current = true;
    interact();
  };

  const btn = "grid size-10 place-items-center rounded-full bg-white/90 text-brand-700 shadow-md backdrop-blur transition hover:bg-brand-700 hover:text-white";

  return (
    <div
      ref={boxRef}
      data-pano-expanded={cssExpanded || undefined}
      className={cn("bg-brand-900", cssExpanded ? "fixed inset-0 z-[100]" : "absolute inset-0")}
    >
      <canvas
        ref={canvasRef}
        tabIndex={0}
        role="img"
        aria-label={`${alt}. Drag, or use the arrow keys, to look around.`}
        onKeyDown={onKeyDown}
        className={cn(
          "block size-full cursor-grab outline-none active:cursor-grabbing",
          // Inline, vertical swipes keep scrolling the page; expanded, every gesture moves the view.
          isExpanded ? "touch-none" : "touch-pan-y",
        )}
      />

      {status !== "ready" ? (
        <div className="absolute inset-0">
          <Image src={poster} alt="" aria-hidden fill sizes="(min-width: 1024px) 760px, 100vw" className="object-cover" />
          <div className="absolute inset-0 grid place-items-center bg-brand-900/45 text-white">
            {status === "loading" ? (
              <div className="flex flex-col items-center gap-3" role="status" aria-live="polite">
                <LoaderCircle className="size-9 animate-spin" aria-hidden />
                <span className="text-sm">Loading 360° view{progress ? ` · ${progress}%` : "…"}</span>
                <span className="h-1 w-40 overflow-hidden rounded-full bg-white/25">
                  <span className="block h-full bg-gold-400 transition-[width]" style={{ width: `${progress}%` }} />
                </span>
              </div>
            ) : (
              <p className="max-w-xs px-6 text-center text-sm" role="alert">
                Your browser can&apos;t display the 360° view. Try another browser or device.
              </p>
            )}
          </div>
        </div>
      ) : null}

      {status === "ready" ? (
        <>
          <span
            className={cn(
              "pointer-events-none absolute top-4 left-4 flex items-center gap-2 rounded-full bg-brand-900/60 px-3 py-1.5 text-xs text-white backdrop-blur transition-opacity duration-500",
              touched && "opacity-0",
            )}
          >
            <Rotate3d className="size-4" aria-hidden /> Drag to look around
          </span>
          <div className="absolute right-4 bottom-4 flex gap-2">
            <button type="button" className={btn} onClick={() => (zoom(1.2), interact())} aria-label="Zoom out">
              <ZoomOut className="size-4" aria-hidden />
            </button>
            <button type="button" className={btn} onClick={() => (zoom(1 / 1.2), interact())} aria-label="Zoom in">
              <ZoomIn className="size-4" aria-hidden />
            </button>
            <button type="button" className={btn} onClick={() => setAutoRotate(!auto)} aria-label={auto ? "Stop rotating" : "Auto-rotate"} aria-pressed={auto}>
              {auto ? <Pause className="size-4" aria-hidden /> : <Play className="size-4" aria-hidden />}
            </button>
            <button type="button" className={btn} onClick={toggleExpanded} aria-label={isExpanded ? "Exit full screen" : "Full screen"}>
              {isExpanded ? <Minimize2 className="size-4" aria-hidden /> : <Maximize2 className="size-4" aria-hidden />}
            </button>
          </div>
        </>
      ) : null}
    </div>
  );
}
