import { useEffect, useRef, useState } from 'react';

function formatWithSpaces(value) {
  const parts = Math.floor(value).toString().split('');
  const out = [];
  for (let i = 0; i < parts.length; i++) {
    const idxFromEnd = parts.length - i;
    out.push(parts[i]);
    if (idxFromEnd > 1 && idxFromEnd % 3 === 1) {
      out.push(' ');
    }
  }
  return out.join('');
}

export default function CountUp({
  start = 0,
  end = 0,
  duration = 1500,
  prefix = '',
  suffix = '',
  className = ''
}) {
  const [value, setValue] = useState(start);
  const startedRef = useRef(false);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !startedRef.current) {
            startedRef.current = true;
            const startTime = performance.now();
            const animate = now => {
              const progress = Math.min(1, (now - startTime) / duration);
              const current = start + (end - start) * progress;
              setValue(current);
              if (progress < 1) requestAnimationFrame(animate);
            };
            requestAnimationFrame(animate);
          }
        });
      },
      { threshold: 0.4 }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [duration, end, start]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {formatWithSpaces(value)}
      {suffix}
    </span>
  );
}

