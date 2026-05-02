import * as THREE from 'https://esm.sh/three@0.160.0';
import { EffectComposer } from 'https://esm.sh/three@0.160.0/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'https://esm.sh/three@0.160.0/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'https://esm.sh/three@0.160.0/examples/jsm/postprocessing/ShaderPass.js';
import { UnrealBloomPass } from 'https://esm.sh/three@0.160.0/examples/jsm/postprocessing/UnrealBloomPass.js';

class GhostCursor {
    constructor(parent, options = {}) {
        this.parent = parent;
        this.options = {
            trailLength: 50,
            inertia: 0.5,
            grainIntensity: 0.05,
            bloomStrength: 0.1,
            bloomRadius: 1.0,
            bloomThreshold: 0.025,
            brightness: 1,
            color: '#d4af37', 
            mixBlendMode: 'screen',
            edgeIntensity: 0,
            maxDevicePixelRatio: 0.5,
            targetPixels: null,
            fadeDelayMs: null,
            fadeDurationMs: null,
            zIndex: 9999, 
            ...options
        };

        this.init();
    }

    init() {
        const isTouch = ('ontouchstart' in window || navigator.maxTouchPoints > 0);
        this.pixelBudget = this.options.targetPixels ?? (isTouch ? 0.9e6 : 1.3e6);
        this.fadeDelay = this.options.fadeDelayMs ?? (isTouch ? 500 : 1000);
        this.fadeDuration = this.options.fadeDurationMs ?? (isTouch ? 1000 : 1500);

        this.container = document.createElement('div');
        this.container.className = 'ghost-cursor';
        this.container.style.position = 'fixed';
        this.container.style.inset = '0';
        this.container.style.pointerEvents = 'none';
        this.container.style.zIndex = this.options.zIndex;
        this.parent.appendChild(this.container);

        this.renderer = new THREE.WebGLRenderer({
            antialias: !isTouch,
            alpha: true,
            depth: false,
            stencil: false,
            powerPreference: isTouch ? 'low-power' : 'high-performance',
            premultipliedAlpha: false,
            preserveDrawingBuffer: false
        });
        this.renderer.setClearColor(0x000000, 0);
        this.renderer.domElement.style.pointerEvents = 'none';
        
        
        this.renderer.domElement.style.display = 'block';
        this.renderer.domElement.style.width = '100%';
        this.renderer.domElement.style.height = '100%';
        this.renderer.domElement.style.background = 'transparent';

        if (this.options.mixBlendMode) {
            this.renderer.domElement.style.mixBlendMode = String(this.options.mixBlendMode);
        }
        this.container.appendChild(this.renderer.domElement);

        this.scene = new THREE.Scene();
        this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        const geom = new THREE.PlaneGeometry(2, 2);

        const maxTrail = Math.max(1, Math.floor(this.options.trailLength));
        this.trailBuf = Array.from({ length: maxTrail }, () => new THREE.Vector2(0.5, 0.5));
        this.head = 0;

        const baseColor = new THREE.Color(this.options.color);

        const baseVertexShader = `
            varying vec2 vUv;
            void main() {
              vUv = uv;
              gl_Position = vec4(position, 1.0);
            }
        `;

        const fragmentShader = `
            uniform float iTime;
            uniform vec3  iResolution;
            uniform vec2  iMouse;
            uniform vec2  iPrevMouse[MAX_TRAIL_LENGTH];
            uniform float iOpacity;
            uniform float iScale;
            uniform vec3  iBaseColor;
            uniform float iBrightness;
            uniform float iEdgeIntensity;
            varying vec2  vUv;

            float hash(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7))) * 43758.5453123); }
            float noise(vec2 p){
              vec2 i = floor(p), f = fract(p);
              f *= f * (3. - 2. * f);
              return mix(mix(hash(i + vec2(0.,0.)), hash(i + vec2(1.,0.)), f.x),
                         mix(hash(i + vec2(0.,1.)), hash(i + vec2(1.,1.)), f.x), f.y);
            }
            float fbm(vec2 p){
              float v = 0.0;
              float a = 0.5;
              mat2 m = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
              for(int i=0;i<5;i++){
                v += a * noise(p);
                p = m * p * 2.0;
                a *= 0.5;
              }
              return v;
            }
            vec3 tint1(vec3 base){ return mix(base, vec3(1.0), 0.15); }
            vec3 tint2(vec3 base){ return mix(base, vec3(0.8, 0.9, 1.0), 0.25); }

            vec4 blob(vec2 p, vec2 mousePos, float intensity, float activity) {
              vec2 q = vec2(fbm(p * iScale + iTime * 0.1), fbm(p * iScale + vec2(5.2,1.3) + iTime * 0.1));
              vec2 r = vec2(fbm(p * iScale + q * 1.5 + iTime * 0.15), fbm(p * iScale + q * 1.5 + vec2(8.3,2.8) + iTime * 0.15));

              float smoke = fbm(p * iScale + r * 0.8);
              float radius = 0.5 + 0.3 * (1.0 / iScale);
              float distFactor = 1.0 - smoothstep(0.0, radius * activity, length(p - mousePos));
              float alpha = pow(smoke, 2.5) * distFactor;

              vec3 c1 = tint1(iBaseColor);
              vec3 c2 = tint2(iBaseColor);
              vec3 color = mix(c1, c2, sin(iTime * 0.5) * 0.5 + 0.5);

              return vec4(color * alpha * intensity, alpha * intensity);
            }

            void main() {
              vec2 uv = (gl_FragCoord.xy / iResolution.xy * 2.0 - 1.0) * vec2(iResolution.x / iResolution.y, 1.0);
              vec2 mouse = (iMouse * 2.0 - 1.0) * vec2(iResolution.x / iResolution.y, 1.0);

              vec3 colorAcc = vec3(0.0);
              float alphaAcc = 0.0;

              vec4 b = blob(uv, mouse, 1.0, iOpacity);
              colorAcc += b.rgb;
              alphaAcc += b.a;

              for (int i = 0; i < MAX_TRAIL_LENGTH; i++) {
                vec2 pm = (iPrevMouse[i] * 2.0 - 1.0) * vec2(iResolution.x / iResolution.y, 1.0);
                float t = 1.0 - float(i) / float(MAX_TRAIL_LENGTH);
                t = pow(t, 2.0);
                if (t > 0.01) {
                  vec4 bt = blob(uv, pm, t * 0.8, iOpacity);
                  colorAcc += bt.rgb;
                  alphaAcc += bt.a;
                }
              }

              colorAcc *= iBrightness;

              vec2 uv01 = gl_FragCoord.xy / iResolution.xy;
              float edgeDist = min(min(uv01.x, 1.0 - uv01.x), min(uv01.y, 1.0 - uv01.y));
              float distFromEdge = clamp(edgeDist * 2.0, 0.0, 1.0);
              float k = clamp(iEdgeIntensity, 0.0, 1.0);
              float edgeMask = mix(1.0 - k, 1.0, distFromEdge);

              float outAlpha = clamp(alphaAcc * iOpacity * edgeMask, 0.0, 1.0);
              gl_FragColor = vec4(colorAcc, outAlpha);
            }
        `;

        this.material = new THREE.ShaderMaterial({
            defines: { MAX_TRAIL_LENGTH: maxTrail },
            uniforms: {
                iTime: { value: 0 },
                iResolution: { value: new THREE.Vector3(1, 1, 1) },
                iMouse: { value: new THREE.Vector2(0.5, 0.5) },
                iPrevMouse: { value: this.trailBuf.map(v => v.clone()) },
                iOpacity: { value: 1.0 },
                iScale: { value: 1.0 },
                iBaseColor: { value: new THREE.Vector3(baseColor.r, baseColor.g, baseColor.b) },
                iBrightness: { value: this.options.brightness },
                iEdgeIntensity: { value: this.options.edgeIntensity }
            },
            vertexShader: baseVertexShader,
            fragmentShader: fragmentShader,
            transparent: true,
            depthTest: false,
            depthWrite: false
        });

        const mesh = new THREE.Mesh(geom, this.material);
        this.scene.add(mesh);

        this.composer = new EffectComposer(this.renderer);
        this.renderPass = new RenderPass(this.scene, this.camera);
        this.composer.addPass(this.renderPass);

        this.bloomPass = new UnrealBloomPass(
            new THREE.Vector2(1, 1), 
            this.options.bloomStrength, 
            this.options.bloomRadius, 
            this.options.bloomThreshold
        );
        this.composer.addPass(this.bloomPass);

        const FilmGrainShader = {
            uniforms: {
                tDiffuse: { value: null },
                iTime: { value: 0 },
                intensity: { value: this.options.grainIntensity }
            },
            vertexShader: `
                varying vec2 vUv;
                void main(){
                  vUv = uv;
                  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform sampler2D tDiffuse;
                uniform float iTime;
                uniform float intensity;
                varying vec2 vUv;

                float hash1(float n){ return fract(sin(n)*43758.5453); }

                void main(){
                  vec4 color = texture2D(tDiffuse, vUv);
                  float n = hash1(vUv.x*1000.0 + vUv.y*2000.0 + iTime) * 2.0 - 1.0;
                  color.rgb += n * intensity * color.rgb;
                  gl_FragColor = color;
                }
            `
        };

        this.filmPass = new ShaderPass(FilmGrainShader);
        this.composer.addPass(this.filmPass);

        const UnpremultiplyPass = new ShaderPass({
            uniforms: { tDiffuse: { value: null } },
            vertexShader: `
                varying vec2 vUv;
                void main(){
                  vUv = uv;
                  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform sampler2D tDiffuse;
                varying vec2 vUv;
                void main(){
                  vec4 c = texture2D(tDiffuse, vUv);
                  float a = max(c.a, 1e-5);
                  vec3 straight = c.rgb / a;
                  gl_FragColor = vec4(clamp(straight, 0.0, 1.0), c.a);
                }
            `
        });
        this.composer.addPass(UnpremultiplyPass);

        this.active = true;
        this.hasValidSize = false;
        this.running = false;
        this.pointerActive = false;
        this.fadeOpacity = 1.0;
        this.lastMoveTime = performance.now();
        this.currentMouse = new THREE.Vector2(0.5, 0.5);
        this.velocity = new THREE.Vector2(0, 0);

        this.resize();
        window.addEventListener('resize', () => this.resize());

        document.addEventListener('pointermove', (e) => this.onPointerMove(e), { passive: true });
        document.addEventListener('pointerenter', () => this.onPointerEnter(), { passive: true });
        document.addEventListener('pointerleave', () => this.onPointerLeave(), { passive: true });

        this.start = performance.now();
        this.ensureLoop();
    }

    calculateScale(el) {
        const r = el.getBoundingClientRect();
        const base = 600;
        const current = Math.min(Math.max(1, r.width), Math.max(1, r.height));
        return Math.max(0.5, Math.min(2.0, current / base));
    }

    resize() {
        if (!this.active) return;
        const rect = this.container.getBoundingClientRect();
        const cssW = Math.floor(rect.width);
        const cssH = Math.floor(rect.height);

        if (cssW <= 0 || cssH <= 0) {
            this.hasValidSize = false;
            return;
        }

        const currentDPR = Math.min(window.devicePixelRatio || 1, this.options.maxDevicePixelRatio);
        const need = cssW * cssH * currentDPR * currentDPR;
        const scale = need <= this.pixelBudget ? 1 : Math.max(0.5, Math.min(1, Math.sqrt(this.pixelBudget / Math.max(1, need))));
        const pixelRatio = currentDPR * scale;

        this.renderer.setPixelRatio(pixelRatio);
        this.renderer.setSize(cssW, cssH, false);
        if(this.composer.setPixelRatio) {
            this.composer.setPixelRatio(pixelRatio);
        }
        this.composer.setSize(cssW, cssH);

        const wpx = Math.max(1, Math.floor(cssW * pixelRatio));
        const hpx = Math.max(1, Math.floor(cssH * pixelRatio));
        this.material.uniforms.iResolution.value.set(wpx, hpx, 1);
        this.material.uniforms.iScale.value = this.calculateScale(this.container);
        this.bloomPass.setSize(wpx, hpx);

        this.hasValidSize = true;
    }

    onPointerMove(e) {
        const x = THREE.MathUtils.clamp(e.clientX / window.innerWidth, 0, 1);
        const y = THREE.MathUtils.clamp(1 - (e.clientY / window.innerHeight), 0, 1);
        this.currentMouse.set(x, y);
        this.pointerActive = true;
        this.lastMoveTime = performance.now();
        this.ensureLoop();
    }

    onPointerEnter() {
        this.pointerActive = true;
        this.ensureLoop();
    }

    onPointerLeave() {
        this.pointerActive = false;
        this.lastMoveTime = performance.now();
        this.ensureLoop();
    }

    ensureLoop() {
        if (!this.running) {
            this.running = true;
            this.raf = requestAnimationFrame(() => this.animate());
        }
    }

    animate() {
        if (!this.active) return;
        if (!this.hasValidSize) {
            this.raf = requestAnimationFrame(() => this.animate());
            return;
        }

        const now = performance.now();
        const t = (now - this.start) / 1000;

        if (this.pointerActive) {
            this.velocity.set(
                this.currentMouse.x - this.material.uniforms.iMouse.value.x,
                this.currentMouse.y - this.material.uniforms.iMouse.value.y
            );
            this.material.uniforms.iMouse.value.copy(this.currentMouse);
            this.fadeOpacity = 1.0;
        } else {
            this.velocity.multiplyScalar(this.options.inertia);
            if (this.velocity.lengthSq() > 1e-6) {
                this.material.uniforms.iMouse.value.add(this.velocity);
            }
            const dt = now - this.lastMoveTime;
            if (dt > this.fadeDelay) {
                const k = Math.min(1, (dt - this.fadeDelay) / this.fadeDuration);
                this.fadeOpacity = Math.max(0, 1 - k);
            }
        }

        const N = this.trailBuf.length;
        this.head = (this.head + 1) % N;
        this.trailBuf[this.head].copy(this.material.uniforms.iMouse.value);
        const arr = this.material.uniforms.iPrevMouse.value;
        for (let i = 0; i < N; i++) {
            const srcIdx = (this.head - i + N) % N;
            arr[i].copy(this.trailBuf[srcIdx]);
        }

        this.material.uniforms.iOpacity.value = this.fadeOpacity;
        this.material.uniforms.iTime.value = t;

        if (this.filmPass.uniforms.iTime) {
            this.filmPass.uniforms.iTime.value = t;
        }

        this.composer.render();

        if (!this.pointerActive && this.fadeOpacity <= 0.001) {
            this.running = false;
            this.raf = null;
            return;
        }

        this.raf = requestAnimationFrame(() => this.animate());
    }
}


window.addEventListener('DOMContentLoaded', () => {
    
    
    new GhostCursor(document.body, { color: '#d4af37' });
});