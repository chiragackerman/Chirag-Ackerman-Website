function decodePathSegment(segment) {
  try {
    return decodeURIComponent(segment);
  } catch {
    return segment;
  }
}

function routeFromSegments(segments) {
  const [first, second] = segments.map(decodePathSegment);

  if (first === 'product' && second) {
    return { route: 'product', productId: second };
  }

  if ((first === 'category' || first === 'categories') && second) {
    return { route: 'shop', categorySlug: second === 'monitors' ? 'collectibles-decor' : second };
  }

  const routeAliases = {
    home: 'home',
    shop: 'shop',
    categories: 'categories',
    setup: 'setup',
    'my-setup': 'setup',
    about: 'about',
    collaborate: 'collaborate',
    contact: 'contact',
    admin: 'admin',
    'affiliate-disclosure': 'affiliate-disclosure',
    privacy: 'privacy',
    'privacy-policy': 'privacy'
  };

  return routeAliases[first] ? { route: routeAliases[first] } : null;
}

export function resolveRoute(location) {
  const pathSegments = location.pathname.split('/').filter(Boolean);
  if (pathSegments.length > 0) {
    const pathRoute = routeFromSegments(pathSegments);
    if (pathRoute) return pathRoute;
  }

  const hashSegments = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean);
  return routeFromSegments(hashSegments) || { route: 'home' };
}