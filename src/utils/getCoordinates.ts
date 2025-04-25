export const getCoordinates = async (location: string) => {
  const apiKey = process.env.NEXT_PUBLIC_OPENCAGE_API_KEY;

  const res = await fetch(
    `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
      location
    )}&key=${apiKey}`
  );

  const data = await res.json();

  if (!data.results.length) {
    throw new Error("Location not found");
  }

  const { lat, lng } = data.results[0].geometry;
  return { lat, lng };
};
