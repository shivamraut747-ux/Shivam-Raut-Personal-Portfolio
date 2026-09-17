import { useMemo, useEffect, type CSSProperties } from "react";

type FocusRole = "background" | "button" | "visual";
type EffectMode = "light" | "dark";

type FocusTarget = {
  selector: string;
  role: FocusRole;
  fit?: "cover" | "contain-square" | "wide-wordmark" | "portrait-stage";
  preserveTransform?: boolean;
};

type EffectDefinition = {
  title: string;
  source: string;
  background: string;
  targets: readonly FocusTarget[];
  theme?: {
    nativeMode?: EffectMode;
    lightBackground: string;
    darkBackground: string;
    invertBackground?: boolean;
  };
  hiddenTargets?: readonly string[];
};

export type TactileButtonProps = {
  mode?: EffectMode;
  hue?: number;
  saturation?: number;
  brightness?: number;
  label?: string;
  className?: string;
  style?: CSSProperties;
  onClick?: () => void;
  href?: string;
};

const TACTILE_BUTTON_DEFAULTS = {
  mode: "dark",
  hue: 0,
  saturation: 1,
  brightness: 1,
} as const;

const NEXUS_TACTILE_SOURCE = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Tactile Fluidics Button</title>
    
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
</head>
<body class="bg-transparent text-neutral-200 h-screen w-screen overflow-hidden font-['Inter',sans-serif] selection:bg-[#06b6d4] selection:text-black relative flex items-center justify-center m-0 p-0">

    <div class="intro flex items-center justify-center">
        <button class="relative flex items-center justify-center w-[230px] sm:w-[250px] h-[52px] sm:h-[56px] border-0 p-0 rounded-[28px] overflow-hidden cursor-pointer bg-[#04090e] transition-all duration-300 ease-out shadow-[inset_0_0_0_1.5px_rgba(6,182,212,0.65),inset_0_0_15px_rgba(6,182,212,0.4)] hover:shadow-[inset_0_0_0_2px_rgba(6,182,212,0.95),inset_0_0_22px_rgba(6,182,212,0.6)] active:scale-[0.985] outline-none focus:outline-none" id="btn" type="button">
            <canvas id="gl" aria-hidden="true" class="absolute inset-0 w-full h-full block rounded-[28px] pointer-events-none"></canvas>
            <span class="relative z-10 pointer-events-none font-bold text-[19px] sm:text-[21px] tracking-[0.24em] indent-[0.24em] text-white drop-shadow-[0_0_16px_rgba(6,182,212,1)] drop-shadow-[0_1px_3px_rgba(0,0,0,0.95)] flex items-center justify-center antialiased">
                Resume
            </span>
        </button>
    </div>

    <script>
        (function initButtonWebGL() {
            var btn = document.getElementById('btn');
            var canvas = document.getElementById('gl');
            var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            var gl = canvas.getContext('webgl');
            
            if (!gl) { 
                btn.style.background = 'linear-gradient(to top, #0284c7 0%, #06b6d4 52%, #a5f3fc 55%, #050b11 56%)';
                canvas.style.display = 'none';
                return; 
            }

            var VS = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
            var FS = [
                'precision highp float;',
                'uniform vec2 u_res;',
                'uniform float u_time;',
                'uniform float u_level;',
                'uniform float u_tilt;',
                'uniform float u_slosh;',
                'float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453123);}',
                'float noise(vec2 p){',
                '  vec2 i=floor(p), f=fract(p);',
                '  vec2 u=f*f*(3.0-2.0*f);',
                '  return mix(mix(hash(i),hash(i+vec2(1.,0.)),u.x),',
                '             mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),u.x),u.y);',
                '}',
                'float fbm(vec2 p){',
                '  float v=0.0; float a=0.5;',
                '  for(int i=0;i<4;i++){ v+=a*noise(p); p=p*2.04+vec2(11.3,7.1); a*=0.5; }',
                '  return v;',
                '}',
                'void main(){',
                '  vec2 uv = gl_FragCoord.xy / u_res;',
                '  float ar = u_res.x / u_res.y;',
                '  float x = uv.x * ar;',
                '  float t = u_time;',
                '  float amp = 0.012 + u_slosh * 0.045;',
                '  float surf = u_level',
                '    + u_tilt * (uv.x - 0.5) * 0.34',
                '    + amp * sin(x * 5.1 + t * 4.6)',
                '    + amp * 0.62 * sin(x * 9.7 + t * (-6.8) + 1.7)',
                '    + amp * 0.38 * sin(x * 14.3 + t * 8.9 + 4.2);',
                '  float d = surf - uv.y;',
                '  vec3 col = mix(vec3(0.03, 0.06, 0.1), vec3(0.05, 0.09, 0.15), uv.y);',
                '  col += vec3(0.02, 0.05, 0.1) * pow(max(0.0, 1.0 - abs(uv.y - 0.88) * 6.0), 2.0);',
                '  float inside = smoothstep(0.0, 0.012, d);',
                '  float depth = clamp(d / max(u_level, 0.001), 0.0, 1.0);',
                '  vec3 liq = mix(vec3(0.05, 0.95, 1.0), vec3(0.03, 0.22, 0.55), depth);',
                '  float caust = fbm(vec2(x * 4.2, (uv.y + t * 0.14) * 4.2));',
                '  liq *= 1.15 + 0.45 * caust;',
                '  liq += vec3(0.04, 0.35, 0.5) * pow(max(0.0, d * 3.0), 1.5) * u_slosh;',
                '  col = mix(col, liq, inside);',
                '  col += vec3(0.5, 0.95, 1.0) * exp(-abs(d) * 75.0) * 1.15;',
                '  col += vec3(0.9, 1.0, 1.0) * exp(-abs(d) * 200.0) * 0.8;',
                '  vec2 e = uv * (1.0 - uv);',
                '  col *= 0.55 + 0.45 * pow(e.x * e.y * 16.0, 0.22);',
                '  gl_FragColor = vec4(col, 1.0);',
                '}'
            ].join('\\n');

            function compile(type, src) {
                var s = gl.createShader(type);
                gl.shaderSource(s, src);
                gl.compileShader(s);
                return s;
            }
            
            var prog = gl.createProgram();
            gl.attachShader(prog, compile(gl.VERTEX_SHADER, VS));
            gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FS));
            gl.linkProgram(prog);
            gl.useProgram(prog);

            var buf = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, buf);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
            var locP = gl.getAttribLocation(prog, 'p');
            gl.enableVertexAttribArray(locP);
            gl.vertexAttribPointer(locP, 2, gl.FLOAT, false, 0, 0);

            var uRes = gl.getUniformLocation(prog, 'u_res');
            var uTime = gl.getUniformLocation(prog, 'u_time');
            var uLevel = gl.getUniformLocation(prog, 'u_level');
            var uTilt = gl.getUniformLocation(prog, 'u_tilt');
            var uSlosh = gl.getUniformLocation(prog, 'u_slosh');

            function resize() {
                var dpr = Math.max(window.devicePixelRatio || 1, 2);
                var w = Math.max(1, Math.round(canvas.clientWidth * dpr));
                var h = Math.max(1, Math.round(canvas.clientHeight * dpr));
                if (canvas.width !== w || canvas.height !== h) {
                    canvas.width = w;
                    canvas.height = h;
                    gl.viewport(0, 0, w, h);
                }
            }
            window.addEventListener('resize', resize);
            resize();

            var BASE = 0.56;
            var level = BASE, gulp = 0;
            var slosh = 0.4, tilt = 0, tiltTarget = 0;
            var lastX = null;
            var last = performance.now();

            btn.addEventListener('mousemove', function (e) {
                var rect = btn.getBoundingClientRect();
                var x = (e.clientX - rect.left) / Math.max(1, rect.width);
                if (lastX !== null) {
                    slosh = Math.min(1.4, slosh + Math.abs(x - lastX) * 2.6);
                }
                lastX = x;
                tiltTarget = Math.max(-1, Math.min(1, (x - 0.5) * 2));
            });
            btn.addEventListener('mouseleave', function () { lastX = null; tiltTarget = 0; });
            btn.addEventListener('touchstart', function (e) {
                slosh = Math.min(1.4, slosh + 0.6);
                if (e.touches && e.touches[0]) {
                    var rect = btn.getBoundingClientRect();
                    var x = (e.touches[0].clientX - rect.left) / Math.max(1, rect.width);
                    lastX = x;
                    tiltTarget = Math.max(-1, Math.min(1, (x - 0.5) * 2));
                }
            }, { passive: true });
            btn.addEventListener('touchmove', function (e) {
                if (e.touches && e.touches[0]) {
                    var rect = btn.getBoundingClientRect();
                    var x = (e.touches[0].clientX - rect.left) / Math.max(1, rect.width);
                    if (lastX !== null) {
                        slosh = Math.min(1.4, slosh + Math.abs(x - lastX) * 2.6);
                    }
                    lastX = x;
                    tiltTarget = Math.max(-1, Math.min(1, (x - 0.5) * 2));
                }
            }, { passive: true });
            btn.addEventListener('touchend', function () { lastX = null; tiltTarget = 0; });
            btn.addEventListener('focus', function () { slosh = Math.min(1.4, slosh + 0.5); });
            btn.addEventListener('click', function () {
                gulp = 1;
                slosh = Math.min(1.4, slosh + 0.7);
                try {
                    window.parent.postMessage({ type: 'TACTILE_BUTTON_CLICK' }, '*');
                } catch(e) {}
            });

            function frame(now) {
                var dt = Math.min(0.05, (now - last) / 1000);
                last = now;
                slosh *= Math.exp(-1.5 * dt);
                gulp *= Math.exp(-1.1 * dt);
                tilt += (tiltTarget - tilt) * Math.min(1, dt * 5);
                var levelTarget = BASE - 0.36 * gulp;
                level += (levelTarget - level) * Math.min(1, dt * 5.5);
                
                resize();
                gl.uniform2f(uRes, canvas.width, canvas.height);
                gl.uniform1f(uTime, reduced ? 2.0 : now / 1000);
                gl.uniform1f(uLevel, level);
                gl.uniform1f(uTilt, tilt);
                gl.uniform1f(uSlosh, reduced ? 0.25 : slosh);
                gl.drawArrays(gl.TRIANGLES, 0, 3);
                requestAnimationFrame(frame);
            }
            requestAnimationFrame(frame);
        })();
    </script>
</body>
</html>`;

const TACTILE_EFFECT: EffectDefinition = {
  title: "Nexus tactile fluidics button",
  source: NEXUS_TACTILE_SOURCE,
  background: "transparent",
  theme: {
    nativeMode: "dark",
    lightBackground: "transparent",
    darkBackground: "transparent",
    invertBackground: false,
  },
  targets: [
    { selector: "#btn", role: "button" },
  ],
};

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value));
}

function buildFocusedDocument(
  definition: EffectDefinition,
  mode: EffectMode,
  label: string = "Resume",
  href?: string
) {
  let source = definition.source;
  if (label && label !== "Resume") {
    source = source.replace(">Resume<", `>${label}<`);
  }
  if (href) {
    const hrefJson = JSON.stringify(href);
    source = source.replace(
      "try {\n                    window.parent.postMessage({ type: 'TACTILE_BUTTON_CLICK' }, '*');\n                } catch(e) {}",
      `try {
                    window.open(${hrefJson}, '_blank');
                } catch(e) {}
                try {
                    window.parent.postMessage({ type: 'TACTILE_BUTTON_CLICK' }, '*');
                } catch(e) {}`
    );
  }
  const targetJson = JSON.stringify(definition.targets).replace(
    /</g,
    "\\u003c",
  );
  const hiddenTargetJson = JSON.stringify(
    definition.hiddenTargets ?? [],
  ).replace(/</g, "\\u003c");
  const modeJson = JSON.stringify(mode);
  const focusStyle = `<style data-threeui-focus>
html, body { width: 100% !important; height: 100% !important; min-height: 0 !important; margin: 0 !important; padding: 0 !important; overflow: hidden !important; background: transparent !important; background-color: transparent !important; color-scheme: ${mode} !important; }
body { position: relative !important; display: flex !important; align-items: center !important; justify-content: center !important; background: transparent !important; background-color: transparent !important; }
body > * { visibility: hidden !important; }
body[data-threeui-ready] > [data-threeui-role] { visibility: visible !important; }
[data-threeui-residual] { display: none !important; }
[data-threeui-hidden] { display: none !important; }
[data-threeui-role="button"] { position: relative !important; z-index: 2 !important; opacity: 1 !important; flex: none !important; }
[data-threeui-role="button"]:not([data-threeui-preserve-transform]) { transform: none !important; }
</style>`;
  const focusScript = `<script data-threeui-focus>
(function () {
  document.documentElement.dataset.sfMode = ${modeJson};
  var isolated = false;
  function isolate() {
    if (isolated) return;
    var specs = ${targetJson};
    var hiddenSelectors = ${hiddenTargetJson};
    var roots = [];
    hiddenSelectors.forEach(function (selector) {
      document.querySelectorAll(selector).forEach(function (element) {
        element.setAttribute('data-threeui-hidden', '');
        element.setAttribute('aria-hidden', 'true');
        if ('inert' in element) element.inert = true;
      });
    });
    specs.forEach(function (spec) {
      var element = document.querySelector(spec.selector);
      if (!element) return;
      element.setAttribute('data-threeui-role', spec.role);
      if (spec.fit) element.setAttribute('data-threeui-fit', spec.fit);
      if (spec.preserveTransform) element.setAttribute('data-threeui-preserve-transform', '');
      if (!roots.some(function (root) { return root.contains(element); })) roots.push(element);
    });
    if (!roots.length) return;
    isolated = true;
    roots.forEach(function (root) {
      var placeholderLink = root.matches('a[href="#"]') ? root : root.querySelector('a[href="#"]');
      if (placeholderLink) placeholderLink.addEventListener('click', function (event) { event.preventDefault(); });
      document.body.appendChild(root);
    });
    Array.from(document.body.children).forEach(function (element) {
      if (roots.indexOf(element) !== -1) return;
      element.setAttribute('data-threeui-residual', '');
      element.setAttribute('aria-hidden', 'true');
      if ('inert' in element) element.inert = true;
    });
    document.body.setAttribute('data-threeui-ready', '');
    requestAnimationFrame(function () { window.dispatchEvent(new Event('resize')); });
  }
  function scheduleIsolation() { setTimeout(isolate, 100); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', scheduleIsolation, { once: true });
  else scheduleIsolation();
  window.addEventListener('load', isolate, { once: true });
})();
</script>`;
  return source
    .replace(/<\/head>/i, `${focusStyle}</head>`)
    .replace(/<\/body>/i, `${focusScript}</body>`);
}

function NeuformIsolatedEffect({
  mode = TACTILE_BUTTON_DEFAULTS.mode,
  hue = TACTILE_BUTTON_DEFAULTS.hue,
  saturation = TACTILE_BUTTON_DEFAULTS.saturation,
  brightness = TACTILE_BUTTON_DEFAULTS.brightness,
  label = "Resume",
  className,
  style,
  onClick,
  href,
}: TactileButtonProps) {
  const definition = TACTILE_EFFECT;
  const safeMode: EffectMode = mode === "light" ? "light" : "dark";
  const source = useMemo(
    () => buildFocusedDocument(definition, safeMode, label, href),
    [safeMode, label, href],
  );
  const safeHue = clamp(hue, -180, 180);
  const safeSaturation = clamp(saturation, 0, 2);
  const safeBrightness = clamp(brightness, 0.35, 1.65);
  const filter =
    safeHue === 0 && safeSaturation === 1 && safeBrightness === 1
      ? undefined
      : `hue-rotate(${safeHue}deg) saturate(${safeSaturation}) brightness(${safeBrightness})`;

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === "TACTILE_BUTTON_CLICK") {
        onClick?.();
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [onClick]);

  return (
    <iframe
      className={className}
      data-mode={safeMode}
      title={definition.title}
      srcDoc={source}
      sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
      loading="eager"
      style={{
        display: "block",
        width: "100%",
        height: "100%",
        border: 0,
        outline: "none",
        background: "transparent",
        backgroundColor: "transparent",
        filter,
        ...style,
      }}
    />
  );
}

export default function TactileButton(props: TactileButtonProps) {
  return <NeuformIsolatedEffect {...props} />;
}
