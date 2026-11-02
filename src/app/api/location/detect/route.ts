import { NextRequest, NextResponse } from 'next/server';

interface ReverseGeoResult {
  city?: string;
  area?: string;
  state?: string;
  country?: string;
  fullAddress?: string;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const latParam = searchParams.get('lat');
    const lngParam = searchParams.get('lng');

    let lat = latParam ? parseFloat(latParam) : null;
    let lng = lngParam ? parseFloat(lngParam) : null;

    // If client supplied GPS coordinates
    if (lat !== null && lng !== null && !isNaN(lat) && !isNaN(lng)) {
      try {
        const nominatimUrl = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&zoom=14&addressdetails=1`;
        const res = await fetch(nominatimUrl, {
          headers: {
            'User-Agent': 'EcoVerse-CivicIntelligencePlatform/1.0 (ecoverse-app@cleanindia.local)',
            'Accept-Language': 'en',
          },
          signal: AbortSignal.timeout(4000),
        });

        if (res.ok) {
          const data = await res.json();
          const address = data.address || {};
          const city =
            address.city ||
            address.town ||
            address.municipality ||
            address.city_district ||
            address.county ||
            address.state_district ||
            'Local Area';

          const area =
            address.suburb ||
            address.neighbourhood ||
            address.residential ||
            address.commercial ||
            address.quarter ||
            address.road ||
            city;

          const state = address.state || '';
          const fullAddress = data.display_name || `${area}, ${city}, ${state}, India`;

          return NextResponse.json({
            success: true,
            source: 'gps_reverse_geocoding',
            lat,
            lng,
            city,
            area,
            state,
            country: address.country || 'India',
            fullAddress,
          });
        }
      } catch (err) {
        console.warn('Nominatim reverse geocode lookup timed out or failed, using fallback:', err);
      }

      // If nominatim fails, return the coordinates directly
      return NextResponse.json({
        success: true,
        source: 'gps_direct',
        lat,
        lng,
        city: 'Local Area',
        area: `${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E`,
        state: 'India',
        country: 'India',
        fullAddress: `Location (${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E), India`,
      });
    }

    // If no coordinates passed, try IP geolocation or default Indian region
    const forwarded = request.headers.get('x-forwarded-for');
    const clientIp = forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1';

    // If on local host, default to New Delhi / Bengaluru Central
    if (clientIp === '127.0.0.1' || clientIp === '::1' || clientIp.startsWith('192.168.') || clientIp.startsWith('10.')) {
      return NextResponse.json({
        success: true,
        source: 'default_india_central',
        lat: 28.6139,
        lng: 77.2090,
        city: 'New Delhi',
        area: 'Central District',
        state: 'Delhi',
        country: 'India',
        fullAddress: 'Central District, New Delhi, Delhi, India',
      });
    }

    // Try ip-api.com for external IPs
    try {
      const ipRes = await fetch(`http://ip-api.com/json/${clientIp}?fields=status,country,regionName,city,lat,lon`, {
        signal: AbortSignal.timeout(3000),
      });
      if (ipRes.ok) {
        const ipData = await ipRes.json();
        if (ipData.status === 'success') {
          return NextResponse.json({
            success: true,
            source: 'ip_geolocation',
            lat: ipData.lat,
            lng: ipData.lon,
            city: ipData.city || 'India',
            area: ipData.regionName || ipData.city,
            state: ipData.regionName || '',
            country: ipData.country || 'India',
            fullAddress: `${ipData.city}, ${ipData.regionName}, ${ipData.country}`,
          });
        }
      }
    } catch {}

    // Ultimate fallback
    return NextResponse.json({
      success: true,
      source: 'fallback',
      lat: 20.5937,
      lng: 78.9629,
      city: 'India Region',
      area: 'Central Region',
      state: '',
      country: 'India',
      fullAddress: 'India',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Location detection failed' },
      { status: 500 }
    );
  }
}

