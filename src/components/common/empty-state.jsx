'use client';
import Link from 'next/link';
import React from 'react';

export default function EmptyState({
  title = 'No products match your filters',
  subtitle = 'Try adjusting your filters or explore more categories.',
  tips = ['Clear some filters', 'Try a different category', 'Widen the price range'],
  primaryAction,   // { label, href? onClick? }
  secondaryAction, // { label, href? onClick? }
  accent = ['#7c3aed', '#06b6d4'], // [from,to] – tweak to your brand
}) {
  const Action = ({ a, intent = 'primary' }) => {
    if (!a) return null;
    const cls = intent === 'primary' ? 'es-btn es-btn-primary' : 'es-btn es-btn-ghost';
    return a.href ? (
      <Link href={a.href} className={cls}>{a.label}</Link>
    ) : (
      <button type="button" onClick={a.onClick} className={cls}>{a.label}</button>
    );
  };

  return (
    <div className="es-wrap" role="status" aria-live="polite">
      <div className="es-card">
        <div className="es-icon" aria-hidden="true">
          <svg viewBox="0 0 160 160">
            <defs>
              <linearGradient id="es-g" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor={accent[0]} />
                <stop offset="1" stopColor={accent[1]} />
              </linearGradient>
              <radialGradient id="es-r" cx="50%" cy="40%" r="70%">
                <stop offset="0%" stopColor="#fff" stopOpacity=".9" />
                <stop offset="60%" stopColor="#fff" stopOpacity=".55" />
                <stop offset="100%" stopColor="#fff" stopOpacity=".2" />
              </radialGradient>
              <mask id="es-sweep">
                <rect width="160" height="160" fill="black"/>
                <circle cx="80" cy="80" r="38" stroke="white" strokeWidth="8" fill="none"
                        strokeDasharray="40 240">
                  <animate attributeName="stroke-dashoffset" values="0;-280" dur="3s" repeatCount="indefinite"/>
                </circle>
              </mask>
            </defs>

            <circle cx="80" cy="80" r="70" fill="url(#es-g)" opacity=".08"/>
            <circle cx="80" cy="80" r="54" fill="url(#es-g)" opacity=".12"/>
            <g className="mag">
              <circle cx="74" cy="74" r="22" fill="none" stroke="#111827" strokeWidth="4"/>
              <line x1="90" y1="90" x2="108" y2="108" stroke="#111827" strokeWidth="4" strokeLinecap="round"/>
              <circle cx="74" cy="74" r="22" fill="url(#es-r)" opacity=".35"/>
            </g>

            {/* sweeping highlight */}
            <g mask="url(#es-sweep)">
              <circle cx="80" cy="80" r="42" fill="url(#es-g)" opacity=".35"/>
            </g>
          </svg>
        </div>

        <h3 className="es-title">{title}</h3>
        <p className="es-sub">{subtitle}</p>

        {!!tips?.length && (
          <ul className="es-chips">
            {tips.map((t, i) => <li key={i} className="es-chip">{t}</li>)}
          </ul>
        )}

        <div className="es-actions">
          <Action a={primaryAction} intent="primary" />
          <Action a={secondaryAction} intent="ghost" />
        </div>
      </div>

      <style jsx>{`
        :root { --es-a1:${accent[0]}; --es-a2:${accent[1]}; }
        .es-wrap {
          width: 100%;
          display: grid;
          place-items: center;
          padding: 8px;
        }
        .es-card {
          max-width: 820px;
          width: 100%;
          text-align: center;
          padding: clamp(24px, 3.8vw, 40px);
          border-radius: 22px;
          border: 1px dashed rgba(17,24,39,.12);
          background:
            radial-gradient(900px 280px at 50% -10%, rgba(124,58,237,.06), transparent),
            rgba(255,255,255,.72);
          backdrop-filter: blur(10px) saturate(140%);
          box-shadow: 0 18px 40px rgba(2,6,23,.07);
        }
        .es-icon { width: 96px; height: 96px; margin: 4px auto 12px; }
        .es-icon svg { width: 100%; height: 100%; display: block; }
        .mag { animation: float 4s ease-in-out infinite; transform-origin: 80px 80px; }
        @keyframes float {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }

        .es-title {
          margin: 6px 0 8px;
          font-size: clamp(22px, 2.8vw, 30px);
          font-weight: 900;
          background: linear-gradient(135deg, #0f172a 30%, #111827 70%);
          -webkit-background-clip: text; background-clip: text;
          color: transparent;
        }
        .es-sub {
          margin: 0 auto 16px;
          color: #475569;
          max-width: 580px;
        }

        .es-chips {
          margin: 0 0 18px;
          padding: 0;
          list-style: none;
          display: flex; gap: 10px; flex-wrap: wrap; justify-content: center;
        }
        .es-chip {
          font-size: 13px; color: #0f172a;
          background: #ffffff;
          border: 1px solid #e5e7eb;
          padding: 8px 12px;
          border-radius: 999px;
          box-shadow: 0 2px 6px rgba(2,6,23,.05);
          transition: transform .12s ease, box-shadow .12s ease, background .12s ease;
        }
        .es-chip:hover { background:#f8fafc; transform: translateY(-1px); box-shadow: 0 6px 14px rgba(2,6,23,.08); }

        .es-actions { display: flex; gap: 12px; justify-content: center; }
        .es-btn {
          border-radius: 999px;
          padding: 10px 16px;
          font-weight: 700; font-size: 14px;
          border: 1px solid transparent;
          transition: transform .15s ease, box-shadow .15s ease, background .15s ease;
        }
        .es-btn:active { transform: translateY(1px); }
        .es-btn-primary {
          color: #fff;
          background: linear-gradient(135deg, var(--es-a1), var(--es-a2));
          box-shadow: 0 8px 22px rgba(124,58,237,.18);
        }
        .es-btn-primary:hover { box-shadow: 0 12px 32px rgba(124,58,237,.22); }
        .es-btn-ghost {
          color: #0f172a;
          background: #fff;
          border-color: rgba(17,24,39,.12);
        }
        .es-btn-ghost:hover { background: #f8fafc; }
      `}</style>
    </div>
  );
}
