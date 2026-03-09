'use client'

import Script from 'next/script'

// Placeholder ID - will require real ID from user or config for live launch
const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX'

export function GoogleAnalytics() {
    return (
        <>
            <Script
                strategy="afterInteractive"
                src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
            />
            <Script
                id="google-analytics"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                    __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
            });
          `,
                }}
            />
        </>
    )
}

export function trackEvent(action: string, category: string, label?: string, value?: number) {
    if (typeof window !== 'undefined' && 'gtag' in window) {
        (window as any).gtag('event', action, {
            event_category: category,
            event_label: label,
            value: value,
        })
    }
}
