import gsap from 'gsap';

export const animations = {
  // Fade up — untuk konten yang muncul saat scroll / mount
  fadeUp: {
    from: { opacity: 0, y: 40 },
    to: { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' },
  },

  // Stagger — untuk list items / cards
  staggerUp: {
    from: { opacity: 0, y: 30 },
    to: { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', stagger: 0.1 },
  },

  // Scale in — untuk cards, modals
  scaleIn: {
    from: { opacity: 0, scale: 0.95 },
    to: { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(1.4)' },
  },

  // Slide — untuk page transitions
  slideInRight: {
    from: { opacity: 0, x: 60 },
    to: { opacity: 1, x: 0, duration: 0.5, ease: 'power3.out' },
  },

  // Timer pulse — saat waktu hampir habis
  timerPulse: {
    to: { scale: 1.05, duration: 0.3, ease: 'power1.inOut', yoyo: true, repeat: -1 },
  },

  // Score reveal — animasi skor muncul
  scoreReveal: {
    from: { opacity: 0, scale: 0.5, y: 20 },
    to: { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.5)' },
  },

  // Number counter — skor naik dari 0
  numberCount: {
    duration: 1.5,
    ease: 'power2.out',
  },
};

// Helper function to animate element with fadeUp
export function animateFadeUp(target: gsap.TweenTarget, vars?: gsap.TweenVars) {
  return gsap.fromTo(
    target,
    animations.fadeUp.from,
    { ...animations.fadeUp.to, ...vars }
  );
}

// Helper function to animate cards with stagger
export function animateStaggerUp(target: gsap.TweenTarget, vars?: gsap.TweenVars) {
  return gsap.fromTo(
    target,
    animations.staggerUp.from,
    { ...animations.staggerUp.to, ...vars }
  );
}

// Helper to animate number counting
export function animateCounter(
  targetObj: { val: number },
  endVal: number,
  onUpdateCallback: () => void,
  duration = 1.5
) {
  return gsap.to(targetObj, {
    val: endVal,
    duration,
    ease: 'power2.out',
    onUpdate: onUpdateCallback,
  });
}
