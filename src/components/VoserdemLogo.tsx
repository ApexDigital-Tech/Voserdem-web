import React, { useState, useEffect } from 'react';
import { LogoConfig } from '../types';
import { api } from '../services/api';
import { cleanGoogleDriveUrl } from '../utils/imageUtils';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  config?: LogoConfig;
}

export function VoserdemLogoColor({
  className = '',
  size = 'md',
  config: externalConfig,
}: LogoProps) {
  const [internalConfig, setInternalConfig] = useState<LogoConfig | null>(null);

  useEffect(() => {
    if (externalConfig) return; // Use external config if provided

    const fetchLogos = () => {
      api
        .get<LogoConfig>('/api/logos')
        .then((res) => {
          if (res.success && res.data) setInternalConfig(res.data);
        })
        .catch((err) => console.error('Error fetching logos color:', err));
    };

    fetchLogos();
    const handleUpdate = () => fetchLogos();
    window.addEventListener('logo-updated', handleUpdate);
    return () => window.removeEventListener('logo-updated', handleUpdate);
  }, [externalConfig]);

  const activeConfig = externalConfig || internalConfig;
  const logoData = activeConfig?.logoColor || {
    brandName: 'VOSERDEM',
    slogan: 'Voluntarios al Servicio de los Demás',
    useCustomImage: false,
    imageUrl: '',
  };

  const dimensions = {
    sm: 'h-12 w-12',
    md: 'h-20 w-20',
    lg: 'h-28 w-28',
    xl: 'h-40 w-40',
  };

  const heightDimensions = {
    sm: 'h-12',
    md: 'h-20',
    lg: 'h-28',
    xl: 'h-40',
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {logoData.useCustomImage && logoData.imageUrl ? (
        <img
          src={cleanGoogleDriveUrl(logoData.imageUrl)}
          alt={logoData.brandName}
          className={`${heightDimensions[size]} w-auto max-w-[240px] shrink-0 object-contain rounded-xl`}
          referrerPolicy="no-referrer"
        />
      ) : (
        <svg
          viewBox="0 0 500 500"
          className={`${dimensions[size]} shrink-0 drop-shadow-md`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Metallic Gold Gradients */}
            <linearGradient id="gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF9E6" />
              <stop offset="30%" stopColor="#E5C158" />
              <stop offset="70%" stopColor="#B38B24" />
              <stop offset="100%" stopColor="#F5D77F" />
            </linearGradient>

            <linearGradient id="gold-ring-grad" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#AA7C11" />
              <stop offset="50%" stopColor="#F3E5AB" />
              <stop offset="100%" stopColor="#C5A059" />
            </linearGradient>

            {/* Bolivia Flag Gradient (gradient map) */}
            <linearGradient id="bolivia-grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#D22630" /> {/* Red */}
              <stop offset="45%" stopColor="#F9A825" /> {/* Yellow */}
              <stop offset="55%" stopColor="#F9A825" /> {/* Yellow */}
              <stop offset="100%" stopColor="#1B5E20" /> {/* Green */}
            </linearGradient>

            {/* Subtle Outer Drop Shadow */}
            <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow
                dx="0"
                dy="8"
                stdDeviation="6"
                floodColor="#1B3022"
                floodOpacity="0.18"
              />
            </filter>
          </defs>

          <g filter="url(#shadow)">
            {/* 1. Golden Outer Ring */}
            <circle
              cx="250"
              cy="270"
              r="160"
              stroke="url(#gold-ring-grad)"
              strokeWidth="18"
              fill="#FFFFFF"
            />

            {/* 2. Map of Bolivia Silhouette nested inside */}
            <path
              d="M 230 160 
                 C 270 150, 310 170, 330 190
                 C 350 210, 360 240, 350 260
                 C 340 280, 310 300, 310 320
                 C 310 340, 270 380, 250 390
                 C 230 400, 190 380, 170 360
                 C 150 340, 150 310, 160 290
                 C 170 270, 190 250, 200 230
                 C 210 210, 210 170, 230 160 Z"
              fill="url(#bolivia-grad)"
              opacity="0.92"
            />

            {/* 3. Illustrated Stylized Figures holding hands in a circle */}
            <circle cx="160" cy="210" r="12" fill="#D22630" />
            <path
              d="M 160 222 C 145 225, 140 245, 142 270"
              stroke="#D22630"
              strokeWidth="8"
              strokeLinecap="round"
            />

            <circle cx="190" cy="330" r="13" fill="#D95C2B" />
            <path
              d="M 190 343 C 180 350, 190 380, 210 390"
              stroke="#D95C2B"
              strokeWidth="9"
              strokeLinecap="round"
            />

            <circle cx="270" cy="350" r="13" fill="#1565C0" />
            <path
              d="M 270 363 C 255 375, 290 395, 305 385"
              stroke="#1565C0"
              strokeWidth="9"
              strokeLinecap="round"
            />

            <circle cx="340" cy="290" r="12" fill="#00838F" />
            <path
              d="M 340 302 C 345 315, 350 345, 335 360"
              stroke="#00838F"
              strokeWidth="8"
              strokeLinecap="round"
            />

            <circle cx="350" cy="210" r="12" fill="#455A64" />
            <path
              d="M 350 222 C 362 230, 365 255, 360 280"
              stroke="#455A64"
              strokeWidth="8"
              strokeLinecap="round"
            />

            {/* Connecting hands overlaying (organic union) */}
            <path
              d="M 142 270 C 150 275, 175 270, 190 330 
                 M 210 390 C 220 395, 250 375, 270 350 
                 M 305 385 C 315 380, 330 310, 340 290"
              stroke="#1B3022"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
            />

            {/* 4. Golden V and Sphere Symbol at the top (Fusing with the ring) */}
            <circle cx="250" cy="90" r="24" fill="url(#gold-grad)" />

            {/* Main Gold "V" Arms swoop */}
            <path
              d="M 175 105
                 C 175 105, 205 195, 250 195
                 C 295 195, 325 105, 325 105
                 C 310 115, 290 145, 250 145
                 C 210 145, 190 115, 175 105 Z"
              fill="url(#gold-grad)"
            />
            {/* Stylized right hand flare (cradle shape) */}
            <path
              d="M 235 155
                 C 245 155, 250 150, 255 142
                 C 265 125, 298 105, 308 102
                 C 310 115, 280 135, 260 152
                 C 250 160, 240 160, 235 155 Z"
              fill="url(#gold-grad)"
            />
          </g>
        </svg>
      )}

      {/* Branded Typography on the right side */}
      <div className="text-left font-sans min-w-0">
        <span className="font-display text-2xl font-black tracking-tight text-[#F5F2ED] block leading-none whitespace-nowrap">
          {logoData.brandName}
        </span>
        <span className="text-[9px] uppercase tracking-wider text-[#C5A059] font-bold block whitespace-nowrap mt-1 leading-tight">
          {logoData.slogan}
        </span>
      </div>
    </div>
  );
}

export function VoserdemLogoGold({
  className = '',
  size = 'md',
  config: externalConfig,
}: LogoProps) {
  const [internalConfig, setInternalConfig] = useState<LogoConfig | null>(null);

  useEffect(() => {
    if (externalConfig) return; // Use external config if provided

    const fetchLogos = () => {
      api
        .get<LogoConfig>('/api/logos')
        .then((res) => {
          if (res.success && res.data) setInternalConfig(res.data);
        })
        .catch((err) => console.error('Error fetching logos gold:', err));
    };

    fetchLogos();
    const handleUpdate = () => fetchLogos();
    window.addEventListener('logo-updated', handleUpdate);
    return () => window.removeEventListener('logo-updated', handleUpdate);
  }, [externalConfig]);

  const activeConfig = externalConfig || internalConfig;
  const logoData = activeConfig?.logoGold || {
    brandName: 'VOSERDEM',
    slogan: 'Una Bolivia mejor es posible',
    useCustomImage: false,
    imageUrl: '',
  };

  const dimensions = {
    sm: 'h-12 w-12',
    md: 'h-20 w-20',
    lg: 'h-28 w-28',
    xl: 'h-40 w-40',
  };

  const heightDimensions = {
    sm: 'h-12',
    md: 'h-20',
    lg: 'h-28',
    xl: 'h-40',
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {logoData.useCustomImage && logoData.imageUrl ? (
        <img
          src={cleanGoogleDriveUrl(logoData.imageUrl)}
          alt={logoData.brandName}
          className={`${heightDimensions[size]} w-auto max-w-[240px] shrink-0 object-contain rounded-xl`}
          referrerPolicy="no-referrer"
        />
      ) : (
        <svg
          viewBox="0 0 400 400"
          className={`${dimensions[size]} shrink-0`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient id="gold-emblem-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF9E6" />
              <stop offset="25%" stopColor="#F0CE68" />
              <stop offset="50%" stopColor="#C5A059" />
              <stop offset="75%" stopColor="#8C6612" />
              <stop offset="100%" stopColor="#FBE9B6" />
            </linearGradient>
            <filter id="gold-shadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow
                dx="0"
                dy="4"
                stdDeviation="4"
                floodColor="#000000"
                floodOpacity="0.3"
              />
            </filter>
          </defs>
          <g filter="url(#gold-shadow)">
            <circle cx="200" cy="100" r="36" fill="url(#gold-emblem-grad)" />
            <path
              d="M 80 120 C 90 120, 145 265, 200 265 C 255 265, 310 120, 320 120 C 295 135, 255 190, 200 190 C 145 190, 105 135, 80 120 Z"
              fill="url(#gold-emblem-grad)"
            />
            <path
              d="M 178 196 C 192 196, 200 188, 210 175 C 225 152, 275 112, 295 105 C 300 123, 255 158, 225 188 C 210 202, 193 202, 178 196 Z"
              fill="url(#gold-emblem-grad)"
            />
          </g>
        </svg>
      )}

      {/* Gold Text Typography — left-aligned, row layout */}
      <div className="font-sans space-y-0.5 text-left">
        <h3 className="font-display text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFF0C2] via-[#C5A059] to-[#8C6612] tracking-widest leading-none whitespace-nowrap">
          {logoData.brandName}
        </h3>
        <p className="text-[9px] uppercase tracking-widest text-[#C5A059] font-bold whitespace-nowrap">
          {logoData.slogan}
        </p>
      </div>
    </div>
  );
}
