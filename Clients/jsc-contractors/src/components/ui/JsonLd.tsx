export function JsonLd() {
    const data = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": "JSC Building Contractors",
        "image": "https://www.jsccontractors.co.uk/logos/jsc-logo.png",
        "@id": "https://www.jsccontractors.co.uk",
        "url": "https://www.jsccontractors.co.uk",
        "telephone": "+447493213511",
        "address": {
            "@type": "PostalAddress",
            "addressLocality": "Havant",
            "addressRegion": "Hampshire",
            "postalCode": "PO9",
            "addressCountry": "GB"
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": 50.8507,
            "longitude": -0.9827
        },
        "openingHoursSpecification": {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday"
            ],
            "opens": "08:00",
            "closes": "17:00"
        }
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
    );
}
