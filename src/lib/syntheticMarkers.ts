const SYNTHETIC_E2E_MARKER_PATTERN = /STYLEOS_E2E_TEST_[A-Za-z0-9_-]+/g;

export function extractSyntheticMarkers(...values: Array<string | null | undefined>) {
  const markers = new Set<string>();

  values.forEach((value) => {
    if (!value) {
      return;
    }
    value.match(SYNTHETIC_E2E_MARKER_PATTERN)?.forEach((marker) => markers.add(marker));
  });

  return Array.from(markers);
}

export function appendSyntheticMarkers(value: string, markers: string[], maxLength = 1200) {
  if (markers.length === 0) {
    return value.slice(0, maxLength);
  }

  const missingMarkers = markers.filter((marker) => !value.includes(marker));
  if (missingMarkers.length === 0) {
    return value.slice(0, maxLength);
  }

  const markerSuffix = ` E2E marker: ${missingMarkers.join(", ")}`;
  return `${value.slice(0, Math.max(maxLength - markerSuffix.length, 0)).trim()}${markerSuffix}`.trim();
}
